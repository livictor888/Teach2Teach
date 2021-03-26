(function () {
  window.onload = async function () {
    isUserLoggedIn().then(function (result) {
      console.log("User logged in: " + result);
    });

    /**** ===== Render post detail ===== ****/
    showSpinner();
    db.collection("posts")
      .orderBy("date_created", "desc")
      .onSnapshot((querySnapshot) => {
        removeSpinner();
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
    function renderNewPost(post) {
      const postHomePage = document.querySelector("#homepage-content");

      // Container
      const container = document.createElement("div");
      container.setAttribute("class", "container-fluid my-3");
      postHomePage.appendChild(container);
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
      tagContainer.setAttribute("class", "d-flex mb-2");
      tagContainer.innerHTML = `
        <div class="badge rounded-pill bg-secondary text-white mr-1">
          lorem ipsum
        </div>
        <div class="badge rounded-pill bg-secondary text-white mr-1">
          lorem ipsum
        </div>
        <div class="badge rounded-pill bg-secondary text-white mr-1">
          lorem ipsum
        </div>
      `;
      container.appendChild(tagContainer);

      // Content
      const postContentElem = document.createElement("div");
      postContentElem.setAttribute("class", "my-2 post-content");
      postContentElem.innerHTML = `
        <div class="my-2 post-content">
        <p><span>${post.content}</span></p>
      `;
      container.appendChild(postContentElem);

      // Interaction
      const interactionElem = document.createElement("div");
      interactionElem.setAttribute("class", "d-flex");
      interactionElem.innerHTML = `
          <div class="d-flex align-items-center">
            <img class="icon" src="./images/icon-like.png" alt="icon-sharing" />
            <p class="ml-2">12 Likes</p>
          </div>
          <div class="d-flex align-items-center ml-3 flex-1">
            <img class="icon" src="./images/icon-comment.png" alt="icon-sharing" />
            <p class="ml-2">254 comments</p>
          </div>
          <div class="d-flex align-items-center">
            <img class="icon-bookmark" src="./images/icon-bookmark.png" alt="icon-bookmark" />
          </div>
      `;
      container.appendChild(interactionElem);

      // Separated line
      const line = document.createElement("div");
      line.setAttribute("class", "bg-secondary w-100 separated-line");
      container.parentNode.appendChild(line);
    }

    /**** ===== Helper functions ===== ****/
    function renderNewPost(post) {
      const postHomePage = document.querySelector("#homepage-content");

      // Container
      const container = document.createElement("div");
      container.setAttribute("class", "container-fluid my-3");
      postHomePage.appendChild(container);
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
      tagContainer.setAttribute("class", "d-flex mb-2");
      tagContainer.innerHTML = `
        <div class="badge rounded-pill bg-secondary text-white mr-1">
          lorem ipsum
        </div>
        <div class="badge rounded-pill bg-secondary text-white mr-1">
          lorem ipsum
        </div>
        <div class="badge rounded-pill bg-secondary text-white mr-1">
          lorem ipsum
        </div>
      `;
      container.appendChild(tagContainer);

      // Content
      const postContentElem = document.createElement("div");
      postContentElem.setAttribute("class", "my-2 post-content");
      postContentElem.innerHTML = `
        <div class="my-2 post-content">
        <p><span>${post.content}</span></p>
      `;
      container.appendChild(postContentElem);

      // Interaction
      const interactionElem = document.createElement("div");
      interactionElem.setAttribute("class", "d-flex");
      interactionElem.innerHTML = `
          <div class="d-flex align-items-center">
            <img class="icon" src="./images/icon-like.png" alt="icon-sharing" />
            <p class="ml-2">12 Likes</p>
          </div>
          <div class="d-flex align-items-center ml-3 flex-1">
            <img class="icon" src="./images/icon-comment.png" alt="icon-sharing" />
            <p class="ml-2">254 comments</p>
          </div>
          <div class="d-flex align-items-center">
            <img class="icon-bookmark" src="./images/icon-bookmark.png" alt="icon-bookmark" />
          </div>
      `;
      container.appendChild(interactionElem);

      // Separated line
      const line = document.createElement("div");
      line.setAttribute("class", "bg-secondary w-100 separated-line");
      container.parentNode.appendChild(line);
    }
  };
})();
