var loginModal = document.getElementById('login_modal');
var registerModal = document.getElementById("registration_modal");
var welcomeModal = document.getElementById("welcome_modal");
var addItemModal = document.getElementById("addItem_modal");
var startAuctionModal = document.getElementById("startAuction_modal");
var editItemModal = document.getElementById("editItem_modal");

var spanModalCloseLogin = document.getElementsByClassName("close")[0];
var spanModalCloseRegistration = document.getElementsByClassName("close")[1];
var spanModalCloseWelcome = document.getElementsByClassName("close")[2];
var spanModalCloseAddItem = document.getElementsByClassName("close")[3];
// var spanModalCloseEditItem = document.getElementsByClassName("close")[4];
var currentUser = null;
var allusers = [];
var itemsList = [];
var activeList = [];
var pendingAuctionItemId;
var nextUserId = 0;

var isTimeRunning = true;

//Buttons
var logoutButton = document.getElementById("logoutButton").style.display = "none";
var addFundsButton = document.getElementById("addUserFunds").style.display = "none";
var welcomeUserInfoSection = document.getElementById("welcome_section").style.display = "none";
var welcomeSectionUserName = document.getElementById("welcome_section_name").style.display = "none";
var welcomeSectionUserBalance = document.getElementById("welcome_section_balance").style.display = "none";
var addItemUserButton = document.getElementById("addItemButton").style.display = "none";
var buttonShowVariants = document.getElementById("buttonShowVariants").style.display = "none";

var loc = {};



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
};
spanModalCloseEditItem.onclick = function(){
  document.getElementById("editItem_modal").style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == loginModal ||
      event.target == registerModal ||
      event.target == welcomeModal ||
      event.target == addItemModal ||
      event.target == startAuctionModal ||
      event.target == document.getElementById("editItem_modal")) {
    loginModal.style.display = "none";
    registerModal.style.display = "none";
    welcomeModal.style.display = "none";
    addItemModal.style.display = "none";
    startAuctionModal.style.display = "none";
    document.getElementById("editItem_modal").style.display = "none";
  }
};

class User {
  constructor(name, password) {
    this.name = name;
    this.pass = password;
    this.items = [];
    this.balance = 0;
    this.id = nextUserId;
    nextUserId += 1;
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
function showEditItemModal(i) {
  editItemModal.style.display = "block";
  pendingEditItemId = i;
  document.getElementById("editItemForm_name").value = itemsList[i].name;
  document.getElementById("editItemForm_description").value = itemsList[i].description;
  document.getElementById("editItemForm_image").src = itemsList[i].image;
}
function showAuctionModal(i) {
  startAuctionModal.style.display = "block";
  // var auctionDetails = document.getElementById("startAuctionDetailes");
  // var name = auctionDetails[0].value = itemsList[i].name;
  // var description = auctionDetails[1].value = itemsList[i].description;
  // var image = auctionDetails[6].value = itemsList[i].image;
  // var start_price = auctionDetails[2].value = 500;
  // var finish_price = auctionDetails[3].value = 50;
  // var reduction_time = auctionDetails[4].value = 15;
  // var auction_time = auctionDetails[5].value = 20;
  var name = document.getElementById("startAuctionDetailes_name").value = itemsList[i].name;
  var description = document.getElementById("startAuctionDetailes_description").value = itemsList[i].description;
  
  var image = document.getElementById("startAuctionDetailes_item_image").src = itemsList[i].image;

  var start_price = document.getElementById("startAuctionDetailes_start_price").value = 500;

  var finish_price = document.getElementById("startAuctionDetailes_final_price").value = 50;

  var reduction_time = document.getElementById("startAuctionDetailes_price_reduction_time").value = 15;

  var auction_time = document.getElementById("startAuctionDetailes_auction_time").value = 20;

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

function getUserByName(users, name) {
  for (var i = 0; i < users.length; i++){
    if (users[i].name == name){
      return users[i];
    }
  }
  return null;
}

function getUserById(users, id) {
  for (var i = 0; i < users.length; i++){
    if (users[i].id == id){
      return users[i];
    }
  }
  return null;
}

function handleLogin() {
  var userName = document.getElementById("loginForm_login").value;
  var userPassword = document.getElementById("loginForm_password").value;
  if (userLoginExist(allusers, userName, userPassword)) {
    currentUser = getUserByName(allusers,userName);
    itemsList = currentUser.items;
    document.getElementById("logoutButton").style.display = "block";
    document.getElementById("addItemButton").style.display = "block";
    document.getElementById("welcome_section").style.display = "";
    
    document.getElementById("welcome_section_name").style.display = "";
    document.getElementById("welcome_section_balance").style.display = "";
    document.getElementById("buttonShowVariants").style.display = "block";
    
    var un = document.getElementById("loginForm_login").value;
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("itemList").style.display = "block";
    document.getElementById("addUserFunds").style.display = "block";
    loginModal.style.display = "none";
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("startedLot").style.display = "block";
    document.getElementById("galary_section").style.display = "none";
    document.getElementById("signUpButton").style.display = "none";
    
    renderList(itemsList);
    renderStartAuction(activeList);
    renderUserName();
    renderFunds();
  }
  else {
    //TODO Check, what type of error? Wrong password or username don't exist
    document.getElementById("mainFooter").innerHTML = "<div class=\"alert alert-primary\">Login error." +
          " Please <span class=\"alert-link\" onclick=\"handleRegistration()\">Sign up</span></div>";
  }
}

function handleLogout() {
  currentUser.items = itemsList;
  itemsList = [];
  currentUser = null;
  document.getElementById("logoutButton").style.display = "none";
  document.getElementById("addItemButton").style.display = "none";
  document.getElementById("loginButton").style.display = "block";
  document.getElementById("welcome_section").style.display = "none";
  
  document.getElementById("welcome_section_name").style.display = "none";
  document.getElementById("welcome_section_balance").style.display = "none";
  document.getElementById("buttonShowVariants").style.display = "none";
  
  document.getElementById("itemList").style.display = "none";
  document.getElementById("addUserFunds").style.display = "none";
  document.getElementById("startedLot").style.display = "none";
  document.getElementById("galary_section").style.display = "block";
  document.getElementById("signUpButton").style.display = "block";
  renderList(itemsList);
  renderStartAuction(activeList);
}

function addFunds() {
  if (currentUser != null) {
    currentUser.balance += 1000;
    renderFunds();
    renderUserName();
  }
}

function renderFunds() {
  if (currentUser != null) {
    document.getElementById("welcome_section_balance").innerHTML = "$" + toCurrencyString(currentUser.balance);
  }
}

function renderUserName() {
  if (currentUser != null) {
    console.log(currentUser);
    document.getElementById("welcome_section_name").innerHTML = currentUser.name;
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
  var name = document.getElementById("userRegistrationForm_login").value;
  var password = document.getElementById("userRegistrationForm_password").value;
  var repeatpass = document.getElementById("userRegistrationForm_password_repeat").value;
  if (password != repeatpass) {
    alert("Passwords you entered are not identical");
    return;
  }
  if (!userExists(allusers,name)) {
    var currentUser = User.register(name, password);
    allusers.push(currentUser);
    loadLoginModal();
    document.getElementById("mainFooter").innerHTML = "<div class='alert alert-success'>Welcome to site! Now you can" +
      " have fun! Enter your login and password!</div>";
  }
  else {
    alert("This Name already exist. You can choose another Name or restore password if you forget!");
      }
}

function addItem() {
  var itemName = document.getElementById("addItemDetails_item_name").value;
  var itemDescription = document.getElementById("addItemDetails_description").value;
  var itemImage = pendingImageDataUrl;
  pendingImageDataUrl = null;
  itemsList.push({
    "name":itemName,
    "description":itemDescription,
    "image":itemImage
  });
  renderList(itemsList);
}

var pendingImageDataUrl = null;

function loadImageFile() {
  var preview = document.getElementById('addItemDetails_previewImage');
  var file    = document.getElementById('addItemDetails_imageFile').files[0];
  var reader  = new FileReader();
  
  reader.addEventListener("load", function () {
    console.log(reader.result);
    preview.src = reader.result;
    pendingImageDataUrl = reader.result;
  }, false);
  
  if (file) {
    reader.readAsDataURL(file);
  }
}

function editItemLoadImageFile() {
  var preview = document.getElementById('editItemForm_image');
  var file    = document.getElementById('editItemDetails_imageFile').files[0];
  var reader  = new FileReader();
  
  reader.addEventListener("load", function () {
    preview.src = reader.result;
  }, false);
  
  if (file) {
    reader.readAsDataURL(file);
  }
}


var sortInfo = {
  "auctions" : {
    "sortedBy" : null,
    "sortDirection" : "ascending"
  },
  "items" : {
    "sortedBy" : null,
    "sortDirection" : "ascending"
  }
};

function getHeaderSortIndicator(tableName,fieldName) {
  if (fieldName == sortInfo[tableName].sortedBy) {
    if (sortInfo[tableName].sortDirection == "ascending") {
      return " &#8595";
    } else {
      return " &#8593";
    }
  } else {
    return "";
  }
}

function getSortFunction(fieldName, direction) {
  var aGreatB = 1, aLessB = -1;
  if (direction == "descending") {
    aGreatB = -1;
    aLessB = 1;
  }
  return function(a, b) {
    if (a[fieldName] > b[fieldName]) {
      return aGreatB ;
    } else {
      if (a[fieldName] < b[fieldName]) {
        return aLessB;
      } else {
        return 0;
      }
    }
  };
}

function updateSortOrder(tableName, fieldName) {
  console.log("updateSortOrder",tableName,fieldName);
  if (sortInfo[tableName].sortedBy == fieldName) {
    if (sortInfo[tableName].sortDirection == "ascending") {
      sortInfo[tableName].sortDirection = "descending";
    } else {
      sortInfo[tableName].sortDirection = "ascending";
    }
  }
  sortInfo[tableName].sortedBy = fieldName;
  // viewTable();
  if(tableName == "auctions"){
    renderStartAuction(activeList);
  } else if (tableName == "items"){
    renderList(itemsList);
  } else {
    console.log("Error. Incorrect table name when sorting", tableName, fieldName);
  }
}

function renderList(items) {
  if(filterText != ""){
    items = items.filter(function(obj) {
      return containsText(obj, filterText, ["image"]);
    });
  }
  if(sortInfo["items"].sortedBy != null){
    items = items.slice();
    items.sort(getSortFunction(sortInfo["items"].sortedBy, sortInfo["items"].sortDirection));
    console.log("sort", items);
  }
  var h = "<table class=\"w-100 table\">" ;
  h += "<thead class=\"thead-dark\"><tr>";
  h += "<th class=\"text-center\" onclick='updateSortOrder(\"items\",\"name\")'>Item name" + getHeaderSortIndicator("items","name") + "</th>";
  h += "<th class=\"text-center\" onclick='updateSortOrder(\"items\",\"description\")'>Description" + getHeaderSortIndicator("items","description") + "</th>";
  h += "<th class=\"text-center\">Image</th>";
  h += "<th class=\"text-center\">Start auction</th>";
  h += "<th class=\"text-center\">Edit item</th>"
  h += "<th class=\"text-center\">Delete item</th>";
  h += "<tbody>";
  const disableHighLight = filterText == "";
  for (var i = 0; i < items.length; i++) {
    h+= "<tr>";
    h+= "<td class=\"text-center align-middle\">" + highlightIfContainsText(items[i].name, filterText, disableHighLight) + "</td>";
    h+= "<td class=\"text-center align-middle\">" + highlightIfContainsText(items[i].description, filterText, disableHighLight) + "</td>";
    
    //Some items contain text instead of image data URL, so we check length, if it's too short then it is text
    if(items[i].image == null || items[i].image.length < 50 ){
      h+= "<td class=\"text-center align-middle\">" + items[i].image + "</td>";
    } else {
      h+= "<td class=\"text-center align-middle\"><img src=\"" + items[i].image + "\"" +
        " style=\"width:100px;height:100px;\"></td>";
    }
    
    // h+= "<td><button onclick=\"startAuction("+i+")\">Start auction</button>"
    h+= "<td class=\"text-center align-middle\"><button type='button' class='btn btn-primary' data-toggle='modal'" +
      " data-target='startAuction_modal'" +
      " onclick=\"showAuctionModal("+i+")\">Start" +
        " auction</button>";
    h+= "<td class=\"text-center align-middle\"><button class='btn btn-info' onclick='showEditItemModal(" + i + ")'>Edit" +
      " item</button>";
    h+= "<td class=\"text-center align-middle\"><button class='btn btn-danger' onclick=\"deleteElementFromList("+i+")\">Delete" +
      " item</button>";
  }
  document.getElementById("itemList").innerHTML = h;
}
//TODO Delete this
function editItemData() {
}


function renderStartAuction(items) {
  if(currentUser != null){
    console.log("Render auction as table");
    renderAuctionAsTable(items);
  } else {
    console.log("Render auction as galary");
    renderAuctionAsGalary(items);
  }
}

function renderAuctionAsGalary(items) {
  if(filterText != ""){
    items = items.filter(function(obj) {
      return containsText(obj, filterText, ["image", "owner"]);
    });
  }
  
  items = items.filter(function (x) {
    return x.image != null && x.image.length > 50;
  });
  var numberRows = 2;
  var numberColumns = 3;
  var classNameInnerDiv = "galaryDiv";
  var classNameOuterDiv = "galaryDiv_Outer";
  var numberRowsExisting = Math.floor(items.length/numberColumns);
  
  
  if (items.length%numberColumns != 0){
    numberRowsExisting += 1;
  }
  var h = "";
  
  const disableHighLight = filterText == "";
  
  for (var i = 0; i < Math.min(numberRows,numberRowsExisting); i+=1) {
    h += "<div class=\"" + classNameOuterDiv + "\">";
     for (var j = i * numberColumns; j < Math.min((i+1)*numberColumns,items.length); j+=1){
       h += "<div onclick=\"loadLoginModal()\" class=\""+classNameInnerDiv+"\">\n" +
       "          <img src="+ items[j].image + " alt=\""+items[j].name+"\">\n" +
       "          <p>" + highlightIfContainsText(items[j].name, filterText, disableHighLight) + "</p>\n" +
         "<p>$ " + items[j].current_price + "</p>" +
       "        </div>\n"
     }
    h += "</div>";
  }
  document.getElementById("galary_section").innerHTML = h;
}


function renderAuctionAsTable(items) {
  console.log("Item.length", items.length);
  if(filterText != ""){
    items = items.filter(function(obj) {
      return containsText(obj, filterText, ["image", "description", "owner"]);
    });
    console.log("Item.length", items.length);
  }
  
  if(sortInfo["auctions"].sortedBy != null){
    items = items.slice();
    items.sort(getSortFunction(sortInfo["auctions"].sortedBy, sortInfo["auctions"].sortDirection));
    console.log("sort", items);
  }
  var h = "<table class=\"w-100 table\">" ;
  h += "<thead class=\"thead-dark\"><tr>";
  h += "<th class=\"text-center\" onclick='updateSortOrder(\"auctions\",\"name\")'>Item name" + getHeaderSortIndicator("auctions","name") + "</th>";
  
  h += "<th class=\"text-center\" onclick='updateSortOrder(\"auctions\",\"description\")'>Description" + getHeaderSortIndicator("auctions","name") + "</th>";
  
  h += "<th class=\"text-center\" onclick='updateSortOrder(\"auctions\",\"image\")'>Image" + getHeaderSortIndicator("auctions","name") + "</th>";
  
  h += "<th class=\"text-center\" onclick='updateSortOrder(\"auctions\",\"left_time\")'>Time left" + getHeaderSortIndicator("auctions","left_time") + "</th>";
  h += "<th class=\"text-center\" onclick='updateSortOrder(\"auctions\",\"current_price\")'>Current price" + getHeaderSortIndicator("auctions","current_price") + "</th>";
  h += "<th class=\"text-center\" onclick='updateSortOrder(\"auctions\",\"minimal_price\")'>Minimal price" + getHeaderSortIndicator("auctions","minimal_price") + "</th>";
  h += "<th class=\"text-center\" onclick='updateSortOrder(\"auctions\",\"duration\")'>Auction end time" + getHeaderSortIndicator("auctions","duration") + "</th>";
  if(currentUser != null){
    h += "<th class=\"text-center\">Stop auction</th>";
    h += "<th class=\"text-center\">Buy item</th>";
  }
  h += "<tbody>";
  const disableHighLight = filterText == "";
  for (var i = 0; i < items.length; i++) {
    h+= "<tr>";
    h+= "<td class=\"text-center align-middle\">" + highlightIfContainsText(items[i].name, filterText, disableHighLight) + "</td>";
    
    h+= "<td class=\"text-center align-middle\">" + highlightIfContainsText(items[i].description, filterText, disableHighLight) + "</td>";
  
    if(items[i].image == null || items[i].image.length < 50 ){
      h+= "<td class=\"text-center align-middle\">" + items[i].image + "</td>";
    } else {
      h+= "<td class=\"text-center align-middle\"><img src=\"" + items[i].image + "\" style=\"width:100px;height:100px;\"></td>";
    }
    
    
    
    h+= "<td class=\"text-center align-middle\">" + highlightIfContainsText(toHHMMSS(items[i].left_time), filterText, disableHighLight) + "</td>";
    h+= "<td class=\"text-center align-middle\">" + highlightIfContainsText(toCurrencyString(items[i].current_price), filterText, disableHighLight) + "</td>";
    h+= "<td class=\"text-center align-middle\">" + highlightIfContainsText(toCurrencyString(items[i].minimal_price), filterText, disableHighLight) + "</td>";
    h+= "<td class=\"text-center align-middle\">" + highlightIfContainsText(toHHMMSS(items[i].duration), filterText, disableHighLight) + "</td>";
    if(currentUser != null) {
      if (currentUser != null && currentUser.id == items[i].owner.id){
        console.log("CurrentUser",currentUser);
        console.log("Items [i] owner", items[i].owner);
      h += "<td class=\"text-center align-middle\"><button class=\"usrControl btn btn-danger\" onclick=\"stopAuction("+i+")\">Stop" +
          " auction</button></td>"; }
      else {
        h += "<td></td>";
      }
      if (currentUser != null && !(currentUser.id == items[i].owner.id)){
        var disableButton = "";
        if (currentUser.balance < items[i].current_price){
          disableButton = "disabled";
        }
      h += "<td class=\"text-center align-middle\"><button class=\"usrControl btn btn-success\" onclick=\"buyItem("+i+")\"" + disableButton +">Buy item</button></td>";}
      else {
        h += "<td class=\"text-center align-middle\"></td>";
      }
    }
  }
  document.getElementById("startedLot").innerHTML = h;
}

function buyItem(i) {
  if (currentUser != null && currentUser.balance > activeList[i].current_price) {
    activeList[i].owner.balance += activeList[i].current_price;
    currentUser.balance -= activeList[i].current_price;
    currentUser.items.push({
      "name" : activeList[i].name,
      "description" : activeList[i].description,
      "image" : activeList[i].image
      // "owner": currentUser
    });
    deleteElementFromAuction(i);
    renderList(itemsList);
    renderFunds();
  }
}

function startStopTimeButtonClick() {
  if(isTimeRunning){
    isTimeRunning = false;
    document.getElementById("startStopTimeButton").innerHTML = "Start";
  } else{
    isTimeRunning = true;
    document.getElementById("startStopTimeButton").innerHTML = "Stop";
  }
}

function stepTime() {
  console.log("Step time", isTimeRunning);
  if (!isTimeRunning){
    return;
  }
  console.log("Stop time, continue processing");
  var areItemsChanged = false;
  for (var i =0; i < activeList.length; i++){

    if (activeList[i].left_time > 0) {
      activeList[i].left_time -= 1;
      if (activeList[i].current_price > activeList[i].minimal_price) {
        var diff = (activeList[i].max_price - activeList[i].minimal_price)/(activeList[i].price_reduction);
        activeList[i].current_price -= diff;
      }

    }
    if (activeList[i].duration > 1) {
      activeList[i].duration -= 1;
    }
    else {
      activeList[i].owner.items.push({
        "name" : activeList[i].name,
        "description" : activeList[i].description,
        "image" : activeList[i].image,
        // "owner": activeList[i].owner
      });
      deleteElementFromAuction(i);
      areItemsChanged = true;
    }
  }

  if (areItemsChanged) {
    renderList(itemsList);
  }
  
  renderStartAuction(activeList);
}

setInterval(function () {
  stepTime();
  // renderStartAuction(activeList);
}, 1000);

function startAuction() {
  // var auctionDetails = document.getElementById("startAuctionDetailes");
  var name = document.getElementById("startAuctionDetailes_name").value;
  var description = document.getElementById("startAuctionDetailes_description").value;
  var image = document.getElementById("startAuctionDetailes_item_image").src;
  var start_price = document.getElementById("startAuctionDetailes_start_price").value;;
  var finish_price = document.getElementById("startAuctionDetailes_final_price").value;
  var price_reduction_time = document.getElementById("startAuctionDetailes_price_reduction_time").value;
  var auction_time = document.getElementById("startAuctionDetailes_auction_time").value;
  activeList.push({
    "name": name,
    "description": description,
    "image": image,
    "current_price" : start_price,
    "left_time" : price_reduction_time,
    "duration" : auction_time,
    "price_reduction" : price_reduction_time,
    "max_price" : start_price,
    "minimal_price" : finish_price,
    "owner" : currentUser
  });
  deleteElementFromList(pendingAuctionItemId);
  renderStartAuction(activeList);
  startAuctionModal.style.display = "none";
}

var pendingEditItemId = null;


function editItemModalOk() {
  var name = document.getElementById("editItemForm_name").value;
  var description = document.getElementById("editItemForm_description").value;
  var image = document.getElementById("editItemForm_image").src;
  itemsList[pendingEditItemId].name = name;
  itemsList[pendingEditItemId].description = description;
  itemsList[pendingEditItemId].image = image;
  pendingEditItemId = null;
  renderList(itemsList);
  editItemModal.style.display = "none";
}

function editItemModalCancel() {
  pendingEditItemId = null;
  editItemModal.style.display = "none";
}

function stopAuction(i) {
  // itemsList.push({
  //   "name":activeList[i].name,
  //   "description" : activeList[i].description,
  //   "image" : activeList[i].image
  // });
  activeList[i].owner.items.push({
    "name" : activeList[i].name,
    "description" : activeList[i].description,
    "image" : activeList[i].image
    // "owner": activeList[i].owner
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

function downloadStateButtonClick() {
  var data = createDataFromState();
// Start file download.
  createFileForDownload("data.json",JSON.stringify(data));
}

function createDataFromState() {
  var data = {
    "users" : allusers,
    "items" : itemsList,
    "auctions" : activeList,
    "currentUser" : currentUser
  };
  return data;
}

function restoreStateFromData(data) {
  var _users = data.users;
  var _currentUser = null;
  if (data.currentUser != null) {
    _currentUser = getUserById(_users,data.currentUser.id);
  }
  var _items = [];
  if (data.currentUser != null) {
    _items = _currentUser.items;
  }
  var _activeList = data.auctions;
  for (var i = 0; i < _activeList.length; i++) {
    _activeList[i].owner = getUserById(_users,_activeList[i].owner.id);
  }
//  TODO Check for errors
  var maxUserID = -1;
  for (var i =0; i < _users.length; i+=1){
    if (_users[i].id > maxUserID) {
      maxUserID = _users[i].id;
    }
  }
  nextUserId = maxUserID + 1;
  allusers = _users;
  itemsList = _items;
  activeList = _activeList;
  currentUser = _currentUser;
  renderList(itemsList);
  renderStartAuction(activeList);
  renderFunds();
  renderUserName();
}

function readStateDataFile(evt) {
  //Retrieve the first (and only!) File from the FileList object
  var f = evt.target.files[0];
  if (f) {
    var r = new FileReader();
    r.onload = function(e) {
      var contents = e.target.result;
      var data = JSON.parse(contents);
      restoreStateFromData(data);
    };
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}
document.getElementById('restoreStateFromFile').addEventListener('change', readStateDataFile, false);



function createFileForDownload(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  
  element.style.display = 'none';
  document.body.appendChild(element);
  
  element.click();
  
  document.body.removeChild(element);
}

var filterText = document.getElementById("search-input").value;

function isSubstring(s, substr) {
  return (String(s).search(new RegExp(substr, "i"))) != -1;
}

function containsText(obj, text, ignoreFields) {
  for (var key in obj) {
    if(ignoreFields && ignoreFields.includes(key)){
      continue;
    }
    if (obj.hasOwnProperty(key)) {
      if (isSubstring(obj[key], text)) {
        console.log("Contains text", key, text, obj[key]);
        return true;
      }
    }
  }
  return false;
}

function highlightIfContainsText(obj, text, disable) {
  const s = String(obj);
  if (!disable && isSubstring(s, text)) {
    return '<span class="search-highlight">' + s + "</span>"
  } else {
    return s;
  }
}

function updateFilterText(text) {
  filterText = text;
  renderList(itemsList);
  renderStartAuction(activeList);
}

function toCurrencyString(x) {
  return Number.parseFloat(x).toFixed(2);
}

function toHHMMSS (x) {
  var sec_num = parseInt(x, 10);
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);
  
  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+':'+minutes+':'+seconds;
}

function showMyItemTable() {
  document.getElementById("startedLot").style.display = "none";
  document.getElementById("itemList").style.display = "block";
}

function showAuctionTable() {
  document.getElementById("startedLot").style.display = "block";
  document.getElementById("itemList").style.display = "none";
}

function showItemAuctionTable() {
  document.getElementById("startedLot").style.display = "block";
  document.getElementById("itemList").style.display = "block";
}