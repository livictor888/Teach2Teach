(function () {
  window.onload = function () {
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
  };
})();
