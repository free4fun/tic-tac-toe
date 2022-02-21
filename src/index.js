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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        }],
      positions: Array(9).fill({ row: null, col: null }),
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i, rows, cols) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const currentSquares = history[history.length - 1].squares;
    const squares = currentSquares.slice();
    const currentPos = [...this.state.positions];
    currentPos[this.state.stepNumber + 1] = {row: rows, col: cols};
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      positions: currentPos.concat([]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  renderSquare(squares, row, col) {
    const i = row * 3 + col;
    return (
      <Square
        value={squares[i]}
        onClick={() => this.handleClick(i, row, col)}
        key={'square' + i}
      />
    );
  }

  render() {
    const history = this.state.history;
    const currentSquares = history[this.state.stepNumber].squares;
    const winner = calculateWinner(currentSquares);
    const currentPositions = this.state.positions;
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move + "(" + currentPositions[move].row + ' ,' + currentPositions[move].col + ")" : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Winner is: ' + winner;
    } else {
      status = 'Next player:' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className='game-info'>
          <div>{status}</div>
        </div>
        <div className="game-board">
          {[0, 1, 2].map(r => {
            return (
              <div className="board-row" key={"row" + r}>
                {[0, 1, 2].map(c => {
                  return this.renderSquare(currentSquares, r, c);
                })}
              </div>
            );
          })}
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

