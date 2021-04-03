(function () {
  window.onload = function () {
    /**** ===== Upload new post function ===== ****/
    async function uploadNewPost(post) {
      const postCollection = db.collection("posts");
      postCollection
        .add({
          title: post.title,
          content: post.content,
          tag: post.tag,
          likes: 0,
          who_likes: [],
          date_created: Date.now(),
        })
        .then((docRef) => {
          window.location.href = `./post-detail.html?post_id=${docRef.id}`;
        })
        .catch((err) => {
          console.log(err);
        });

      showSpinner();
    }

    /**** ===== Add new feature upload post ===== ****/
    const newPostSubmitButton = document.querySelector("#new-post-submit-btn");
    newPostSubmitButton.addEventListener("click", async function () {
      const postTitle = document.querySelector("#new-post-title").value;
      const postContent = document.querySelector("#new-post-content").value;
      const postTag = document.querySelector("#new-post-tag").value;

      toggleError("new-post-title", postTitle);
      toggleError("new-post-content", postContent);
      toggleError("new-post-tag", postTag);

      if (postTitle && postContent) {
        await uploadNewPost({
          title: postTitle,
          content: postContent,
          tag: postTag,
        });
      }
    });

    function toggleError(id, value) {
      if (value) {
        document.querySelector(`#${id}`).classList.remove("error-line");
      } else {
        document.querySelector(`#${id}`).classList.add("error-line");
      }
    }
  };
})();
