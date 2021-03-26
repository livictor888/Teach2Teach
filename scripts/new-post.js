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

    function showSpinner() {
      const body = document.querySelector("body");
      const loading = document.createElement("div");
      loading.setAttribute(
        "style",
        "position: absolute; top: 0px; left: 0px; background-color: rgba(255, 255, 255, 0.70);"
      );
      loading.innerHTML = `  
        <div class="d-flex justify-content-center align-items-center" style="width: 100vw; height: 100vh;">
          <div class="spinner-border" style="width: 4rem; height: 4rem;" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      `;
      body.appendChild(loading);
    }
  };
})();
