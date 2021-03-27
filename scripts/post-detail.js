(function () {
  window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("post_id");

    showSpinner();
    db.collection("posts")
      .doc(postId)
      .onSnapshot((doc) => {
        removeSpinner();
        renderPostDetail(doc.data());
      });
  };

  /**** ===== Helper functions ===== ****/
  function renderPostDetail(post) {
    const container = document.querySelector("#post-detail-container");
    const contentElem = document.createElement("div");
    contentElem.setAttribute("class", "container-fluid my-3");
    contentElem.innerHTML = `
      <!-- Title -->
      <div class="h4">${post.title}</div>

      <!-- Tag badges -->
      <div class="d-flex mb-2">
        <div class="badge rounded-pill bg-secondary text-white mr-1">
          lorem ipsum
        </div>
        <div class="badge rounded-pill bg-secondary text-white mr-1">
          lorem ipsum
        </div>
        <div class="badge rounded-pill bg-secondary text-white mr-1">
          lorem ipsum
        </div>
      </div>

      <!-- Rating, views and sharing -->
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <div class="d-flex align-items-center">
            <ul class="list-inline rating-list">
              <li><i class="fa fa-star yellow"></i></li>
              <li><i class="fa fa-star yellow"></i></li>
              <li><i class="fa fa-star yellow"></i></li>
              <li><i class="fa fa-star yellow"></i></li>
              <li><i class="fa fa-star gray"></i></li>
            </ul>
          </div>
          <div>
            <p class="small pl-3">3456 Reviews</p>
          </div>
        </div>
        <div>
          <img class="icon" src="./images/icon-sharing.png" alt="icon-sharing" />
        </div>
      </div>

      <!-- Content -->
      <div class="my-2">${post.content}</div>

      <!-- Post interaction -->
      <div class="d-flex">
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
      </div>
      <div class="bg-secondary w-100 mt-3 mb-2" style="height: 2px"></div>

      <!-- Comment section -->
      <div class="d-flex">
        <img class="comment-avatar" src="https://randomuser.me/api/portraits/thumb/women/45.jpg" alt="avatar" />
        <div class="ml-2">
          <p>
            <span class="comment-username">John</span> Lorem ipsum dolor, sit
            amet consecur adipisicing elit.
          </p>
          <div class="d-flex comment-interactions">
            <div class="mr-2">1 d</div>
            <div class="mr-2">4 likes</div>
            <div>Reply</div>
          </div>
        </div>
      </div>

      <!-- New comment section -->
      <div class="w-100 my-4">
        <input class="w-100 comment-input" placeholder="Comment here" />
      </div>

      <!-- Recommended Topics -->
      <div class="mb-4">
        <div class="h5">Recommended Topics</div>
        <div class="d-flex rec-topics-container">
          <div class="rec-topics">
            <p>Topic 1</p>
          </div>
          <div class="rec-topics">
            <p>Topic 2</p>
          </div>
          <div class="rec-topics">
            <p>Topic 3</p>
          </div>
          <div class="rec-topics">
            <p>Topic 4</p>
          </div>
        </div>
      </div>
    `;

    container.appendChild(contentElem);
  }
})();
