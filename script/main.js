const DEFAULT_AUCTION_START_PRICE = 500;
const DEFAULT_AUCTION_FINAL_PRICE = 50;
const DEFAULT_AUCTION_PRICE_REDUCTION_TIME = 15;
const DEFAULT_AUCTION_TOTAL_TIME = 20;
const DEFAULT_ADD_USER_BALANCE = 1000;

var loginModal = document.getElementById('login_modal');
var registerModal = document.getElementById("registration_modal");
var addItemModal = document.getElementById("addItem_modal");
var startAuctionModal = document.getElementById("startAuction_modal");
var editItemModal = document.getElementById("editItem_modal");
var spanModalCloseLogin = document.getElementsByClassName("close")[0];
var spanModalCloseRegistration = document.getElementsByClassName("close")[1];
var spanModalCloseWelcome = document.getElementsByClassName("close")[2];
var spanModalCloseAddItem = document.getElementsByClassName("close")[3];

// currently logged in user
var currentUser = null;

// all users in system
var allUsers = [];

// items for current user, it is a reference to currentUser.items
var currentUserItems = [];

// all auctions in the system
var allAuctions = [];

// index of item on which auction modal is opened
var pendingAuctionItemId;

// id of next user. when user is created it increases
var nextUserId = 0;

// should auction update their state. setting it to false will freeze all auctions
var isTimeRunning = true;

// contains picture which is added to item during item creation
var pendingImageDataUrl = null;

// index of item in currentUserItems on which editItemModal is opened
var pendingEditItemId = null;

// contains text used during filtering
var filterText = document.getElementById("search-input").value;

// contains information about sorting for item and auctions tables
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

// // When the user clicks on <span> (x), close the modal
spanModalCloseLogin.onclick = function() {
  loginModal.style.display = "none";
};
spanModalCloseRegistration.onclick = function() {
  registerModal.style.display = "none";
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
      event.target == addItemModal ||
      event.target == startAuctionModal ||
      event.target == document.getElementById("editItem_modal")) {
    loginModal.style.display = "none";
    registerModal.style.display = "none";
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
  document.getElementById("mainFooter").innerHTML = "";
}


function loadRegisterModal() {
  loginModal.style.display = "none";
  registerModal.style.display = "block";
}


function loadAddItemModal() {
  loginModal.style.display = "none";
  registerModal.style.display = "none";
  addItemModal.style.display = "block";
}


function cancelAddItemModal() {
  addItemModal.style.display = "none";
}


function cancelUserRegistrationModal() {
  registerModal.style.display = "none";
  loginModal.style.display = "block";
}


function cancelStartAuctionModal() {
  startAuctionModal.style.display = "none";
  pendingAuctionItemId = null;
}


function loadEditItemModal(i) {
  editItemModal.style.display = "block";
  pendingEditItemId = i;
  document.getElementById("editItemForm_name").value = currentUserItems[i].name;
  document.getElementById("editItemForm_description").value = currentUserItems[i].description;
  document.getElementById("editItemForm_image").src = currentUserItems[i].image;
}


function loadStartAuctionModal(i) {
  startAuctionModal.style.display = "block";
  document.getElementById("startAuctionDetailes_name").value = currentUserItems[i].name;
  document.getElementById("startAuctionDetailes_description").value = currentUserItems[i].description;
  document.getElementById("startAuctionDetailes_item_image").src = currentUserItems[i].image;
  document.getElementById("startAuctionDetailes_start_price").value = DEFAULT_AUCTION_START_PRICE;
  document.getElementById("startAuctionDetailes_final_price").value = DEFAULT_AUCTION_FINAL_PRICE;
  document.getElementById("startAuctionDetailes_price_reduction_time").value = DEFAULT_AUCTION_PRICE_REDUCTION_TIME;
  document.getElementById("startAuctionDetailes_auction_time").value = DEFAULT_AUCTION_TOTAL_TIME;
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
  if (userLoginExist(allUsers, userName, userPassword)) {
    currentUser = getUserByName(allUsers,userName);
    currentUserItems = currentUser.items;
    document.getElementById("logoutButton").style.display = "block";
    document.getElementById("addItemButton").style.display = "block";
    document.getElementById("welcome_section").style.display = "";
    document.getElementById("welcome_section_name").style.display = "";
    document.getElementById("welcome_section_balance").style.display = "";
    document.getElementById("buttonShowVariants").style.display = "block";
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("itemList").style.display = "block";
    document.getElementById("addUserBalance").style.display = "block";
    loginModal.style.display = "none";
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("startedLot").style.display = "block";
    document.getElementById("galary_section").style.display = "none";
    document.getElementById("signUpButton").style.display = "none";
    
    renderItemsTable(currentUserItems);
    renderAuctions(allAuctions);
    renderUserName();
    renderUserBalance();
  }
  else {
    //TODO Check, what type of error? Wrong password or username don't exist
    document.getElementById("mainFooter").innerHTML = "<div class=\"alert alert-primary\">Login error." +
          " Please <span class=\"alert-link\" onclick=\"handleUserRegistration()\">Sign up</span></div>";
  }
}


function handleLogout() {
  currentUser.items = currentUserItems;
  currentUserItems = [];
  currentUser = null;
  document.getElementById("logoutButton").style.display = "none";
  document.getElementById("addItemButton").style.display = "none";
  document.getElementById("loginButton").style.display = "block";
  document.getElementById("welcome_section").style.display = "none";
  document.getElementById("welcome_section_name").style.display = "none";
  document.getElementById("welcome_section_balance").style.display = "none";
  document.getElementById("buttonShowVariants").style.display = "none";
  document.getElementById("itemList").style.display = "none";
  document.getElementById("addUserBalance").style.display = "none";
  document.getElementById("startedLot").style.display = "none";
  document.getElementById("galary_section").style.display = "block";
  document.getElementById("signUpButton").style.display = "block";
  renderItemsTable(currentUserItems);
  renderAuctions(allAuctions);
}


function addUserBalance() {
  if (currentUser != null) {
    currentUser.balance += DEFAULT_ADD_USER_BALANCE;
    renderUserBalance();
    renderUserName();
  }
}


function renderUserBalance() {
  if (currentUser != null) {
    document.getElementById("welcome_section_balance").innerHTML = "$" + toCurrencyString(currentUser.balance);
  }
}


function renderUserName() {
  if (currentUser != null) {
    document.getElementById("welcome_section_name").innerHTML = currentUser.name;
  }
}


function handleUserRegistration() {
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
  if (!userExists(allUsers,name)) {
    var currentUser = User.register(name, password);
    allUsers.push(currentUser);
    loadLoginModal();
    document.getElementById("mainFooter").innerHTML = "<div class='alert alert-success'>Welcome to site! Now you can" +
      " have fun! Enter your login and password!</div>";
  }
  else {
    alert("This Name already exist. You can choose another Name or restore password if you forget!");
      }
}


function createItem() {
  var itemName = document.getElementById("addItemDetails_item_name").value;
  var itemDescription = document.getElementById("addItemDetails_description").value;
  var itemImage = pendingImageDataUrl;
  pendingImageDataUrl = null;
  currentUserItems.push({
    "name":itemName,
    "description":itemDescription,
    "image":itemImage
  });
  renderItemsTable(currentUserItems);
}


function addItemModal_loadImageFile() {
  var preview = document.getElementById('addItemDetails_previewImage');
  var file    = document.getElementById('addItemDetails_imageFile').files[0];
  var reader  = new FileReader();
  
  reader.addEventListener("load", function () {
    preview.src = reader.result;
    pendingImageDataUrl = reader.result;
  }, false);
  
  if (file) {
    reader.readAsDataURL(file);
  }
}


function editItemModal_loadImageFile() {
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


function getTableHeaderSortIndicator(tableName, fieldName) {
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

function updateTableSortOrder(tableName, fieldName) {
  if (sortInfo[tableName].sortedBy == fieldName) {
    if (sortInfo[tableName].sortDirection == "ascending") {
      sortInfo[tableName].sortDirection = "descending";
    } else {
      sortInfo[tableName].sortDirection = "ascending";
    }
  }
  sortInfo[tableName].sortedBy = fieldName;
  if(tableName == "auctions"){
    renderAuctions(allAuctions);
  } else if (tableName == "items"){
    renderItemsTable(currentUserItems);
  } else {
    console.log("Error. Incorrect table name when sorting", tableName, fieldName);
  }
}


function renderItemsTable(items) {
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
  h += "<th class=\"text-center\" onclick='updateTableSortOrder(\"items\",\"name\")'>Item name" + getTableHeaderSortIndicator("items","name") + "</th>";
  h += "<th class=\"text-center\" onclick='updateTableSortOrder(\"items\",\"description\")'>Description" + getTableHeaderSortIndicator("items","description") + "</th>";
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
    h+= "<td class=\"text-center align-middle\"><button type='button' class='btn btn-primary' data-toggle='modal'" +
      " data-target='startAuction_modal'" +
      " onclick=\"loadStartAuctionModal("+i+")\">Start" +
        " auction</button>";
    h+= "<td class=\"text-center align-middle\"><button class='btn btn-info' onclick='loadEditItemModal(" + i + ")'>Edit" +
      " item</button>";
    h+= "<td class=\"text-center align-middle\"><button class='btn btn-danger' onclick=\"deleteItemFromUserItems("+i+")\">Delete" +
      " item</button>";
  }
  document.getElementById("itemList").innerHTML = h;
}

function renderAuctions(items) {
  if(currentUser != null){
    console.log("Render auction as table");
    renderAuctionsAsTable(items);
  } else {
    console.log("Render auction as galary");
    renderAuctionsAsGallery(items);
  }
}

function renderAuctionsAsGallery(auctions) {
  if(filterText != ""){
    auctions = auctions.filter(function(obj) {
      return containsText(obj, filterText, ["image", "owner"]);
    });
  }
  auctions = auctions.filter(function (x) {
    return x.image != null && x.image.length > 50;
  });
  var numberRows = 2;
  var numberColumns = 3;
  var classNameInnerDiv = "galaryDiv";
  var classNameOuterDiv = "galaryDiv_Outer";
  var numberRowsExisting = Math.floor(auctions.length/numberColumns);
  if (auctions.length%numberColumns != 0){
    numberRowsExisting += 1;
  }
  var h = "";
  const disableHighLight = filterText == "";
  for (var i = 0; i < Math.min(numberRows,numberRowsExisting); i+=1) {
    h += "<div class=\"" + classNameOuterDiv + "\">";
     for (var j = i * numberColumns; j < Math.min((i+1)*numberColumns,auctions.length); j+=1){
       h += "<div onclick=\"loadLoginModal()\" class=\""+classNameInnerDiv+"\">\n" +
       "          <img src="+ auctions[j].image + " alt=\""+auctions[j].name+"\">\n" +
       "          <p>" + highlightIfContainsText(auctions[j].name, filterText, disableHighLight) + "</p>\n" +
         "<p>$ " + auctions[j].current_price + "</p>" +
       "        </div>\n"
     }
    h += "</div>";
  }
  document.getElementById("galary_section").innerHTML = h;
}

function renderAuctionsAsTable(auctions) {
  console.log("Item.length", auctions.length);
  if(filterText != ""){
    auctions = auctions.filter(function(obj) {
      return containsText(obj, filterText, ["image", "description", "owner"]);
    });
    console.log("Item.length", auctions.length);
  }
  if(sortInfo["auctions"].sortedBy != null){
    auctions = auctions.slice();
    auctions.sort(getSortFunction(sortInfo["auctions"].sortedBy, sortInfo["auctions"].sortDirection));
    console.log("sort", auctions);
  }
  var h = "<table class=\"w-100 table\">" ;
  h += "<thead class=\"thead-dark\"><tr>";
  h += "<th class=\"text-center\" onclick='updateTableSortOrder(\"auctions\",\"name\")'>Item name" + getTableHeaderSortIndicator("auctions","name") + "</th>";
  h += "<th class=\"text-center\" onclick='updateTableSortOrder(\"auctions\",\"description\")'>Description" + getTableHeaderSortIndicator("auctions","name") + "</th>";
  h += "<th class=\"text-center\" onclick='updateTableSortOrder(\"auctions\",\"image\")'>Image" + getTableHeaderSortIndicator("auctions","name") + "</th>";
  h += "<th class=\"text-center\" onclick='updateTableSortOrder(\"auctions\",\"left_time\")'>Time left" + getTableHeaderSortIndicator("auctions","left_time") + "</th>";
  h += "<th class=\"text-center\" onclick='updateTableSortOrder(\"auctions\",\"current_price\")'>Current price" + getTableHeaderSortIndicator("auctions","current_price") + "</th>";
  h += "<th class=\"text-center\" onclick='updateTableSortOrder(\"auctions\",\"minimal_price\")'>Minimal price" + getTableHeaderSortIndicator("auctions","minimal_price") + "</th>";
  h += "<th class=\"text-center\" onclick='updateTableSortOrder(\"auctions\",\"duration\")'>Auction end time" + getTableHeaderSortIndicator("auctions","duration") + "</th>";
  if(currentUser != null){
    h += "<th class=\"text-center\">Stop auction</th>";
    h += "<th class=\"text-center\">Buy item</th>";
  }
  h += "<tbody>";
  const disableHighLight = filterText == "";
  for (var i = 0; i < auctions.length; i++) {
    h+= "<tr>";
    h+= "<td class=\"text-center align-middle\">" + highlightIfContainsText(auctions[i].name, filterText, disableHighLight) + "</td>";
    h+= "<td class=\"text-center align-middle\">" + highlightIfContainsText(auctions[i].description, filterText, disableHighLight) + "</td>";
  
    if(auctions[i].image == null || auctions[i].image.length < 50 ){
      h+= "<td class=\"text-center align-middle\">" + auctions[i].image + "</td>";
    } else {
      h+= "<td class=\"text-center align-middle\"><img src=\"" + auctions[i].image + "\" style=\"width:100px;height:100px;\"></td>";
    }
    h+= "<td class=\"text-center align-middle\">" + highlightIfContainsText(toHHMMSS(auctions[i].left_time), filterText, disableHighLight) + "</td>";
    h+= "<td class=\"text-center align-middle\">" + highlightIfContainsText(toCurrencyString(auctions[i].current_price), filterText, disableHighLight) + "</td>";
    h+= "<td class=\"text-center align-middle\">" + highlightIfContainsText(toCurrencyString(auctions[i].minimal_price), filterText, disableHighLight) + "</td>";
    h+= "<td class=\"text-center align-middle\">" + highlightIfContainsText(toHHMMSS(auctions[i].duration), filterText, disableHighLight) + "</td>";
    if(currentUser != null) {
      if (currentUser != null && currentUser.id == auctions[i].owner.id){
        console.log("CurrentUser",currentUser);
        console.log("Items [i] owner", auctions[i].owner);
      h += "<td class=\"text-center align-middle\"><button class=\"usrControl btn btn-danger\" onclick=\"stopAuction("+i+")\">Stop" +
          " auction</button></td>"; }
      else {
        h += "<td></td>";
      }
      if (currentUser != null && !(currentUser.id == auctions[i].owner.id)){
        var disableButton = "";
        if (currentUser.balance < auctions[i].current_price){
          disableButton = "disabled";
        }
      h += "<td class=\"text-center align-middle\"><button class=\"usrControl btn btn-success\" onclick=\"handleBuyItem("+i+")\"" + disableButton +">Buy item</button></td>";}
      else {
        h += "<td class=\"text-center align-middle\"></td>";
      }
    }
  }
  document.getElementById("startedLot").innerHTML = h;
}

function handleBuyItem(i) {
  if (currentUser != null && currentUser.balance > allAuctions[i].current_price) {
    allAuctions[i].owner.balance += allAuctions[i].current_price;
    currentUser.balance -= allAuctions[i].current_price;
    currentUser.items.push({
      "name" : allAuctions[i].name,
      "description" : allAuctions[i].description,
      "image" : allAuctions[i].image
    });
    deleteAuction(i);
    renderItemsTable(currentUserItems);
    renderUserBalance();
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
  if (!isTimeRunning){
    return;
  }
  var areItemsChanged = false;
  for (var i =0; i < allAuctions.length; i++){

    if (allAuctions[i].left_time > 0) {
      allAuctions[i].left_time -= 1;
      if (allAuctions[i].current_price > allAuctions[i].minimal_price) {
        var diff = (allAuctions[i].max_price - allAuctions[i].minimal_price)/(allAuctions[i].price_reduction);
        allAuctions[i].current_price -= diff;
      }
    }
    if (allAuctions[i].duration > 1) {
      allAuctions[i].duration -= 1;
    }
    else {
      allAuctions[i].owner.items.push({
        "name" : allAuctions[i].name,
        "description" : allAuctions[i].description,
        "image" : allAuctions[i].image,
      });
      deleteAuction(i);
      areItemsChanged = true;
    }
  }
  if (areItemsChanged) {
    renderItemsTable(currentUserItems);
  }
  renderAuctions(allAuctions);
}

function startAuctionModal_startAuction() {
  var name = document.getElementById("startAuctionDetailes_name").value;
  var description = document.getElementById("startAuctionDetailes_description").value;
  var image = document.getElementById("startAuctionDetailes_item_image").src;
  var start_price = document.getElementById("startAuctionDetailes_start_price").value;
  var finish_price = document.getElementById("startAuctionDetailes_final_price").value;
  var price_reduction_time = document.getElementById("startAuctionDetailes_price_reduction_time").value;
  var auction_time = document.getElementById("startAuctionDetailes_auction_time").value;
  allAuctions.push({
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
  deleteItemFromUserItems(pendingAuctionItemId);
  renderAuctions(allAuctions);
  startAuctionModal.style.display = "none";
}

function editItemModalOk() {
  var name = document.getElementById("editItemForm_name").value;
  var description = document.getElementById("editItemForm_description").value;
  var image = document.getElementById("editItemForm_image").src;
  currentUserItems[pendingEditItemId].name = name;
  currentUserItems[pendingEditItemId].description = description;
  currentUserItems[pendingEditItemId].image = image;
  pendingEditItemId = null;
  renderItemsTable(currentUserItems);
  editItemModal.style.display = "none";
}

function editItemModalCancel() {
  pendingEditItemId = null;
  editItemModal.style.display = "none";
}

function stopAuction(i) {
  allAuctions[i].owner.items.push({
    "name" : allAuctions[i].name,
    "description" : allAuctions[i].description,
    "image" : allAuctions[i].image
  });
  deleteAuction(i);
  renderAuctions(allAuctions);
  renderItemsTable(currentUserItems);
}

function deleteItemFromUserItems(i) {
  currentUserItems.splice(i,1);
  renderItemsTable(currentUserItems);
}

function deleteAuction(i) {
  allAuctions.splice(i,1);
  renderAuctions(allAuctions);
}

function downloadStateButtonClick() {
  var data = createDataFromState();
  createFileForDownload("data.json",JSON.stringify(data));
}

function createDataFromState() {
  var data = {
    "users" : allUsers,
    "items" : currentUserItems,
    "auctions" : allAuctions,
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
  allUsers = _users;
  currentUserItems = _items;
  allAuctions = _activeList;
  currentUser = _currentUser;
  renderItemsTable(currentUserItems);
  renderAuctions(allAuctions);
  renderUserBalance();
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

function createFileForDownload(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  
  element.style.display = 'none';
  document.body.appendChild(element);
  
  element.click();
  
  document.body.removeChild(element);
}


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
  renderItemsTable(currentUserItems);
  renderAuctions(allAuctions);
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

function showItemAndAuctionTable() {
  document.getElementById("startedLot").style.display = "block";
  document.getElementById("itemList").style.display = "block";
}


function initialSetup() {
  document.getElementById("logoutButton").style.display = "none";
  document.getElementById("addUserBalance").style.display = "none";
  document.getElementById("welcome_section").style.display = "none";
  document.getElementById("welcome_section_name").style.display = "none";
  document.getElementById("welcome_section_balance").style.display = "none";
  document.getElementById("addItemButton").style.display = "none";
  document.getElementById("buttonShowVariants").style.display = "none";
  
  setInterval(function () {
    stepTime();
    // renderAuctions(allAuctions);
  }, 1000);
  
  document.getElementById('restoreStateFromFile').addEventListener('change', readStateDataFile, false);
}

initialSetup();