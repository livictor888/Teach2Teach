// show profile page items: email, name, biography, teaching subject

isUserLoggedIn().then(function (somebody) {
    if (somebody) {
        console.log(somebody.uid);
        db.collection("users")
            .doc(somebody.uid)
            .get()      //read the data
            .then(function (doc) {
                console.log(doc.data().name);
                var userName = doc.data().name;
                var email = doc.data().email;
                document.getElementById("name").setAttribute("placeholder", userName)
                document.getElementById("email").setAttribute("placeholder", email)
            })
    }
})
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
    document.getElementById("EditProfileButton").style.visibility = "hidden";
    document.getElementById("UpdateProfileButton").style.visibility = "visible";
}

// Update Button
function letUserUpdate(){
    document.getElementById("name").readOnly = true;
    document.getElementById("email").readOnly = true;
    document.getElementById("bio").readOnly = true;
    document.getElementById("location").readOnly = true;
    document.getElementById("favsub").readOnly = true;

    //update to firebase
    var updatedName = document.getElementById("name").value;
    console.log(updatedName);
    var updatedEmail = document.getElementById("email").value;
    console.log(updatedEmail);
    var updatedBio = document.getElementById("bio").value;
    console.log(updatedBio);
    var updatedLocation = document.getElementById("location").value;
    console.log(updatedLocation);
    var updatedFavsub = document.getElementById("favsub").value;
    console.log(updatedFavsub);
    isUserLoggedIn().then(function (somebody) {
        if (somebody) {
            console.log(somebody.uid);
            db.collection("users")
                .doc(somebody.uid)
                .set({
                    name: updatedName,
                    email: updatedEmail,
                    bio: updatedBio,
                    location: updatedLocation,
                    favsub: updatedFavsub
                })      //write the new name into Firebase

        }
    })

    // var user = firebase.auth().currentUser;
    // user.updateProfile({
    //     name: updatedName
    // }).then(function() {
    //     console.log("update successful")
        
    // })



    // show spinner
    // then make input fields readonly again and show edit button
    document.getElementById("EditProfileButton").style.visibility = "visible"
    document.getElementById("UpdateProfileButton").style.visibility = "hidden"
    // removeSpinner()




}





// on Edit button click, remove all the readonly attributes from each form