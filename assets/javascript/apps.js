/*
PARKING LOT
-Monitoring connections
  -Automatically remove player on disconnect
    -Reassign remaining player to P1
-When Player 2 loads the web page, do NOT clear the database
-When Displaying buttons
  -Find a way to not have to use .empty()
  -Currently running display function twice
*/

/*
Next Steps
1.Comparison of player choices
2.Results Function 
  a. record wins/losses
  b. reset to pick choice screen
3.Handle player closing the browser and waiting for new opponent
*/

/*
DONE
-Dynamic screen display
*/

$(document).ready(function(){
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAweC1yLVveGGhAe3kQOnX5ZxfLv5DPeGQ",
  authDomain: "nucb-first-firebase-db.firebaseapp.com",
  databaseURL: "https://nucb-first-firebase-db.firebaseio.com",
  projectId: "nucb-first-firebase-db",
  storageBucket: "nucb-first-firebase-db.appspot.com",
  messagingSenderId: "1007986593665"
};
firebase.initializeApp(config); 

//main database that will hold player information
var database = firebase.database();

var currentNumberPlayers = 0;
var compareChoices = false;
 
function initializeDatabase () {
  //reset global variables (booleans, counters, etc.)
  database.ref("global").set({
    numPlayers: 0
  })
  //clear out all player information
  database.ref("/players").set({})
  sessionStorage.clear()
}

function addNewPlayer () {
  // currentNumberPlayers++;
  if(sessionStorage.getItem("myPlayerNum") === null ){
   
   sessionStorage.setItem("myPlayerNum",currentNumberPlayers)
  
    var newName = $("#name-input").val().trim();

    database.ref("players/"+(currentNumberPlayers+1)).update({
      name: newName,
      choice: ""
    })

  }else{
    console.log("Please wait for another player")
  }
  
}

function submitButtonPressed () {
  console.log("Enter function submitButtonPressed")
  
  if(currentNumberPlayers < 2){
    addNewPlayer();
  }else{
    console.log("Cannot add new players"); 
  }
}

function rpsButtonPressed () {
  console.log("rps button pressed");
  var newChoice = $(this).attr("data-value");
  console.log(newChoice + " pressed")
  var myIdentifier = sessionStorage.getItem("myPlayerNum");

  database.ref("players/" + myIdentifier).update({
    choice: newChoice
  })

  $("#instructions").text("You chose " + newChoice)

}

database.ref("players").on("value",function(snapshot){
  console.log("Taking a snapshot of /players/")
  console.log(snapshot.val())
  currentNumberPlayers = snapshot.numChildren();
  console.log("Current # of players: " + snapshot.numChildren());

  var mySessStorage = sessionStorage.getItem("myPlayerNum");
  console.log("numChildren: "+snapshot.numChildren())

  if(snapshot.numChildren() === 2){
    displayButtons()
  }

})

function displayButtons () {
  console.log("displaying buttons");
  var rockBtn = $("<button>");
  rockBtn.attr("id","rock-button");
  rockBtn.addClass("btn btn-secondary rps-btn");
  rockBtn.attr("data-value","rock");
  rockBtn.text("Rock");

  var paperBtn = $("<button>");
  paperBtn.attr("id","paper-button");
  paperBtn.addClass("btn btn-secondary rps-btn");
  paperBtn.attr("data-value","paper");
  paperBtn.text("Paper");

  var scissorsBtn = $("<button>");
  scissorsBtn.attr("id","scissors-button");
  scissorsBtn.addClass("btn btn-secondary rps-btn");
  scissorsBtn.attr("data-value","scissors");
  scissorsBtn.text("Scissors");

  $("#choices-box").empty();
  $("#choices-box").append(rockBtn);
  $("#choices-box").append(paperBtn);
  $("#choices-box").append(scissorsBtn);

  $("#instructions").empty();
  $("#instructions").text("Choose R P S")

}

initializeDatabase();
$(document).on("click","#submit-btn",submitButtonPressed);

$(document).on("click",".rps-btn",rpsButtonPressed)
  
// database.ref("players/1").update({
//   name: "imran p1",
//   choice: ""
// })

// database.ref("players/1").update({
//   choice: "rock"
// })

// database.ref("players/1").update({
//   wins: 3
// })

// // database.ref("players/1").remove()

// database.ref("players/2").update({
//   name: "p 2",
//   choice: "p2 s choice"
// })

// database.ref("players/two").update({
//   name: "p two",
//   choice: "p two s  choice"
// })

// database.ref("global").update({
//   testVar: "test global var 1"
// })

// database.ref("players").on("value",function(snapshot){
//   console.log(snapshot.val())
//   console.log("test: " + snapshot.val()["two"].choice)
// })

// console.log("num players: "+database.ref("players").numChildren())

// database

}); //end document.ready