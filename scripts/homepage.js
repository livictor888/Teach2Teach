(function () {
  window.onload = async function () {
    /**** ===== Navigate to post detail ===== ****/
    const postTitle = document.querySelectorAll(".post-title");
    const postReadmore = document.querySelectorAll(".post-readmore");
    const postContent = document.querySelectorAll(".post-content");

    function navigateToPostDetail() {
      window.location.href = "./post-detail.html";
    }

    postTitle.forEach((elem) => {
      elem.addEventListener("click", navigateToPostDetail);
    });
    postReadmore.forEach((elem) => {
      elem.addEventListener("click", navigateToPostDetail);
    });
    postContent.forEach((elem) => {
      elem.addEventListener("click", navigateToPostDetail);
    });

    /**** ===== Detect if user logged in ===== ****/
    const loggedIn = await new Promise((res) => {
      firebase.auth().onAuthStateChanged((user) => res(!!user));
    });

    /**** ===== Detect if user logged in ===== ****/
    const addNewPostIcon = document.querySelector("#bottom-icon-add");
    if (addNewPostIcon) {
      addNewPostIcon.addEventListener("click", function () {
        if (loggedIn) {
          window.location.assign("new-post.html");
        } else {
          window.location.assign("login.html");
        }
      });
    }
  };
})();
