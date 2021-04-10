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
          comments: 0,
          user_id: CURRENT_USER.uid,
        })
        .then((docRef) => {
          window.location.href = `./post-detail.html?post_id=${docRef.id}`;
        })
        .catch((err) => {
          console.log(err);
        });

      showSpinner();
    }

    /**** ===== Add new feature post add tag ===== ****/
    const selectPostTag = document.querySelector("#new-post-tag");
    const selectPostTagWrapper = document.querySelector(".tag-chosen");
    if (selectPostTag && selectPostTagWrapper) {
      selectPostTag.addEventListener("change", (event) => {
        const selectedValue = event.target.value;
        const currentSelectedValue =
          selectPostTagWrapper.getAttribute("data-chosen") || "";

        if (currentSelectedValue.indexOf(selectedValue) >= 0) {
          // Remove tag bubble
          selectPostTagWrapper.querySelectorAll("span").forEach((elem) => {
            if (elem.innerText === selectedValue) {
              elem.remove();
            }
            const newDataChosen = currentSelectedValue
              .split(",")
              .filter((val) => !!val && val !== selectedValue)
              .join(",");
            selectPostTagWrapper.setAttribute("data-chosen", newDataChosen);
          });
        } else {
          // Create tag bubble
          const tagElem = document.createElement("span");
          tagElem.setAttribute("class", "tag-bubble");
          tagElem.innerText = ` ${selectedValue} `;
          selectPostTagWrapper.appendChild(tagElem);
          selectPostTagWrapper.setAttribute(
            "data-chosen",
            currentSelectedValue + `,${selectedValue}`
          );
        }

        // Reset
        event.target.value = "";
      });
    }

    /**** ===== Add new feature upload post ===== ****/
    const newPostSubmitButton = document.querySelector("#new-post-submit-btn");
    newPostSubmitButton.addEventListener("click", async function () {
      const postTitle = document.querySelector("#new-post-title").value;
      const postContent = document.querySelector("#new-post-content").value;
      let postTagData = document
        .querySelector(".tag-chosen")
        .getAttribute("data-chosen");
      const postTag = (postTagData || "").split(",").filter((val) => !!val);

      toggleError("new-post-title", postTitle);
      toggleError("new-post-content", postContent);
      toggleError("tag-wrapper", postTag.length > 0);

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
