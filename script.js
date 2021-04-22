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
var panic = false;
var suddenCount = 5;
var stunCount = 3;
var stunImmune = 0;
var stunAble = true;
// monsterDefeat 현재는 사용 안함 추후에 처치 수 필요할 때 사용
var monsterDefeat = 0;

var sheetData
var subData;
var charvalue = [];
var nowParty = "rest";

var monsterItem = [];
var dropTable = [];
var item20 = [];
var item40 = [];
var item100 = [];
var item200 = [];
var item400 = [];
var itemOther = [];

var dragged;

document.addEventListener("dragstart", function(event) {
    dragged = event.target;
}, false);
document.addEventListener("dragenter", function(event) {
    if (event.target.classList[1] == "drag") {
        event.target.style.width = "120px";
        event.target.style.transition = "all .2s";
    }
}, false);
document.addEventListener("dragleave", function(event) {
    if (event.target.classList[1] == "drag") {
      event.target.style.width = "";
    }
}, false);
document.addEventListener("dragover", function(event) {
    event.preventDefault();
}, false);
document.addEventListener("drop", function(event) {
    event.preventDefault();
    event.target.style.width = "";
    if (event.target.classList[1] == "drag") {
        for (let i = 0; i < selectChar().length; i++) {
            selectChar()[i].className = `char-sheet ${event.target.classList[0]}`;
        }
    }

    var eTarget;
    if (event.target.classList[0] == "char-sheet") eTarget = event.target;
    if (event.target.parentNode.classList[0] == "char-sheet") eTarget = event.target.parentNode;
    if (event.target.parentNode.parentNode.classList[0] == "char-sheet") eTarget = event.target.parentNode.parentNode;

    if (eTarget != undefined) {
        for (let i = 0; i < $(".char-name").length; i++) {
            if ($(".char-name")[i].value == dragged.children[1].value) var dragIndex = i;
            if ($(".char-name")[i].value == eTarget.children[1].value) var targetIndex = i;
        }
        eTarget.before(dragged);
    if (dragIndex > targetIndex) $(".char-sheet")[dragIndex].after(eTarget);
    else if (dragIndex < targetIndex) $(".char-sheet")[dragIndex].before(eTarget);
    }
}, false);

function sortObj(obj) {
    var sortObjs = $(".sort-panel").children();
    if (obj.classList[1] == undefined || obj.classList.contains("sort-DESC")) {
        for (let i = 1; i < sortObjs.length; i++) {
            if (sortObjs[i].classList.contains("sort-ASC") || sortObjs[i].classList.contains("sort-DESC")) {
                sortObjs[i].classList.remove("sort-ASC");
                sortObjs[i].classList.remove("sort-DESC");
            }
        }
        obj.classList.add("sort-ASC");
    }
    else if (obj.classList.contains("sort-ASC")) {
        for (let i = 1; i < sortObjs.length; i++) {
            if (sortObjs[i].classList.contains("sort-ASC") || sortObjs[i].classList.contains("sort-DESC")) {
                sortObjs[i].classList.remove("sort-ASC");
                sortObjs[i].classList.remove("sort-DESC");
            }
        }
        obj.classList.add("sort-DESC");
    }
    sortContent(obj, obj.classList[1]);
}
function sortContent(obj, type) {
    var sortType = obj.classList[0];
    var items = $(".char-sheet");
    if (sortType == "sort-name") {
        items.sort(function(a, b) {
            if (type == "sort-ASC") {
                return a.children[1].value == b.children[1].value
                ? 0 : (a.children[1].value > b.children[1].value
                ? 1 : -1);
            }
            if (type == "sort-DESC") {
                return a.children[1].value == b.children[1].value
                ? 0 : (a.children[1].value < b.children[1].value
                ? 1 : -1);
            }
        });
    }
    if (sortType == "sort-dice") {
        items.sort(function(a, b) {
            var aa = a.children[2].children[0].checked
            + a.children[3].children[0].checked
            + a.children[4].children[0].checked;
            var bb = b.children[2].children[0].checked
            + b.children[3].children[0].checked
            + b.children[4].children[0].checked;
            if (type == "sort-ASC") return aa == bb ? 0 : (aa < bb ? 1 : -1);
            if (type == "sort-DESC") return aa == bb ? 0 : (aa > bb ? 1 : -1);
        });
    }
    if (sortType == "sort-weapon") {
        items.sort(function(a, b) {
            if (type == "sort-ASC") {
                return a.children[5].value == b.children[5].value
                ? 0 : (a.children[5].value < b.children[5].value
                ? 1 : -1);
            }
            if (type == "sort-DESC") {
                return a.children[5].value == b.children[5].value
                ? 0 : (a.children[5].value > b.children[5].value
                ? 1 : -1);
            }
        });
    }
    if (sortType == "sort-armor") {
        items.sort(function(a, b) {
            if (type == "sort-ASC") {
                return a.children[6].value == b.children[6].value
                ? 0 : (a.children[6].value < b.children[6].value
                ? 1 : -1);
            }
            if (type == "sort-DESC") {
                return a.children[6].value == b.children[6].value
                ? 0 : (a.children[6].value > b.children[6].value
                ? 1 : -1);
            }
        });
    }
    if (sortType == "sort-hp") {
        items.sort(function(a, b) {
            if (type == "sort-ASC") {
                return a.children[7].value == b.children[7].value
                ? 0 : (a.children[7].value < b.children[7].value
                ? 1 : -1);
            }
            if (type == "sort-DESC") {
                return a.children[7].value == b.children[7].value
                ? 0 : (a.children[7].value > b.children[7].value
                ? 1 : -1);
            }
        });
    }
    $(".char-panel").children().remove();
    for (let i = 0; i < items.length; i++) {
        $(".char-panel").append(items[i]);
    }
}

function createParty() {
    var partys = [];
    for (let i = 1; i < 9; i++) {
        partys.push($(`<button class="party${i} drag ml5" onclick="partyView(this)"></button>`));
    }
    for (let i = 0; i < partys.length; i++) {
        partys[i][0].innerHTML = `파티 ${i+1}`; 
        $(".group-panel")[0].append(partys[i][0]);
    }
}
function partyView(obj) {
    for (let i = 0; i < $(".char-sheet").length; i++) {
        if ($(".char-sheet")[i].classList.contains(obj.classList[0])) {
            $(".char-sheet")[i].classList.remove("hidden");
        }
        else {
            $(".char-sheet")[i].classList.add("hidden");
        }
        $(".input_on-off")[i].checked = false;
    }
    for (let i = 0; i < $(".drag").length; i++) {
        $(".drag")[i].style.opacity = "";
    }
    obj.style.opacity = 1;
    nowParty = obj.classList[0];
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
    charSheet = $(".char-sheet")[0].cloneNode();
    $(".drag")[0].style.opacity = 1;
    createDropTable();
    createParty();
    // dataLoad();
}

function pp(str, particle) {
    var strGA = 44032; //가
    var strHI = 55203; //힣
   
    var lastStrCode = str.charCodeAt(str.length-1);
    var prop = true;
    var msg;
   
    for (let i = 2; i < str.length; i++) {
        if (lastStrCode < strGA || lastStrCode > strHI) {
            lastStrCode = str.charCodeAt(str.length-i);
            if (i+1 == str.length) return str; //한글이 없음
        }
        else {
            break;
        }
    }
   
    if (( lastStrCode - strGA ) % 28 == 0) prop = false;
    if (prop) {
        if (particle == "은는") msg = str+'은';
        if (particle == "을를") msg = str+' 을';
    }
    else {
        if (particle == "은는") msg = str+'는';
        if (particle == "을를") msg = str+' 를';
    }
    return msg;
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
        $(".input_on-off")[i].disabled = false;
        var key = JSON.parse(chars[i].dataset.key);
        key["action"] = false;
        chars[i].dataset.key = JSON.stringify(key);
    }
    stun = false;
    stunImmune = 0;
    stunAble = true;
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
function monTypeCheck() {
    var monType = $(".monster-hp")[0].options[$(".monster-hp")[0].selectedIndex].className;
    if (monType == "execution") $(".type_on-off")[0].checked = true;
    if (monType == "raid") $(".type_on-off")[0].checked = false;
}

function battleStartPause(e) {
    if (!running) {
        running = true;
        if (!battleStart) {
            battleStart = true;
            logOutput("전투 시작");
            br();
            $(".turn-text")[0].innerText = "1";
            monHp = $(".monster-hp")[0];
            monHp = monHp.options[monHp.selectedIndex];
        }
        else {
            logOutput("전투 재개");
            br();
        }
        $(".monster-hp")[0].disabled = true;
        increment();
        e.classList.replace("fa-play", "fa-pause");
    }
    else if (running) {
        running = false;
        clearTimeout(timerid);
        logOutput(`전투 일시정지 중... [${$(".timer")[0].innerText}]`);
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
    stunCount = 3;
    suddenCount = 5;
    time = 0;
    document.getElementsByClassName("timer")[0].innerText = "00 : 00 : 00";
    document.getElementsByClassName("timer-start-pause")[0].classList.replace("fa-pause", "fa-play");
    document.getElementsByClassName("turn-text")[0].innerText = "0";
    document.getElementsByClassName("monster-hp")[0].disabled = false;
    btnOnOff();
    battleLogPanel.innerHTML = " ";
    monHp.value = monHp.innerHTML;
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
            $(".turn-text")[0].innerText=`${turn}`;
            if (subTime >= 9000 && subTime % 9000 == 0) {
                var log = "";
                if (subTime >= 36000) {
                    log = `${subHours}시간 `;
                }
                log += `${subMins}분 경과. ${subTurn}턴 입니다.`;
                logOutput(log);
                br();
                if (stun && stunCount == 0) logOutput("마물은 매서운 기운을 내뿜으며 몸의 감각을 극대화 합니다.");
                else if (stun) logOutput("시간이 지나 마물이 다시 힘을 되찾은 것 같다.");
                turnReset();
            }
            $(".timer")[0].innerText=`${hours} : ${mins} : ${secs}`;
            increment();
        }, 99)
    }
}

function allCharSel() {
    var charCheck = [];
    for (let i = 0; i < $(".char-sheet").length; i++) {
        for (let j = 0; j < $(".input_on-off").length; j++) {
            if ($(".input_on-off")[j].disabled == false) {
                charCheck.push($(".input_on-off")[j].checked);
            }
        }
        if(charCheck.every(function(check) {
            return check == true;
        })) {
            var allCheck = true;
        }
        if(allCheck) {
            $(".char-sheet")[i].getElementsByClassName("input_on-off")[0].checked = false;
        }
        else if(!$(".char-sheet")[i].classList.contains("hidden")) {
            if ($(".input_on-off")[i].disabled == false) {
                $(".char-sheet")[i].getElementsByClassName("input_on-off")[0].checked = true;
            }
        }
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
function charNowHp (damage) {
    charHp.value -= damage;
    logOutput(`${charName.value}의 남은 HP : ${charHp.value}`)
}
function monNowHp (damage) {
    monHp.value -= damage;
    if (monHp.value <= 0) monHp.value = 0;
    logOutput(`마물의 남은 HP : ${monHp.value}`);
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

    for (let i = 0; i < $(`.char-panel>.${nowParty}`).length; i++) { 
        if (monsterItem.length != 0) {
            var chance = Math.floor(Math.random() * 100);
            for (let j = 0; j < monsterItem.length; j++) {
                if (chance >= monsterItem[j][1]) {
                    var name = $(`.char-panel>.${nowParty}`)[i].getElementsByClassName("char-name")[0].value;
                    if (monsterItem[j][2] <= 3) {
                        logOutput(`정화 성공! ... 아니, 이것은!! ${pp(name, "은는")} ${pp(monsterItem[j][0], "을를")} 얻었다!`);
                        br();
                    }
                    else {
                        if (monsterItem.length >= 1) {
                            logOutput(`정화 성공! ${pp(name, "은는")} ${pp(monsterItem[j][0], "을를")} 얻었다.`);
                            br();
                        }
                    }
                    break;
                }
            }
        }
    }
}
function actionReady(i) {
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
    monHp = monHp.options[monHp.selectedIndex];
}
function monsterAtk() {
    var critical = chanceCalc(30);
    var totalDamage = monAtk.reduce((a, b) => a + b);

    if (critical) {
        var log = `마물이 회심의 일격을 가했다! 1.5 X `;
        totalDamage = totalDamage * 1.5;
    }
    else {
        var log = `마물의 공격을 받았다! `;
    }
    totalDamage -= armor;
    if (totalDamage < 0) totalDamage = 0;
    log += `(${monAtk.join(" + ")}) - ${armor} = ${totalDamage}`;
    logOutput(log);
    charNowHp(totalDamage);
}
function normalAtk() {
    if (stun) stunImmune -= 1;
    var critical = chanceCalc(30);
    var totalDamage = charAtk.reduce((a, b) => a + b);

    if (critical) {
        var log = `크리티컬! ${charName.value}의 강력한 일격이다! 1.5 X `;
        totalDamage = totalDamage * 1.5;
    }
    else {
        var log = `${charName.value}의 공격! 마물에게 `;
    }
    totalDamage += Number(weapon);
    log += `(${charAtk.join(" + ")}) + ${weapon} = ${totalDamage} 피해를 주었다.`;
    logOutput(log);
    monNowHp(totalDamage);
}
function suddenAtk() {
    panic = chanceCalc(30);
    var charDamage = charAtk.reduce((a, b) => a + b) * 3;
    var monDamage = monAtk.reduce((a, b) => a + b) * 3;

    if (suddenCount <= 0) {
        logOutput("※ 이 마물은 더 이상 기습이 통하지 않습니다.");
        panic = false;
    }
    if (stun) {
        if (suddenCount <= 0) {
            logOutput(`마물은 간신히 몸을 틀어 ${charName.value}의 기습을 피해냅니다.`);
        }
        else {
            stunImmune -= 1;
            logOutput(`무력화된 마물에게 ${charName.value}의 기습 공격! 3.0 X (${charAtk.join(" + ")}) + ${weapon} = ${charDamage} 피해를 주었다.`);
            monNowHp(charDamage);
        }
    }
    else if (panic) {
        logOutput(`마물이 방심한 틈을 타 ${charName.value}의 기습 공격! 3.0 X (${charAtk.join(" + ")}) + ${weapon} = ${charDamage} 피해를 주었다.`);
        monNowHp(charDamage);
        logOutput("마물이 당황한 것 같다!");
        logOutput("※ 무력화 시도 시 확률이 상승합니다.");
    }
    else {
        logOutput(`${pp(charName.value, "은는")} 파고 들었지만 마물에게 간파 당했다! 3.0 X (${monAtk.join(" + ")}) = ${monDamage} 역습으로 큰 피해를 받았다.`);
        charNowHp(monDamage);
    }

    suddenCount -= 1;
    if (suddenCount >= 0) logOutput(`(남은 기습 횟수 : ${suddenCount})`);
    if (suddenCount < 0) logOutput(`(남은 기습 횟수 : 0)`);

    if (suddenCount == 0) {
        logOutput("마물은 반복된 기습에 분노하며 온 신경을 곤두세웁니다.");
    }
}
function stunAtk() {
    if (stun) {
        logOutput("※ 이미 무력화가 적용된 턴 입니다. 무효. 로그 재사용 불가.");
        return;
    }
    else if (!stunAble || stunCount <= 0) {
        if (!stunAble) logOutput("※ 이번 턴에는 이미 무력화를 성공했습니다.");
        logOutput(`${charName.value}의 무력화는 마물에게 아무런 효과를 줄 수 없었다.`);
    }
    else if (panic) {
        stun = chanceCalc(50);
        var log = `당황한 마물에게 ${pp(charName.value, "은는")} 무력화를 시도 한다...! `;
    }
    else if (stunAble) {
        stun = chanceCalc(5);
        var log = `${charName.value}의 무력화! 과연? `;
    }

    if (stun && stunAble) {
        stunCount -= 1;
        stunImmune = 10;
        stunAble = false;
        log += "성공!";
        logOutput(log);
        if (stunCount == 0) logOutput("무력화는 성공했지만, 마물의 상태가 심상치 않아 보입니다.");
        logOutput("※ 마물이 이번 턴, 일정 공격 구간까지 반격을 하지 않습니다.");
        logOutput(`(남은 무력화 성공 횟수 : ${stunCount})`);
    }
    else {
        if (stunAble) { 
            log += "실패!";
            logOutput(log);
        }
        var monDamage = (monAtk.reduce((a, b) => a + b)) * 1.1;
        logOutput(`1.1 X (${monAtk.join(" + ")}) = ${Math.round(monDamage)} 피해를 받았다.`);
        charNowHp(monDamage);
    }
}
function healing(healPoint) {
    charHp.value += Number(healPoint);
}
function battleEnd() {
    monHp.value = monHp.innerHTML;
    time = 0;
    stunAble = true;
    stunCount = 3;
    suddenCount = 5;
    $(".turn-text")[0].innerText = "0";
    running = false;
    battleStart = false;
    clearTimeout(timerid);
    $(".timer")[0].innerText = "00 : 00 : 00";
    var startPause = $(".timer-start-pause")[0];
    startPause.classList.replace("fa-pause", "fa-play");
    $(".monster-hp")[0].disabled = false;
    turnReset();
    var atkBtn = $(".atk-btn");
    logOutput(`전투 종료`);
    for (let i = 0; i < atkBtn.length; i++) {
        if (!running) {
            atkBtn[i].disabled = true;
        }
        else {
            atkBtn[i].disabled = false;
        }
    }
}
function battleResult(act) {
    charHp.dataset.label = `${charHp.value} / 500`;
    if (stun && stunImmune == 0) {
        stun = false;
        br();
        if (stunCount == 0) logOutput("마물은 매서운 기운을 내뿜으며 몸의 감각을 극대화 합니다.");
        else logOutput("계속된 공격에 마물이 몸부림치며 깨어났다!");
    }
    if (panic) {
        if (!stun && (act == "attack" || act == "stun")) {
            panic = false;
            logOutput("마물은 정신을 되찾은 것 같다.");
        }
    }
    if (battleStart) {
        if (charHp.value <= 0) {
            charName.disabled = true;
            charHp.value = 0;
            br();
            logOutput(`${charName.value} 사망.`);
        }
        var allAtk = [];
        for (let i = 0; i < $(`.char-panel>.${nowParty}`).length; i++) {
            var cd = $(`.char-panel>.${nowParty}`)[i].getElementsByClassName("char-recen-act-txt")[0];
            var key = JSON.parse(cd.dataset.key);
            allAtk.push(key["action"]);
        }
        if (allAtk.every(function(subject) {
            return subject == true;
        })) {
            var run = true;
        }
        if (monHp.value > 0 && run && $(".type_on-off")[0].checked) {
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
            var victoryTxt = [
                `${charName.value}의 마지막 일격으로 마물은 피를 쏟아내며 쓰러졌다.`,
                `${charName.value}의 날카로운 공격에 마물은 괴성을 지르며 쓰러졌다.`,
                `${charName.value}의 무자비한 무기는 마물의 숨통을 끊어내고는 작게 진동했다.`
            ]
            var ran = Math.round(Math.random() * 2);
            logOutput(victoryTxt[ran]);
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
        if (status.dataset.key != "heal") {
            key["action"] = true;
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
    else if (nowParty == "rest" && e.dataset.key != "heal") swal("Caution!", "휴식중인 파티는 전투에 참여할 수 없습니다");
    else {
        for (let i = 0; i < selectChar().length; i++) {
            actionReady(i)
            var key = JSON.parse(charData.dataset.key);
            if (!key["action"] && charHp.value > 0) {
                if (e.dataset.key != "heal") selectChar()[i].getElementsByClassName("input_on-off")[0].disabled = true;
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
                battleResult(e.dataset.key);
            }
            else if (charHp.value == 0) {
                swal("Caution!", `${pp(charName.value, "은는")} 사망하여 더 이상 행동할 수 없습니다`);
            }
            else {
                logOutput(`${pp(charName.value, "은는")} 이번 턴에 더 이상 행동할 수 없다. 무효. 로그 재사용 불가.`);
                br();
            }
            battleLogPanel.scrollTop = battleLogPanel.scrollHeight;
        }
        for (let i = 0; i < $(".char-sheet").length; i++) {
            $(".input_on-off")[i].checked = false;
        }
    }
}
