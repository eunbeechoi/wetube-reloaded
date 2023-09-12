import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join"});

export const postJoin = async(req, res) => {
    const {name, username, email, password, password2, location} = req.body;
    const pageTitle = "Join";
    if(password !== password2){
        return res.status(400).render("join", {pageTitle, errorMessage: "Password Confirmation daes not match"});
    }
    const usernameExists = await User.exists({ $or: [{username}, {email}]});
    if(usernameExists){
        return res.status(400).render("join", {pageTitle, errorMessage: "This username/email is already taken."});
    }
    try {
        await User.create({
            name,
            username,
            email,
            password,
            location,
            
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("Join", {
            pageTitle: "Join",
            errorMessage: error._message,
        });
    };
   
    
};

export const getLogin = (req, res) => res.render("login", {pageTitle: "Login"});

export const postLogin = async(req, res) => {
    const { username, password} =req.body;
    const pageTitle= "Login";
    const user = await User.findOne({username});
    if(!user){
        return res
        .status(400)
        .render("login", { 
        pageTitle,
        errorMessage: "An account with this username does not exists."});
    }
    //check if password correct
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res
        .status(400)
        .render("login", { 
        pageTitle,
        errorMessage: "wrong password"});
    }
    //세션에 정보 추가
    // 이 설정은 세션을 수정할 때만 세션을 DB에 저장하고 쿠키를 넘겨줌 
    req.session.loggedIn = true;  //사용자가 로그인하면 loggedIn을 true로 
    req.session.user= user;      // DB에서 찾은 사용자 데이터를 user에 넣어줌 
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id : "10d990269080aa31cd1e",
        allow_signup: false,
        scope: "read:user user:eamil",
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
 
};

export const finishGithubLogin = (req, res) => {};

export const edit =(req, res) => res.send("Edit User");
export const remove =(req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");
