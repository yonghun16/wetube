// User Controller
/* 
 * 회원가입, 로그인, 회원정보, 로그아웃 같은 유저활동에 관한 req, res 처리
 * pug로 render 
 */

import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

// get 회원가입
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

// post 회원가입
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  const exists = await User.exists({ $or: [{ username }, { email }] });
  // 패스워드 예외처리
  if (password !== password2) {
    // 오류코드(400)를 상태코드로 받아 렌더링
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  // 동일 username, email 예외처리
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken."
    });
  }
  // 기타 예외처리
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message
    });
  }
};

// 로그인(get controller)
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

// 로그인(post controller : non social login)
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  // 계정이 이미 있는지 확인
  if (!user) {
    return res.status(404).render("login", {
      pageTitle,
      errorMessage: "User not found."
    });
  }
  // 패스워드가 일치하는지 확인
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(404).render("login", {
      pageTitle,
      errorMessage: "Worng password"
    });
  }
  // 문제가 없다면 -> req.session에 정보 추가
  req.session.loggedIn = true;  // 로그인 유지
  req.session.user = user;      // 유저이름 
  return res.redirect("/");
}

// 로그인 (social login)
// github 인증 controller
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: "false",
    scope: "read:user user:email",
  }
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  return res.redirect(finalUrl);
}

// git 인증 후 로그인 결정
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  // token을 요청(request)
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  // access_token이 있는지 확인 있다면 -> 로그인 허가
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObj) {
      return res.render("login");
    }

    // emailObj는 있으나, db에 동일한 email이 없다면, user 새로 만들기 
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location
      })
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  }
  // access_token가 없다면 -> 로그인 불허
  else {
    return res.render("login");
  }
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
}
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id }
    },
    body: { name, email, username, location },
    file,
  } = req;
  console.log(file)
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username,
      location
    },
    {
      new: true   // 새로 바뀐 데이터로 반환
    }
  )
  req.session.user = updatedUser;   // 세션 업데이트(프론트는 세션에서 정보를 받음)
  return res.redirect("/users/edit");
}

export const remove = (req, res) => res.send("Remove User");

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
}

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
}

export const postChangePassword = async (req, res) => {
  // req객체에서 _id와 password를 수집
  // req.session.user.password → password 변수에 저장
  // req.body.oldPassword → oldPassword 변수에 저장
  const {
    session: {
      user: { _id, password }
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;

  // 입력한 oldPassword를 해시화 해서 db에 저장된 password 비교
  const ok = await bcrypt.compare(oldPassword, password);

  // Old Password가 일치하는지 확인
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect",
    });
  }

  // New Password와 New Password Confirmation가 일치하는지 확인
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "New Password does not match",
    });
  }
  const user = await User.findById(_id);
  user.password = newPassword;
  // user.save()의 middleware로 bcrypt.hash가 있어 save()만 해도 암호화
  await user.save()

  // session 업데이트(비밀번호를 연속해서 다시 고칠 경우 등 고려)
  req.session.user.password = user.password;

  return res.redirect("/users/logout");
}

export const see = (req, res) => res.send("See User");
