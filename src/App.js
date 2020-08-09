import React from 'react';
import './App.css';
import GameTile from './GameTile.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 4,
      cols: 4,
      finnished: false,
      game: [],
      startingGame: [],
    };
  }

  componentDidMount = () => {
    this.setBoardSize();
    this.initBoard();
    this.shuffleBoard();
  }
  
  render() {
    return (
      <div className="game">
        <div className="board">
          {this.state.game.map((value, i) => {
            return <GameTile onClick={(evt) => this.handleClick(value, evt)} key={i} value={value}></GameTile>
          })}
        </div>
        <button onClick={this.shuffleBoard}>Shuffle the board</button>
      </div>
    );
  }

  setBoardSize = () => {
    const width = this.state.cols * 100;
    const height = this.state.rows * 100;

    console.log(height);
    
    document.querySelector('.board').style.width = width + 'px';
    document.querySelector('.board').style.height = height + 'px';
  }

  initBoard = () => {
    let newGame = [];
    let gamesize = this.state.rows * this.state.cols;

    for (let i = 0; i < gamesize; i++) {
      newGame.push(i);
    }

    this.setState((state, props) => {
      return {
        startingGame: newGame,
        game: newGame,
      };
    });
  }

  shuffleBoard = () => {
    let gamesize = this.state.rows * this.state.cols;

    for (let i = 0; i < 1000; i++) {
      let randomNumber = Math.floor(Math.random() * Math.floor(gamesize));
      if (this.isLegalMove(randomNumber)) {
        this.swapNumbers(randomNumber)
      }
    }
  }

  handleClick(value, evt) {
    // Only continue if the move is legal.
    if (this.isLegalMove(value)) {

      const tile = evt.currentTarget;
      const style = window.getComputedStyle(tile)
      // const matrix = style.transform
      // const numberPattern = /-?\d+\.?\d*/g;
      // const matrixValues = matrix.match( numberPattern );

      const direction = this.getDirection(value);
      console.log(direction);

      // switch (direction) {
      //   case 'up':
      //     matrixValues[5] = parseInt(matrixValues[5]) - 100;
      //     break;
      //   case 'down':
      //     matrixValues[5] = parseInt(matrixValues[5]) + 100;
      //     break;     
      //   case 'left':
      //     matrixValues[4] = parseInt(matrixValues[4]) - 100;
      //     break;     
      //   case 'right':
      //     matrixValues[4] = parseInt(matrixValues[4]) + 100;
      //     break;
      //   default:
      //     break;
      // }

      // const matrixString = `matrix(${matrixValues.join(', ')})`;

      // tile.style.transform = matrixString;

      this.swapNumbers(value);
    }
  }

  swapNumbers = (clickedNumber) => {
    let gamestate = this.state.game;

    gamestate.forEach((value, i) => {
      if (value === clickedNumber) {
        gamestate[i] = 0;
      }

      if (value === 0) {
        gamestate[i] = clickedNumber;
      }
    })

    this.setState({game: gamestate});
  }

  getDirection = (clickedNumber) => {
    let gamestate = this.state.game;
    let direction = null

    // index of clicked number
    let index = gamestate.findIndex((tile) => {
      return tile === clickedNumber;
    })

    if (gamestate[index - 1] === 0) {
      direction = 'left';
    }

    if (gamestate[index + 1] === 0) {
      direction = 'right';
    }

    if (gamestate[index - this.state.cols] === 0) {
      direction = 'up';
    }

    if (gamestate[index + this.state.cols] === 0) {
      direction = 'down';
    }

    return direction;

  }

  isLegalMove = (clickedNumber) => {
    let gamestate = this.state.game;
    let legal = false;

    gamestate.forEach((value, i) => {
      if (value === clickedNumber) {
        // Taka index modulous cols to get column
        const col = i % this.state.cols + 1;

        // Take the index devided by cols to get which row the clicked numer is on. 
        const row = Math.floor(i / this.state.cols) + 1;

        // Set up variables to check where the clicked square is.
        let topBoundry = row === 1 ? true : false;
        let leftBoundry = col === 1 ? true : false;
        let bottomBoundry = row === this.state.rows ? true : false;
        let rightBoundry = col === this.state.cols ? true : false;

        // Valid squares.
        let validSquares = [];

        // If top boundry is false is always has a valid square above.
        if (topBoundry === false) {
          validSquares.push(gamestate[i - this.state.cols]);
        } 

        // If bottom boundry is false is always has a valid square below.
        if (bottomBoundry === false) {
          validSquares.push(gamestate[i + this.state.cols]);
        } 

        // If left boundry is false is always has a valid square to the left.
        if (leftBoundry === false) {
          validSquares.push(gamestate[i - 1]);
        } 

        // If right boundry is false is always has a valid square to the right.
        if (rightBoundry === false) {
          validSquares.push(gamestate[i + 1]);
        } 

        if (validSquares.includes(0)) {
          legal = true;
        }
      }
    })

    return legal
  }
}

export default App;
