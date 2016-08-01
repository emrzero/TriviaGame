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
  beginBtnHTML('Begin!');
  btnListenerGameInit();
}

function beginBtnHTML(h){
  var b = $('<button>');
  b.addClass("btn btn-primary btn-lg");
  b.attr('id', 'begin');
  b.html(h);

  gs.append(b);
}


function startGame(){
  var gameTemplate = {
    cq: 0, //Current Question
    stats: {
      right: 0,
      wrong: 0,
      "timed-out": 0,
    },
    
    over: false,
    qNum: "",
    time: 30,
    g : {} //Empty object to hold GIF data
  }

  game = Object.assign({}, gameTemplate);

  printQ();

}

function printQ(){
  gs.empty();

  if (typeof nextQ !== 'undefined'){
    clearTimeout(nextQ);
  }

  if (game.over == true){
    printGameOver();
  }

  else{

    timer();

    game.cq++ //Increment the value of the current question tracker

    game.qNum = "q" + game.cq;

    var q = $('<h3>');
    q.html(knowledgeRepo[game.qNum].prompt);

    gs.append(q);


    for (k in knowledgeRepo[game.qNum].ops){
      var o = $('<button>');
      o.addClass('optionButton text-center');
      o.attr('value', k);
      o.html(knowledgeRepo[game.qNum].ops[k]);

      gs.append(o);

    }

    btnListener();
  }
}

function checkAns(b){
  stopTimer();

  var ans = knowledgeRepo[game.qNum].correct;

  var msg = "";

  if (b== knowledgeRepo[game.qNum].correct){
    game.stats.right++;
    msg = "You answered correctly!";
  }

  else if (b == null){
    msg = "Time is up!";
    msg += "The correct answer is " + knowledgeRepo[game.qNum].ops[ans];
  }

  else {
    game.stats.wrong++;
    msg = "Your answer is incorrect! ";
    msg += "The correct answer is " + knowledgeRepo[game.qNum].ops[ans];
  }

  result(msg);

  checkQStatus();


  nextQ = setTimeout(printQ, 5000);



}

function btnListener(){  
  $('.optionButton').on('click', function(){
    optionClicked = $(this).attr('value');
    stopTimer();
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


function timer () {
  var t = $('<h2>');
  t.attr('id', 'timer');
  t.html(game.time);

  gs.prepend(t);
  counter = setInterval(count, 1000);
  
}

function count(){
  if (game.time < 1 ) {
    game.stats['timed-out']++;
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
  if (game.cq == Object.keys(knowledgeRepo).length){
    game.over = true;
  }
}

function printGameOver(){
  //Print stats
  gs.empty();

  var t = $('<h2>');
  t.html('Nitwit! Blubber! Oddment! Tweak! <br> GAME OVER');

  gs.append(t);

  for (s in game.stats){
    var c = $('<p>');
    c.html(s + ' : ' + game.stats[s]);

    gs.append(c);

  }

  beginBtnHTML('Restart Game?');
  btnListenerGameInit();

}

function btnListenerGameInit(){
  $('#begin').on('click', startGame);
}


initializeGame();
retrieveGifs();
