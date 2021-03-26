(function () {
  window.onload = function () {
    /**** ===== Upload new post function ===== ****/
    async function uploadNewPost(post) {
      const postCollection = db.collection("posts");
      postCollection
        .add({
          title: post.title,
          content: post.content,
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

      if (postTitle && postContent) {
        const a = await uploadNewPost({
          title: postTitle,
          content: postContent,
        });
        console.log(a);
      }
    });
  };
})();
