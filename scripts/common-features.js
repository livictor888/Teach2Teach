// Signout
function addSignoutToTopBar() {
  const signoutButton = document.querySelector("#sign-out");

  if (signoutButton) {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  }
}

// Signout
function addNavBarFeature() {
  // Home Icon
  const homepageButton = document.querySelector("#bottom-icon-home");

  if (homepageButton) {
    homepageButton.addEventListener("click", function () {
      window.location.href = "./index.html";
    });
  }

  // Add Icon
  const addNewPostIcon = document.querySelector("#bottom-icon-add");
  if (addNewPostIcon) {
    addNewPostIcon.addEventListener("click", function () {
      isUserLoggedIn().then((loggedIn) => {
        console.log(loggedIn);
        if (loggedIn) {
          window.location.href = "./new-post.html";
        } else {
          console.log("here");
          window.location.href = "./login.html";
        }
      });
    });
  }
}

// Call
addSignoutToTopBar();
addNavBarFeature();
