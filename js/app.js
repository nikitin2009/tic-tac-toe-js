const gameBoard = (() => {
  const _board = new Array(9);

  const getBoard = () => _board;

  return {
    getBoard,
  };
})();


const displayController = (() => {
  const renderBoard = (board) => {
    console.log(board);
    
  };

  return {
    renderBoard,
  };
})();


const playerFactory = (name) => {
  return {
    name
  };
};


function render() {
  displayController.renderBoard(gameBoard.getBoard());
}