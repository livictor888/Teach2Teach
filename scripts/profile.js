// show profile page items: email, name, biography, teaching subject
const editButton = document.getElementById("EditProfileButton");
const updateButton = document.getElementById("UpdateProfileButton");
const discardButton = document.getElementById("DiscardProfileButton");

isUserLoggedIn().then(function (somebody) {
  if (somebody) {
    db.collection("users")
      .doc(somebody.uid)
      .get() //read the data
      .then(function (doc) {
        document
          .getElementById("name")
          .setAttribute("placeholder", doc.data().name || "Your name");
        document
          .getElementById("email")
          .setAttribute("placeholder", doc.data().email || "Your email");
        document
          .getElementById("bio")
          .setAttribute("placeholder", doc.data().bio || "Your description");
        document
          .getElementById("location")
          .setAttribute("placeholder", doc.data().location || "Your location");
        document
          .getElementById("favsub")
          .setAttribute(
            "placeholder",
            doc.data().favsub || "Your favourite course"
          );
      });

    editButton.addEventListener("click", letUserEdit);
    updateButton.addEventListener("click", letUserUpdate);
    discardButton.addEventListener("click", letUserDiscard);
  }
});

function UserProfileInformation() {
  // const urlParams = new URLSearchParams(window.location.search);
  // const userId = urlParams.get("user_id");
  // const usernameElem = urlParams.get("#name");
  // const userEmailElem = urlParams.get("#email");
}

// Edit Profile Button
function letUserEdit() {
  document.getElementById("name").removeAttribute("readonly");
  document.getElementById("email").removeAttribute("readonly");
  document.getElementById("bio").removeAttribute("readonly");
  document.getElementById("location").removeAttribute("readonly");
  document.getElementById("favsub").removeAttribute("readonly");

  document.getElementById("name").value = CURRENT_USER.name || "";
  document.getElementById("email").value = CURRENT_USER.email || "";
  document.getElementById("bio").value = CURRENT_USER.bio || "";
  document.getElementById("location").value = CURRENT_USER.location || "";
  document.getElementById("favsub").value = CURRENT_USER.favsub || "";

  editButton.classList.add("d-none");
  updateButton.classList.remove("d-none");
  discardButton.classList.remove("d-none");
}

function letUserDiscard() {
  document.getElementById("name").readOnly = true;
  document.getElementById("email").readOnly = true;
  document.getElementById("bio").readOnly = true;
  document.getElementById("location").readOnly = true;
  document.getElementById("favsub").readOnly = true;

  editButton.classList.remove("d-none");
  updateButton.classList.add("d-none");
  discardButton.classList.add("d-none");
}

// Update Button
function letUserUpdate() {
  showSpinner();
  //update to firebase
  var updatedName = document.getElementById("name").value;
  var updatedEmail = document.getElementById("email").value;
  var updatedBio = document.getElementById("bio").value;
  var updatedLocation = document.getElementById("location").value;
  var updatedFavsub = document.getElementById("favsub").value;

  // Prevent user from update empty value
  if (
    !updatedName ||
    !updatedEmail ||
    !updatedBio ||
    !updatedLocation ||
    !updatedFavsub
  ) {
    removeSpinner();
    return;
  }

  isUserLoggedIn().then(function (somebody) {
    if (somebody) {
      db.collection("users")
        .doc(somebody.uid)
        .update({
          name: updatedName,
          email: updatedEmail,
          bio: updatedBio,
          location: updatedLocation,
          favsub: updatedFavsub,
        })
        .then(() => {
          removeSpinner();
        });
    }
  });

  // var user = firebase.auth().currentUser;
  // user.updateProfile({
  //     name: updatedName
  // }).then(function() {
  //     console.log("update successful")

  // })

  // show spinner
  // then make input fields readonly again and show edit button
  document.getElementById("name").readOnly = true;
  document.getElementById("email").readOnly = true;
  document.getElementById("bio").readOnly = true;
  document.getElementById("location").readOnly = true;
  document.getElementById("favsub").readOnly = true;

  editButton.classList.remove("d-none");
  updateButton.classList.add("d-none");
  discardButton.classList.add("d-none");
}

// on Edit button click, remove all the readonly attributes from each form
