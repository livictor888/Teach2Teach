(function () {
  window.onload = async function () {
    showSpinner();
    const currentUser = await isUserLoggedIn();
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("post_id");

    db.collection("posts")
      .doc(postId)
      .onSnapshot((doc) => {
        removeSpinner();
        renderPostDetail({ id: doc.id, ...doc.data() }, currentUser);
      });

    // Render post detail
    async function renderPostDetail(post, currentUser) {
      const container = document.querySelector("#post-detail-container");
      const contentElem = document.createElement("div");
      contentElem.setAttribute("class", "container-fluid my-3");
      contentElemHTML = `
      <!-- Title -->
      <div class="h4 text-capitalized">${post.title}</div>

      <!-- Share -->
      <div class="icon icon-share">
        <img
          class="icon"
          src="./images/icon-sharing.png"
          alt="icon-sharing"
          data-toggle="modal"
          data-target="#shareModal"
        />
      </div>

      <!-- Tag badges -->
      <div id="post-tag-placeholder"></div>

      <!-- Content -->
      <div class="my-2 post-content">${post.content}</div>

      <!-- Post interaction -->
      <div class="d-flex">
        <div class="d-flex align-items-center">
          <img id="post-icon-like" class="icon" src="./images/${
            (post.who_likes || []).includes((currentUser || {}).uid)
              ? "icon-heart-solid"
              : "icon-heart-frame"
          }.png" alt="icon-like" />
          <p class="ml-2" id="post-number-of-likes"></p>
        </div>
        <div class="d-flex align-items-center ml-3 flex-1">
          <img class="icon" src="./images/icon-comment.png" alt="icon-comment" />
          <p class="ml-2" id="post-number-of-comments"></p>
        </div>
        <div class="d-flex align-items-center" id="post-bookmark-${post.id}">
        </div>
      </div>
      <div class="bg-secondary w-100 mt-3 mb-2" style="height: 2px"></div>

      <!-- Comment section -->
      <div id="post-comment-wrapper">
      </div>

      <!-- New comment section -->
      <div id="new-comment-placeholder />

      <!-- Recommended Topics -->
      <div class="mb-4">
        <div class="h5">Recommended Topics</div>
        <div class="d-flex rec-topics-container">
          <div class="rec-topics" keyword="Communication">
            <p>Communication</p>
          </div>
          <div class="rec-topics" keyword="Entertainment Tips">
            <p>Entertainment Tips</p>
          </div>
          <div class="rec-topics" keyword="Creative Content">
            <p>Creative Content</p>
          </div>
          <div class="rec-topics" keyword="Planning and Organisation">
            <p>Planning</p>
          </div>
          <div class="rec-topics" keyword="Time Management">
            <p>Time Management</p>
          </div>
          <div class="rec-topics" keyword="Other">
            <p>Other</p>
          </div>
        </div>
      </div>
      `;

      // Render new comment section if user logged in
      if (currentUser) {
        contentElem.innerHTML = contentElemHTML.replace(
          `<div id="new-comment-placeholder />`,
          `<div class="w-100 my-4">
          <input 
            id="input-post-comment"
            class="w-100 comment-input"
            placeholder="Comment here"
          />
        </div>`
        );
      } else {
        contentElem.innerHTML = contentElemHTML;
      }

      container.innerHTML = "";
      container.appendChild(contentElem);
      renderTag(post);

      addEventToLikePost(post);
      addEventToInputPostComment(post);
      addClickEventToBookmarkIcon(post);
      addClickEventToTopics();

      renderLikes(post);
      await renderBookmarkIcon(post);
      await renderComments(post);
    }

    // Render tag
    function renderTag(post) {
      const element = document.querySelector("#post-tag-placeholder");
      if (element) {
        element.setAttribute("class", "d-flex flex-wrap mb-2 post-tag");
        let content = "";
        (post.tag || []).forEach((tag) => {
          content += `
          <div class="badge rounded-pill text-white mt-1 mr-1" style="background-color: #185d8b;">
            ${tag}
          </div>`;
        });
        element.innerHTML = content;
      }
    }

    // Render Like section
    function renderLikes(post) {
      // Insert total number of likes
      document.querySelector("#post-number-of-likes").innerText =
        post.likes + " Likes";
    }

    // Render comment section
    function renderComments(post) {
      return new Promise((res) => {
        // Get the comment content
        db.collection("comments")
          .where("post_id", "==", post.id)
          .orderBy("date_created")
          .onSnapshot((querySnapshot) => {
            const commentElem = document.createElement("div");
            let commentSection = "";
            let promises = [];
            const listOfCommentIds = [];

            // Insert total number of comments
            document.querySelector("#post-number-of-comments").innerText =
              querySnapshot.size > 1
                ? `${querySnapshot.size} Comments`
                : `${querySnapshot.size} Comment`;

            // Insert each comments
            querySnapshot.forEach((doc, index) => {
              const commentDoc = doc.data();

              // Add promise to fetch author info of each comments
              promises.push(
                getDataFromDocAsync(db, "users", commentDoc.user_id)
              );
              let content = `        
              <div class="d-flex my-2">
                <img class="comment-avatar" src="https://randomuser.me/api/portraits/thumb/women/<avatar_${
                  commentDoc.user_id
                }>.jpg" alt="avatar" />
                <div class="ml-2 flex-fill">
                  <p>
                    <span class="comment-username"><username_${
                      commentDoc.user_id
                    }></span> <content>
                  </p>
                  <div class="d-flex comment-interactions">
                    <div class="mr-2">${convertTimeFromThePast(
                      commentDoc.date_created
                    )}</div>
                    <div class="mr-2">${commentDoc.likes} likes</div>
                    ${
                      commentDoc.user_id === (currentUser || {}).uid
                        ? `<div class="comment-delete" comment-id="${doc.id}" id="delete-comment-${doc.id}">
                            <img src="./images/icon-trash.png" alt="delete" />
                          </div>`
                        : ""
                    }
                  </div>
                </div>
                <div class="comment-like-icon-wrapper" comment_id="${doc.id}">
                  <img class="comment-like-icon" alt="icon-like" src="./images/${
                    commentDoc.who_likes.includes((currentUser || {}).uid)
                      ? "icon-like-solid.png"
                      : "icon-like-frame.png"
                  }"/>
                </div>
              </div>`;

              // Store comment ids to add event delete comment
              if (commentDoc.user_id === (currentUser || {}).uid) {
                listOfCommentIds.push(doc.id);
              }

              content = content.replace("<content>", commentDoc.content);
              commentSection += content;
            });

            Promise.all(promises).then((userDocs) => {
              userDocs.forEach((user, index) => {
                const userData = user.data();

                // Insert author info to comment elements
                commentSection = commentSection.replace(
                  `<username_${user.id}>`,
                  userData.name
                );
                commentSection = commentSection.replace(
                  `<avatar_${user.id}>`,
                  userData.ava_number
                );
              });
              commentElem.innerHTML = commentSection;

              const postCommentWrapper = document.querySelector(
                "#post-comment-wrapper"
              );
              postCommentWrapper.innerHTML = "";
              postCommentWrapper.appendChild(commentElem);

              addEventToLikeCommentIconn();

              listOfCommentIds.forEach((commentId) => {
                addClickEventToDeleteCommentIcon(commentId);
              });
              res("");
            });
          });
      });
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

    // Event handler for like post
    function addEventToLikePost(post) {
      const element = document.querySelector("#post-icon-like");
      if (element) {
        element.addEventListener("click", (event) => {
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

    // Event handler for input comment
    function addEventToInputPostComment(post) {
      const element = document.querySelector("#input-post-comment");
      if (element) {
        element.addEventListener("keydown", (event) => {
          // Save new comment on ennter key only
          if (event.target.value && event.keyCode === 13) {
            db.collection("comments")
              .add({
                content: event.target.value || "",
                post_id: post.id,
                user_id: currentUser.uid,
                likes: 0,
                who_likes: [],
                date_created: Date.now(),
              })
              .then(() => {
                event.target.value = "";

                // Update number of comments in posts collection
                db.collection("posts")
                  .doc(post.id)
                  .update({
                    comments: (post.comments || 0) + 1,
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      }
    }

    // Event handler like comment button
    function addEventToLikeCommentIconn() {
      const elements = document.querySelectorAll(".comment-like-icon-wrapper");

      elements.forEach((element) => {
        element.addEventListener("click", () => {
          if (!currentUser || !currentUser.uid) {
            return;
          }
          // Get comment ref
          const commentRef = db
            .collection("comments")
            .doc(element.getAttribute("comment_id"));

          commentRef.get().then((doc) => {
            const commentData = doc.data();
            // Check if user already liked comment?
            if (commentData.who_likes.includes(currentUser.uid)) {
              // Unlike
              commentRef.update({
                likes: commentData.likes - 1,
                who_likes: doc
                  .data()
                  .who_likes.filter((id) => id != currentUser.uid),
              });

              element.children[0].setAttribute(
                "src",
                "./images/icon-like-frame.png"
              );
            } else {
              // like
              commentRef.update({
                likes: commentData.likes + 1,
                who_likes: [...commentData.who_likes, currentUser.uid],
              });

              element.children[0].setAttribute(
                "src",
                "./images/icon-like-solid.png"
              );
            }
          });
        });
      });
    }

    // Event handler to bookmark icon
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

    // Event handler to bookmark icon
    function addClickEventToDeleteCommentIcon(commentId) {
      const deleteCommentElem = document.querySelector(
        `#delete-comment-${commentId}`
      );
      if (deleteCommentElem) {
        deleteCommentElem.addEventListener("click", (event) => {
          if (!currentUser) return;

          db.collection("comments").doc(commentId).delete();
        });
      }
    }

    // Event handler to bookmark icon
    function addClickEventToTopics() {
      const topicElems = document.querySelectorAll(`.rec-topics`);
      topicElems.forEach((elem) => {
        if (elem) {
          elem.addEventListener("click", () => {
            window.location.href = `/search.html?tag=${elem.getAttribute(
              "keyword"
            )}`;
          });
        }
      });
    }
  };
})();
