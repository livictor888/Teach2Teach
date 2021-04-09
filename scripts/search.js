const searchButton = document.getElementById("search-post");
var numberOfResult = document.querySelector("#number-of-result");
var inputTextField = document.querySelector("#search-keyword");
var resultNum = 0;
const searchResultWrapper = document.querySelector("#search-content");
searchResultWrapper.setAttribute("class", "container-fluid my-3");

/**** ===== Search the Key word =====****/
searchButton.addEventListener("click", function () {
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

      numberOfResult.innerText = resultNum + " results are founded";
    });
  });

  /**** ===== Navigate to post detail ===== ****/
  // const postTitle = document.querySelectorAll(".post-title");
  // const postReadmore = document.querySelectorAll(".post-readmore");
  // const postContent = document.querySelectorAll(".post-content");

  function renderNewPost(post) {
    // Container
    const container = document.createElement("div");
    container.setAttribute("class", "container-fluid my-3");
    searchResultWrapper.appendChild(container);
    container.addEventListener("click", () => {
      window.location.href = `./post-detail.html?post_id=${post.id}`;
    });

    // Title
    const postTitleElem = document.createElement("div");
    postTitleElem.setAttribute("class", "h4 post-title");
    postTitleElem.innerText = post.title;
    container.appendChild(postTitleElem);

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

    // Separated line
    const line = document.createElement("div");
    line.setAttribute("class", "bg-secondary w-100 separated-line");
    container.parentNode.appendChild(line);
  }
  function shortenContent(content) {
    if (content.length >= 300) {
      return content.substr(0, 300) + "...";
    } else {
      return content;
    }
  }
});
