const numCellsX = 6
const numCellsY = 8
const cellSize = 60
const bombChance = 0.85
let cellsCreated = false
const cells = []
let cellElements = []

const createCellsContainer = () => {
  const element = document.createElement('div')
  element.classList.add('container')
  element.style.lineHeight = cellSize + 'px'
  element.style.width = cellSize * numCellsX + 'px'
  element.style.height = cellSize * numCellsY + 'px'

  return element
}

const container = createCellsContainer()
document.body.appendChild(container)

container.addEventListener('contextmenu', (event) => {
  event.preventDefault()
})

const gameOver = () => {
  for (let i = 0; i < cells.length; i++) {
    cells[i].isOpen = true
    cells[i].hasFlag = false
  }
  document.querySelector('.game_over').classList.add('window-open')
}

const isWin = () => {
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].isOpen) {
      if (!(cells[i].hasBomb && cells[i].hasFlag)) {
        return false
      }
    }
  }
  return true
}
const checkwin = () => {
  if (isWin()) {
    document.querySelector('.win').classList.add('window-open')
  }
}

const openRecursive = (x, y) => {
  if (!isCellCoordsValid(x, y)) {
    return
  }
  const i = y * numCellsX + x
  if (cells[i].isOpen) {
    return
  }
  cells[i].isOpen = true

  if (!isCellEmpty(x, y)) {
    return
  }

  openRecursive(x, y - 1)

  openRecursive(x + 1, y - 1)

  openRecursive(x + 1, y)

  openRecursive(x + 1, y + 1)

  openRecursive(x, y + 1)

  openRecursive(x - 1, y + 1)

  openRecursive(x - 1, y)

  openRecursive(x - 1, y - 1)
}
const isCellCoordsValid = (x, y) => {
  if (y < 0 || y >= numCellsY || x < 0 || x >= numCellsX) {
    return false
  }
  return true
}

const isCellEmpty = (x, y) => {
  if (!isCellCoordsValid(x, y)) {
    return false
  }
  const index = y * numCellsX + x

  return cells[index].numBombs === 0
}

const calculateNumbers = () => {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].hasBomb) {
      continue
    }
    let numBombs = 0
    const x = i % numCellsX
    const y = Math.floor(i / numCellsX)
    if (hasCellBomb(x, y - 1)) {
      numBombs++
    }
    if (hasCellBomb(x + 1, y - 1)) {
      numBombs++
    }
    if (hasCellBomb(x + 1, y)) {
      numBombs++
    }
    if (hasCellBomb(x + 1, y + 1)) {
      numBombs++
    }
    if (hasCellBomb(x, y + 1)) {
      numBombs++
    }
    if (hasCellBomb(x - 1, y + 1)) {
      numBombs++
    }
    if (hasCellBomb(x - 1, y)) {
      numBombs++
    }
    if (hasCellBomb(x - 1, y - 1)) {
      numBombs++
    }

    cells[i].numBombs = numBombs
  }
}

const hasCellBomb = (x, y) => {
  if (!isCellCoordsValid(x, y)) {
    return false
  }

  const index = y * numCellsX + x
  return cells[index].hasBomb
}

container.addEventListener('mouseup', (event) => {
  const isLeftButton = event.button === 0
  const index = Number(event.target.id)
  if (cells[index].isOpen) {
    return
  }
  if (isLeftButton) {
    if (cells[index].hasFlag) {
      cells[index].hasFlag = false
    } else if (cells[index].hasBomb) {
      gameOver()
    } else {
      const x = index % numCellsX
      const y = Math.floor(index / numCellsX)
      openRecursive(x, y)
      checkwin()
    }
  } else {
    if (!cells[index].isOpen) {
      cells[index].hasFlag = !cells[index].hasFlag
      checkwin()
    }
  }
  updateAllCells()
})

const creatCell = (x, y) => {
  const cell = document.createElement('div')
  cell.classList.add('cell')
  cell.id = String(y * numCellsX + x)

  cell.style.height = cellSize + 'px'
  cell.style.width = cellSize + 'px'
  cell.style.left = x * cellSize + 'px'
  cell.style.top = y * cellSize + 'px'

  return cell
}

const shoudAddBomb = () => {
  return Math.random() > bombChance
}

for (let y = 0; y < numCellsY; y++) {
  for (let x = 0; x < numCellsX; x++) {
    const cell = {
      hasBomb: false,
      hasFlag: false,
      numBombs: 0,
      isOpen: false,
    }

    if (shoudAddBomb()) {
      cell.hasBomb = true
    }
    cells.push(cell)
  }
}

const emptyCellClasses = (el) => {
  el.classList.remove('bomb', 'flag', 'open', '_1', '_2', '_3')
}

const createAllCells = () => {
  container.innerHTML = ''
  cellElements = []

  for (i = 0; i < cells.length; i++) {
    const cell = creatCell(i % numCellsX, Math.floor(i / numCellsX))
    container.appendChild(cell)
    cellElements.push(cell)
  }
  calculateNumbers()
}

const updateAllCells = () => {
  for (i = 0; i < cells.length; i++) {
    emptyCellClasses(cellElements[i])

    if (cells[i].hasFlag) {
      cellElements[i].classList.add('flag')
    }

    if (cells[i].isOpen) {
      if (cells[i].hasBomb) {
        cellElements[i].classList.add('bomb')
      }
      if (cells[i].numBombs > 0) {
        cellElements[i].classList.add('_' + cells[i].numBombs)
        cellElements[i].classList.add('open')
      } else {
        cellElements[i].classList.add('open')
      }
    }
  }
}

createAllCells()
