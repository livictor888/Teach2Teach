function myFunction() {

    $(".message").text("link copied");
}

function showToast() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

address = document.getElementById("myInput")
address.setAttribute('placeholder', window.location.href)

shareEventTwitter = document.getElementById("shareSuccessfulTwitter");
shareEventTwitter.addEventListener('click', function (event) {
    //M.toast({html: 'I am a toast!'})
    //alert("share sucessful");
    showToast()
    

});

//    
