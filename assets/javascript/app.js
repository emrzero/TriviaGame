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
  }
};

var game = {};

//Variable "gs" is used the jQuery selector for writing HTML output
var gs = $('#gameSection');

function initializeGame () {
  beginBtnHTML();
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
    qNum: ""
  }

  game = Object.assign({}, gameTemplate);

  printQ();

  btnListener();
}

function printQ(){
  game.cq++ //Increment the value of the current question tracker

  game.qNum = "q" + game.cq;

  var q = $('<h3>');
  q.html(knowledgeRepo[game.qNum].prompt);

  gs.html(q);


  for (k in knowledgeRepo[game.qNum].ops){
    var o = $('<button>');
    o.addClass('optionButton text-center');
    o.attr('value', k);
    o.html(knowledgeRepo[game.qNum].ops[k]);

    gs.append(o);

  }
}

function checkAns(b){
  var ans = knowledgeRepo[game.qNum].correct;
  console.log(ans);

  var msg = "";
  
  if (b== knowledgeRepo[game.qNum].correct){
    game.right++;
    msg = "You answered correctly!";
  }

  else {
    game.wrong++;
    msg = "Your answer is incorrect! ";
    msg += "The correct answer is " + knowledgeRepo[game.qNum].ops[ans];
  }

  result(msg);

}

function btnListener(){  
  $('.optionButton').on('click', function(){
    optionClicked = $(this).attr('value');
    checkAns(optionClicked);
  });
}


function result(m){
  var p = $('<p>');
  p.html(m);

  gs.html(p);

  var im = $('<img>');
  im.addClass('resultImage');
  im.attr('src', knowledgeRepo[game.qNum].i);

  gs.append(im);
}


initializeGame();

$(document).ready(function(){
  $('#begin').on('click', startGame);
});

