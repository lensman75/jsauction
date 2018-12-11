var modal = document.getElementById('login_modal');
var gotoregister = document.getElementById('myRegistration');
var modalreg = document.getElementById('abc');
var span = document.getElementsByClassName('close')[1];

function closeLogin() {
  modal.style.display = "none";
  modalreg.style.display = "block";
  gotoregister.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  gotoregister.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}