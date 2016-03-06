/*************/
/** Globals **/
/*************/
var areas = new Array();
var speed = "2";
var playerFacing = "down";
var keys = {};
var keyCodes = new Array();
var opposite = new Array();
var canMove = true;
var currentArea = "";
var menuIsShowing = false;
var terminalTimeout;

/*******************/
/** Save and load **/
/*******************/
function save() {
	if (typeof localStorage.labrynnaSave == "undefined" || localStorage.labrynnaSave == "") {
		localStorage.labrynnaSave = JSON.stringify(new Date());
		localStorage.labrynnaSavedAreas = JSON.stringify(areas);
		localStorage.labrynnaSaveCurrentArea = JSON.stringify(currentArea);
		localStorage.labrynnaSaveCharacterPosition = JSON.stringify([$("#map").css("top"), $("#map").css("left")]);
		localStorage.labrynnaSavePlayer = JSON.stringify(player);
		terminalWriteLine("Saved game " + new Date());
	} else {
		terminalWriteLine("There is already a saved game. Delete this before saving a new one.");
	}
}

function load() {
	if (typeof localStorage.labrynnaSave != "undefined" && localStorage.labrynnaSave != "") {
		var backupAreas = areas;
		areas = JSON.parse(localStorage.labrynnaSavedAreas);
		for (var i = 0; i < backupAreas.length; i++) {
			var newArea = getAreaById(backupAreas[i].id);
			for (var j = 0; j < newArea.characters.length; j++) {
				newArea.characters[j].preLoad = getCharacterById(newArea.characters[j].id, backupAreas[i].characters).preLoad;
				newArea.characters[j].talkData = getCharacterById(newArea.characters[j].id, backupAreas[i].characters).talkData;
				newArea.characters[j].obstruction = getObstructionById(newArea.characters[j].id, newArea.obstructions);
			}
			for (var j = 0; j < newArea.triggerAreas.length; j++) {
				newArea.triggerAreas[j].script = getTriggerAreaById(newArea.triggerAreas[j].id, backupAreas[i].triggerAreas).script;
			}
		}
		player = JSON.parse(localStorage.labrynnaSavePlayer);
		buildArea(getAreaById(JSON.parse(localStorage.labrynnaSaveCurrentArea).id), JSON.parse(localStorage.labrynnaSaveCharacterPosition));
		
		toggleMenu();
		terminalWriteLine("Successfully loaded " + localStorage.labrynnaSave);
	} else {
		terminalWriteLine("There are no saved games.");
	}
}

function deleteSave() {
	var saveDate = localStorage.labrynnaSave;
	localStorage.labrynnaSave = "";
	localStorage.labrynnaSavedAreas = "";
	localStorage.labrynnaSaveCurrentArea = "";
	localStorage.labrynnaSaveCharacterPosition = "";
	localStorage.labrynnaSavePlayer = "";
	terminalWriteLine("Deleted save: " + saveDate);
}

/****************************/
/** Movement and collision **/
/****************************/
$(document).keydown( function(e) {
	if (canMove) {
		keys[keyCodes[e.keyCode]] = true;
	}
	//console.log(e.keyCode);
});

$(document).keyup( function (e) {
   delete keys[keyCodes[e.keyCode]];
   
   //Commands trigger here to avoid being able to spam them by holding down the button
   //Scripted events need to instantly invoke canMove = false
	if (keyCodes[e.keyCode] == "talk" && canMove == true) {
		talk();
	} else if (keyCodes[e.keyCode] == "menu" && canMove == true) {
		toggleMenu();
	}
});

function movePlayer() {  
	for (var direction in keys) {
		if (!keys.hasOwnProperty(direction)) continue;

		if (direction == "left" && move(direction).possible) {
			faceSprite($("#player"),  direction);
			playerFacing = "left";
			$("#map").animate({
			left: '+='+speed
			}, 0);
		}
		
		if (direction == "up" && move(direction).possible) {
			faceSprite($("#player"),  direction);
			playerFacing = "up";
			$("#map").animate({
			top: '+='+speed
			}, 0);
		}
		
		if (direction == "right" && move(direction).possible) {
			faceSprite($("#player"),  direction);
			playerFacing = "right";
			$("#map").animate({
			left: '-='+speed
			}, 0);
		}
		
		if (direction == "down" && move(direction).possible) {
			faceSprite($("#player"),  direction);
			playerFacing = "down";
			$("#map").animate({
			top: '-='+speed
			}, 0);
		}
		
		if (playerIsInTriggerArea()) {
			var trigger = getCurrentTriggerArea();
			if (trigger.active) {
				trigger.script();
			}
		}
		
		if (currentArea.hasRandomMonsters && canMove == true) {
			if (Math.random() > 0.9980) {
				stopAllMovement();
				healAllRandomMonsters();
				startBattle(player, randomMonsters[Math.floor(Math.random()*randomMonsters.length)]);
			}
		}
	}
}

function move(direction) {
	var mapTop = $("#map").offset().top;
	var mapLeft = $("#map").offset().left;
	var oos = currentArea.obstructions;
	var pos = getPlayerOffsets();
	var move = { 
		possible: true,
		obstructions: new Array()
	}
	for (var i = 0; i < oos.length; i++) {
		if (oos[i].isActive) {
			if (direction == "down" && ((oos[i].top + mapTop)-pos.bottom) <= parseInt(speed) && (oos[i].bottom+ mapTop) > pos.top && (oos[i].left + mapLeft) < pos.right && (oos[i].right + mapLeft) > pos.left) {
				move.possible = false;
				move.obstructions.push(oos[i]);
			} else if (direction == "right" && ((oos[i].left + mapLeft)-pos.right) <= parseInt(speed) && (oos[i].right + mapLeft) > pos.left && (oos[i].top + mapTop) < pos.bottom && (oos[i].bottom + mapTop) > pos.top ) {
				move.possible = false;
				move.obstructions.push(oos[i]);
			} else if (direction == "left" && (pos.left-(oos[i].right + mapLeft)) <= parseInt(speed) && pos.left > (oos[i].right + mapLeft) && (oos[i].top + mapTop) < pos.bottom && (oos[i].bottom + mapTop) > pos.top) {
				move.possible = false;
				move.obstructions.push(oos[i]);
			} else if (direction == "up" && (pos.top-(oos[i].bottom + mapTop)) <= parseInt(speed) && pos.bottom > (oos[i].top + mapTop) && (oos[i].left + mapLeft) < pos.right && (oos[i].right + mapLeft) > pos.left) {
				move.possible = false;
				move.obstructions.push(oos[i]);
			}
		}
	}
	return move;
}

function stopAllMovement() {
	if (menuIsShowing) {
		toggleMenu();
	}
	
	canMove = false;
	delete keys["down"];
	delete keys["left"];
	delete keys["right"];
	delete keys["up"];
}

function getPlayerOffsets() {
	var offsets = $("#player").offset();
	var pos = {
		top: offsets.top,
		left: offsets.left,
		bottom: offsets.top + $("#player").height(),
		right: offsets.left + $("#player").width()
	}
	return pos;
}

function obstruction(id, type, top, left, height, width, isActive) {
	this.id = id;
	this.type = type;
	this.top = top;
	this.left = left;
	this.height = height;
	this.width = width;
	this.bottom = top + height;
	this.right = left + width;
	this.isActive = isActive;
}

function getObstructionById(id, customArray) {
	var array = currentArea.obstructions;
	if (typeof customArray != "undefined") {
		array = customArray;
	}

	id = id.toLowerCase();
	var found = -1
	for (var i = 0; i < array.length; i++) {
		var thisId = array[i].id.toLowerCase();
		if (thisId == id) {
			found = array[i];
		}
	}
	return found;
}

function getObstructionOffsets() {
	//used with the obstructionIsNearby fucntion
	var soos = currentArea.obstructions;
	var oos = new Array();
	for (var i = 0; i < soos.length; i++) {
		if (obstructionIsNearby(soos[i], direction)) {
			oos.push(soos[i]);
		}
	}
	return soos;
}

function obstructionIsNearby(obstruction, direction) {
	//no good function
	var tc = Math.abs(parseInt($("#map").css("top"))) + ($("#screen").height()/2) - 20;
	var rc = Math.abs(parseInt($("#map").css("left"))) + ($("#screen").width()/2) + 20;
	var lc = Math.abs(parseInt($("#map").css("left"))) + ($("#screen").width()/2) - 20;
	var dc = Math.abs(parseInt($("#map").css("top"))) + ($("#screen").height()/2) + 20;
	/*var charTopOffset = (Math.abs($("#map").offset().top) * (($("#map").offset().top+1) - $("#map").offset().top)) + ($("#screen").height()/2);
	var charLeftOffset = (Math.abs($("#map").offset().left) * (($("#map").offset().left+1) - $("#map").offset().left)) + ($("#screen").width()/2) - 10;*/
	var rv = false;
	
	if (direction == "right" && obstruction.left > rc && obstruction.left < rc+50) {
		rv = true;
	}
	if (direction == "left" && obstruction.right < lc && obstruction.right > lc-50) {
		rv = true;
	}
	if (direction == "up" && obstruction.bottom < tc && obstruction.bottom > tc-50) {
		rv = true;
	}
	if (direction == "down" && obstruction.top > dc && obstruction.top < dc+50) {
		rv = true;
	} 
	return rv;
}

function faceSprite (spriteElement, direction) {
	if (typeof spriteElement.length == "undefined") {
		spriteElement = $(spriteElement);
	}
	
	if (direction == "left") {
		spriteElement.css("background-position", "0px -32px");
	} else if (direction == "up") {
		spriteElement.css("background-position", "0px -96px");
	} else if (direction == "right") {
		spriteElement.css("background-position", "0px -64px");
	} else if (direction == "down") {
		spriteElement.css("background-position", "0px 0px");
	} else {
		//Do nothing
	}
}

function buildMovementArrays() {		
	// Arrow keys
	keyCodes[37] = "left";
	keyCodes[38] = "up";
	keyCodes[39] = "right";
	keyCodes[40] = "down";
	// WASD
	keyCodes[83] = "down";
	keyCodes[65] = "left";
	keyCodes[87] = "up";
	keyCodes[68] = "right";
	// Commands
	keyCodes[81] = "talk"; // q
	keyCodes[69] = "menu"; // e
	
	// Opposite array
	opposite["left"] = "right";
	opposite["right"] = "left"; 
	opposite["up"] = "down";
	opposite["down"] = "up";
}

/*************************/
/** Trigger area system **/
/*************************/
function playerIsInTriggerArea() {
	if (getCurrentTriggerArea() == -1) {
		return false;
	} else {
		return true;
	}
}

function getCurrentTriggerArea() {
	var pos = getPlayerOffsets();
	var tos = currentArea.triggerAreas;
	var mapTop = $("#map").offset().top;
	var mapLeft = $("#map").offset().left;
	var rv = -1;
	
	for (var i = 0; i < tos.length; i++) {
		if (tos[i].top+mapTop < pos.bottom && tos[i].left+mapLeft < pos.right && tos[i].right+mapLeft > pos.left && tos[i].bottom+mapTop > pos.top) {
			rv = tos[i];
		}
	}
	return rv;
}

function triggerArea(id, active, top, left, height, width, script) {
	this.id = id;
	this.active = active;
	
	this.left = left;
	this.top = top;
	this.height = height;
	this.width = width;
	this.right = left+width;
	this.bottom = top+height;
	
	this.script = script;
}

function getTriggerAreaById(id, customArray) {
	var array = currentArea.triggerAreas;
	var found = -1;
	
	if (typeof customArray != "undefined") {
		array = customArray;
	}
	
	for (var i = 0; i < array.length; i++) {
		if (id == array[i].id) {
			found = array[i];
		}
	}
	return found;
}

/***************************/
/** Commands and triggers **/
/***************************/
function talk() {
	var target = move(playerFacing);
	if (!target.possible && target.obstructions[0].type.indexOf("talkable") != -1) {
		getCharacterById(target.obstructions[0].id).talkData();
	} else {
		message($("#player"), "How did I get here?", 2000, 0);
	}
}

function message(source, messageString, duration, delay, direction) {
	if (typeof messageString == "undefined") {
		//Do nothing, its just a tree probably
	} else {
		var bubble = document.createElement('div');
		bubble.className = "talkBubble";
		bubble.innerHTML = messageString;
		$(source).append(bubble);
		$(bubble).css("top", "-"+($(bubble).height()+20+10)+"px");
		setTimeout(function () {
			$(bubble).show("drop");
			setTimeout(function () {
				$(bubble).fadeOut(
					function () { 
						$(bubble).remove(); 
					}
				); 
			}, duration);
		
			if ($(source)[0].id != "player" && typeof direction == "undefined") {
				faceSprite($(source), opposite[playerFacing]);
			} else {
				faceSprite($(source), direction);
			}
		}, delay);
	}
}

/*************/
/** Battles **/
/*************/
function startBattle(side1, side2) {
	player.target = side2;
	player.active = true;
	stopAllMovement();
	playMusic(player.target.battleMusic);
	$("#screen").append("<div id='battleScene' class='battleScene'><div id='playerSide'><img src='"+player.battleSprite+"' /></div><div id='opposingSide'><img src='"+player.target.battleSprite+"' /></div></div>");
	$("#battleScene").show("pulsate", {}, 200, function () {
		$("#playerSide").show("puff", {}, 2000, function () {
			$("#opposingSide").show("puff", {}, 2000, function () { showHealthBars(); });
			battleMessage(player.target.name+" wants to battle!", 3000, 2000);
			setTimeout(listPlayerAttacks, 5500);
		});
	});
}

function listPlayerAttacks() {
	var items = "";
	for (var i = 0; i < player.inventory.length; i++) {
		if (player.inventory[i].type.indexOf("Offensive") != -1) {
			items += '<div class="attackContainer"><div class="attackThumbnail"></div><input class="attackButton" type="submit" value="'+player.inventory[i].name+'" onclick="strike(player.inventory['+i+'],player,player.target)" /></div>&nbsp;&nbsp;&nbsp;';
		}
	}
	battleMessage("Strike "+player.target.name+" with:<br/>" + items, "infinite", 500);
}

function strike(item, striker, target) {
	if (striker.isPlayer && !player.active) {
		battleMessage("It's not your turn.", 3000, 0);
	} else {
		//((((2 * Level / 5 + 2) * AttackStat * AttackPower / DefenseStat) / 50) + 2) * STAB * Weakness/Resistance * RandomNumber / 100 <-- for future reference when weakness/resistance and defense are in
		var damage = ((((2 * striker.level / 5 + 2) * striker.baseAttack * striker.baseAttack / 1) / 50) + 2) * 1 * 1 * (Math.floor(Math.random() * (100-(85-1))) + 85) / 100
		battleMessage(striker.name + "'s " + item.name + " strikes " + target.name + " for " + Math.floor(damage) + " damage.", 6000, 1000);
		target.currentHp -= damage;
		if (typeof spellVisuals[item.name] == "function") {
			spellVisuals[item.name](striker.isPlayer);
		}
		updateHealthBar(target);
		if (target.currentHp > 0) {
			setTimeout(function () {
				if (player.active == true) {
					player.active = false;
					var enemyAttack = player.target.inventory[Math.floor(Math.random()*player.target.inventory.length)];
					strike(enemyAttack, player.target, player);
				} else {
					player.active = true;
					listPlayerAttacks();
				}
			}, 6000);
		} else {
			setTimeout(function () {
				var beforeExp = striker.level;
				var levelUpDelay = 0;
				
				if (player.active == true) {
					$("#opposingSide").fadeOut("slow");
				} else {
					$("#playerSide").fadeOut("slow");
				}
				
				battleMessage(target.name + " has been defeated! "+striker.name+" gains " + Math.floor(gainExperience(striker, target)) + " experience points from the battle.", 6000, 500);
				if (beforeExp < striker.level) {
					levelUpDelay = 3500;
					battleMessage(striker.name + " has reached level " + striker.level + "!", 3000, 7000);
				}
				setTimeout(function () {
					endBattle();
				}, 7000 + levelUpDelay);
			}, 6000, 500);
		}
	}
}

function battleMessage(message, duration, delay) {
	$(".battleMessage").remove();
	setTimeout(function () {
		var messageBox = document.createElement('div');
		messageBox.id = "battleMessage";
		messageBox.className = "battleMessage";
		messageBox.innerHTML = message;
		$("#battleScene").append(messageBox);
		$(messageBox).show("drop");
		if (duration != "infinite") {
			setTimeout(function () {
				$(messageBox).effect("drop", function () {
					$(messageBox).remove();
				});
			}, duration);
		}
	}, delay);
}

function endBattle() {
	if (player.currentHp <= 0) {
		battleMessage("You have been defeated. Game over.", "infinite", 500);
	} else {
		$("#battleScene").fadeOut("slow", function () {
			$("#battleScene").remove();
			playMusic(currentArea.music);
			if (typeof player.target.onDefeat == "function") {
				player.target.onDefeat();
			}
			player.target = "";
			canMove = true;
		});
	}
}

function gainExperience(victor, loser) {
	//((1 eller 1.5 avhengig av om det er boss eller random) * 1 * 60 *1 * fainted level)/7
	var exp = (1 * 1 * 60 * 1 * loser.level) / 7;
	victor.experience += exp;
	
	if (victor.isPlayer) {
		var width = (100 / (levels[victor.level]-levels[victor.level-1])) * (victor.experience - levels[victor.level-1]);
		while (width > 0) {
			$("#expBarInner").animate({
				width: width+"%"
			}, function () {});
			width = width-100;
			updateLevel(victor);
		}
	}	
	return exp;
}

function updateLevel(character) {
	var i = character.level - 1;
	while (character.experience > levels[i]) {
		i++;
	}
	
	if (i > character.level) {
		$("#playerLevel").html("Lv."+i);
		character.level = i;
		character.maxHp += 2;
		character.currentHp += 2;
		character.baseAttack += 1;
		terminalWriteLine(player.name + " has reached level " + player.level + "!");
	}
}

function showHealthBars() {
	if (typeof player.target.displayLevel != "undefined") {
		var enemyLevel = player.target.displayLevel;
	} else {
		var enemyLevel = player.target.level;
	}

	$("#playerSide").append('<div class="healthFrame" id="playerHealth">'+player.name+'<div style="position: relative; float: right;" id="playerLevel">Lv.'+player.level+'</div><br/><div class="healthBarFrame"><div id="playerHealthBarInner"></div></div><div class="expBar" id="expBar"><div class="expBarInner" id="expBarInner"></div></div></div>');
	$("#opposingSide").append('<div class="healthFrame" id="enemyHealth">'+player.target.name+'<div style="position: relative; float: right;" id="enemyLevel">Lv.'+enemyLevel+'</div><br/><div class="healthBarFrame"><div id="enemyHealthBarInner"></div></div></div>');
	
	var width = (100 / player.maxHp) * player.currentHp;
	$("#playerHealthBarInner").css("width", width+"%");
	$("#playerHealthBarInner").css("height", "100%");
	$("#playerHealthBarInner").css("background-color", "green");
	
	width = (100 / (levels[player.level]-levels[player.level-1])) * (player.experience - levels[player.level-1]);
	$("#expBarInner").css("width", width+"%");
	$("#expBarInner").css("height", "100%");
	$("#expBarInner").css("background-color", "#4AB1CB");
	
	width = (100 / player.target.maxHp) * player.target.currentHp;
	$("#enemyHealthBarInner").css("width", width+"%");
	$("#enemyHealthBarInner").css("height", "100%");
	$("#enemyHealthBarInner").css("background-color", "green");
}

function updateHealthBar(target) {
	var width = (100 / target.maxHp) * target.currentHp;
	if (target.isPlayer) {
		$("#playerHealthBarInner").animate({
			width: width+"%"
		});
	} else {
		$("#enemyHealthBarInner").animate({
			width: width+"%"
		});
	}
}

function healAllRandomMonsters() {
	for (var i = 0; i < randomMonsters.length; i++) {
		randomMonsters[i].currentHp = randomMonsters[i].maxHp;
	}
}

/*************************************/
/** Area interaction and characters **/
/*************************************/
function buildArea(area, overrideStartCords) {
	if (typeof getAreaById(area.id) == "undefined") {
		areas.push(area);
	}
	
	currentArea = getAreaById(area.id);
	$("#map").html("");
	$("#daytime").css("opacity", "0");
	
	//Show background
	$("#map").append('<div id="background" style="position: absolute; top: 0px; left: 0px; z-index: 15000;"><img src="'+currentArea.background+'" /></div>');
	
	//Position the map so that the player starts in the right spot (we might add some modifiers in the future to assess where the player is entering the area from)
	if (typeof overrideStartCords != "undefined") {
		$("#map").css("top", overrideStartCords[0]);
		$("#map").css("left", overrideStartCords[1]);
	} else {
		$("#map").css("top", currentArea.topStart);
		$("#map").css("left", currentArea.leftStart);
	}

	//Play the right music
	playMusic(currentArea.music);

	//Set right time of day
	$("#daytime").css("opacity", currentArea.timeOfDay);
	
	//Build characters
	for (var i = 0; i < currentArea.characters.length; i++) {
		if (getObstructionById(currentArea.characters[i].id) == -1) {
			currentArea.obstructions.push(currentArea.characters[i].obstruction);
		}
		$("#map").append('<div class="obstruction character" id="'+currentArea.characters[i].id+'" style="top: '+currentArea.characters[i].obstruction.top+'px; left: '+currentArea.characters[i].obstruction.left+'px;"></div>');
		$("#"+currentArea.characters[i].id).css("background-image", "url('"+currentArea.characters[i].sprite+"')");
		if (currentArea.characters[i].isShowing == false) {
			$("#"+currentArea.characters[i].id).css("display", "none");
		}
		currentArea.characters[i].preLoad();
	}
	
	//Show area name in terminal
	setTimeout(function () { terminalWriteLine("Entered " + currentArea.name + "."); }, 1000);
}

function playMusic(fileString) {
	var musicPlayer = document.getElementById("background-music");
	musicPlayer.pause();
	musicPlayer.setAttribute("src", fileString);
	musicPlayer.play();
}

function area (id, name, background, music, timeOfDay, topStart, leftStart, triggers, obstructions, characters, triggerAreas, hasRandomMonsters) {
	this.id = id;
	this.name = name;
	this.background = background;
	this.music = music;
	this.timeOfDay = timeOfDay;
	this.topStart = topStart;
	this.leftStart = leftStart;
	this.triggers = triggers;
	this.obstructions = obstructions;
	this.characters = characters;
	this.triggerAreas = triggerAreas;
	this.hasRandomMonsters = hasRandomMonsters;
}

function character(name, level, isPlayer, maxHp, currentHp, mapSprite, battleSprite, inventory, baseAttack, active, target, battleMusic, onDefeat) {
	this.name = name;
	this.level = level;
	this.isPlayer = isPlayer;
	this.maxHp = maxHp;
	this.currentHp = currentHp;
	this.mapSprite = mapSprite;
	this.battleSprite = battleSprite;
	this.inventory = inventory;
	this.baseAttack = baseAttack;
	this.active = active;
	this.target = target;
	this.battleMusic = battleMusic;
	this.onDefeat = onDefeat;
	this.experience = 0;
	
	if (isPlayer) {
		this.questLog = new Array();
	}
}

function mapCharacter(id, topStart, leftStart, sprite, preLoad, talkData, isShowing) {
	this.id = id;
	this.sprite = sprite;
	this.preLoad = preLoad;
	this.talkData = talkData;
	this.isShowing = isShowing;
	this.obstruction = new obstruction(id, "character talkable", parseInt(topStart), parseInt(leftStart), 31, 31, isShowing);
}

function toggleMapCharacter(characterObject) {
	if (characterObject.isShowing) {
		characterObject.isShowing = false;
		characterObject.obstruction.isActive = false;
		$("#"+characterObject.id).hide();
	} else {
		characterObject.isShowing = true;
		characterObject.obstruction.isActive = true;
		$("#"+characterObject.id).show();
	}
}

function moveMapCharacter(characterObject, topCord, leftCord, speed, callback) {
	topCord = parseInt(topCord);
	leftCord = parseInt(leftCord);
	
	characterObject.obstruction.top = topCord;
	characterObject.obstruction.left = leftCord;
	
	$("#"+characterObject.id).animate({
		top: topCord+"px",
		left: leftCord+"px"
	}, 6000, callback);
} 

function item (name, type, damage) {
	this.name = name;
	this.type = type;
	this.damage = damage;
}

function getCharacterById(id, customArray) {
	var source = currentArea.characters;
	if (typeof customArray != "undefined") {
		source = customArray;
	}
	var found = false;
	for (var i = 0; i < source.length; i++) {
		if (source[i].id == id) {
			found = source[i];
		}
	}
	return found;
}

function getAreaById(id) {
	var found = false;
	for (var i = 0; i < areas.length; i++) {
		if (areas[i].id == id) {
			found = areas[i];
		}
	}
	return found;
}

/**************************/
/** Quests and quest log **/
/**************************/
function quest(id, name, description, questObjectives) {
	this.id = id;
	this.name = name;
	this.description = description;
	this.questObjectives = questObjectives;
}

function questObjective(id, description, neededNumber, currentNumber) {
	this.id = id;
	this.description = description;
	this.neededNumber = neededNumber;
	this.currentNumber = currentNumber;
}

function givePlayerQuest(questObject) {
	if (typeof player.questLog == "undefined") {
		player.questLog = new Array();
	}
	if (getQuestById(questObject.id) == -1) {
		terminalWriteLine("New quest: " + questObject.name + ".");
		player.questLog.push(questObject);
	}
}

function completeQuest(quest) {
	if (questIsComplete(quest)) {
		var logIndex = getQuestById(quest.id).logIndex;
		player.questLog.splice(logIndex, 1);
		questCompletions[quest.id]();
	}
}

function questIsComplete(quest) {
	var completed = true;
	for (var i = 0; i < quest.questObjectives.length; i++) {
		if (quest.questObjectives[i].currentNumber < quest.questObjectives[i].neededNumber) {
			completed = false;
		}
	}
	return completed;
}

function getQuestById(id) {
	var found = -1;
	for (var i = 0; i < player.questLog.length; i++) {
		if (player.questLog[i].id == id) {
			found = player.questLog[i];
			found.logIndex = i;
		}
	}
	return found;
}

/**********/
/** Menu **/
/**********/
function toggleMenu() {
	menuIsShowing = !menuIsShowing;
	appendInventory();
	$("#menu").toggle();
}

function appendInventory() {
	//Header
	$("#menuHeader").html("Inventory");
	
	//Right side
	$("#menuRight").html("<div id='characterSheet' style='margin: 0 auto; text-align: center;'><img src='"+player.battleSprite+"' /><br/></div>");
	$("#menuRight").append(player.name + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lv." + player.level + "<br/>");
	$("#menuRight").append("Health: " + Math.floor(player.currentHp) + " / " + player.maxHp + "<br/>");
	$("#menuRight").append("Base attack: " + player.baseAttack);
	
	//Left side
	$("#menuLeft").html("");
	for (var i = 0; i < player.inventory.length; i++) {
		$("#menuLeft").append(player.inventory[i].name + "&nbsp;&nbsp;-&nbsp;&nbsp;"+player.inventory[i].type+"<br/>");
	}
}

function appendQuestLog() {
	//Header
	$("#menuHeader").html("Quest Log");
	
	//Left side
	$("#menuLeft").html("");
	if (typeof player.questLog[0] != "undefined") {
		showQuest(player.questLog[0].id);
	}
	
	//Right side
	$("#menuRight").html("");
	for (var i = 0; i < player.questLog.length; i++) {
		$("#menuRight").append("<input class='quest' type='submit' value='"+player.questLog[i].name+"' onclick='showQuest("+player.questLog[i].id+");' /><br/>");
	}
}

function showQuest(id) {
	var q = getQuestById(id);
	$("#menuLeft").html(q.name+"<br/><br/>");
	$("#menuLeft").append(q.description+"<br/><br/>");
	
	var qo = q.questObjectives;
	for (var i = 0; i < qo.length; i++) {
		$("#menuLeft").append(qo[i].description + ":<br/>" + qo[i].currentNumber + " / " + qo[i].neededNumber + "<br/><br/>");
	}
}

/*******************/
/** World Builder **/
/*******************/
function newObstruction() {
	$("#daytime").remove();
	var div = document.createElement('div');
	$(div).attr("class", "obstruction generated");
	$("#map").append(div);
	$(div).css("height", "10px");
	$(div).css("width", "10px");
	
	var left = (Math.abs($("#map").offset().left) * (($("#map").offset().left+1) - $("#map").offset().left)) + ($("#screen").width()/2);
	var top = (Math.abs($("#map").offset().top) * (($("#map").offset().top+1) - $("#map").offset().top)) + ($("#screen").height()/2);
	
	$(div).css("top", top);
	$(div).css("left", left);
	$(div).css("border", "1px solid black");
	makeDragable($(div));
	makeScalable($(div));
}

function generateObstructionHtml() {
	$("#generatedObstructions").html("");
	var obs = $(".generated");
	for (var i = 0; i < obs.length; i++) {
		$("#generatedObstructions").append("new obstruction('genericObstruction', 'obstruction', "+obs[i].style.top+", "+obs[i].style.left+", "+obs[i].style.height+", "+obs[i].style.width+", true),<br/>");
		//$("#generatedObstructions").append('&lt;div class="obstruction" style="height: '++'; width: '++'; top: ''; left: '';"&gt;&lt;/div&gt;<br/>');
	}
}

function makeDragable(DOMElement) {
	$(DOMElement).draggable();
	$(DOMElement).mousedown(function () {
		$(this).css("cursor", "move");
	});
	$(DOMElement).mouseup(function () {
		$(this).css("cursor", "auto");
	});
}

function makeScalable(DOMElement) {
	$(DOMElement).resizable();
	$(DOMElement).mousedown(function () {
		$(this).css("cursor", "move");
	});
	$(DOMElement).mouseup(function () {
		$(this).css("cursor", "auto");
	});
}

/**********/
/** Misc **/
/**********/
function terminalWriteLine(string) {
	$("#mapTerminal").append(string + "<br/>");
	$("#mapTerminal").fadeIn("fast", scrollTerminalDown);
	clearTimeout(terminalTimeout);
	terminalTimeout = setTimeout(function () { $("#mapTerminal").fadeOut(); }, 10000);
}

function clearTerminal() {
	$("#mapTerminal").html("");
}

function scrollTerminalDown() {
	var terminal = document.getElementById('mapTerminal');
	terminal.scrollTop = terminal.scrollHeight;
}