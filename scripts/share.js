address = document.getElementById("myInput")
address.setAttribute('placeholder', window.location.href)
address.value = window.location.href.toString();


function myFunction() {
    $(".message").text("link copied");
    let address = document.getElementById("myInput");
    console.log(address.value);
    address.select();
    address.setSelectionRange(0, 99999)
    document.execCommand('copy');
}

function showToast() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}



shareEventTwitter = document.getElementById("shareSuccessfulTwitter");
shareEventTwitter.addEventListener('click', function (event) {
    showToast()
    

});

//    
