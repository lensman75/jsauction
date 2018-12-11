var modal = document.getElementById('login_modal');
var span = document.getElementsByClassName("close")[0];

function loadLoginModal() {
  modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
//LoginError
function loginError() {
  var para = document.createElement("footer");
  var node = document.createTextNode("Login error, please do something");
  var modalContent = document.getElementById('ab');
  para.appendChild(node);
  modalContent.appendChild(para);
}