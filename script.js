let number;
let defaultNumber = 10;
let mines;
let defaultMines = 20;
let newArr;
let newnewArr;
let superNewArr;
let gameEnded = false;
let shiftPushed = false;
let minesArr = [];
const MAX = 70, MIN = 10;
let SPEED = 200;
let direction;
let snake;
let foodLocation = null;

function setMapSize() {
    let promptVal = prompt('Set size of map in format number*number\nInput number(min: ' + MIN + ', max: ' + MAX + '): ', defaultNumber);
    number = promptVal === null || promptVal === '' ? defaultNumber : promptVal;
    if (isNaN(number) || number > MAX || number < MIN) {
        setMapSize();
    }
    number = parseInt(number, 10);
    defaultNumber = number;
}

function setDirection(e) {
    let prevDirect = direction;
    switch (e.key) {
        case 'ArrowUp': direction = -number;
            break;
        case 'ArrowDown': direction = +number;
            break;
        case 'ArrowLeft': direction = -1;
            break;
        case 'ArrowRight': direction = 1;
            break;
    }
    if (snake[1] === snake[0] + direction) direction = prevDirect;
}

function startGame() {
    // setMapSize();
    document.body.addEventListener('keydown', setDirection)
    number = 20;
    direction = -20;
    newArr = new Array(number * number);
    newArr.fill(0);
    snake = [209, 229, 249, 269, 289, 309, 329, 349];
    snake.forEach(id => {
        newArr[id] = 1;
    })
    newnewArr = [];
    if (!gameEnded) setLoop();
    renderMap()
}

function setLoop() {
    gameEnded = true;
    setTimeout(function iteration() {
        snakeMove();
        setTimeout(iteration, SPEED);
    }, SPEED)
}


function endGame() {
    alert('End Game!');
    gameEnded = true;
    return startGame();
}

function snakeMove() {
    let nextMove = snake[0] + direction;
    if (''.indexOf.call(snake[0], '9') !== -1 && nextMove % number === 0) return endGame();
    if (''.indexOf.call(nextMove, '9') !== -1 && snake[0] % number === 0) return endGame();
    if (nextMove < 0) return endGame();
    if (nextMove >= number * number) return endGame();
    if (snake.some(item => item === nextMove)) return endGame();
    snake.unshift(nextMove);
    if(superNewArr[nextMove].isFood) {
        newArr[nextMove] = 1;
        setFood();
        // if(!(SPEED <= 50)) SPEED -= 25;
    }
    if (!superNewArr[nextMove].isFood) snake.pop();
    renderMap();
}

startGame();

function renderTile(id) {
    let tile = document.getElementsByClassName('tile')[id];
    tile.innerHTML = '';
    let it = newArr[id];
    if (newArr[id].isOpened === true) {
        tile.className = 'tile opened';
    } else {
        tile.className = 'tile';
    }
    let insertedTag = it.denger === true ? '<span class="front-ground denger' : '<span class="front-ground';
    let string = it.content + insertedTag + '"></span>';
    tile.innerHTML = string;
}

function setFood() {
    let random = Math.floor(Math.random() * (number * number)) + 0;
    if (newArr[random] !== 1 && newArr[random] !== 2) {
        // newArr[newArr.indexOf(2)] = 1;
        newArr[random] = 2;
        foodLocation = random;
        return;
    }
    setFood();
}

function renderMap() {
    newArr.fill(0);
    snake.forEach(id => {
        newArr[id] = 1;
    })
    if(foodLocation === null) {
        setFood();
    } else {
        newArr[foodLocation] = 2;
    }

    superNewArr = newArr.map((item, index) => {
        if (item === 1) {
            return { content: 1, isSnake: true, id: index };
        }
        if (item === 2) {
            return { content: 1, isFood: true, id: index };
        }
        return { content: 0, isSnake: false, id: index };
    })
    for (let i = 0; i < number; i++) {
        newnewArr[i] = superNewArr.slice(number * i, (i + 1) * number);
    }
    let game = document.getElementById('game');
    game.innerHTML = '';
    if (number >= 40) {
        game.className = 'small';
    } else {
        game.className = '';
    }
    newnewArr.forEach(item => {
        let div = document.createElement('div');
        div.className = 'row';
        let string = '';
        item.forEach(it => {
            let tag = '<span class="tile "';
            if (it.isSnake) {
                tag = '<span class="tile snake" ';
            }
            if (it.isFood) {
                tag = '<span class="tile food" ';
                string += tag + 'value="' + it.id + '" ' + '><span></span></span>';
                return;
            }
            // let insertedTag = it.denger === true ? '<span class="front-ground denger' : '<span class="front-ground';
            string += tag + 'value="' + it.id + '" ' + '></span>';
        })
        div.innerHTML = string;
        game.appendChild(div);
    })

}
