var monsterStun = false;
var monsterHealth;
var createMonster = false;
var contentArea;
var battleText;

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
function screenAutoView() {
    contentArea.scrollTop = contentArea.scrollHeight;
}
function chanceCalc(persent) {
    var result = false
    var chance = Math.ceil(Math.random() * 100);
    if (chance < persent) {
        result = true;
    }
    return result;
}

function dicePoint(diceType) {
    var dice = document.getElementsByName(diceType);
    var color = ["firstDice", "secondDice", "thirdDice"];
    var newDice = new Array(3);
    for (var i = 0; i < dice.length; i++) {
        if (!dice[i].checked) {
            newDice[i] = null;
        }
        else {
            newDice[i] = 0;
        }
    }

    var chance = new Array(2, 7, 17, 37, 67, 107, 157, 217, 267, 307);

    for (var i = 0; i < newDice.length; i++) {
        var diceChance = Math.ceil(Math.random() * 307);
        if (newDice[i] != null) {
            for (var j = 0; j < chance.length; j++) {
                if (diceChance < chance[j]) {
                    newDice[i] = {
                        className: color[i],
                        value: 100 - j * 10,
                    }
                    break;
                }
            }
        }
    }
    return newDice;
}
function readyBattle() {
    contentArea = document.getElementById("displayPanel");
    battleText = document.createElement("p");

    if (createMonster == false) {
        if (document.getElementById("monsterHealthPoint").value > 0) {
            monsterHealth = document.getElementById("monsterHealthPoint").value;
            createMonster = true;
        }
        else {
            battleText.innerHTML += `<span class="firstDice">마물의 체력을 설정해주세요.</span>`
            contentArea.appendChild(battleText);
        }
    }
}
function battleCheck() {
    if (monsterHealth <= 0) {
        battleText.innerHTML += `<span style="color: green">마물과의 전투에서 승리했습니다!</span>`;
        createMonster = false;
        monsterHealth = 0;
    }
}
function commonAttack(diceType, bounsType) {
    var bonus = document.getElementById(bounsType);
    bonus = bonus.options[bonus.selectedIndex].text;
    var dice = dicePoint(diceType);
    var critChance = chanceCalc(30);
    var totalDamage = 0;
    var damageText = "";
    var newDice = dice.filter((subject) => {
        if (subject != null) {
            return subject;
        }
    })
    for (var i = 0; i < newDice.length; i++) {
        totalDamage += Number(newDice[i].value);
    }
    var domDice = newDice.map((object) => {
        return `<span class="${object.className}">${object.value}</span>`;
    })
    if (critChance) {
        damageText += `<span class="specialWord">치명타! 1.5 X </span>`;
        totalDamage = totalDamage * 1.5;
    }
    switch (diceType) {
        case "m-dice":
            totalDamage -= Number(bonus);
            damageText += `(${domDice.join(" + ")}) - <span class="bounsWord">${bonus}</span>`;
            damageText += ` = ${totalDamage} 피해를 받았다.`;
            break;
        case "a-dice":
            totalDamage += Number(bonus);
            damageText += `(${domDice.join(" + ")}) + <span class="bounsWord">${bonus}</span>`;
            damageText += ` = ${totalDamage} 피해를 주었다.<br>`;
            monsterHealth -= totalDamage;
            if (monsterHealth < 0) {
                monsterHealth = 0;
            }

            break;
    }

    return damageText;
}

function normalAttack() {
    readyBattle();

    if (createMonster) {
        battleText.innerHTML += commonAttack("a-dice", "normal");
        battleText.innerHTML += `마물의 남은 HP : ${monsterHealth}<br>`;
        battleCheck();
        if (monsterStun) {
            monsterStun = false;
        }
        else if (createMonster){
            battleText.innerHTML += commonAttack("m-dice", "armor");
        }
        contentArea.appendChild(battleText);
        screenAutoView()
    }
}
function suddenAttack() {
    readyBattle();

    if (createMonster) {
        var bonus = document.getElementById("sudden");
        bonus = bonus.options[bonus.selectedIndex].text;

        var backstep = chanceCalc(30);
        var dice;
        var totalDamage = 0;

        if (backstep) {
            dice = dicePoint("s-dice");
        }
        else {
            dice = dicePoint("m-dice");
        }
        
        var newDice = dice.filter((subject) => {
            if (subject != null) {
                return subject;
            }
        })
        var domDice = newDice.map((object) => {
            return `<span class="${object.className}">${object.value}</span>`;
        })
        for (var i = 0; i < newDice.length; i++) {
            totalDamage += Number(newDice[i].value);
        }

        if (backstep || monsterStun) {
            monsterStun = false;
            totalDamage += totalDamage * 2 + Number(bonus);
            monsterHealth -= totalDamage;
            if (monsterHealth < 0) {
                monsterHealth = 0;
            }

            battleText.innerHTML += `<span class="specialWord">기습 성공! 3.0 </span>X (${domDice.join(" + ")}) + <span class="bounsWord">${bonus}</span>`;
            battleText.innerHTML += ` = ${totalDamage} 피해를 주었다.<br>`;
            battleText.innerHTML += `마물의 남은 HP: ${monsterHealth}<br>`;
            battleCheck();
        }
        else {
            totalDamage += totalDamage * 2;

            battleText.innerHTML += `<span class="specialWord">기습 실패! 3.0 </span>X (${domDice.join(" + ")})`;
            battleText.innerHTML += ` = ${totalDamage} 피해를 받았다.<br>`;
        }
        contentArea.appendChild(battleText);
        screenAutoView()
    }
}
function stunAttack() {
    readyBattle();

    if (createMonster) {
        var mDice = dicePoint("m-dice");
        var monsterDamage = mDice[0].value * 1.1;

        if (!monsterStun) {
            monsterStun = chanceCalc(45);
        }

        if (monsterStun) {
            battleText.innerHTML += `<span class="specialWord">무력화 성공!</span> 마물이 <span class="bounsWord">1</span>턴간 공격하지 않습니다.`;
        }
        else {
            var damageText = `<span class="${mDice[0].className}">${mDice[0].value}</span>`
            battleText.innerHTML += `<span class="specialWord">무력화 실패! 1.1</span> X ${damageText} = ${Math.ceil(monsterDamage)} 피해를 받았다.`
        }
        contentArea.appendChild(battleText);
        screenAutoView()
    }
}