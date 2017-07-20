let number;
let defaultNumber = 10;
let mines;
let defaultMines = 20;
let newArr;
let newnewArr;
let gameEnded = false;
let shiftPushed = false;

function setMapSize() {
    let promptVal = prompt('Set size of map in format number*number\nInput number: ', 10);
    number = promptVal === null || promptVal === '' ? defaultNumber : promptVal;
    if (isNaN(number) || number > 30) {
        setMapSize();
    }
    number = parseInt(number, 10);
}

function setMines() {
    let promptVal = prompt('Set number for mines: ', (number * number) * 0.1);
    mines = promptVal === null || promptVal === '' ? defaultMines : promptVal;
    if (mines > number * number || mines < (number * number) * 0.1 || isNaN(mines)) {
        setMines();
    }
    mines = parseInt(mines, 10);
}

function setShiftPushed(e, pushed) {
    if(e.key === "Shift") {
        shiftPushed = pushed;
    }
}

function startGame() {
    setMapSize();
    setMines();
    document.body.addEventListener('keydown', (e) => setShiftPushed(e, true), true);
    document.body.addEventListener('keyup', (e) => setShiftPushed(e, false), true);
    newArr = new Array(number * number);
    newArr.fill(0);
    gameEnded = false;

    for (let i = 0; i < mines;) {
        let random = Math.floor(Math.random() * (number * number)) + 0;
        if (newArr[random] !== '*') {
            newArr[random] = '*';
            i++;
        }
    }

    changeAroundBoxes('*', valuePlus);

    newnewArr = [];
    newArr = newArr.map((item, index) => {
        if (item === 0) {
            return { content: '&nbsp;', isOpened: false, id: index };
        }
        return { content: item, isOpened: false, id: index };
    })
    renderMap()
}

startGame();

function valuePlus(index) {
    if (newArr[index] === '*') return;
    newArr[index] += 1;
}

function changeAroundBoxes(selector, callback, once = false, id = null) {
    function changeManipulation(item, index) {
        if (item === selector) {
            let notLeft = (index) % number !== 0;
            let notRight = (index + 1) % number !== 0;
            let notBot = !(index >= (newArr.length - number - 1));
            let notTop = !(index <= number - 1);
            if (notLeft) {
                callback(index - 1);
                if (notBot) callback(index + number - 1);
                if (notTop) callback(index - number - 1);
            }
            if (notRight) {
                callback(index + 1);
                if (notTop) callback(index - number + 1);
                if (notBot) callback(index + number + 1);
            }
            if (notTop) { callback(index - number) };
            if (notBot) callback(index + number);
        }
    }
    if (once === true) {
        changeManipulation(newArr[id].content, parseInt(id, 10));
        return;
    }
    newArr.forEach(changeManipulation);
}

function renderMap() {
    for (let i = 0; i < number; i++) {
        newnewArr[i] = newArr.slice(number * i, (i + 1) * number);
    }

    document.getElementById('game').innerHTML = '';
    newnewArr.forEach(item => {
        let div = document.createElement('div');
        let string = '';
        item.forEach(it => {
            let tag = it.isOpened ? '<span class="opened" ' : '<span ';
            let insertedTag = it.denger === true ? '<span class="front-ground denger' : '<span class="front-ground';
            string += tag + 'value="' + it.id + '" ' + 'onClick="some(this)">' + it.content + insertedTag + '"></span></span>';
        })
        div.innerHTML = string;
        document.getElementById('game').appendChild(div);
    })

}

function openAllMines() {
    newArr = newArr.map(item => {
        if (item.content === '*') {
            item.isOpened = true;
        }
        return item;
    })
    renderMap();
}

function checkIfWin() {
    return !newArr.some(item => {
        return (item.content !== '*' && item.isOpened === false);
    })
}

function emptyBoxHendle(index) {
    changeAroundBoxes('&nbsp;', openBox, true, index);
    renderMap();
}

function openBox(index) {
    let some = newArr[index].isOpened;
    newArr[index].isOpened = true;
    if (newArr[index].content === '&nbsp;' && some === false) {
        emptyBoxHendle(index);
    }
}

function some(e) {
    let id = e.getAttribute('value');
    if (gameEnded === true) {
        startGame();
        return;
    };

    if(shiftPushed) {
        newArr[id].denger = newArr[id].denger ? !newArr[id].denger : true;
        renderMap();
        return;
    }

    if (newArr[id].content === '&nbsp;') {
        newArr[id].isOpened = true;
        emptyBoxHendle(id);
    } else {
        openBox(id);
    }

    renderMap();
    if (newArr[id].content === '*') {
        openAllMines();
        let el = document.querySelectorAll('[value="' + e.getAttribute('value') + '"]')[0];
        el.className += " red";
        setTimeout(() => {
            if (confirm('Game Over!\nDo you wont to try again?')) {
                startGame();
                return;
            }
            gameEnded = true;
        }, 0)
    }

    if (checkIfWin()) {
        openAllMines();
        setTimeout(() => {
            if (confirm('YOU WIN! CONNGRATZ!\nDo you wont to win again?')) {
                startGame();
                return;
            }
            gameEnded = true;
        }, 0)
    }

}