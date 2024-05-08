import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard(nrows, ncols, chanceLightStartsOn));

  //creates an array filled with nrows number of empty arrays for board base
  function addRows(nrows){
    let container = [];
    for(let i = nrows; i > 0; i--){
      container.push([]);
    }
    return container
  }

  //takes gameboard of empty array rows and fills them with columns
  //columns are represented by a random true or false- randomization determined by float integer passed in to determine chance of true or false
  function addCols(board, ncols, chanceLightStartsOn){
    for(let i = 0; i < board.length; i++){
      for(let j = 0; j < ncols; j++)
        board[i].push(randomTrueOrFalse(chanceLightStartsOn))
    }
    return board;
  }

  /**returns a random true or false based on the float chance number passed in*/
  function randomTrueOrFalse(chance = 0.5){
    let randomNum = Math.random();
    if(randomNum <= chance){
      return true;
    }
    return false;
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard(nrows, ncols, chanceLightStartsOn) {
    let initialBoardRows = addRows(nrows);
    // TODO: create array-of-arrays of true/false values
    let initialBoard = addCols(initialBoardRows, ncols, chanceLightStartsOn);
    return initialBoard;
  }

  function hasWon(board) {
    // TODO: check the board in state to determine whether the player has won.
    for(let i = 0; i < board.length; i++){
      if(board[i].includes(true)){
        return false;
      }
    }
    return true;
  }

  //pass in cell coordinate (for example: "3-2" (y-x))
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      //extract x and y from coordinates 
      const [y, x] = coord.split("-").map(Number);

      // TODO: Make a (deep) copy of the oldBoard
      let boardCopy = JSON.parse(JSON.stringify(board)); 
      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
        // if there is a coord to its left, flip it
        let westY = y - 1;
        if (x >= 0 && x < ncols && westY >= 0 && westY < nrows) {
          boardCopy[westY][x] = !boardCopy[westY][x];
        }
        // if there is a coord to its right, flip it
        let eastY = y + 1;
        if (x >= 0 && x < ncols && eastY >= 0 && eastY < nrows) {
          boardCopy[eastY][x] = !boardCopy[eastY][x];
        }
        // if there is a coord to its north, flip it
        let northX = x - 1;
        if (northX >= 0 && northX < ncols && y >= 0 && y < nrows) {
          boardCopy[y][northX] = !boardCopy[y][northX];
        }
        // if there is a coord to its south, flip it
        let southX = x + 1;
        if (southX >= 0 && southX < ncols && y >= 0 && y < nrows) {
          boardCopy[y][southX] = !boardCopy[y][southX];
        }
        return boardCopy;
      };

      let updatedBoard = flipCell(y, x, boardCopy);

      return updatedBoard;
    });
  }

  // if the game is won, just show a winning msg & render nothing else

  // TODO

  // make table board


  let tableBoard = [];

  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`;
      row.push(
          <Cell
              key={coord}
              isLit={board[y][x]}
              flipCellsAroundMe={evt => flipCellsAround(coord)}
          />,
      );
    }
    tableBoard.push(<tr key={y}>{row}</tr>);
  }


 if(hasWon(board)){
  return(<div><h1>You won!</h1></div>)
 }
 else{
  return (
    
    <div className="Board">
      <h1>Lights Out!</h1>
      <table>
        <tbody>
        {tableBoard}
        </tbody>
      </table>
    </div>
  )
  }
}

export default Board;
