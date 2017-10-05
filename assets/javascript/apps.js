/*
PARKING LOT
-When Player 2 loads the web page, do NOT clear the database
-Add timeout to limit 
*/

/*
Next Steps
1.Comparison of player choices
2.Results Function 
  a. record wins/losses
  b. reset to pick choice screen
3.Establish proper DOM manipulation functions
4..Handle player closing the browser and waiting for new opponent
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

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

connectedRef.on("value",function(snap) {
  if(snap.val()) {
    var con = database.ref("players").push(true);
    sessionStorage.setItem("myKey",con.key)
    con.onDisconnect().remove();
  }
})

var currentNumberPlayers = 0;
 
function initializeDatabase () {
  //reset global variables (booleans, counters, etc.)

  //clear out all player information
  database.ref("/players").set({})
  sessionStorage.clear()
}

function addNewPlayer () {
}

function submitButtonPressed () {
  console.log("Enter function submitButtonPressed")
  if(currentNumberPlayers >1){
    console.log("Cannot add new players"); 
  }else{
    var myIdentifier = sessionStorage.getItem("myKey");
    var newName = $("#name-input").val().trim();
    database.ref("players/"+myIdentifier).update({
      name: newName,
      choice: "",
      wins: 0,
      losses: 0
    })
  }
}

function rpsButtonPressed () {
  console.log("rps button pressed");
  var newChoice = $(this).attr("data-value");
  console.log(newChoice + " pressed")
  var myIdentifier = sessionStorage.getItem("myKey");

  database.ref("players/" + myIdentifier).update({
    choice: newChoice
  })

  database.ref("comparisons").update({
    myIdentifier: myIdentifier+newChoice
  })
  $("#instructions").text("You chose " + newChoice)
}

function compareChoices (snapshot){
  console.log("entering compareChoices")
  console.log(snapshot.val())
  // var p1choice = snapshot.val()[1].choice;
  // var p2choice = snapshot.val()[2].choice;
  // console.log("p1 chose: " + p1choice)  
  // console.log("p2choice: " + p2choice)
  //compare choices
  }

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

database.ref("players").on("value",function(snapshot){
  console.log("Taking a snapshot of /players/")
  console.log(snapshot.val())
  console.log("Testing w/ snapshot...");
  // console.log(snapshot.val().keys())
  currentNumberPlayers = snapshot.numChildren();
  // console.log("Current # of players: " + snapshot.numChildren());
  // // var mySessStorage = sessionStorage.getItem("myPlayerNum");
  // console.log("numChildren: "+snapshot.numChildren())
  
  //checks if you should display RPS buttons
  // if(snapshot.numChildren() === 2
  //     && snapshot.val()[1].choice === ""
  //     && snapshot.val()[2].choice === ""){
  //   displayButtons()
  // }  
 
  //check if ready to compare RPS choice
  c
  if(snapshot.val()[1].choice !== "" && snapshot.val()[2].choice !== ""){
    console.log("time to compare");
    compareChoices(snapshot);  

    
  }
})

initializeDatabase();
$(document).on("click","#submit-btn",submitButtonPressed);
$(document).on("click",".rps-btn",rpsButtonPressed)
displayButtons()
  
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