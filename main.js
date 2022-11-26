'use strict'

//* Minesweeper//*

// Global variables

var MINE = '💣'
var FLAG = '🚩'
var LIVES = 3
var gElSelectedSeat = null
var gInterval = null
var gMineCount = 0
var gFlagCount = 0
var HINT = 3

var gBoard

var gLevel = {
  SIZE: 4,
  MINES: 2,
}

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
}

function initGame() {
  gBoard = buildBoard()
  renderBoard(gBoard)
  updateScore()
  gMineCount = 0
  LIVES = 3
  gGame.isOn = true
  checkVictory()
  createLives()
}

function buildBoard() {
  var board = []
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }

  //ADD MINES
  addMines(board)
  addFlag()

  return board
}

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n'

    for (var j = 0; j < board[0].length; j++) {
      var currCell = gBoard[i][j]
      var cellClass = getClassNamePos({ i, j }) + ' '

      cellClass += currCell.isMine ? 'mine' : ' '

      strHTML += `\t<td id=${i + j * gLevel.SIZE} class="cell ${cellClass}"" 
      onclick="cellClicked(this, ${i}, ${j})" > 
      `

      setMinesNegsCount(i, j, gBoard)
      //Count mines on board
    }
    strHTML += `</tr>\n`
  }

  const elBoard = document.querySelector('.board-container')
  elBoard.innerHTML = strHTML
}

function cellClicked(elCell, i, j) {
  if (!gGame.isOn) return

  var cell = gBoard[i][j]
  console.log({ cell })

  setMinesNegsCount(i, j, gBoard)

  elCell.innerText = cell.minesAroundCount

  if (cell.isShown) return

  if (gElSelectedSeat) {
    cell.isShown = true
  }
  gGame.shownCount++

  gElSelectedSeat = elCell

  //if (gElSelectedSeat) elCell.classList.add('selected')
  elCell.classList.add('selected')

  if (cell.isMine) {
    LIVES--
    LIVES <= 0 ? gameOver() : console.log(LIVES)

    elCell.innerText = '💣'
    var elLives = document.querySelector('.lives')
    elLives.innerText = '❤️'.repeat(LIVES)
  }

  if (!gInterval && !cell.isMine) {
    gInterval = setInterval(countUpTimer, 1000)
  }

  if (cell.minesAroundCount === 0) {
    ExposeAllNegs(i, j)
  }

  checkVictory()
}

function setMinesNegsCount(cellI, cellJ, mat) {
  var minesCount = 0
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= mat[0].length) continue
      if (i === cellI && j === cellJ) continue
      if (mat[i][j].isMine) minesCount++
    }
  }
  mat[cellI][cellJ].minesAroundCount = minesCount

  return minesCount
}

function addMines(board) {
  for (var i = 0; i < gLevel.MINES; i++) {
    var randI = getRandomInt(0, gLevel.SIZE - 1)
    var randJ = getRandomInt(0, gLevel.SIZE - 1)
    if (board[randI][randJ].isMine) {
      i--
      continue
    }
    board[randI][randJ].isMine = true
    gMineCount++
  }
}

function addFlag() {
  addEventListener('contextmenu', function (e) {
    e.preventDefault()
    var elCell = e.target
    if (elCell.classList.contains('cell')) elCell.innerText = FLAG
  })
}

function chooseLevel(lvl) {
  if (lvl === 4) {
    gLevel.SIZE = 4
    gLevel.MINES = 2
  } else if (lvl === 8) {
    gLevel.SIZE = 8
    gLevel.MINES = 14
  } else {
    gLevel.SIZE = 12
    gLevel.MINES = 32
  }
  initGame()
  return
}

function updateScore() {
  var elMines = document.querySelector('h2 span')
  elMines.innerText = gMineCount
}

function exposeMines() {
  var mines = document.querySelectorAll('.mine')
  for (var i = 0; i < mines.length; i++) {
    mines[i].innerHTML = MINE
  }
}

function gameOver(elRestart) {
  clearInterval(gInterval)
  var elRestart = document.querySelector('.restart')
  elRestart.innerText = '🤯'
  elRestart.addEventListener('click', restartGame)
  exposeMines()
  gInterval = null
  gGame.isOn = false
}

function restartGame(elRestart) {
  var elRestart = document.querySelector('.restart')
  elRestart.innerText = '😁'
  var elTimer = document.querySelector('.time')
  gInterval = 0
  elTimer.innerText = '00:00:00'
  clearInterval(gInterval)
  totalSeconds = 0
  gGame.shownCount = 0
  gGame.isOn = true
  initGame()
}

function checkVictory() {
  if (gGame.shownCount === gLevel.SIZE ** 2 - gLevel.MINES) {
    clearInterval(gInterval)
    var elRestart = document.querySelector('.restart')
    elRestart.addEventListener('click', restartGame)
    elRestart.innerText = '🏆'
    gGame.isOn = false
  }
}

function createLives() {
  var elLives = document.querySelector('.lives')
  elLives.innerHTML = '❤️' + '❤️' + '❤️'
}

// function showAllMinesAround(cellI, cellJ, mat = gBoard) {
//   for (var i = cellI - 1; i <= cellI + 1; i++) {
//     if (i < 0 || i >= mat.length) continue
//     for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//       if (j < 0 || j >= mat[0].length) continue
//       if (!mat[i][j].isShown) {
//         gGame.shownCount--
//         mat[i][j].isShown = true
//         if (mat[i][j].minesAroundCount === 0) {
//           showAllMinesAround(i, j)
//         }
//       }
//     }
//   }
// }

function ExposeAllNegs(i, j) {
  // console.log({ i, j })
  if (
    i < 0 ||
    i === gLevel.SIZE ||
    j < 0 ||
    j === gLevel.SIZE ||
    gBoard[i][j].isShown === true // if cell is shown
  ) {
    return
  }

  if (gBoard[i][j].minesAroundCount !== 0) {
    gBoard[i][j].isShown = true
    var board = document.getElementById(i + j * gLevel.SIZE)
    console.log({ i, j })
    board.innerText = gBoard[i][j].minesAroundCount
    console.log({ board })
    // console.log(gBoard[i][j])

    // console.log(i, j)
    return
  }
  gBoard[i][j].isShown = true
  var board = document.getElementById(i + j * gLevel.SIZE)
  board.innerText = gBoard[i][j].minesAroundCount
  ExposeAllNegs(i - 1, j)
  ExposeAllNegs(i + 1, j)
  ExposeAllNegs(i, j - 1)
  ExposeAllNegs(i, j + 1)
}
