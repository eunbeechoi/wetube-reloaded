const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const videoComments = document.querySelector(".video__comments ul");
const deleteIcon = document.querySelectorAll(".delete__icon");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    const span2 = document.createElement("span");
    span2.innerText = "Delete"
    deleteIcon.className = "delete__icon";
    newComment.appendChild(icon); //appendChild -> icon을 newComment에 넣어줌 
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment); //prepend 맨 위에 추가
    deleteIcon.addEventListener("click", handleDelete);
    //console.log(newComment)
  };

const handleSubmit = async(event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value; 
    const videoId = videoContainer.dataset.id;
    if (text === "") {
        return;
      }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
      });
      
      if(response.status === 201) {
        textarea.value = ""; // 댓글창을 비움 
        const {newCommentId} = await response.json();
        addComment(text, newCommentId);
        
      }
};

const handleDelete = async (event) => {
    const deleteComment = event.target.parentElement;
  
    const {
      dataset: { id },
    } = event.target.parentElement;
  
    const videoId = videoContainer.dataset.id;
  
    const response = await fetch(`/api/videos/${videoId}/comment/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId: id }),
    });
  
    if (response.status === 200) {
      deleteComment.remove();
    }
  };

if(form){
    form.addEventListener("submit", handleSubmit);
}

if (deleteIcon) {
    deleteIcon.forEach((icon) => icon.addEventListener("click", handleDelete));
  }