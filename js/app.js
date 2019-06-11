const gameBoard = (() => {
  const _board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => _board;
  const placeMark = (mark, cellId) => {
    if (_board[cellId]) {
      return false
    } else {
      _board[cellId] = mark;
      return _board;
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
    _currentPlayer = _currentPlayer === _playerX ? _playerO : _playerX;
  }

  const renderBoard = (board) => {
    const gameBoardElement = document.getElementById('gameBoard');
    const cells = board.map( (cell, index) => (`
      <div class="board-cell" data-id="${index}" onclick="gameController.handleCellClick(this)">${cell}</div>
    `));
    gameBoardElement.innerHTML = cells.join('');
  };

  const handleCellClick = (cell) => {
    let board = gameBoard.placeMark(getCurrentPlayer().getMark(), cell.dataset.id);
    if (board) {
      renderBoard(board);
      let status = checkGameStatus(board);

      if (!status){
        switchCurrentPlayer();
        renderStatus('Player ' + getCurrentPlayer().getName() + ' plays:');
      }
    } else {
      renderStatus(`The cell is occupied, try another one! Player ${getCurrentPlayer().getName()} plays:`);
    }
  }

  const renderStatus = (status) => {
    document.getElementById('status').innerText = status;
  }

  const isWin = (board) => {
    let win = false;
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
        win = true;
      }
    });
    return win
  }

  const checkGameStatus = (board) => {
    let win = isWin(board);
    let tie = board.every(cell => cell) ? 'tie' : false;
    let status = win || tie

    if (win || tie) {
      finishGame(status);
    }
    
    return status;
  };
  
  const finishGame = (status) => {
    [...document.getElementsByClassName('board-cell')].forEach(cell => {
      cell.onclick = null;
    });

    let endStatus = status == "tie" ? "Game over! It's a tie" : `Game over! Player ${_currentPlayer.getName()} won`;
    endStatus += " (Press F5 to restart the game)";

    renderStatus(endStatus);
  }

  const startGame = (e) => {
    e.preventDefault();

    let players = e.target.elements;
    _playerX = playerFactory(players["playerX"].value, 'x');
    _playerO = playerFactory(players["playerO"].value, 'o');
    _currentPlayer = _playerX; 
    
    let info = document.getElementById('info');
    info.innerHTML = `
      <h3>Game info:</h3>
      Player 'x': ${_playerX.getName()}<br>
      Player 'o': ${_playerO.getName()}
    `;
    info.style.display = "block";
    e.target.style.display = "none";

    renderBoard(gameBoard.getBoard());
    renderStatus('Player ' + getCurrentPlayer().getName() + ' plays:');
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