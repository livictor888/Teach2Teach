address = document.getElementById("myInput");
address.setAttribute("placeholder", window.location.href);
address.value = window.location.href.toString();

function copyClipBoard() {
  $(".message").text("link copied");
  let address = document.getElementById("myInput");
  address.select();
  address.setSelectionRange(0, 99999);
  document.execCommand("copy");
}

function showToast() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}

shareElems = document.querySelectorAll(".smd");
shareElems.forEach((elem) => {
  elem.addEventListener("click", function () {
    showToast();
  });
});

document
  .querySelector(".button-share.cpy")
  .addEventListener("click", copyClipBoard);
