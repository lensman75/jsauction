var loginModal = document.getElementById('login_modal');
var registerModal = document.getElementById("registration_modal");
var welcomeModal = document.getElementById("welcome_modal");
var addItemModal = document.getElementById("addItem_modal");
var startAuctionModal = document.getElementById("startAuction_modal");
var spanModalCloseLogin = document.getElementsByClassName("close")[0];
var spanModalCloseRegistration = document.getElementsByClassName("close")[1];
var spanModalCloseWelcome = document.getElementsByClassName("close")[2];
var spanModalCloseAddItem = document.getElementsByClassName("close")[3];
var currentUser;
var allusers = [];
var itemsList = [];
var activeList = [];
var pendingAuctionItemId;

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
spanModalCloseAddItem.onclick = function() {
  addItemModal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == loginModal || event.target == registerModal || event.target == welcomeModal || event.target == addItemModal || event.target == startAuctionModal) {
    loginModal.style.display = "none";
    registerModal.style.display = "none";
    welcomeModal.style.display = "none";
    addItemModal.style.display = "none";
    startAuctionModal.style.display = "none";
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
  document.getElementById("mainFooter").innerHTML = "";
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
function loadAddItemModal() {
  loginModal.style.display = "none";
  registerModal.style.display = "none";
  welcomeModal.style.display = "none";
  addItemModal.style.display = "block";
}
function cancelAddItem() {
  addItemModal.style.display = "none";
}
function cancelUserRegistration() {
  registerModal.style.display = "none";
  loginModal.style.display = "block";
}
function cancelAuctionModal() {
  startAuctionModal.style.display = "none";
  pendingAuctionItemId = null;
}
function showAuctionModal(i) {
  startAuctionModal.style.display = "block";
  var auctionDetails = document.getElementById("startAuctionDetailes");
  var name = auctionDetails[0].value = itemsList[i].name;
  var description = auctionDetails[1].value = itemsList[i].description;
  var imaage = auctionDetails[5].value = itemsList[i].image;
  var start_price = auctionDetails[2].value = 500;
  var finish_price = auctionDetails[3].value = 50;
  var auction_duration = auctionDetails[4].value = 15;
  pendingAuctionItemId = i;
}

function userLoginExist (users, name, pass) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].name == name && users[i].pass == pass){
      return true;
    }
  }
  return false;
}

function handleLogin() {
  var loginForm = document.getElementById("loginForm");
  var userName = loginForm[0].value;
  var userPassword = loginForm[1].value;
  if (userLoginExist(allusers, userName, userPassword)) {
    loadWelcomeModal();
    document.getElementById("userInfo").innerHTML = "Hello " + userName;
    document.getElementById("userBalance").innerHTML = "Your balance " + "1000" + "$";
  }
  else {
      document.getElementById("mainFooter").innerHTML = "Login error"
  }
}

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
    document.getElementById("mainFooter").innerHTML = "";
    loadLoginModal();
  }
  else {
    alert("This Name already exist. You can choose another Name or restore password if you forget!");
      }
}

function addItem() {
  var itemName = document.getElementById("addItemDetails")[0].value;
  var itemDescription = document.getElementById("addItemDetails")[1].value;
  var itemImage = document.getElementById("addItemDetails")[2].value;
  itemsList.push({
    "name":itemName,
    "description":itemDescription,
    "image":itemImage,
  });
  renderList(itemsList);
}

function renderList(items) {
  var h = "<table>" ;
  h += "<thead><tr>";
  h += "<th>Item name</th>";
  h += "<th>Description</th>";
  h += "<th>Image</th>";
  h += "<th>Start auction</th>";
  h += "<th>Delete item</th>";
  h += "<tbody>";
  for (var i = 0; i < items.length; i++) {
    h+= "<tr>";
    h+= "<td>" + items[i].name + "</td>";
    h+= "<td>" + items[i].description + "</td>";
    h+= "<td>" + items[i].image + "</td>";
    // h+= "<td><button onclick=\"startAuction("+i+")\">Start auction</button>"
    h+= "<td><button onclick=\"showAuctionModal("+i+")\">Start auction</button>"
    h+= "<td><button onclick=\"deleteElementFromList("+i+")\">Delete item</button>";
  }
  document.getElementById("itemList").innerHTML = h;
}

function renderStartAuction(items) {
  var h = "<table>" ;
  h += "<thead><tr>";
  h += "<th>Item name</th>";
  h += "<th>Time left</th>";
  h += "<th>Current price</th>";
  h += "<th>Minimal price</th>";
  h += "<th>Stop auction</th>";
  h += "<tbody>";
  for (var i = 0; i < items.length; i++) {
    h+= "<tr>";
    h += "<td>" + items[i].name + "</td>";
    h += "<td>" + items[i].left_time + "</td>";
    h += "<td>" + items[i].current_price + "</td>";
    h += "<td>" + items[i].minimal_price + "</td>";
    h += "<td><button onclick=\"stopAuction("+i+")\">Stop auction</button></td>";
  }
  document.getElementById("startedLot").innerHTML = h;
}

function stepTime() {
  for (var i =0; i < activeList.length; i++){

    if (activeList[i].left_time > 0) {
      activeList[i].left_time -= 1;
      if (activeList[i].current_price > activeList[i].minimal_price) {
        var diff = (activeList[i].max_price - activeList[i].minimal_price)/activeList[i].duration;
        activeList[i].current_price -= diff;
      }
    }
  }
}
setInterval(function () {
  stepTime();
  renderStartAuction(activeList);
}, 1000);

function startAuction() {
  var auctionDetails = document.getElementById("startAuctionDetailes");
  var name = auctionDetails[0].value;
  var description = auctionDetails[1].value;
  var image = auctionDetails[5].value;
  var start_price = auctionDetails[2].value;
  var finish_price = auctionDetails[3].value;
  var auction_duration = auctionDetails[4].value;
  activeList.push({
    "name": name,
    "description": description,
    "image": image,
    "current_price" : start_price,
    "left_time" : auction_duration,
    "duration" : auction_duration,
    "max_price" : start_price,
    "minimal_price" : finish_price
  });
  // console.log({"name": itemsList[i].name,"left_time": itemsList[i].auction_duration, "current_price":itemsList[i].start_price,"minimal_price":itemsList[i].finish_price});
  deleteElementFromList(pendingAuctionItemId);
  renderStartAuction(activeList);
  startAuctionModal.style.display = "none";
}

//"name":itemName,"start_price":itemStartPrice,"finish_price":itemLowestPrice, "auction_duration":itemAuctionDuration

function stopAuction(i) {
  itemsList.push({
    "name":activeList[i].name,
    "description" : activeList[i].description,
    "image" : activeList[i].image
  });
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