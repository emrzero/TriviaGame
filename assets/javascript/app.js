//Trivia Game
//by Eliot Reyes
//July 2016
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
  gs.html("<h2>Hello World</h2>");
}


initializeGame();

$('#begin').on('click', startGame);

