(function () {
  window.onload = async function () {
    showSpinner();
    const currentUser = await isUserLoggedIn();
    if (!currentUser) return;

    const bookmarkWrapper = document.querySelector(
      "#bookmark-result-placeholder"
    );

    // Query all bookmarks id
    db.collection("users")
      .doc(currentUser.uid)
      .onSnapshot((snapshot) => {
        const bookmarkIds = snapshot.data().bookmarks || [];

        if (bookmarkIds.length) {
          // Query all bookmarked posts
          db.collection("posts")
            .where(firebase.firestore.FieldPath.documentId(), "in", bookmarkIds)
            .onSnapshot((snapshotResult) => {
              removeSpinner();
              document.querySelector(".bookmark-title").innerText =
                "Your bookmarks";

              bookmarkWrapper.innerHTML = "";
              snapshotResult.forEach((doc) => {
                renderBookmarkedPosts({ ...doc.data(), id: doc.id });
              });
            });
        } else {
          removeSpinner();
          document.querySelector(".bookmark-title").innerText =
            "Your bookmarks";
          bookmarkWrapper.innerHTML = `
            <div class="no-bookmark-post">
              <img src="./images/icon-warning.jpg" alt="warning" />
              <div class="no-bookmark-post-text">
                You currently don't have any bookmark posted
              </div>
            </div>
          `;
        }
      });

    // Render bookmark post
    function renderBookmarkedPosts(post) {
      // Container
      const containerWrapper = document.createElement("div");
      containerWrapper.setAttribute("class", "card m-2 shadow");
      containerWrapper.setAttribute("id", `post-card-${post.id}`);
      const container = document.createElement("div");
      container.setAttribute("class", "container-fluid my-3");
      containerWrapper.appendChild(container);
      bookmarkWrapper.appendChild(containerWrapper);
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
            <div class="badge rounded-pill bg-secondary text-white mt-1 mr-1">
              ${tag}
            </div>`;
      });
      tagContainer.innerHTML = tagContent;
      container.appendChild(tagContainer);

      // Content
      const postContentElem = document.createElement("div");
      postContentElem.setAttribute("class", "my-2 post-content");
      const formattedContent = shortenContent(post.content, 150);
      postContentElem.innerHTML = `
        <p>${formattedContent}
          ${
            formattedContent.length < post.content.length &&
            `<span class="text-read-more text-primary post-readmore">
                Read More
              </span>`
          }
        </p>
      `;
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
                (post.who_likes || []).includes((CURRENT_USER || {}).uid)
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
          <div class="d-flex align-items-center icon-bookmark-wrapper" id="post-bookmark-${
            post.id
          }">
            <img class="icon-bookmark" src="./images/icon-bookmark-solid.png" alt="icon-bookmark" />
          </div>
      `;

      container.appendChild(interactionElem);
      addClickEventToLikeIcon(post);
      addClickEventToBookmarkIcon(post);
    }

    // Add click event to like icon
    function addClickEventToLikeIcon(post) {
      const element = document.querySelector(`#post-like-icon-${post.id}`);
      if (element) {
        element.addEventListener("click", (event) => {
          event.stopPropagation();
          if (!CURRENT_USER) return;

          if (post.who_likes.includes(CURRENT_USER.uid)) {
            db.collection("posts")
              .doc(post.id)
              .update({
                likes: post.likes - 1,
                who_likes: [
                  ...post.who_likes.filter((id) => id !== CURRENT_USER.uid),
                ],
              });
          } else {
            db.collection("posts")
              .doc(post.id)
              .update({
                likes: post.likes + 1,
                who_likes: [...post.who_likes, CURRENT_USER.uid],
              });
          }
        });
      }
    }

    // Add click event to bookmark icon
    function addClickEventToBookmarkIcon(post) {
      const bookmarkElem = document.querySelector(`#post-bookmark-${post.id}`);
      if (bookmarkElem) {
        bookmarkElem.addEventListener("click", (event) => {
          event.stopPropagation();
          if (!CURRENT_USER) return;

          const postCard = document.querySelector(`#post-card-${post.id}`);
          postCard.classList.add("animate__animated");
          postCard.classList.add("animate__fadeOutUp");

          setTimeout(() => clickBookMarkPost(post, CURRENT_USER.uid), 600);
        });
      }
    }
  };
})();
