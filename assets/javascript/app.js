//Trivia Game
//by Eliot Reyes
//July 2016


var knowledgeRepo = {
  q1: {
    prompt: "What is the name of Hagrid's hypogriff?",
    correct: "a1",
    ops: {
      a1: "Buckbeak",
      a2: "Fluffy",
      a3: "Norbert",
      a4: "Fang"
    },
    i: "assets/images/buckbeak.jpg"
  },

  q2: {
    prompt: "Who is Harry Potter's archenemy?",
    correct: "a4",
    ops: {
      a1: "McGonagall",
      a2: "Draco Malfoy",
      a3: "Snape",
      a4: "Voldemort"
    },
    i: "assets/images/buckbeak.jpg"
  }
};

var game = {};

//Variable "gs" is the jQuery selector for HTML output; USED EXTENSIVELY
var gs = $('#gameSection');

function initializeGame () {
  beginBtnHTML();
  printAllQ();
}

function beginBtnHTML(){
  var b = $('<button>');
  b.addClass("btn btn-primary btn-lg");
  b.attr('id', 'begin');
  b.html("Begin!");

  gs.html(b);
}


function startGame(){
  var gameTemplate = {
    cq: 0, //Current Question
    right: 0,
    wrong: 0,
    noAns: 0,
    over: false,
    qNum: "",
    time: 30,
    g : {}, //Empty object to hold GIF data
    cs3: ""  //jQuery css selector string for Q divs
  }

  game = Object.assign({}, gameTemplate);

  $('#begin').remove();

  showQ();
}

function printAllQ(){

  for (k in knowledgeRepo){

    var newDiv = $('<div>');
    newDiv.addClass('QContainer');
    newDiv.attr('id', k);

    var q = $('<h3>');
    q.html(knowledgeRepo[k].prompt);
    newDiv.append(q);

      //Nested loop
      for (ao in knowledgeRepo[k].ops){
        var o = $('<button>');
        o.addClass('optionButton text-center');
        o.attr('value', k);
        o.html(knowledgeRepo[k].ops[ao]);

        newDiv.append(o);
      }//End nested loop

      gs.append(newDiv);
      btnListener();
  }
}


function showQ(){
  if (game.cs3.length > 0){
    game.cs3.remove();
  }
  
  qTracker();
  checkQStatus();
  game.cs3 = $("#" + game.qNum);
  game.cs3.css('display', 'block');

  if (typeof nextQ !== "undefined"){
    window.clearTimeout(nextQ);
  }
  timer();
}

function qTracker () {
    game.cq++ //Increment the value of the current question tracker

    game.qNum = "q" + game.cq;
}

function checkAns(b){
  stopTimer();
  $('#timer').remove();

  var ans = knowledgeRepo[game.qNum].correct;

  var msg = "";

  if (b== knowledgeRepo[game.qNum].correct){
    game.right++;
    msg = "You answered correctly!";
  }

  else if (b == null){
    msg = "Time is up!";
    msg += "The correct answer is " + knowledgeRepo[game.qNum].ops[ans];
  }

  else {
    game.wrong++;
    msg = "Your answer is incorrect! ";
    msg += "The correct answer is " + knowledgeRepo[game.qNum].ops[ans];
  }

  result(msg);

  nextQ = setTimeout(showQ, 5000);

}

function btnListener(){  
  $('.optionButton').on('click', function(){
    optionClicked = $(this).attr('value');
    // stopTimer();
    checkAns(optionClicked);
  });
}


function result(m){

  var p = $('<p>');
  p.html(m);

  game.cs3.html(p);

  var im = $('<img>');
  im.addClass('resultImage');
  im.attr('src', knowledgeRepo[game.qNum].i);

  game.cs3.append(im);
}


function timer () {
  var t = $('<h2>');
  t.attr('id', 'timer');
  t.html(game.time);

  gs.prepend(t);
  counter = setInterval(count, 1000);
  
}

function count(){
  if (game.time < 1 ) {
    checkAns(null);
  }
  else {
    game.time--;
    $('#timer').text(game.time);
  }
}

function stopTimer() {
  clearInterval(counter);
  game.time = 30;

}

function retrieveGifs () {
  var queryURL = "http://api.giphy.com/v1/gifs/search?q=harry+potter&api_key=dc6zaTOxFJmzC&limit=10"

  $.ajax({url: queryURL, method: 'GET'})
   .done(function(response) {

    game.g = Object.assign({}, response);

   });
}

function checkQStatus (){
  if (game.cq > Object.keys(knowledgeRepo).length){
    game.over = true;
    throw new Error("No more questions");
  }
}

initializeGame();
retrieveGifs();

$(document).ready(function(){
  $('#begin').on('click', startGame);
});

