'use strict'

//* Minesweeper//*

// Global variables

var MINE = '💣'
var gElSelectedSeat = null
var gInterval

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
}

// Builds the board Set mines at random locations Call setMinesNegsCount() Return the created board

function buildBoard() {
  var board = []
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: true,
      }
    }
  }
  //ADD MINES
  for (var i = 0; i < gLevel.MINES; i++) {
    var randI = getRandomInt(0, gLevel.SIZE - 1)
    var randJ = getRandomInt(0, gLevel.SIZE - 1)
    if (board[randI][randJ].isMine) {
      i--
      continue
    }
    board[randI][randJ].isMine = true
  }

  return board
}

// Count mines around each cell and set the cell's minesAroundCount.

// Render the board as a <table> to the page

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n'

    for (var j = 0; j < board[0].length; j++) {
      var currCell = gBoard[i][j]
      var cellClass = getClassNamePos({ i, j }) + ' '

      cellClass += currCell.isMine ? 'mine' : ' '
      // if (currCell.isShown) className += ' shown'
      // if (currCell.isMine) className += ' mine'
      // if (currCell.isMarked) className += ' marked'
      strHTML += `\t<td class="cell ${cellClass}"" 
            onclick="cellClicked(this, ${i}, ${j})" > 
            `

      setMinesNegsCount(i, j, gBoard)
    }
    strHTML += `</tr>\n`
  }

  const elBoard = document.querySelector('.board-container')
  elBoard.innerHTML += strHTML
}

function cellClicked(elCell, i, j) {
  var cell = gBoard[i][j]

  if (cell.isShown) {
    return
  }

  if (!gInterval) gInterval = setInterval(countUpTimer, 1000)

  setMinesNegsCount(i, j, gBoard)

  elCell.innerText = cell.minesAroundCount
  elCell.classList.add('selected')
  if (gElSelectedSeat) {
    gElSelectedSeat.classList.remove('selected')
  }

  if (cell.isMine) {
    exposeMines()
    clearInterval(gInterval)
    return
  }
}

// TODO: Loop through the mat and call setMinesNegsCount on each cell

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

function getClassNamePos(location) {
  const cellClass = 'cell-' + location.i + '-' + location.j
  return cellClass
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function exposeMines() {
  var mines = document.querySelectorAll('.mine')
  for (var i = 0; i < mines.length; i++) {
    mines[i].innerHTML = MINE
    console.log(mines[i])
  }
}

var totalSeconds = 0

function countUpTimer() {
  ++totalSeconds
  var hour = Math.floor(totalSeconds / 3600)
  var minute = Math.floor((totalSeconds - hour * 3600) / 60)
  var seconds = totalSeconds - (hour * 3600 + minute * 60)
  document.getElementById('count_up_timer').innerHTML =
    hour + ':' + minute + ':' + seconds
}

function chooseLevel(lvl) {}
//switch between levels/
