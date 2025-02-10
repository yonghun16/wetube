import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

// 회원가입 피드
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (password !== password2) {
    // 오류코드(400)를 상태코드로 받아 렌더링
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken."
    });
  }
  await User.create({
    name,
    username,
    email,
    password,
    location
  });
  return res.redirect("/login");
};

export const edit = (req, res) => res.send("Edit User");

export const remove = (req, res) => res.send("Delete User");

export const login = (req, res) => res.send("Login");

export const logout = (req, res) => res.send("Logout");

export const see = (req, res) => res.send("See User");

