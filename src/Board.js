// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row;
      row = this.get(rowIndex);

      return this.conflictCheck(row);

    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var rowsArray = this.rows();

      //run hasRowConflictAt for each row
      for (var i=0; i<rowsArray.length; i++){
        if(this.hasRowConflictAt(i)){
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var rowsArray = this.rows();
      var colResults = [];

      //get the column values from the rows
      for (var i=0; i<rowsArray.length; i++){
        colResults.push(rowsArray[i][colIndex]);
      }

      return this.conflictCheck(colResults);
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {

      //run hasColConflictAt for each column;
      for (var i=0; i<this.attributes.n; i++){
        if(this.hasColConflictAt(i)){
          return true;
        }
      }
      return false; // fixme
    },

    //Custom method to check if there is a conflict (accepts an array)
    conflictCheck: function(arr){
      var result;

      result = _.reduce(arr, function(a, b){
        return a+b;
      });

      return result > 1;
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {

      var rows = this.rows();

      var col, row;
      var index = majorDiagonalColumnIndexAtFirstRow;
      var results = [];

      //if index <= 0 start col = 0, row = abs(index)

      if (index <= 0){
        col=0;
        row=Math.abs(index);

      //if index > 0 start col = index, row = 0
      } else {
        col = index;
        row = 0;
      }

      //  first value would be at rows[row][col]
      //  push value into array for conflict check
      //  look through while row < n and repeat
      for (var i = 0; i<this.attributes.n - Math.abs(index); i++){
        results.push(rows[row][col]);
        col++;
        row++;
      }

      //run helper function to see if there are any conflicts in the array
      return this.conflictCheck(results);
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {

      //Calculate the index to start at
      var start = (this.attributes.n-1)*-1;

      //run helper function to check if there are any conflicts at each diagonal
      for (var i = start; i<this.attributes.n; i++){
        if(this.hasMajorDiagonalConflictAt(i)){
          return true;
        }
      }

      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var rows = this.rows();
      var index = minorDiagonalColumnIndexAtFirstRow;
      var results = [];
      var rowPos;
      var colPos;

      var n = this.attributes.n;
      //set initial position of the first value based on index provided;
      if (index<n){
        rowPos = 0;
        colPos = index;
      }
      else {
        colPos = n-1;
        rowPos = index-colPos;
      }
      //calculate the max number of diagonals for n
      var diagonals = (n-1)*2+1;

      //calculate the indext of the middle diagonal
      var midDiagonal = (diagonals-1)/2;

      //calculate the number of iterations needed to get all coordinates in the diagonal
      var iterations = n-Math.abs(index-midDiagonal);

      //for each coordinate, push the value in results
      for (var i=0; i<iterations; i++){
        results.push(rows[rowPos][colPos]);
        rowPos++;
        colPos--;
      }

      return this.conflictCheck(results);
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      // debugger;
      //calculate the number of diagonals for an n square
      var diagonals = (this.attributes.n*2)-1;

      //run helper function to check if there are any conflicts at each diagonal
      for(var i=0;i<diagonals;i++){
        if(this.hasMinorDiagonalConflictAt(i)){
          return true;
        }
      }
      return false;
    }

    /*---------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
