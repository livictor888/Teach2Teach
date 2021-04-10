const searchButton = document.getElementById("search-post");
var numberOfResult = document.querySelector("#number-of-result");
var inputTextField = document.querySelector("#search-keyword");
var resultNum = 0;
const searchResultWrapper = document.querySelector("#search-content");
searchResultWrapper.setAttribute("class", "container-fluid my-3");

/**** ===== Search the Key word =====****/
searchButton.addEventListener("click", function () {
  if (!inputTextField || !inputTextField.value) return;

  showSpinner();
  db.collection("posts").onSnapshot((querySnapshot) => {
    removeSpinner();

    /**** ===== Search Result ===== ****/
    resultNum = 0;

    searchResultWrapper.innerHTML = "";
    querySnapshot.forEach((doc) => {
      if (
        doc
          .data()
          .title.toLowerCase()
          .includes(inputTextField.value.toLowerCase())
      ) {
        renderNewPost({ id: doc.id, ...doc.data() });
        console.log(doc.data());
        resultNum++;
      }
    });

    numberOfResult.innerText =
      resultNum +
      " results are found with keyword `" +
      inputTextField.value +
      "`";
    inputTextField.value = "";
  });

  /**** ===== Navigate to post detail ===== ****/

  function renderNewPost(post) {
    // Container
    const containerWrapper = document.createElement("div");
    containerWrapper.setAttribute("class", "card my-2 shadow");
    const container = document.createElement("div");
    container.setAttribute("class", "card-body container-fluid");
    containerWrapper.appendChild(container);
    searchResultWrapper.appendChild(containerWrapper);
    container.addEventListener("click", () => {
      window.location.href = `./post-detail.html?post_id=${post.id}`;
    });

    containerWrapper.classList.add("animate__animated");
    containerWrapper.classList.add("animate__flipInX");

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
  }
});
