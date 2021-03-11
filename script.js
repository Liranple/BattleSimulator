var time = 0;
var running = false;
var timerid = 0;

var charSheet;

var playerAtk;
var monsterAtk;
var stun = false;
var scar = false;

window.onload = function () {
    charSheet = document.getElementsByClassName("charSheet")[0]
};


function onlyNumber(input) {
    if (isNaN(Number(input.value))) {
        let newInputValue = "";
        let firstDot = false;
        for (let i = 0; i < input.value.length; i++) {
            if (!isNaN(Number(input.value[i]))) {
                newInputValue += input.value[i];
            }
            else if (input.value[i] == "." && firstDot == false) {
                newInputValue += input.value[i];
                firstDot = true;
            }
        }
        input.value = newInputValue;
    }
}

function timerStartPause(e) {
    if (!running) {
        document.getElementsByClassName("turnText")[0].innerText="1 턴";
        running = true;
        increment();
        e.classList.replace("fa-play", "fa-pause");
    }
    else if (running){
        running = false;
        clearTimeout(timerid);
        e.classList.replace("fa-pause", "fa-play");
    }
}
function timerReset() {
    time = 0;
    running = false;
    clearTimeout(timerid);
    document.getElementsByClassName("timer")[0].innerText="00 : 00 : 00";
    document.getElementsByClassName("timerStartPause")[0].classList.replace("fa-pause", "fa-play");
    document.getElementsByClassName("turnText")[0].innerText="0 턴";

}
function increment() {
    if (running) {
        timerid = setTimeout(function () {
            time++;
            var hours = Math.floor(time / 3600);
            var mins = Math.floor(time % 3600 / 60);
            var secs = time % 3600 % 60;
            var turn = Math.floor((mins/15)+1);
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (mins < 10) {
                mins = "0" + mins;
            }
            if (secs < 10) {
                secs = "0" + secs;
            }
            document.getElementsByClassName("turnText")[0].innerText=`${turn} 턴`;
            document.getElementsByClassName("timer")[0].innerText=`${hours} : ${mins} : ${secs}`;
            increment();
        }, 10)
    }
}

function addCharSheet() {
    document.getElementsByClassName("charPanel")[0].innerHTML += charSheet.innerHTML;
}

function chanceCalc(persent) {
    var result = false
    var chance = Math.ceil(Math.random() * 100);
    if (chance < persent) {
        result = true;
    }
    return result;
}
function atkBoxCheck(e) {
    var atkBox = document.getElementsByClassName(e);
    var atkCount = 0;
    var chanceTable = new Array(2, 7, 17, 37, 67, 107, 157, 217, 267, 307);

    for (let i = 0; i < atkBox.length; i++) {
        if (atkBox[i].checked) {
            atkCount++
        }
    }
    var damage = new Array(atkCount);

    for (var i = 0; i < atkCount; i++) {
        var atkChance = Math.ceil(Math.random() * 307);
        for (var j = 0; j < chanceTable.length; j++) {
            if (atkChance < chanceTable[j]) {
                damage[i] = 100 - j * 10;
                break;
            }
        }
    }
    return damage;
}
function charSelect(e) {
    var char = document.getElementsByName("switch");
    for (let i = 0; i < char.length; i++) {
        if (char[i] != e) {
            char.checked = false;
        }
    }
}

function charCheck() {
    

}

function ready() {
    playerAtk = atkBoxCheck("pBox");
    monsterAtk = atkBoxCheck("mBox");

}

function normalAttack() {
    var critical = chanceCalc(30);
    var log;
    if (critical) {
        log = ""
    }
}

function playerAction(e) {
    ready();
    switch (e.dataset.key) {
        case "attack":
            
            break;
        case "sudden":
            var backstep = chanceCalc(30);
            break;
        case "stun":
            
            break;
    }
}