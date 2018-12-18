# Internet auction
##Introduction  
Realization of [Dutch auction](https://en.wikipedia.org/wiki/Dutch_auction)  
Basics: auction starts with the highest price and price decreases until buyer is found. 
### How to use

1.Open in project folder file - main.html  
2.Click "Stop" button.  
3.Then click "browse file" and choose JSON file with data from folder "data" in project folder.  
4.You can "Login" whith  such login-pass pairs  

| Login| Password |    |
| -----|:--------:|---:|
| john | john     |    |
| mary | mary     |    |
| mark | mark     |    |

###Functionality
######Buttons and fields

Before login

- Login - to login on site or create account.  
- Download data - save to JSON file current site state.  
- Browse/Choose file - load to site saved site states.
- Start / Stop - to start or stop time on site for debug purposes  
- Search field - to search something on site  

After login  

- Logout - leave your account
- Add funds - add some money to current account
- addItem - add item you want to sell on auction
- Download data - save to JSON file current site state.  
- Browse/Choose file - load to site saved site states.
- Start / Stop - to start or stop time on site for debug purposes  
- Search field - to search something on site  

######Tables on page  

First table - your items table view

|Item name   |Description   |Image   |Start auction   |Edit item   |Delete item   |  
|------------|--------------|--------|----------------|------------|--------------|

Start auction - button for each item in table to put this item to auction.  
Edit item - button to edit item name, description or image  
Detele item - button to delete item

Second table - auction items table view  

|Item name  |Time left  |Current price  |Minimal price  |Auction end time  |Stop auction  |Buy item  |
|-----------|-----------|---------------|---------------|------------------|--------------|----------|  

Time left - time that left for price reduction  
Current price - item price at current period of time  
Minimal price - lowest possible price (if nobody purchase it before)  
Auction end time - time when auction will be finished and item will be returned to owner if nobody purchase it  
Stop auction - button that allow owner to remove his item from auction if he decided not to sell item (available only
 for item owner)  
 Buy item - button allow to buy item you want if you have enough funds. If you don't have enough funds, button will 
 be disabled. 