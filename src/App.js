import React from 'react';
import './App.css';
import GameTile from './GameTile.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 5,
      cols: 5,
      game: [],
      tileSize: 0,
    };
  }

  componentDidMount = () => {
    this.setBoardSize();
    this.shuffleBoard();
    window.addEventListener("resize", this.setBoardSize);
  }

  componentWillMount = () => {
    this.initBoard();
  }
  
  render() {
    return (
      <div className="game">
        <div className="board">
          {this.state.game.map((value, i) => {
            return <GameTile onClick={(evt) => this.handleClick(value, evt)} key={i} value={value}></GameTile>
          })}
        </div>
        <div class="game-controls">
          <button className="btn btn-shuffle" onClick={this.shuffleBoard}>Shuffle the board</button>
          <button className="btn btn-solve" onClick={this.initBoard}>Solve the board</button>
        </div>
      </div>
    );
  }

  hasMoreRows = () => {
    return this.state.rows > this.state.cols;
  }

  setBoardSize = () => {
    const winHeight = window.innerHeight;
    const winWidth = window.innerWidth ;

    const height = winHeight / this.state.rows;
    const width = winWidth / this.state.cols;

    const tileSize = Math.round((height < width ? height : width) * .75);

    document.querySelector('.game').style.width = tileSize * this.state.cols + 'px';
    document.querySelector('.board').style.height = tileSize * this.state.rows + 'px';

    document.querySelectorAll('.tile').forEach((tile) => {
      tile.style.height = tileSize + 'px';
      tile.style.width = tileSize + 'px';
    });

    this.setState({tileSize: tileSize})
  }

  initBoard = () => {
    let newGame = [];
    let gamesize = this.state.rows * this.state.cols;

    for (let i = 0; i < gamesize; i++) {
      newGame.push(i);
    }

    this.setState(() => {
      return {
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
      const direction = this.getDirection(value);

      switch (direction) {
        case 'left':
          tile.style.left = -this.state.tileSize + 'px';
          break;
      
        case 'right':
          tile.style.left = this.state.tileSize + 'px';
          break;
    
        case 'up':
          tile.style.top = -this.state.tileSize + 'px';
          break;
        
        case 'down':
          tile.style.top = this.state.tileSize + 'px';
          break;
    
        default:
          break;
      }

      const animationTimeout = 200;

      setTimeout(() => {
        tile.style.top = '';
        tile.style.left = '';
        this.swapNumbers(value);
      }, animationTimeout)
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
