var time = 0;
var running = false;
var timerid = 0;

var charSheetTxt;
var charSheet;
var charPanel;

var battleLogPanelPanel;

var charName;
var charAtk;
var charHp;
var weapon;
var armor;
var monAtk;
var monHp;
var stun = false;
var scar = false;
var stunCount = 3;


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

function charSelectCheck() {
    var checkbox = document.getElementsByClassName("input_on-off");
    for (let i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked == true) {
            return checkbox[i].parentNode.parentNode;
        }
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
    if (e == "p-box") {
        var atkBox = charSelectCheck().getElementsByClassName(e);
    }
    if (e == "m-box") {
        var atkBox = document.getElementsByClassName(e);
    }
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

function ready() {
    charName = charSelectCheck().getElementsByClassName("char-name")[0].value;
    weapon = charSelectCheck().getElementsByClassName("weapon-bonus")[0];
    weapon = weapon.options[weapon.selectedIndex].value;
    armor = charSelectCheck().getElementsByClassName("armor-bonus")[0];
    armor = armor.options[armor.selectedIndex].value;
    charAtk = atkBoxCheck("p-box");
    charHp = charSelectCheck().getElementsByClassName("char-hp")[0];
    monAtk = atkBoxCheck("m-box");
    monHp = document.getElementsByClassName("monster-hp-input")[0].value;
    battleLogPanel = document.getElementsByClassName("battle-log-panel")[0];
}

function normalAtk(charType) {
    var critical = chanceCalc(30);
    var log;
    var totalDamage;
    if (charType == "player") {
        log = `${charName}의 `;
        totalDamage = charAtk.reduce((a, b) => a + b);
    }
    if (charType == "monster") {
        log = "마물의 ";
        totalDamage = monAtk.reduce((a, b) => a + b);
    }

    if (critical) {
        log += "크리티컬 공격! 1.5 X ";
        totalDamage = totalDamage * 1.5;
    }
    else {
        log += "공격! ";
    }

    if (charType == "player") {
        totalDamage += Number(weapon);
        log += `(${charAtk.join(" + ")}) + ${weapon} = ${totalDamage} 피해를 주었다.<br>`;
        monHp -= totalDamage;
        log += `마물의 남은 HP : ${monHp}`;
    }
    if (charType == "monster") {
        totalDamage += Number(armor);
        log += `(${monAtk.join(" + ")}) - ${armor} = ${totalDamage} 피해를 받었다.`;
        charHp.value -= totalDamage;
        charHp.dataset.label = `500/${charHp.value}`;
    }

    var battleLog = document.createElement("div");
    battleLog.innerHTML = log;
    battleLogPanel.appendChild(battleLog);
}
function suddenAtk() {
    scar = chanceCalc(30);
    var log = charName;
    var totalDamage;
    if (scar || stun) {
        log += "의 기습 성공! ";
        totalDamage = charAtk.reduce((a, b) => a + b) * 3;
        log += `3.0 X (${charAtk.join(" + ")}) + ${weapon} = ${totalDamage} 피해를 주었다.<br>`;
        monHp -= totalDamage;
        log += `마물의 남은 HP : ${monHp}`;
    }
    else { 
        log += "은(는) 기습을 시도했지만 실패했다! "
        totalDamage = monAtk.reduce((a, b) => a + b) * 3;
        log += `3.0 X (${monAtk.join(" + ")}) = ${totalDamage} 피해를 받았다.`;
        charHp.value -= totalDamage;
        charHp.dataset.label = `500/${charHp.value}`;
    }
    var battleLog = document.createElement("div");
    battleLog.innerHTML = log;
    battleLogPanel.appendChild(battleLog);
}
function stunAtk() {
    if (stun) {
        var log = "이미 무력화 상태입니다.";
    }
    else {
        stunCount--;
        if (scar) {
            stun = chanceCalc(30);
        }
        else {
            stun = chanceCalc(5);
        }
        scar = false;
        var log = `${charName}의 무력화`;
        var totalDamage;
        if (stun) {
            log += "는 효과적이다! 마물이 1턴간 공격하지 않습니다.";
        }
        else {
            if (stunCount < 0) {
                log = "더 이상 무력화가 통하지 않는다! ";
            }
            else {
                log += " 실패! ";
            }
            totalDamage = 1.1 * monAtk[0];
            log += `1.1 X ${monAtk[0]} = ${Math.round(totalDamage)} 피해를 받았다.`;
            console.log(charHp.value);
            charHp.value -= Math.round(totalDamage);
            charHp.dataset.label = `500/${charHp.value}`;
        }
    }
    var battleLog = document.createElement("div");
    battleLog.innerHTML = log;
    battleLogPanel.appendChild(battleLog);
}
function healing(healPoint) {
    var log;
    console.log(healPoint);
    console.log(charHp.value);
    charHp.value += Number(healPoint);
    console.log(charHp.value);
    charHp.dataset.label = `500/${charHp.value}`;
}

function playerAction(e) {
    ready();
    switch (e.dataset.key) {
        case "attack":
            normalAtk("player");
            if (!stun) {
                normalAtk("monster");
            }
            break;
        case "sudden":
            suddenAtk();
            break;
        case "stun":
            stunAtk();
            break;
        case "heal":
            healing(e.dataset.value);
            break;
    }
}