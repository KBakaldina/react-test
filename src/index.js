import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
    renderSquare(i) {
      return (
          <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0, 
    });
  }

  handleClick(i) {
    const { history: oldHistory, xIsNext, stepNumber } = this.state;

    const history = oldHistory.slice(0, stepNumber + 1)
    const current = getCurrentFromHistory(history, stepNumber);
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) { return; }

    squares[i] = getNextPlayer(xIsNext);

    this.setState({
      history: history.concat([{ squares }]),
      stepNumber: history.length,
      xIsNext: !xIsNext,
    });
  }
  
  render() {
    const { history, xIsNext, stepNumber } = this.state;

    const current = getCurrentFromHistory(history, stepNumber);
    const winner = calculateWinner(current.squares);
    const status = winner
      ? 'Winner: ' + winner
      : 'Next player: ' + getNextPlayer(xIsNext);

    const moves = history.map((step, move) => {
      let indexOfLastMove;
      if (move) {
        const prevSquares = history[move - 1].squares.slice();
        const curSquares = step.squares.slice();
        indexOfLastMove = getIndexOfNewMove(prevSquares, curSquares);
      }

      const desc = move
        ? `Go to move #${move} (
          col=${indexOfLastMove % 3 + 1},
          row=${Math.floor(indexOfLastMove / 3 + 1)}
          )`
        : 'Go to game start';
      
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
      <div className="game-info">
        <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
  
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
         squares[a]
      && squares[a] === squares[b]
      && squares[a] === squares[c]
      ) {
      return squares[a]
    }
  }

  return null;
}
  
function getNextPlayer(xIsNext) {
  return xIsNext ? 'X' : 'O';
}

function getCurrentFromHistory(history, stepNumber) {
  return history[stepNumber];
}

function getIndexOfNewMove(prevSquares, curSquares) {
  for (let i = 0; i < prevSquares.length; i++) {
    if (prevSquares[i] !== curSquares[i]) {
      return i;
    }
  }
  return null;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  