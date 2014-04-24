/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolutionHelper = function(n){

  var startingArray = [];
  var board, row, tempBoard;
  var resultsArray = [[[1]]];

  for (var i=1;i<n;i++){
    startingArray = resultsArray;
    resultsArray = [];
    for (var bIndex=0; bIndex<startingArray.length; bIndex++){
      board = startingArray[bIndex].slice(0);
      for (var iIndex=0; iIndex<i+1; iIndex++){
        tempBoard = makeTopRow(iIndex, i+1);
        for (var rIndex=0; rIndex<board.length; rIndex++){
          row = spliceRow(board[rIndex], iIndex);
          tempBoard.push(row);
        }
        resultsArray.push(tempBoard);
      }
    }
  }
  return resultsArray;
};
window.findNRooksSolution = function(n) {

  var results = window.findNRooksSolutionHelper(n);
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(results[0]));
  return results[0];
};

window.spliceRow = function(arr, index){
  var tempArr = arr.slice(0);
  tempArr.splice(index,0,0);
  return tempArr;
};

window.makeTopRow = function(index, n){
  var results = [];
  var topRow = [];
  for (var i=0; i<n; i++){
    if(i===index){
      topRow.push(1);
    }
    else {
      topRow.push(0);
    }
  }
  results.push(topRow);
  return results;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var results = window.findNRooksSolutionHelper(n);
  var count = results.length;
  console.log('Number of solutions for ' + n + ' rooks:', count);
  return count;
};


window.findNQueensHelper = function(n){
  // debugger;


  var rooks = window.findNRooksSolutionHelper(n);
  var results = [];
  var board;
  var conflict;
  console.log(rooks);
  // debugger;
  for (var i = 0; i<rooks.length; i++){
    console.log(rooks[i], i);
    board = new Board(rooks[i]);
    conflict = board.hasAnyQueensConflicts();
    if(!conflict){
      results.push(rooks[i]);
    }
  }

  return results;


};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var results;
  if(n===2){
    results = [[[0,0], [0,0]]];
  }
  else if (n===3){
    results = [[[0,0,0],[0,0,0],[0,0,0]]];
  }
  else{
    results = window.findNQueensHelper(n);
  }
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(results[0]));
  return results[0];
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {

  var count;

  var results = window.findNQueensHelper(n);
  count = results.length;


  console.log('Number of solutions for ' + n + ' queens:', count);
  return count;
};
