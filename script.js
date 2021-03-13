var time = 0;
var running = false;
var timerid = 0;

var charSheetTxt;
var charSheet;
var charPanel;

var charName;
var charAtk;
var monAtk;
var stun = false;
var scar = false;


window.onload = function () {
    charSheetTxt = document.getElementsByClassName("char-sheet")[0].innerHTML;
    charPanel = document.getElementsByClassName("char-panel")[0];
}

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
        document.getElementsByClassName("turn-text")[0].innerText = "1";
        document.getElementsByClassName("monster-hp-input")[0].disabled = true;
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
    document.getElementsByClassName("timer")[0].innerText = "00 : 00 : 00";
    document.getElementsByClassName("timer-start-pause")[0].classList.replace("fa-pause", "fa-play");
    document.getElementsByClassName("turn-text")[0].innerText = "0";
    document.getElementsByClassName("monster-hp-input")[0].disabled = false;
    document.getElementsByClassName("monster-hp-input")[0].innerText = "0";

}
function increment() {
    if (running) {
        timerid = setTimeout(function () {
            time++;
            var hours = Math.floor(time / 3600);
            var mins = Math.floor(time % 3600 / 60);
            var secs = time % 3600 % 60;
            var turn = Math.floor((hours*4)+(mins/15)+1);
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (mins < 10) {
                mins = "0" + mins;
            }
            if (secs < 10) {
                secs = "0" + secs;
            }
            document.getElementsByClassName("turn-text")[0].innerText=`${turn}`;
            document.getElementsByClassName("timer")[0].innerText=`${hours} : ${mins} : ${secs}`;
            increment();
        }, 10)
    }
}

function addCharSheet() {
    charSheet = document.createElement("div");
    charSheet.innerHTML = charSheetTxt;
    charSheet.classList = "char-sheet inline-block";
    charPanel.appendChild(charSheet);
}
function delCharSheet() {
    if (document.getElementsByClassName("char-sheet").length > 1) {
        charPanel.removeChild(charSelectCheck());
    }
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
    var atkBox = charSelectCheck().getElementsByClassName(e);
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
function charSelectCheck() {
    var checkbox = document.getElementsByClassName("input_on-off");
    for (let i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked == true) {
            return checkbox[i].parentNode;
        }
    }
}

function ready() {
    charName = charSelectCheck().getElementsByClassName("char-name")[0].value;
    charAtk = atkBoxCheck("p-box");
    monAtk = atkBoxCheck("m-box");
}

function normalAtk() {
    ready();
    var critical = chanceCalc(30);
    var log = `${charName}의 `;
    var totalDamage = 0;
    if (critical) {
        log += "크리티컬 공격! 1.5 X ";
    }
    else {
        log += "공격! ";
    }
    for (let i = 0; i < charAtk.length; i++) {
        log += 
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