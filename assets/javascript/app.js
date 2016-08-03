//Trivia Game
//by Eliot Reyes
//July 2016

var knowledgeRepo = {
  q0: {
    prompt: "What is the name of Hagrid's hypogriff?",
    correct: "a1",
    ops: {
      a1: "Buckbeak",
      a2: "Fluffy",
      a3: "Norbert",
      a4: "Fang"
    },
    i: "http://i.giphy.com/P2mw9kvE1ZGH6.gif"
  },

  q1: {
    prompt: "Who is Harry Potter's archenemy?",
    correct: "a4",
    ops: {
      a1: "McGonagall",
      a2: "Draco Malfoy",
      a3: "Snape",
      a4: "Voldemort"
    },
    i: "http://i.giphy.com/ffynNaSYx2yTC.gif"
  },

  q2: {
    prompt: "Norbert the dragon is a...",
    correct: "a1",
    ops: {
      a1: "Hungarian Horntail",
      a2: "Romanian Longhorn",
      a3: "Norwegian Ridgeback",
      a4: "Peruvian Vipertooth"
    },
    i: "http://i.giphy.com/3BA7qjsR8WLIc.gif"
  },

  q3: {
    prompt: "A Quidditch match ends when this is caught",
    correct: "a2",
    ops: {
      a1: "Bludger",
      a2: "Snitch",
      a3: "Quaffle",
      a4: "Owl"
    },
    i: "http://i.giphy.com/IlVul9hwHHy9O.gif"
  },

  q4: {
    prompt: "Harry belongs to which of the houses of Hogwarts?",
    correct: "a4",
    ops: {
      a1: "Slytherin",
      a2: "Hufflepuff",
      a3: "Ravenclaw",
      a4: "Gryffindor"
    },
    i: "http://i.giphy.com/b5Ogp12sTcalO.gif"
  },

  q5: {
    prompt: "The head of Gryffindor house is..",
    correct: "a3",
    ops: {
      a1: "Filius Flitwick",
      a2: "Severus Snape",
      a3: "Minerva McGonagall",
      a4: "Pomona Sprout"
    },
    i: "http://i.giphy.com/2f41Z7bhKGvbG.gif"
  },

  q6: {
    prompt: "Voldemort's henchmen are called ...",
    correct: "a2",
    ops: {
      a1: "Dark Knights",
      a2: "Death Eaters",
      a3: "Terrible Trolls",
      a4: "Evil Elves"
    },
    i: "http://i.giphy.com/cfCvkhXltHdny.gif"
  },

  q7: {
    prompt: "The last book the Harry Potter series is ...",
    correct: "a3",
    ops: {
      a1: "Harry Potter and the Philosopher's Stone",
      a2: "Harry Potter and the Half-Blood Prince",
      a3: "Harry Potter and the Deathly Hollows",
      a4: "Harry Potter and the Order of the Phoenix"
    },
    i: "http://i.giphy.com/7rSqa74vJW0Te.gif"
  },


}

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

function btnListenerGameInit(){
  $('#begin').on('click', startGame);
}


function startGame(){
  var gameTemplate = {
    cq: 0, //Current Question
    qOrder: [],
    stats: {
      right: 0,
      wrong: 0,
      "timed-out": 0,
    },
    
    over: false,
    qNum: "",
    time: 30,
    ding: new Audio("./assets/audio/ding.mp3"),
    buzzer: new Audio("./assets/audio/buzzer.mp3")
  }

  

  game = Object.assign({}, gameTemplate);
  randomizeQorder();

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


    game.qNum = "q" + game.qOrder[game.cq]; //Gets key for current question from randomized array
    game.cq++ //Increment the value of the current question tracker


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

function btnListener(){  
  $('.optionButton').on('click', function(){
    optionClicked = $(this).attr('value');
    stopTimer();
    checkAns(optionClicked);
  });
}


function printGameOver(){
  //Print stats
  gs.empty();

  gs.css('background-color', 'rgba(0,0,0, 0.5)');
  gs.css('padding', '10px 0');
  gs.css('border-radius', '5px');
  gs.css('width', '50%');

  var t = $('<h3>');
  t.html('Nitwit! Blubber! Oddment! Tweak!');
  gs.append(t);

  t=$('<h2>');
  t.html('GAME OVER');
  gs.append(t);

  for (s in game.stats){
    var c = $('<p>');
    c.addClass('stats');
    c.html(s + ' : ' + game.stats[s]);

    gs.append(c);

  }

  beginBtnHTML('Restart Game');
  btnListenerGameInit();

}

function checkAns(b){
  stopTimer();

  var ans = knowledgeRepo[game.qNum].correct;

  var msg = "";

  if (b== knowledgeRepo[game.qNum].correct){
    game.stats.right++;
    game.ding.play();
    msg = "CORRECT!";
  }

  else if (b == null){
    game.stats['timed-out']++;
    game.buzzer.play();
    msg = "Time is up!";
    msg += "The correct answer is " + knowledgeRepo[game.qNum].ops[ans];
  }

  else {
    game.stats.wrong++;
    game.buzzer.play();
    msg = "WRONG! ";
    msg += "The correct answer is " + knowledgeRepo[game.qNum].ops[ans];
  }

  result(msg);

  checkQStatus();

  nextQ = setTimeout(printQ, 4000);
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

function checkQStatus (){
  if (game.cq == Object.keys(knowledgeRepo).length){
    game.over = true;
  }
}

function randomizeQorder(){
  var qs = Object.keys(knowledgeRepo);
  var newOrder = []
  var randNum;
  
  while (newOrder.length < qs.length){
    randNum = Math.floor(Math.random() * qs.length);
    if (newOrder.indexOf(randNum) == -1){
      newOrder.push(randNum);
    }
  }
  game.qOrder = newOrder;
}

initializeGame();


