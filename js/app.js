const gameBoard = (() => {
  const _board = [
    ['-', '-', '-'],
    ['-', '-', '-'],
    ['-', '-', '-']
  ];

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