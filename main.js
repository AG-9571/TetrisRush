import './style.css'

const canvas = document.querySelector('#tetris')
const context = canvas.getContext('2d')
const $span = document.querySelector('span')
const $score = document.querySelector('#score')
const $section = document.querySelector('#StartGame')

const scale = 20
const boardWidth = 10
const boardHeight = 20
let score = 0

canvas.width = boardWidth * scale
canvas.height = boardHeight * scale

context.scale(scale, scale)
// 3. board
const board = [] // 20 * 10
for (let i = 0; i < boardHeight; i++) {
  board.push(new Array(boardWidth).fill(0))
}
// piezas player
const pices = {
  cube: {
    position: { x: 0, y: 0 },
    shape: [
      [1, 1],
      [1, 1]
    ]
  },
  T: {
    position: { x: 0, y: 0 },
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ]
  },
  L: {
    position: { x: 0, y: 0 },
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ]
  },
  J: {
    position: { x: 0, y: 0 },
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ]
  },
  I: {
    position: { x: 0, y: 0 },
    shape: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 0, 0]
    ]
  },
  S: {
    position: { x: 0, y: 0 },
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ]
  }
}

let dropcouter = 0
let lastestime = 0
let acceleration = 1 // Velocidad inicial
let timeSinceLastAcceleration = 0 // Tiempo desde la última aceleración

// Update
function update (time = 0) {
  const deltaTime = time - lastestime
  lastestime = time
  dropcouter += deltaTime
  timeSinceLastAcceleration += deltaTime

  if (timeSinceLastAcceleration > 30000) {
    timeSinceLastAcceleration = 0
    acceleration += 0.5
  }

  if (dropcouter > (1000 / acceleration)) {
    pices.cube.position.y++
    if (checkCollision()) {
      pices.cube.position.y--
      solidify()
      removeRows()
    }
    dropcouter = 0
  }

  draw()
  window.requestAnimationFrame(update)
}
// Draw
function draw () {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })
  pices.cube.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        context.fillStyle = 'red'
        context.fillRect(
          x + pices.cube.position.x,
          y + pices.cube.position.y,
          1,
          1
        )
      }
    })
  })
}

document.addEventListener('keydown', event => {
  const rotate = []
  const previusShape = pices.cube.shape
  switch (event.keyCode) {
    case 37:
      pices.cube.position.x--
      if (checkCollision()) {
        pices.cube.position.x++
      }
      break
    case 39:
      pices.cube.position.x++
      if (checkCollision()) {
        pices.cube.position.x--
      }
      break
    case 40:
      pices.cube.position.y++
      if (checkCollision()) {
        pices.cube.position.y--
        solidify()
        removeRows()
      }
      break
    case 38:
      for (let i = 0; i < pices.cube.shape[0].length; i++) {
        const row = []
        for (let j = pices.cube.shape.length - 1; j >= 0; j--) {
          row.push(pices.cube.shape[j][i])
        }
        rotate.push(row)
      }
      pices.cube.shape = rotate
      if (checkCollision()) {
        pices.cube.shape = previusShape
      }
      break
  }
})

function checkCollision () {
  return pices.cube.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 &&
        board[y + pices.cube.position.y]?.[x + pices.cube.position.x] !== 0
      )
    })
  })
}

function solidify () {
  pices.cube.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + pices.cube.position.y][x + pices.cube.position.x] = 1
      }
    })
  })
  const PIECES = new Array(6).fill(0).map((_, i) => {
    return Object.values(pices)[i]
  })
  pices.cube.position = { x: Math.floor(boardWidth / pices.cube.shape[0].length), y: 0 }
  pices.cube.shape = PIECES[Math.floor(Math.random() * PIECES.length)].shape

  if (checkCollision()) {
    window.alert('Game Over')
    board.forEach((row) => row.fill(0))
  }
}
function removeRows () {
  board.forEach((row, y) => {
    if (row.every(value => value === 1)) {
      board.splice(y, 1)
      const newRow = new Array(boardWidth).fill(0)
      board.unshift(newRow)
      score += 10
      $score.textContent = score
    }
  })
}

$section.addEventListener('click', () => {
  update()
  $section.style.display = 'none'
  $span.style.display = 'block'
  canvas.style.display = 'block'
  const audio = new window.Audio('./tetris.mp3')
  audio.volume = 0.1
  audio.play()
})
