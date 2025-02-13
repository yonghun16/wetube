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

// get 로그인
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

// post 로그인
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
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

// Github 로그인 컨트롤러
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

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const userRequest = await (
      await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userRequest);
  } else {
    return res.render("login");
  }
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See User");
