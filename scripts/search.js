const searchButton = document.getElementById("search-post");

searchButton.addEventListener("click", function () {
  showSpinner();
  console.log("50 results are searched");

  setTimeout(removeSpinner, 1000);
});
