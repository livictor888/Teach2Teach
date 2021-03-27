// Signout
function addSignoutToTopBar() {
  const signoutButton = document.querySelector("#sign-out");

  if (signoutButton) {
    signoutButton.addEventListener("click", () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          window.location.href = "./index.html";
        })
        .catch((error) => {
          // An error happened.
        });
    });
  }

  const profileButton = document.querySelector("#sign-out");

  if (signoutButton) {
  }
}

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
        if (loggedIn) {
          window.location.href = "./new-post.html";
        } else {
          window.location.href = "./login.html";
        }
      });
    });
  }

  // Profile Icon

  // Search Icon
}

// Call
addSignoutToTopBar();
addNavBarFeature();
