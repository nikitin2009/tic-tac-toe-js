const gameBoard = (() => {
  const _board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => _board;
  const placeMark = (player, cellId) => {
    if (_board[cellId]) {
      gameController.renderStatus(`The cell is occupied, try another one! Player ${player} plays:`);
    } else {
      _board[cellId] = player;
      gameController.switchCurrentPlayer();
      gameController.checkGameStatus(_board);
      gameController.renderBoard(_board);
    }
  };

  return {
    getBoard,
    placeMark
  };
})();


const playerFactory = (name, mark) => {
  const getMark = () => mark;
  const getName = () => name;
  return { getMark, getName };
};


const gameController = (() => {

  let _playerX,
      _playerO,
      _currentPlayer;

  const getCurrentPlayer = () => {
    return _currentPlayer;
  }

  const switchCurrentPlayer = () => {
    _currentPlayer = _currentPlayer == _playerX ? _playerO : _playerX;
  }

  const renderBoard = (board) => {
    const gameBoardElement = document.getElementById('gameBoard');
    const cells = board.map( (cell, index) => (`
      <div class="board-cell" data-id="${index}" onclick="gameController.handleCellClick(this)">${cell}</div>
    `));
    gameBoardElement.innerHTML = cells.join('');
    renderStatus('Player ' + getCurrentPlayer().getName() + ' plays:');
  };

  const handleCellClick = (cell) => {
    gameBoard.placeMark(getCurrentPlayer().getMark(), cell.dataset.id);
  }

  const renderStatus = (status) => {
    document.getElementById('status').innerText = status;
  }

  const checkGameStatus = (board) => {
    let won = false;
    const lines = {
      top:                    [ board[0], board[1], board[2] ],
      middle:                 [ board[3], board[4], board[5] ],
      bottom:                 [ board[6], board[7], board[8] ],
      left:                   [ board[0], board[3], board[6] ],
      center:                 [ board[1], board[4], board[7] ],
      right:                  [ board[2], board[5], board[8] ],
      bottom_to_top_diagonal: [ board[6], board[4], board[2] ],
      top_to_bottom_diagonal: [ board[0], board[4], board[8] ]
    };
    Object.values(lines).forEach(line => {
      let xWon = line.every(cell => cell == 'x');
      let oWon = line.every(cell => cell == 'o');
      if (xWon || oWon) {
        won = true;
        finishGame(line);
      }
    });

    if (won) return;

    let tie = board.every(cell => cell);
    if (tie) {
      finishGame("tie");
    }

  };

  const finishGame = (status) => {
    [...document.getElementsByClassName('board-cell')].forEach(cell => {
      cell.onclick = null;
    });

    let endStatus = status == "tie" ? "Game over! It's a tie" : `Game over! Player ${_currentPlayer.getName()} won`;

    renderStatus(endStatus);
  }

  const startGame = (e) => {
    e.preventDefault();
    e.target[3].style.display = "none";
    

    let players = e.target.elements;
    _playerX = playerFactory(players["playerX"].value, 'x');
    _playerO = playerFactory(players["playerO"].value, 'o');
    _currentPlayer = _playerX;    

    renderBoard(gameBoard.getBoard());
  }

  return {
    renderBoard,
    getCurrentPlayer,
    switchCurrentPlayer,
    handleCellClick,
    checkGameStatus,
    renderStatus,
    startGame
  };
})();


document.getElementById('usersNames').onsubmit = gameController.startGame;