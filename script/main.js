var loginModal = document.getElementById('login_modal');
var registerModal = document.getElementById("registration_modal");
var welcomeModal = document.getElementById("welcome_modal");
var spanModalCloseLogin = document.getElementsByClassName("close")[0];
var spanModalCloseRegistration = document.getElementsByClassName("close")[1];
var spanModalCloseWelcome = document.getElementsByClassName("close")[2];
var currentUser;
var allusers = [];
var itemsList = [];
var activeList = [];

// // When the user clicks on <span> (x), close the modal
spanModalCloseLogin.onclick = function() {
  loginModal.style.display = "none";
};
spanModalCloseRegistration.onclick = function() {
  registerModal.style.display = "none";
};
spanModalCloseWelcome.onclick = function() {
  welcomeModal.style.display = "none";
};


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == loginModal || event.target == registerModal || event.target == welcomeModal) {
    loginModal.style.display = "none";
    registerModal.style.display = "none";
    welcomeModal.style.display = "none";
  }
};

class User {
  constructor(name, password) {
    this.name = name;
    this.pass = password;
    this.items = [];
    this.balance = 0;
  }

  static register(...args){
      return new User(...args);
    }
}

function loadLoginModal() {
  loginModal.style.display = "block";
  registerModal.style.display = "none";
  welcomeModal.style.display = "none";
}
function loadRegisterModal() {
  loginModal.style.display = "none";
  welcomeModal.style.display = "none";
  registerModal.style.display = "block";
}
function loadWelcomeModal() {
  loginModal.style.display = "none";
  registerModal.style.display = "none";
  welcomeModal.style.display = "block";
}

function handleLogin() {
  var loginForm = document.getElementById("loginForm");
  var userName = loginForm[0].value;
  var userPassword = loginForm[1].value;
  for (var i = 0; i < allusers.length; i++) {
    console.log(userName, allusers[i].name);
    console.log(userPassword, allusers[i].pass);
    if (userName == allusers[i].name && userPassword == allusers[i].pass) {
      loadWelcomeModal();
      document.getElementById("userInfo").innerHTML = "Hello " + userName;
      document.getElementById("userBalance").innerHTML = "Your balance " + "1000" + "$";
      break;
    } else {
      document.getElementById("mainFooter").innerHTML = "Login error"
    }
  }
};

function handleRegistration() {
  loadRegisterModal();
}

function userExists(users, name) {
  for (var i = 0; i < users.length; i++) {
    if(users[i].name == name) {
      return true;
    }
  }
  return false;
}

function handleUserCreation() {
  var registrationForm = document.getElementById("abb");
  var name = registrationForm[0].value;
  var password = registrationForm[1].value;
  var repeatpass = registrationForm[2].value;
  if (password != repeatpass) {
    alert("Passwords you entered are not identical");
    return;
  }
  if (!userExists(allusers,name)) {
    currentUser = User.register(name, password);
    allusers.push(currentUser);
    console.log(allusers);
    alert("Welcome to auction! Now you can have fun!");
    loadLoginModal();
  }
  else {
    alert("This Name already exist. You can choose another Name or restore password if you forget!");
      }
}

function addText() {
  var userText = document.getElementById("userText").value;
  itemsList.push(userText);
  renderList(itemsList);
}

function renderList(items) {
  var h = "";
  for (var i = 0; i < items.length; i++) {
    h += "<li>" +i + "---" + items[i] + "<button onclick=\"deleteElementFromList("+i+")\">Delete</button>" + "<button onclick=\"startAuction("+i+");timer(" + i + ")\">Start auction</button>" + "</li>";
  }
  document.getElementById("itemList").innerHTML = h;
}

function renderStartAuction(items) {
  var h = "";
  var spanTimer = "<span class=\"spanTimer\"></span>";
  for (var i = 0; i < items.length; i++) {
    h += "<li>" + i + " --- " + items[i] +" " +spanTimer + " "+"<button onclick=\"stopAuction("+i+")\">Stop" +
        " auction</button>" +"</li>";
  }
  document.getElementById("startedLot").innerHTML = h;
}


function timer(i) {
  var timeleft = 20;
  var downloadTimer = setInterval(function(){
    timeleft--;
    document.getElementsByClassName("spanTimer")[i].innerHTML = timeleft;
    if(timeleft <= 0)
      clearInterval(downloadTimer);
  },1000);
}

function startAuction(i) {
  activeList.push(itemsList[i]);
  // timer(i);
  deleteElementFromList(i);
  renderStartAuction(activeList);
  // timer(i);
}

function stopAuction(i) {
  itemsList.push(activeList[i]);
  deleteElementFromAuction(i);
  renderStartAuction(activeList);
  renderList(itemsList);
}

function deleteElementFromList(i) {
  itemsList.splice(i,1);
  renderList(itemsList);
}

function deleteElementFromAuction(i) {
  activeList.splice(i,1);
  renderStartAuction(activeList);
}