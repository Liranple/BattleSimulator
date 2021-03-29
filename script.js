var battleStart = false;
var time = 0;
var subTime = 0;
var running = false;
var timerid = 0;

var charSheetTxt;
var charSheet;
var charPanel;

var battleLogPanel;

var charName;
var charAtk;
var charHp;
var charData;
var weapon;
var armor;
var monAtk;
var monHp;
var stun = false;
var scar = false;
var stunCount = 3;
var stunImmune = 0;
var actionReturn = false;
var monsterDefeat = 0;

var sheetData
var subData;
var charvalue = [];


function getby(classname, num, int) {
    var panel = document.getElementsByClassName("char-sheet");
    return panel[num].getElementsByClassName(classname)[int];
}

function dataSave() {
    charvalue = [];
    for (let i = 0; i < document.getElementsByClassName("char-sheet").length; i++) {
        charvalue.push(createObject(i));
    }
    sheetData = JSON.stringify(charvalue);
    localStorage.setItem("character", sheetData);
}
function dataLoad() {
    charvalue = JSON.parse(localStorage.getItem("character"));
    if (charvalue != null) {
        for (let i = 0; i < charvalue.length; i++) {
            if (i != 0) {
                addCharSheet()
            }
            loadObject(i);
        }
    }
    fps();
}
function fps() {
    setTimeout(function() {
        dataSave();
        fps();
    }, 100)
}

function loadObject(sheetnum) {
    getby("char-name", sheetnum, 0).value = charvalue[sheetnum].name;
    getby("atk-box", sheetnum, 0).checked = charvalue[sheetnum].atk1;
    getby("atk-box", sheetnum, 1).checked = charvalue[sheetnum].atk2;
    getby("atk-box", sheetnum, 2).checked = charvalue[sheetnum].atk3;
    getby("weapon-bonus", sheetnum, 0).value = charvalue[sheetnum].weapon;
    getby("armor-bonus", sheetnum, 0).value = charvalue[sheetnum].armor;
    getby("char-hp", sheetnum, 0).value = charvalue[sheetnum].hp;
    getby("char-hp", sheetnum, 0).dataset.label = charvalue[sheetnum].hptxt;
    getby("char-recen-act-txt", sheetnum, 0).dataset.key = charvalue[sheetnum].charkey;
    getby("char-recen-act-txt", sheetnum, 0).value = charvalue[sheetnum].chartxt;
}
function createObject(sheetnum) {
    return { name: getby("char-name", sheetnum, 0).value,
    atk1: getby("atk-box", sheetnum, 0).checked,
    atk2: getby("atk-box", sheetnum, 1).checked,
    atk3: getby("atk-box", sheetnum, 2).checked,
    weapon: getby("weapon-bonus", sheetnum, 0).value,
    armor: getby("armor-bonus", sheetnum, 0).value,
    hp: getby("char-hp", sheetnum, 0).value,
    hptxt: getby("char-hp", sheetnum, 0).dataset.label,
    charkey: getby("char-recen-act-txt", sheetnum, 0).dataset.key,
    chartxt: getby("char-recen-act-txt", sheetnum, 0).value }
}
window.onload = function() {
    charPanel = document.getElementsByClassName("char-panel")[0];
    charSheetTxt = document.getElementsByClassName("char-sheet")[0].innerHTML;
    
    battleLogPanel = document.getElementsByClassName("battle-log-panel")[0];
    startBtn = document.getElementsByClassName("fa-play")[0];
    dataLoad();
}

function br() {
    var marginDiv = document.createElement("div");
    marginDiv.innerHTML = "<br>";
    battleLogPanel.appendChild(marginDiv);
}
function turnReset() {
    if (charData != undefined) {
        var chars = document.getElementsByClassName("char-recen-act-txt");
        for (let i = 0; i < chars.length; i++) {
            var key = JSON.parse(chars[i].dataset.key);
            key["action"] = false;
            chars[i].dataset.key = JSON.stringify(key);
        }
        stun = false;
        stunCount = 3;
        stunImmune = 10;
    }
}
function logOutput(str, cl) {
    var battleLog = document.createElement("div");
    battleLog.className = cl;
    battleLog.innerHTML = str;
    battleLogPanel.appendChild(battleLog);
}


function battleReady() {
    monHp = document.getElementsByClassName("monster-hp-input")[0].value;
    if (monHp > 0) {
        return true;
    }
    else {
        swal("Caution!", "마물의 HP를 올바른 값으로 설정해주세요");
    }
}
function btnOnOff() {
    var healBtn = document.getElementsByClassName("heal-btn");
    for (let i = 0; i < healBtn.length; i++) {
        if (document.getElementsByClassName("monster-hp-input")[0].disabled) {
            healBtn[i].disabled = true;
        }
        else {
            healBtn[i].disabled = false;
        }
    }
    var atkBtn = document.getElementsByClassName("atk-btn");
    for (let i = 0; i < atkBtn.length; i++) {
        if (!running) {
            atkBtn[i].disabled = true;
        }
        else {
            atkBtn[i].disabled = false;
        }
    }
}
function battleStartPause(e) {
    var isReady = battleReady();
    if (!running && isReady) {
        running = true;
        if (!battleStart) {
            battleStart = true;
            logOutput("전투 시작");
            br();
            document.getElementsByClassName("turn-text")[0].innerText = "1";
        }
        else {
            logOutput("전투 재개");
            br();
        }
        document.getElementsByClassName("monster-hp-input")[0].disabled = true;
        increment();
        e.classList.replace("fa-play", "fa-pause");
    }
    else if (running) {
        running = false;
        clearTimeout(timerid);
        var timer = document.getElementsByClassName("timer")[0].innerText;
        logOutput(`전투 일시정지 중... [${timer}]`);
        br();
        e.classList.replace("fa-pause", "fa-play");
    }
    btnOnOff();
}
function battleReset() {
    running = false;
    battleStart = false;
    clearTimeout(timerid);
    turnReset();
    time = 0;
    document.getElementsByClassName("timer")[0].innerText = "00 : 00 : 00";
    document.getElementsByClassName("timer-start-pause")[0].classList.replace("fa-pause", "fa-play");
    document.getElementsByClassName("turn-text")[0].innerText = "0";
    document.getElementsByClassName("monster-hp-input")[0].disabled = false;
    document.getElementsByClassName("monster-hp-input")[0].value = "";
    btnOnOff();
    battleLogPanel.innerHTML = " ";
}
function increment() {
    if (running) {
        timerid = setTimeout(function() {
            time++;
            subTime++;
            var hours = Math.floor(time / 36000);
            var subHours = Math.floor(subTime / 36000);
            var mins = Math.floor(time % 36000 / 600);
            var subMins = Math.floor(subTime % 36000 / 600);
            var secs = Math.floor(time / 10 % 3600 % 60);
            var turn = Math.floor((time / 9000) + 1);
            var subTurn = Math.floor((subTime / 9000) + 1);
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (mins < 10) {
                mins = "0" + mins;
            }
            if (secs < 10) {
                secs = "0" + secs;
            }
            document.getElementsByClassName("turn-text")[0].innerText=`${turn + monsterDefeat}`;
            if (subTime >= 9000 && subTime % 9000 == 0) {
                turnReset();
                var log = "";
                if (subTime >= 36000) {
                    log = `${subHours}시간 `;
                }
                log += `${subMins}분 경과. ${subTurn}턴 입니다`;
                logOutput(log);
                br();
            }
            document.getElementsByClassName("timer")[0].innerText=`${hours} : ${mins} : ${secs}`;
            increment();
        }, 100)
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
    if (e == "p-box") {
        var atkBox = charSelectCheck().getElementsByClassName(e);
    }
    if (e == "m-box") {
        var atkBox = document.getElementsByClassName(e);
    }
    var atkCount = 0;
    var chanceTable = new Array(2, 7, 17, 37, 67, 107, 157, 217, 267, 307);

    for (let i = 0; i < atkBox.length; i++) {
        if (atkBox[i].checked) atkCount++
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
function actionReady() {
    if (charSelectCheck() == undefined) swal("Caution!", "기사를 선택해주세요");
    if (stunImmune == 0) stun = false;
    charName = charSelectCheck().getElementsByClassName("char-name")[0];
    charAtk = atkBoxCheck("p-box");
    charHp = charSelectCheck().getElementsByClassName("char-hp")[0];
    charData = charSelectCheck().getElementsByClassName("char-recen-act-txt")[0];
    weapon = charSelectCheck().getElementsByClassName("weapon-bonus")[0];
    weapon = weapon.options[weapon.selectedIndex].value;
    if (weapon == "") waepon = 0;
    armor = charSelectCheck().getElementsByClassName("armor-bonus")[0];
    armor = armor.options[armor.selectedIndex].value;
    if (armor == "") armor = 0;
    monAtk = atkBoxCheck("m-box");
    monHp = document.getElementsByClassName("monster-hp-input")[0];
}

function monsterAtk() {
    var critical = chanceCalc(30);
    var log;
    var totalDamage = monAtk.reduce((a, b) => a + b);

    if (critical) {
        log = `마물이 회심의 일격을 가했다! 1.5 X `;
        totalDamage = totalDamage * 1.5;
    }
    else {
        log = `마물의 공격을 받았다! `;
    }
    totalDamage -= armor;
    if (totalDamage <= 0) {
        totalDamage = 0;
    }
    charHp.value -= totalDamage;
    log += `(${monAtk.join(" + ")}) - ${armor} = ${totalDamage}`;
    logOutput(log);
}
function normalAtk() {
    if (stun) {
        stunImmune -= 1;
    }
    var critical = chanceCalc(30);
    var log;
    var totalDamage = charAtk.reduce((a, b) => a + b);

    if (critical) {
        log = `크리티컬! ${charName.value}의 강력한 일격이다! 1.5 X `;
        totalDamage = totalDamage * 1.5;
    }
    else {
        log = `${charName.value}의 공격! 마물에게 `;
    }
    totalDamage += Number(weapon);
    monHp.value -= totalDamage;
    log += `(${charAtk.join(" + ")}) + ${weapon} = ${totalDamage} 피해를 주었다.`;
    logOutput(log);
    if (monHp.value <= 0) { 
        monHp.value = 0;
    }
    var log = `마물의 남은 HP : ${monHp.value}`;
    logOutput(log);
}
function suddenAtk() {
    scar = chanceCalc(30);
    var totalDamage;
    if (scar || stun) {
        if (stun) {
            stunImmune -= 1;
        }
        var log = `마물이 방심한 틈을 타 ${charName.value}의 기습 공격! `;
        totalDamage = charAtk.reduce((a, b) => a + b) * 3;
        log += `3.0 X (${charAtk.join(" + ")}) + ${weapon} = ${totalDamage} 피해를 주었다`;
        logOutput(log);
        monHp.value -= totalDamage;
        if (monHp.value <= 0) { 
            monHp.value = 0;
        }
        var log = `마물의 남은 HP : ${monHp.value}`;
        logOutput(log);
    }
    else { 
        var log = `${charName.value}은(는) 파고 들었지만 마물에게 간파 당했다! `;
        totalDamage = monAtk.reduce((a, b) => a + b) * 3;
        log += `3.0 X (${monAtk.join(" + ")}) = ${totalDamage} 역습으로 큰 피해를 받았다`;
        charHp.value -= totalDamage;
        logOutput(log);
    }
}
function stunAtk() {
    if (stun) {
        var log = "이미 무력화가 적용된 턴 입니다. 무효. 로그 재사용 불가";
        actionReturn = true;
    }
    else {
        stunCount--;
        if (scar) {
            stun = chanceCalc(30);
            var log = `당황한 마물에게 ${charName.value}이(가) 무력화를 시도 한다...! `;
        }
        else {
            stun = chanceCalc(5);
            var log = `${charName.value}의 무력화! 과연? `;
        }
        scar = false;
       
        var totalDamage;
        if (stun) {
            stunImmune = 10;
            log += "성공!";
            logOutput(log);
            log = "마물이 다음 턴 까지 반격을 하지 않습니다.";
        }
        else {
            if (stunCount < 0) {
                log = "이번 전투에서는 더 이상 무력화를 시도할 수 없다.";
                logOutput(log);
            }
            else {
                log += "실패!";
                logOutput(log);
            }
            totalDamage = 1.1 * monAtk[0];
            log = `1.1 X ${monAtk[0]} = ${Math.round(totalDamage)} 피해를 받았다.`;
            charHp.value -= Math.round(totalDamage);
        }
    }
    logOutput(log);
}
function healing(healPoint) {
    charHp.value += Number(healPoint);
}
function battleResult() {
    charHp.dataset.label = `${charHp.value} / 500`;
    if (battleStart) {
        if (monHp.value == 0) {
            log = `${charName.value}의 마지막 일격으로 마물이 쓰러졌다.`;
            logOutput(log);
            br();
            turnReset();
            running = false;
            battleStart = false;
            monsterDefeat += 1;
            time = 0;
            clearTimeout(timerid);
            document.getElementsByClassName("timer")[0].innerText = "00 : 00 : 00";
            var startPause = document.getElementsByClassName("timer-start-pause")[0];
            startPause.classList.replace("fa-pause", "fa-play");
            document.getElementsByClassName("monster-hp-input")[0].disabled = false;
            document.getElementsByClassName("monster-hp-input")[0].value = "";
            logOutput(`전투 대기 중...`);
            var atkBtn = document.getElementsByClassName("atk-btn");
            for (let i = 0; i < atkBtn.length; i++) {
                if (!running) {
                    atkBtn[i].disabled = true;
                }
                else {
                    atkBtn[i].disabled = false;
                }
            }
        }
        if (charHp.value <= 0) {
            charName.disabled = true;
            charHp.value = 0;
            var log = `${charName.value} 사망`;
            logOutput(log);
        }
    }
}
function actionWork(action, attack, sudden, stun, heal) {
    switch (action) {
        case "attack":
            attack();
            break;
        case "sudden":
            sudden();
            break;
        case "stun":
            stun();
            break;
        case "heal":
            heal();
            break;
    }
}
function recentlyAction(status) {
    var key = JSON.parse(charData.dataset.key);
    key[status.dataset.key] += 1;
    if (actionReturn == false) {
        key["action"] = true;
        actionReturn == true;
    }
    charData.dataset.key = JSON.stringify(key);

    var postfix = "";
    actionWork(status.dataset.key, function() {
        postfix = "일반 공격 시도";
    }, function() {
        postfix = "기습 공격 시도";
    }, function() {
        postfix = "무력화 시도";
    }, function() {
        postfix = `HP ${status.dataset.value}회복`;
        logOutput(`${charName.value}의 HP가 ${status.dataset.value}만큼 회복되었다`);
    });
    charData.innerHTML = `${postfix} (${key[status.dataset.key]})`;
}
function playerAction(e) {
    actionReady()
    var key = JSON.parse(charData.dataset.key);
    if (!key["action"] && charHp.value > 0) {
        actionWork(e.dataset.key, function() {
            normalAtk();
            if (!stun && monHp.value > 0) {
                monsterAtk();
            }
        }, function() {
            suddenAtk();
        }, function() {
            stunAtk();
        }, function() {
            healing(e.dataset.value);
        });
        recentlyAction(e);
        battleResult();
        br();
    }
    else if (charHp.value == 0) {
        swal("Caution!", `${charName.value}은(는) 사망하여 더 이상 행동할 수 없습니다`);
    }
    else {
        logOutput(`${charName.value}은(는) 이번 턴에 더 이상 행동할 수 없다. 무효. 로그 재사용 불가`);
        br();
    }
    battleLogPanel.scrollTop = battleLogPanel.scrollHeight;
}