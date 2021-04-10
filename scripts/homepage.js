(function () {
  window.onload = async function () {
    showSpinner();
    const currentUser = await isUserLoggedIn();
    const postHomePage = document.querySelector("#homepage-content");

    /**** ===== Render post detail ===== ****/
    db.collection("posts")
      .orderBy("date_created", "desc")
      .onSnapshot((querySnapshot) => {
        removeSpinner();

        postHomePage.innerHTML = "";

        querySnapshot.forEach((doc) => {
          renderNewPost({ id: doc.id, ...doc.data() });
        });
      });

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

    /**** ===== Helper functions ===== ****/
    async function renderNewPost(post) {
      // Container
      const containerWrapper = document.createElement("div");
      containerWrapper.setAttribute("class", "card m-2 shadow");
      const container = document.createElement("div");
      container.setAttribute("class", "card-body container-fluid");
      containerWrapper.appendChild(container);
      postHomePage.appendChild(containerWrapper);
      container.addEventListener("click", () => {
        window.location.href = `./post-detail.html?post_id=${post.id}`;
      });

      // Title
      const postTitleElem = document.createElement("div");
      postTitleElem.setAttribute("class", "h4 post-title");
      postTitleElem.innerText = post.title;
      container.appendChild(postTitleElem);

      // Tag Badges
      const tagContainer = document.createElement("div");
      tagContainer.setAttribute("class", "d-flex flex-wrap mb-2 post-tag");
      let tagContent = "";
      (post.tag || []).forEach((tag) => {
        tagContent += `
            <div class="badge rounded-pill text-white mt-1 mr-1" style="background-color: #185d8b;">
              ${tag}
            </div>`;
      });
      tagContainer.innerHTML = tagContent;
      container.appendChild(tagContainer);

      // Content
      const postContentElem = document.createElement("div");
      postContentElem.setAttribute("class", "my-2 post-content");
      const formattedContent = shortenContent(post.content);
      postContentElem.innerHTML = `<p>${formattedContent}${
        formattedContent.length < post.content.length
          ? `<span class="text-read-more text-primary post-readmore">Read More</span>`
          : ""
      }
        </p>`;
      container.appendChild(postContentElem);

      // Interaction
      const interactionElem = document.createElement("div");
      interactionElem.setAttribute("class", "d-flex");
      interactionElem.innerHTML = `
          <div class="d-flex align-items-center">
            <img 
              post_id="${post.id}"
              id="post-like-icon-${post.id}"
              class="icon"
              src="./images/${
                (post.who_likes || []).includes((currentUser || {}).uid)
                  ? "icon-heart-solid"
                  : "icon-heart-frame"
              }.png"
              alt="icon-sharing"
            />
            <p class="ml-2">${post.likes || 0} Likes</p>
          </div>
          <div class="d-flex align-items-center ml-3 flex-1">
            <img class="icon" src="./images/icon-comment.png" alt="icon-sharing" />
            <p class="ml-2">${post.comments || 0} Comments</p>
          </div>
          <div class="d-flex align-items-center" id="post-bookmark-${post.id}">
          </div>
      `;
      container.appendChild(interactionElem);
      addClickEventToLikeIcon(post);
      addClickEventToBookmarkIcon(post);

      // Separated line
      // const line = document.createElement("div");
      // line.setAttribute("class", "bg-secondary w-100 separated-line");
      // container.parentNode.appendChild(line);

      await renderBookmarkIcon(post);
    }

    // Add click event to like icon
    function addClickEventToLikeIcon(post) {
      const element = document.querySelector(`#post-like-icon-${post.id}`);
      if (element) {
        element.addEventListener("click", (event) => {
          event.stopPropagation();
          if (!currentUser) return;

          if (post.who_likes.includes(currentUser.uid)) {
            db.collection("posts")
              .doc(post.id)
              .update({
                likes: post.likes - 1,
                who_likes: [
                  ...post.who_likes.filter((id) => id !== currentUser.uid),
                ],
              });
          } else {
            db.collection("posts")
              .doc(post.id)
              .update({
                likes: post.likes + 1,
                who_likes: [...post.who_likes, currentUser.uid],
              });
          }
        });
      }
    }

    // Render Bookmark icon
    async function renderBookmarkIcon(post) {
      return new Promise(async (res) => {
        const bookmarkElem = document.querySelector(
          `#post-bookmark-${post.id}`
        );

        const currentUser = await isUserLoggedIn();
        if (!currentUser || !bookmarkElem) return res("");

        db.collection("users")
          .doc(currentUser.uid)
          .onSnapshot((snapshot) => {
            const bookmarkIcon = document.createElement("img");
            bookmarkIcon.setAttribute("class", "icon-bookmark");
            bookmarkIcon.setAttribute(
              "src",
              `./images/icon-bookmark${
                (snapshot.data().bookmarks || []).includes(post.id)
                  ? "-solid"
                  : ""
              }.png`
            );
            bookmarkIcon.setAttribute("alt", "icon-bookmark");
            bookmarkElem.innerHTML = "";
            bookmarkElem.appendChild(bookmarkIcon);
            res("");
          });
      });
    }

    // Add click event to bookmark icon
    function addClickEventToBookmarkIcon(post) {
      const bookmarkElem = document.querySelector(`#post-bookmark-${post.id}`);
      if (bookmarkElem) {
        bookmarkElem.addEventListener("click", (event) => {
          event.stopPropagation();
          if (!currentUser) return;

          clickBookMarkPost(post, currentUser.uid);
        });
      }
    }
  };
})();
