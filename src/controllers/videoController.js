const fakeUser = {
    username: "seya",
    loggedIn: true,
};




export const trending = (req, res) => res.render("home", {pageTitle: "Home", fakeUser: fakeUser});
export const see = (req, res) => res.render("watch");

export const edit = (req, res) => res.render("edit");
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("upload");
export const deleteVideo = (req, res) => {

    return res.send("Delete Video");
}
 