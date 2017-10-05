/*
PARKING LOT
-Monitoring connections
  -Automatically remove player on disconnect
    -Reassign remaining player to P1
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

var currentNumberPlayers = 0;

var winner = null;
var p1Selection;
var p2Selection;
var p1Name;
var p2Name;
var readyToCompare = false;
 
function initializeDatabase () {
  //reset global variables (booleans, counters, etc.)

  //clear out all player information
  // database.ref("/players").set({})

  sessionStorage.clear()
}

function addNewPlayer () {
  if(sessionStorage.getItem("myPlayerNum") === null ){
   
   sessionStorage.setItem("myPlayerNum",(currentNumberPlayers+1));
  }else{
    console.log("Please wait for another player")
  }

  var newName = $("#name-input").val().trim();

    database.ref("players/"+(currentNumberPlayers+1)).update({
      name: newName,
      choice: ""
    })

}

function submitButtonPressed () {
  console.log("Enter function submitButtonPressed")
  
  if(currentNumberPlayers > 1){
    console.log("Cannot add new players"); 
  }else{
    addNewPlayer();
  }
}

function rpsButtonPressed () {
  console.log("rps button pressed");
  var newChoice = $(this).attr("data-value");
  console.log(newChoice + " pressed")
  var myIdentifier = sessionStorage.getItem("myPlayerNum");
 

  if(!readyToCompare){
    /*the timing of when this code runs is 
    causing an issue where the player's choice 
    displays after the function displaysResults has already 
    been displayed. this overrides the display on one of player's
    screens and makes it such that they do not know the results of
     the game
    */
    database.ref("players/" + myIdentifier).update({
      choice: newChoice
    })
    $("#instructions").text("You chose " + newChoice)
  }else{
    console.log("You already chose")
  }

  

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

function displayResults(){
  console.log("entering displayResults")

  
  if(p1Selection === "rock" && p2Selection === "scissors"){
    winner = 1
  }else if(p1Selection === "scissors" && p2Selection === "paper"){
    winner = 1
  }else if(p1Selection === "paper" && p2Selection == "rock"){
    winner = 1
  }else if(p2Selection === "rock" && p1Selection === "scissors"){
    winner = 2;
  }else if(p2Selection === "scissors" && p1Selection === "paper"){
    winner = 2;
  }else if(p2Selection === "paper" && p1Selection == "rock"){
    winner = 2;
  }else{
    winner = 0;
  }

  database.ref("comparison").set({
    winner: winner
  })

    $("#instructions").empty();
    var newP = $("<p>");
    console.log(winner)
    newP.text("Player " + winner + " wins!")
    $("#instructions").append(newP)
  
}

//this is the main function that calls the other functions of the program
//any time a value changes, the function checks if the conditions are met to run the function to advance the game
database.ref("players").on("value",function(snapshot){
 
  console.log("Taking a snapshot of /players/")
  console.log(snapshot.val())
  currentNumberPlayers = snapshot.numChildren();
  console.log("Current # of players: " + snapshot.numChildren());
  // var mySessStorage = sessionStorage.getItem("myPlayerNum");
  console.log("numChildren: "+snapshot.numChildren())
  p1Name = snapshot.val()[1].name;
  p2Name = snapshot.val()[2].name;


  // //checks if you should update player 1 or 2
  // if(snapshot.val()[1].name === null){
  //   //set boolean flag to update player 1 slot on add
  // }else if(snapshot.val()[2].name === null){
  //   //set boolean flag to update player 2 slot on add
  // }else{
  // }

  //check if ready to compare RPS choice
  if(snapshot.val()[1].choice !== "" && snapshot.val()[2].choice !== ""){
    p1Selection = snapshot.val()[1].choice;
    p2Selection = snapshot.val()[2].choice;
    readyToCompare = true;
    displayResults(); //doesn't display on both screens??
  }
  
  //checks if you should display RPS buttons
  if(snapshot.numChildren() === 2
      && snapshot.val()[1].choice === ""
      && snapshot.val()[2].choice === ""){
    displayButtons() //displays on both screens
  }  




  // database.ref("comparison").on("value",function(snapshot){
  //   if(winner === 1){
  //   $("#instructions").text("Player 1 wins!");
  //   // database.ref("players/" + 1).upate({

  //   // })
  //   }else if(winner === 2){
  //     $("#instructions").text("Player 2 wins!");
  //   }else if(winner === 0){
  //     $("#instructions").text("Tie game")
  //   }
  // })

  //removes player on disconnect
  database.ref("players").child(sessionStorage.getItem("myPlayerNum")).onDisconnect().remove();

})

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