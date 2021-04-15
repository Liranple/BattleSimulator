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
var monType;
var stun = false;
var scar = false;
var stunCount = 3;
var stunImmune = 0;
var actionReturn = false;
// monsterDefeat 현재는 사용 안함 추후에 처치 수 필요할 때 사용
var monsterDefeat = 0;

var sheetData
var subData;
var charvalue = [];
var nowParty;

var monsterItem = [];
var dropTable = [];
var item20 = [];
var item40 = [];
var item100 = [];
var item200 = [];
var item400 = [];
var itemOther = [];

function colorChange(obj) {
    if(obj.classList.contains("execution") && obj.selectedIndex > 4) {
        obj.classList.replace = ("execution", "raid");
    }
    else if(obj.classList.contains("raid") && obj.selectedIndex < 5) {
        obj.classList.replace = ("raid", "execution");
    }
}
function allowDrop(ev) {
    ev.preventDefault();
}
function dropRest(ev) {
    ev.preventDefault();
    for (let i = 0; i < selectChar().length; i++) {
        selectChar()[i].className = "char-sheet rest";
    }
}
function dropParty1(ev) {
    ev.preventDefault();
    for (let i = 0; i < selectChar().length; i++) {
        selectChar()[i].className = "char-sheet party1";
    }
}
function dropParty2(ev) {
    ev.preventDefault();
    for (let i = 0; i < selectChar().length; i++) {
        selectChar()[i].className = "char-sheet party2";
    }
}
function dropParty3(ev) {
    ev.preventDefault();
    for (let i = 0; i < selectChar().length; i++) {
        selectChar()[i].className = "char-sheet party3";
    }
}
function allView() {
    for (let i = 0; i < $(".char-sheet").length; i++) {
        $(".char-sheet")[i].classList.remove("hidden");
        $(".input_on-off")[i].checked = false;
    }
}
function restView() {
    for (let i = 0; i < $(".char-sheet").length; i++) {
        if ($(".char-sheet")[i].classList.contains("rest")) {
            $(".char-sheet")[i].classList.remove("hidden");
        }
        else {
            $(".char-sheet")[i].classList.add("hidden");
        }
        $(".input_on-off")[i].checked = false;
    }
}
function party1View() {
    for (let i = 0; i < $(".char-sheet").length; i++) {
        if ($(".char-sheet")[i].classList.contains("party1")) {
            $(".char-sheet")[i].classList.remove("hidden");
        }
        else {
            $(".char-sheet")[i].classList.add("hidden");
        }
        $(".input_on-off")[i].checked = false;
    }
    nowParty = "party1";
}
function party2View() {
    for (let i = 0; i < $(".char-sheet").length; i++) {
        if ($(".char-sheet")[i].classList.contains("party2")) {
            $(".char-sheet")[i].classList.remove("hidden");
        }
        else {
            $(".char-sheet")[i].classList.add("hidden");
        }
        $(".input_on-off")[i].checked = false;
    }
    nowParty = "party2";
}
function party3View() {
    for (let i = 0; i < $(".char-sheet").length; i++) {
        if ($(".char-sheet")[i].classList.contains("party3")) {
            $(".char-sheet")[i].classList.remove("hidden");
        }
        else {
            $(".char-sheet")[i].classList.add("hidden");
        }
        $(".input_on-off")[i].checked = false;
    }
    nowParty = "party3";
}

function dataUpload() {
    swal({
        title: "데이터를 저장합니다",
        text: "※ 기존에 있던 데이터를 덮어씌웁니다 ※",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            charvalue = [];
            for (let i = 0; i < document.getElementsByClassName("char-sheet").length; i++) {
                charvalue.push(objectSave(i));
            }
            $.ajax({
                async: false,        
                type: "POST",
                url: "//artesadmin.dothome.co.kr/create.php",
                data: JSON.stringify(charvalue),
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            });
            swal({
                icon: "success",
                text: "데이터가 저장되었습니다"
            });
        }
    });
}
function dataDownload() {
    swal({
        title: "데이터를 불러옵니다",
        text: "※ 기존에 있던 데이터를 덮어씌웁니다 ※",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                type: "POST",
                async: false,
                url: "//artesadmin.dothome.co.kr/load.php",
                datatype: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    charvalue = JSON.parse(data);
                }
            });
            var cp = $(".char-panel")[0];
            while (cp.hasChildNodes()) {
                cp.removeChild(cp.firstChild);
            }
            for (let i = 0; i < charvalue.length; i++) {
                addCharSheet()
                objectLoad(i);
            }
        }
    });
}
function objectSave(sheetnum) {
    return {
        name: getby("char-name", sheetnum, 0).value,
        death: getby("char-name", sheetnum, 0).disabled,
        atk2: getby("atk-box", sheetnum, 1).checked,
        atk3: getby("atk-box", sheetnum, 2).checked,
        weapon: getby("weapon-bonus", sheetnum, 0).value,
        armor: getby("armor-bonus", sheetnum, 0).value,
        hp: getby("char-hp", sheetnum, 0).value,
        charkey: getby("char-recen-act-txt", sheetnum, 0).dataset.key,
        chartxt: getby("char-recen-act-txt", sheetnum, 0).innerHTML,
        party: $(".char-sheet")[sheetnum].className
    }
}
function objectLoad(sheetnum) {
    getby("char-name", sheetnum, 0).value = charvalue[sheetnum].name;
    getby("char-name", sheetnum, 0).disabled = Number(charvalue[sheetnum].death);
    getby("atk-box", sheetnum, 1).checked = Number(charvalue[sheetnum].atk2);
    getby("atk-box", sheetnum, 2).checked = Number(charvalue[sheetnum].atk3);
    getby("weapon-bonus", sheetnum, 0).value = Number(charvalue[sheetnum].weapon);
    getby("armor-bonus", sheetnum, 0).value = Number(charvalue[sheetnum].armor);
    getby("char-hp", sheetnum, 0).value = Number(charvalue[sheetnum].hp);
    getby("char-hp", sheetnum, 0).dataset.label = `${Number(charvalue[sheetnum].hp)} / 500`;
    getby("char-recen-act-txt", sheetnum, 0).dataset.key = charvalue[sheetnum].charkey;
    getby("char-recen-act-txt", sheetnum, 0).innerHTML = charvalue[sheetnum].chartxt;
    $(".char-sheet")[sheetnum].className = charvalue[sheetnum].party;
}
window.onload = function() {
    charPanel = document.getElementsByClassName("char-panel")[0];
    charSheetTxt = document.getElementsByClassName("char-sheet")[0].innerHTML;
    
    battleLogPanel = document.getElementsByClassName("battle-log-panel")[0];
    startBtn = document.getElementsByClassName("fa-play")[0];
    snackbar = $('#snackbar');
    charSheet = $(".char-sheet")[0].cloneNode();
    createDropTable();
    // dataLoad();
}

function getby(classname, num, int) {
    var panel = document.getElementsByClassName("char-sheet");
    return panel[num].getElementsByClassName(classname)[int];
}
function br() {
    var marginDiv = document.createElement("div");
    marginDiv.innerHTML = "<br>";
    battleLogPanel.appendChild(marginDiv);
}
function turnReset() {
    var chars = $(".char-recen-act-txt");
    for (let i = 0; i < chars.length; i++) {
        var key = JSON.parse(chars[i].dataset.key);
        key["action"] = false;
        chars[i].dataset.key = JSON.stringify(key);
    }
    stun = false;
    stunCount = 3;
    stunImmune = 10;
}
function logOutput(str) {
    var battleLog = document.createElement("div");
    battleLog.innerHTML = str;
    battleLogPanel.appendChild(battleLog);
}

function btnOnOff() {
    var healBtn = document.getElementsByClassName("heal-btn");
    for (let i = 0; i < healBtn.length; i++) {
        if (document.getElementsByClassName("monster-hp")[0].disabled) {
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
    if (!running) {
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
        document.getElementsByClassName("monster-hp")[0].disabled = true;
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
    document.getElementsByClassName("monster-hp")[0].disabled = false;
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
            document.getElementsByClassName("turn-text")[0].innerText=`${turn}`;
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

function selectChar() { 
    var selectChar = [];
    var checkbox = $(".input_on-off");
    for (let i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked == true) {
            selectChar.push(checkbox[i].parentNode.parentNode);
        }
    }
    return selectChar;
}
function addCharSheet() {
    var $div = $(charSheet.outerHTML);
    $div[0].innerHTML = charSheetTxt;
    charPanel.append($div[0]);
}
function delCharSheet() {
    if ($(".char-sheet").length > selectChar().length) {
        for (let i = selectChar().length-1; i >= 0; i--) {
           selectChar()[i].remove();
        }
    }
}


function chanceCalc(persent) {
    var result = false
    var chance = Math.floor(Math.random() * 100);
    if (chance < persent) {
        result = true;
    }
    return result;
}
function atkBoxCheck(e, i = 0) {
    if (e == "p-box") {
        var atkBox = selectChar()[i].getElementsByClassName(e);
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
        var atkChance = Math.floor(Math.random() * 307);
        for (var j = 0; j < chanceTable.length; j++) {
            if (atkChance < chanceTable[j]) {
                damage[i] = 100 - j * 10;
                break;
            }
        }
    }
    return damage;
}
function createDropTable() {
    dropTable = [
        item20 = [
            ["마물의 잔해 1개", 70, 30],
            ["마물의 잔해 2개", 44, 26],
            ["헤진 붕대 (10)", 34, 10],
            ["고급 붕대 (100)", 29, 5],
            ["30 아르", 19, 10],
            ["리브레 포션 (30)", 9, 10],
            ["대용량 리브레 포션 (50)", 4, 5],
            ["보호부적 (0)", 1, 3],
            ["빛바랜 루비", 0, 1]
        ],
        item40 = [
            ["마물의 잔해 1개", 70, 30],
            ["마물의 잔해 2개", 45, 25],
            ["헤진 붕대 (10)", 35, 10],
            ["고급 붕대 (100)", 32, 3],
            ["50 아르", 22, 10],
            ["리브레 포션 (30)", 12, 10],
            ["대용량 리브레 포션 (50)", 8, 4],
            ["보호부적 (0)", 5, 3],
            ["찢어진 일기장 1", 3, 2],
            ["찢어진 일기장 2", 1, 2],
            ["빛바랜 사파이어", 0, 1]
        ],
        item100 = [
            ["마물의 잔해 1개", 70, 30],
            ["마물의 잔해 2개", 50, 20],
            ["굳게 잠긴 상자", 40, 10],
            ["고급 붕대 (100)", 35, 5],
            ["100 아르", 25, 10],
            ["리브레 포션 (30)", 15, 10],
            ["대용량 리브레 포션 (50)", 10, 5],
            ["보호부적 (0)", 7, 3],
            ["업화의 무기(10)", 5, 2],
            ["찢어진 사진 1", 3, 2],
            ["찢어진 사진 2", 1, 2],
            ["빛바랜 에메랄드", 0, 1]
        ],
        item200 = [
            ["마물의 잔해 1개", 70, 30],
            ["마물의 잔해 2개", 48, 22],
            ["굳게 잠긴 상자", 38, 10],
            ["고급 붕대 (100)", 33, 5],
            ["누군가의 주머니", 23, 10],
            ["500 아르", 13, 10],
            ["대용량 리브레 포션 (50)", 8, 5],
            ["보호부적 (0)", 5, 3],
            ["신념의 무기 (20)", 3, 2],
            ["깨어난 업화의 무기 (20)", 2, 1],
            ["빛바랜 자수정", 1, 1],
            ["빛바랜 다이아몬드", 0, 1]
        ],
        item400 = [
            ["마물의 잔해 1개", 75, 25],
            ["마물의 잔해 2개", 50, 25],
            ["굳게 잠긴 상자", 40, 10],
            ["고급 붕대 (100)", 35, 5],
            ["누군가의 주머니", 25, 10],
            ["1000 아르", 15, 10],
            ["대용량 리브레 포션 (50)", 10, 5],
            ["보호부적 (0)", 7, 3],
            ["업화의 무기 (10)", 5, 2]
            ["신념의 무기 (20)", 3, 2],
            ["깨어난 신념의 무기 (30)", 2, 1],
            ["빛바랜 오팔", 1, 1],
            ["빛바랜 다이아몬드", 0, 1]
        ],
        itemOther = [
            ["타락한 수호자의 심장", 95, 5]
        ]
    ]
}
function monsterItemDrop() {
    var monHpList = $(".monster-hp")[0];
    for (let i = 0; i < dropTable.length; i++) {
        if (monHpList.selectedIndex == i) {
            monsterItem = dropTable[i];
            break;
        }
        else monsterItem = dropTable[5];
    }

    for (let i = 0; i < $(`.${nowParty}`).length; i++) { 
        if (monsterItem.length != 0) {
            var chance = Math.floor(Math.random() * 100);
            for (let j = 0; j < monsterItem.length; j++) {
                if (chance > monsterItem[j][1]) {
                    var name = $(`.${nowParty}`)[i].getElementsByClassName("char-name")[0].value;
                    if (monsterItem[j][2] <= 3) {
                        logOutput(`정화 성공! ... 아니, 이것은!! ${name}은/는 ${monsterItem[j][0]} 을/를 얻었다!`);
                    }
                    else {
                        if (monsterItem.length > 1) {
                            logOutput(`정화 성공! ${name}은/는 ${monsterItem[j][0]} 을/를 얻었다.`);
                        }
                    }
                    br();
                    break;
                }
            }
        }
    }
}
function actionReady(i) {
    if (stunImmune == 0) stun = false;
    charName = selectChar()[i].getElementsByClassName("char-name")[0];
    charAtk = atkBoxCheck("p-box", i);
    charHp = selectChar()[i].getElementsByClassName("char-hp")[0];
    charData = selectChar()[i].getElementsByClassName("char-recen-act-txt")[0];
    weapon = selectChar()[i].getElementsByClassName("weapon-bonus")[0];
    weapon = weapon.options[weapon.selectedIndex].value;
    if (weapon == "") waepon = 0;
    armor = selectChar()[i].getElementsByClassName("armor-bonus")[0];
    armor = armor.options[armor.selectedIndex].value;
    if (armor == "") armor = 0;
    monAtk = atkBoxCheck("m-box");
    monHp = $(".monster-hp")[0];
    monType = monHp.options[monHp.selectedIndex].className;
    monHp = monHp.options[monHp.selectedIndex];
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
    if (stun) stunImmune -= 1;
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
    if (monHp.value <= 0) monHp.value = 0;
    var log = `마물의 남은 HP : ${monHp.value}`;
    logOutput(log);
}
function suddenAtk() {
    scar = chanceCalc(30);
    var totalDamage;
    if (scar || stun) {
        if (stun) stunImmune -= 1;
        var log = `마물이 방심한 틈을 타 ${charName.value}의 기습 공격! `;
        totalDamage = charAtk.reduce((a, b) => a + b) * 3;
        log += `3.0 X (${charAtk.join(" + ")}) + ${weapon} = ${totalDamage} 피해를 주었다`;
        logOutput(log);
        logOutput("마물이 당황한 것 같다!");
        monHp.value -= totalDamage;
        if (monHp.value <= 0) monHp.value = 0;
        var log = `마물의 남은 HP : ${monHp.value}`;
        logOutput(log);
    }
    else { 
        var log = `${charName.value}은/는/ 파고 들었지만 마물에게 간파 당했다! `;
        totalDamage = monAtk.reduce((a, b) => a + b) * 3;
        log += `3.0 X (${monAtk.join(" + ")}) = ${totalDamage} 역습으로 큰 피해를 받았다.`;
        charHp.value -= totalDamage;
        logOutput(log);
    }
}
function stunAtk() {
    if (stun) {
        var log = "이미 무력화가 적용된 턴 입니다. 무효. 로그 재사용 불가.";
        actionReturn = true;
    }
    else {
        stunCount--;
        if (scar) {
            stun = chanceCalc(50);
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
function battleEnd() {
    monHp.value = monHp.innerHTML;
    time = 0;
    running = false;
    battleStart = false;
    clearTimeout(timerid);
    document.getElementsByClassName("timer")[0].innerText = "00 : 00 : 00";
    var startPause = document.getElementsByClassName("timer-start-pause")[0];
    startPause.classList.replace("fa-pause", "fa-play");
    document.getElementsByClassName("monster-hp")[0].disabled = false;
    turnReset();
    var atkBtn = document.getElementsByClassName("atk-btn");
    logOutput(`전투 대기 중...`);
    for (let i = 0; i < atkBtn.length; i++) {
        if (!running) {
            atkBtn[i].disabled = true;
        }
        else {
            atkBtn[i].disabled = false;
        }
    }
}
function battleResult() {
    charHp.dataset.label = `${charHp.value} / 500`;
    if (battleStart) {
        if (charHp.value <= 0) {
            charName.disabled = true;
            charHp.value = 0;
            var log = `${charName.value} 사망.`;
            br();
            logOutput(log);
        }
        var allAtk = [];
        for (let i = 0; i < $(`.${nowParty}`).length; i++) {
            var cd = $(`.${nowParty}`)[i].getElementsByClassName("char-recen-act-txt")[0];
            var key = JSON.parse(cd.dataset.key);
            allAtk.push(key["action"]);
        }
        if (allAtk.every(function(subject) {
            return subject == true;
        })) {
            var run = true;
        }
        if (monHp.value > 0 && run && monType == "execution") {
            var failTxt = [
                "전력을 다해 공격했지만 마물을 놓쳐버렸다... 처형 실패.",
                "마물이 가까스로 공격을 피하더니 도망쳐버렸다! 처형 실패.",
                "이런, 공격이 얕았나. 마무리를 하지 못하고 마물을 놓쳐버렸다. 처형 실패."
            ];
            var ran = Math.round(Math.random() * 2);
            br();
            logOutput(failTxt[ran]);
            br();
            battleEnd();
        }
        if (monHp.value == 0) {
            log = `${charName.value}의 마지막 일격으로 마물이 쓰러졌다.`;
            logOutput(log);
            br();
            monsterItemDrop();
            monsterDefeat += 1;
            battleEnd();
        }
        br();
    }
}
function actionWork(action, attack, sudden, stun, heal) {
    switch (action) {
        case "attack":
            if (running) attack();
            break;
        case "sudden":
            if (running) sudden();
            break;
        case "stun":
            if (running) stun();
            break;
        case "heal":
            heal();
            break;
    }
}
function recentlyAction(status) {
    var key = JSON.parse(charData.dataset.key);
    if (running || status.dataset.key == "heal") {
        key[status.dataset.key] += 1;
        if (actionReturn == false && status.dataset.key != "heal") {
            key["action"] = true;
            actionReturn == true;
        }
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
        logOutput(`${charName.value}의 HP가 ${status.dataset.value}만큼 회복되었다.`);
        br();
    });
    if (postfix != "") {
        charData.innerHTML = `${postfix} (${key[status.dataset.key]})`;
    }
}
function playerAction(e) {
    if (selectChar().length == 0) swal("Caution!", "기사를 선택해주세요");
    for (let i = 0; i < selectChar().length; i++) {
        actionReady(i)
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
        }
        else if (charHp.value == 0) {
            swal("Caution!", `${charName.value}은/는 사망하여 더 이상 행동할 수 없습니다.`);
        }
        else {
            logOutput(`${charName.value}은/는 이번 턴에 더 이상 행동할 수 없다. 무효. 로그 재사용 불가.`);
            br();
        }
        battleLogPanel.scrollTop = battleLogPanel.scrollHeight;
    }
}
