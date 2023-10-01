import User from "../models/User";
import Video from "../models/Video"
import fetch from "node-fetch";
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
    const user = await User.findOne({username, socialOnly: false});
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
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        }
    })).json();
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await(await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        })).json();
        console.log(userData);
        const emailData = await (await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        })).json();
        const emailObj = emailData.find(email => email.primary === true && email.verified === true);
        if(!emailObj){
            //set notification 
            return res.redirect("/login");
        }
        //기존 유저 찾기 
        let user = await User.findOne({email: emailObj.email});
        if(!user){
            user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name?userData.name:"Unknown",
                username: userData.login,
                email: emailObj.email,
                password:"",
                socialOnly: true,
                location:userData.location,
            });
        } 
            req.session.loggedIn = true; 
            req.session.user= user;
            return res.redirect("/"); 
     }else {
        return res.redirect("/login");
    }

};


export const logout = (req, res) => {
    req.session.destroy();
    req.flash("info", "Bye Bye")
    return res.redirect("/");
};


export const getEdit = (req, res) => {
    res.render("edit-profile", {pageTitle: "Edit Profile"});
};

export const postEdit = async(req, res) => {
    //const {user: {id}} = req.session;
    // ==
    //const id = req.session.user.id
    //==
    const {
        session: {
            user: {_id, avatarUrl},
        },
        body: {name, email, username, location},
        file,
    } = req;
    console.log(file);
    const updateUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        username, 
        location,
    },
    {new: true}
    );
    console.log(avatarUrl);
    req.session.user = updateUser;
    return res.redirect("/users/edit");
};


export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly === true){
        req.flash("error", "Can't change password")
        return res.redirect("/");
    }
    return res.render("users/change-password", {pageTitle: "Change Password"});
};


export const postChangePassword = async(req, res) => {
    const {
        session: {
            user: {_id},
        },
        body: {oldPassword, newPassword, newPasswordConfirmation},
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password)
    if(!ok){
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password", 
            errorMessage: "the current password is incorrect",});
    }
    if(newPassword !== newPasswordConfirmation){
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password", 
            errorMessage: "the password does not match the confirmation"});
    }
    
    user.password = newPassword;
    await user.save();     //pre save 작동 (User.js 파일), 새 비번을 hash하기 위해서 작동시킴
    req.flash("info", "Password Updated")
    return res.redirect("/users/logout");
};

/*export const see = async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate("videos");
    if(!user){
        return res.status(404).render("404", { pageTitle : "User not found."});
    }
    return res.render("users/profile", {pageTitle: `${user.name}`, user});
}; */


export const see = async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
            model: "User",
        },
    });
    if(!user){
        return res.status(404).render("404", { pageTitle : "User not found."});
    }
    return res.render("users/profile", {pageTitle: `${user.name}`, user});
};


