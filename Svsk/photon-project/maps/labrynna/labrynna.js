			//1   2   3   4    5    6    7    8    9    10   11   12   13   14    15
var levels = [0, 30, 60, 100, 150, 200, 280, 360, 460, 570, 680, 750, 970, 1250, 1500];

var spellVisuals = 
{
	Fireball: 
		function (isPlayer) { 
			if (isPlayer == true) {
				$("#battleScene").append("<div id='attack' style='-moz-transform:rotate(-75deg); position:  absolute; z-index: 80000; top: "+$("#playerSide").css("top")+"; left: "+$("#playerSide").css("left")+";'><img src='maps/labrynna/attackvisuals/fireball.gif' /></div>");
				$("#attack").animate({
					left: $("#opposingSide").css("left"),
					top: $("#opposingSide").css("top")
				}, 450, function () {
					$("#attack").remove();
				});
			}
		},
		
	Shade: 
		function () {
			$("#battleScene").append("<div id='attack' style='position: absolute; height: 50000px; width: 50000px; opacity: 0.7; background-color: black; display: none;'></div>");
			$("#attack").fadeIn("slow", function () { $("#attack").fadeOut("slow", function () { $("#attack").remove(); }); });
		}
}

var player =  new character(
	"Lynna",						//Name
	1,
	true,							//isPlayer
	20,							//maxHp
	20,							//currentHp
	"maps/labrynna/sprites/player.gif",			//mapSprite
	"maps/labrynna/battle-sprites/player.png",	//battleSprite
	[new item(						//inventory
		"Fireball",
		"Offensive Spell",
		10
	)],					
	10,								//baseAttack
	true,							//active
	"",								//target
	"",								//battleMusic
	""								//onDefeat
);

var randomMonsters = [
	new character(
		"Flimsy Wizard",
		1,
		false,
		10,
		10,
		"maps/labrynna/sprites/oldman.gif",
		"maps/labrynna/battle-sprites/flimsyWizard.png",
		[new item("Shade", "Offensive Spell", 10)],
		3,
		false,
		"",
		"maps/labrynna/music/battle-music-random.ogg"
	),
	
	new character(
		"Mindless Zombie",
		1,
		false,
		15,
		15,
		"maps/labrynna/sprites/oldman.gif",
		"maps/labrynna/battle-sprites/mindlessZombie.png",
		[new item("Gnaw", "Offensive Spell", 5), new item("Leap", "Offensive Spell", 10)],
		3,
		false,
		"",
		"maps/labrynna/music/battle-music-random.ogg",
		function () {
			var q = getQuestById(1);
			if (q != -1) {
				if (q.questObjectives[0].currentNumber < q.questObjectives[0].neededNumber) {
					q.questObjectives[0].currentNumber++;
				}
			}
		}
	),
	
	new character(
		"Shadowrunner",
		1,
		false,
		10,
		10,
		"maps/labrynna/sprites/oldman.gif",
		"maps/labrynna/battle-sprites/wolf.png",
		[new item("Shade", "Offensive Spell", 10, function () {
			$("#battleScene").append("<div id='attack' style='position: absolute; height: 50000px; width: 50000px; opacity: 0.7; background-color: black; display: none;'></div>");
			$("#attack").fadeIn("slow", function () { $("#attack").fadeOut("slow", function () { $("#attack").remove(); }); });
		})],
		4,
		false,
		"",
		"maps/labrynna/music/battle-music-random.ogg"
	)
];

var questCompletions = {
	1: function () {
		message($("#oldman"), "Oh dear, you are some force to be reckoned with... Thank you so much,", 4000, 0);
		player.experience += 40;
		terminalWriteLine("The Rising Threat completed! " + player.name + " gained 40 experience.");
		updateLevel(player);
	}
}


areas.push(new area (	
	1, 										//id
	"Forest Haven",
	"maps/labrynna/backgrounds/area1.png", 	//background
	"maps/labrynna/music/defaultArea-music.ogg", 				//music
	0.5, 						 			//timeOfDay;
	"-20px", 								//StartPosition-top
	"-100px", 								//StartPosition-left
	{},										//Triggers (NYI)
	
	//Obstructions
	
	[
		new obstruction('genericObstruction', 'obstruction', 253, 277, 104, 104, true),
		new obstruction('genericObstruction', 'obstruction', 259, 379, 93, 21, true),
		new obstruction('genericObstruction', 'obstruction', 356, 282, 14, 96, true),
		new obstruction('genericObstruction', 'obstruction', 257, 255, 97, 21, true),
		new obstruction('genericObstruction', 'obstruction', 160, 247, 50, 108, true),
		new obstruction('genericObstruction', 'obstruction', 142, 314, 18, 531, true),
		new obstruction('genericObstruction', 'obstruction', 155, 392, 55, 103, true),
		new obstruction('genericObstruction', 'obstruction', 192, 428, 35, 32, true),
		new obstruction('genericObstruction', 'obstruction', 139, 339, 41, 23, true),
		new obstruction('genericObstruction', 'obstruction', 171, 287, 55, 27, true),
		new obstruction('genericObstruction', 'obstruction', 158, 532, 55, 109, true),
		new obstruction('genericObstruction', 'obstruction', 158, 571, 70, 32, true),
		new obstruction('genericObstruction', 'obstruction', 160, 676, 48, 109, true),
		new obstruction('genericObstruction', 'obstruction', 156, 716, 69, 31, true),
		new obstruction('genericObstruction', 'obstruction', 147, 819, 60, 56, true),
		new obstruction('genericObstruction', 'obstruction', 189, 875, 77, 55, true),
		new obstruction('genericObstruction', 'obstruction', 264, 850, 21, 33, true),
		new obstruction('genericObstruction', 'obstruction', 291, 803, 70, 63, true),
		new obstruction('genericObstruction', 'obstruction', 273, 828, 23, 39, true),
		new obstruction('genericObstruction', 'obstruction', 360, 813, 27, 74, true),
		new obstruction('genericObstruction', 'obstruction', 381, 821, 39, 55, true),
		new obstruction('genericObstruction', 'obstruction', 362, 862, 77, 25, true),
		new obstruction('genericObstruction', 'obstruction', 429, 885, 50, 10, true),
		new obstruction('genericObstruction', 'obstruction', 468, 842, 45, 42, true),
		new obstruction('genericObstruction', 'obstruction', 477, 825, 45, 47, true),
		new obstruction('genericObstruction', 'obstruction', 495, 792, 73, 61, true),
		new obstruction('genericObstruction', 'obstruction', 535, 800, 59, 50, true),
		new obstruction('genericObstruction', 'obstruction', 594, 811, 33, 57, true),
		new obstruction('genericObstruction', 'obstruction', 593, 848, 51, 36, true),
		new obstruction('genericObstruction', 'obstruction', 616, 878, 67, 54, true),
		new obstruction('genericObstruction', 'obstruction', 660, 845, 65, 56, true),
		new obstruction('genericObstruction', 'obstruction', 678, 818, 52, 58, true),
		new obstruction('genericObstruction', 'obstruction', 713, 823, 74, 52, true),
		new obstruction('genericObstruction', 'obstruction', 748, 704, 70, 120, true),
		new obstruction('genericObstruction', 'obstruction', 733, 564, 42, 116, true),
		new obstruction('genericObstruction', 'obstruction', 747, 663, 27, 50, true),
		new obstruction('genericObstruction', 'obstruction', 717, 416, 27, 147, true),
		new obstruction('genericObstruction', 'obstruction', 692, 342, 42, 89, true),
		new obstruction('genericObstruction', 'obstruction', 660, 181, 73, 159, true),
		new obstruction('genericObstruction', 'obstruction', 635, 230, 61, 87, true),
		new obstruction('genericObstruction', 'obstruction', 577, 111, 73, 127, true),
		new obstruction('genericObstruction', 'obstruction', 471, 157, 110, 131, true),
		new obstruction('genericObstruction', 'obstruction', 584, 243, 28, 26, true),
		new obstruction('genericObstruction', 'obstruction', 372, 149, 97, 74, true),
		new obstruction('genericObstruction', 'obstruction', 456, 171, 15, 90, true),
		new obstruction('genericObstruction', 'obstruction', 273, 82, 98, 91, true),
		new obstruction('genericObstruction', 'obstruction', 359, 139, 30, 59, true),
		new obstruction('genericObstruction', 'obstruction', 206, 110, 69, 120, true),
		new obstruction('genericObstruction', 'obstruction', 175, 194, 37, 52, true),
		new obstruction('genericObstruction', 'obstruction', 352, 216, 19, 29, true)
	], 
	
	//Characters (map)
	[	
		new mapCharacter(
			"galenna",
			"438px",
			"758px",
			"maps/labrynna/sprites/galenna.gif",
			function () {},
			function () {},
			false
		),
		
		new mapCharacter(
			"rahlye",
			"395px",
			"309px",
			"maps/labrynna/sprites/rahlye.gif",
			function () {},
			function () {
				if (typeof currentArea.triggers["galennaBattle"] == "undefined") {
					stopAllMovement();
					message($("#rahlye"), "Welcome traveler. I am Rahlye, sage of the Gods. I can see you are confused. Worry not, all will be made clear in due time...", 8000);
					message($("#rahlye"), "What you see before you is the pool of Rahij, the God after whom I was named. I pray here for the safety of our land, Labrynna.", 8000, 8500);
					message($("#rahlye"), "Labrynna is currently under the siege of Galenna, the Sorceress of Shadows. I have been praying here for a savior. And now you have appeared before me...", 9000, 17000);
					setTimeout(function () {
						faceSprite($("#player"), "right");
						playerFacing = "right";
						toggleMapCharacter(getCharacterById("galenna"));
						faceSprite($("#galenna"), "left");
						moveMapCharacter(getCharacterById("galenna"), "391px", "399px", 6000, function () {
							message($("#galenna"), "Galenna: You have made a grave mistake in coming here, stranger. I would leave this place if I were you.", 5000, 0);
							message($("#player"), "I will leave when it pleases me, crone!", 5000, 5500);
							message($("#galenna"), "So be it...", 3000, 11000);
							setTimeout(function () {
								canMove = true;
								startBattle(player, {name: "Galenna", level: 2, displayLevel: 50, isPlayer: false, battleSprite: "maps/labrynna/battle-sprites/galenna.png", baseAttack: 4, maxHp: 25, currentHp: 25, battleMusic: "maps/labrynna/music/battle-music-boss.ogg", inventory: [
									{name: "Frostbolt", type: "Offensive Spell", damage: 10},
									{name: "Hail", type: "Offensive Spell", damage: 3},
									{name: "Flash Freeze", type: "Offensive Spell", damage: 1.5}
								], onDefeat: function () {
									currentArea.triggers["galennaBattle"] = 1;
									message($("#galenna"), "Of course you would defeat me on this hallowed ground! Next time we meet, your precious Rahij won't be around to protect you!", 7000, 0);
									setTimeout(function () {$("#galenna").fadeOut("slow", toggleMapCharacter(getCharacterById("galenna")));}, 7200);
								}});
							}, 14000);
						});
					}, 17000+9000);
				} else {
					getTriggerAreaById("defaultArea-forestPath").active = true;
					message($("#rahlye"), "A thrilling battle! Rahij clearly favours you as his champion. You should go to Landro Village and seek the aid of the Wisdom Stone there.", 8000, 0);
				}
			},
			true
		)
	],
	
	//triggerAreas
	[new triggerArea(
		"defaultArea-forestPath",
		false,
		417,
		827,
		61,
		68,
		function () {
			buildArea(getAreaById(2), ["-1836px", "-192px"]);
		}
	)]
	
	//Has random monsters
	,false
));

areas.push(new area (
	2, 										//id
	"Forest Path",
	"maps/labrynna/backgrounds/area2.png", 	//background
	"maps/labrynna/music/defaultArea-music.ogg", 				//music
	0.5, 						 			//timeOfDay;
	"-1836px", 								//StartPosition-top
	"-192px", 								//StartPosition-left
	{},										//Triggers

	//Obstructions
	[
	new obstruction('genericObstruction', 'obstruction', 1975, 340, 336, 66, true),
	new obstruction('genericObstruction', 'obstruction', 1968, 374, 49, 676, true),
	new obstruction('genericObstruction', 'obstruction', 1870, 1069, 61, 65, true),
	new obstruction('genericObstruction', 'obstruction', 1910, 1025, 52, 51, true),
	new obstruction('genericObstruction', 'obstruction', 1828, 1099, 39, 128, true),
	new obstruction('genericObstruction', 'obstruction', 1850, 1225, 57, 113, true),
	new obstruction('genericObstruction', 'obstruction', 1889, 1267, 37, 27, true),
	new obstruction('genericObstruction', 'obstruction', 1850, 1341, 31, 35, true),
	new obstruction('genericObstruction', 'obstruction', 1896, 1359, 67, 133, true),
	new obstruction('genericObstruction', 'obstruction', 1946, 1413, 36, 22, true),
	new obstruction('genericObstruction', 'obstruction', 2304, 400, 46, 1838, true),
	new obstruction('genericObstruction', 'obstruction', 438, 2238, 1332, 35, true),
	new obstruction('genericObstruction', 'obstruction', 1771, 2254, 18, 42, true),
	new obstruction('genericObstruction', 'obstruction', 1783, 2276, 23, 43, true),
	new obstruction('genericObstruction', 'obstruction', 1793, 2298, 29, 47, true),
	new obstruction('genericObstruction', 'obstruction', 1818, 2312, 23, 49, true),
	new obstruction('genericObstruction', 'obstruction', 1815, 2331, 48, 56, true),
	new obstruction('genericObstruction', 'obstruction', 1853, 2351, 33, 174, true),
	new obstruction('genericObstruction', 'obstruction', 1894, 2238, 429, 10, true),
	new obstruction('genericObstruction', 'obstruction', 297, 1389, 1593, 112, true),
	new obstruction('genericObstruction', 'obstruction', 1575, 1616, 73, 76, true),
	new obstruction('genericObstruction', 'obstruction', 1272, 2029, 74, 74, true),
	new obstruction('genericObstruction', 'obstruction', 1883, 2238, 10, 121, true),
	new obstruction('genericObstruction', 'obstruction', 1900, 1565, 38, 38, true),
	new obstruction('genericObstruction', 'obstruction', 1783, 1504, 193, 21, true),
	new obstruction('genericObstruction', 'obstruction', 1783, 1515, 38, 88, true),
	new obstruction('genericObstruction', 'obstruction', 2065, 1876, 35, 147, true),
	new obstruction('genericObstruction', 'obstruction', 2021, 1928, 185, 39, true),
	new obstruction('genericObstruction', 'obstruction', 2034, 1894, 153, 110, true),
	new obstruction('genericObstruction', 'obstruction', 2100, 1880, 50, 36, true),
	new obstruction('genericObstruction', 'obstruction', 2090, 1969, 58, 47, true),
	new obstruction('genericObstruction', 'obstruction', 2049, 1883, 34, 30, true),
	new obstruction('genericObstruction', 'obstruction', 2050, 1976, 42, 38, true),
	new obstruction('genericObstruction', 'obstruction', 1657, 1918, 186, 150, true),
	new obstruction('genericObstruction', 'obstruction', 848, 1963, 188, 117, true),
	new obstruction('genericObstruction', 'obstruction', 1013, 2081, 82, 129, true),
	new obstruction('genericObstruction', 'obstruction', 817, 2197, 195, 22, true),
	new obstruction('genericObstruction', 'obstruction', 782, 2067, 95, 140, true),
	new obstruction('genericObstruction', 'obstruction', 323, 1799, 102, 40, true),
	new obstruction('genericObstruction', 'obstruction', 316, 1955, 109, 39, true),
	new obstruction('genericObstruction', 'obstruction', 298, 1664, 150, 113, true),
	new obstruction('genericObstruction', 'obstruction', 402, 1707, 65, 27, true),
	new obstruction('genericObstruction', 'obstruction', 337, 1593, 49, 74, true),
	new obstruction('genericObstruction', 'obstruction', 375, 1559, 67, 30, true),
	new obstruction('genericObstruction', 'obstruction', 381, 1576, 42, 52, true),
	new obstruction('genericObstruction', 'obstruction', 382, 1517, 40, 59, true),
	new obstruction('genericObstruction', 'obstruction', 343, 1502, 42, 43, true),
	new obstruction('genericObstruction', 'obstruction', 228, 1791, 21, 198, true),
	new obstruction('genericObstruction', 'obstruction', 232, 1772, 88, 19, true),
	new obstruction('genericObstruction', 'obstruction', 247, 1990, 68, 12, true),
	new obstruction('genericObstruction', 'obstruction', 432, 2011, 13, 107, true),
	new obstruction('genericObstruction', 'obstruction', 417, 2052, 46, 24, true),
	new obstruction('genericObstruction', 'obstruction', 402, 2144, 10, 139, true),
	new obstruction('genericObstruction', 'obstruction', 412, 2254, 38, 37, true),
	new obstruction('genericObstruction', 'obstruction', 372, 2188, 58, 22, true),
	new obstruction('genericObstruction', 'obstruction', 387, 2096, 30, 29, true),
	new obstruction('genericObstruction', 'obstruction', 369, 2125, 18, 63, true),
	new obstruction('genericObstruction', 'obstruction', 355, 2076, 82, 31, true),
	new obstruction('genericObstruction', 'obstruction', 608, 1690, 187, 148, true),
	new obstruction('genericObstruction', 'obstruction', 670, 1561, 185, 139, true)
	],
	
	//Characters (map)
	[
		new mapCharacter(
			"oldman",
			"2021px",
			"679px",
			"maps/labrynna/sprites/oldman.gif",
			function () {},
			function () {
				stopAllMovement();
				message($("#oldman"), "Tread carefully child. Outside the forest haven of Rahij, monsters can pop out at any time. Be prepared to battle!", 8000, 0);
				message($("#oldman"), "Let me heal your wounds.", 4000, 8500);
				player.currentHp = player.maxHp;
				setTimeout(function () {canMove=true;}, 12500);
			},
			true
		),
		
		new mapCharacter(
			"galennaGuard",
			"719px",
			"2125px",
			"maps/labrynna/sprites/oldman.gif",
			function () {
				$("#galennaGuard").hide();
			},
			function () {},
			true
		),
	],
	
	//TriggerAreas
	[new triggerArea(
		"forestPath-defaultArea",
		true,
		2017,
		406,
		287,
		19,
		function () {
			buildArea(getAreaById(1), ["-160px","-368px"]);
		}
	),
	
	new triggerArea(
		"forestPath-landroVillage",
		true,
		393,
		1841,
		42,
		110,
		function () {
			buildArea(getAreaById(3), ["-1420px","-444px"]);
		}
	)
	
	/*new triggerArea(
		"galennaGuardEncounter",
		true,
		450,
		1781,
		20,
		227,
		function () {
			$("#galennaGuard").show();
			faceSprite($("#galennaGuard"), "up");
			var top = $("#map").offset().right+34;
			var left = $("#map").offset().left;
			getCharacterById("galennaGuard").top = top;
			getCharacterById("galennaGuard").left = left;
			$("#galeannaGuard").animate({
				left: left,
				top: top
			}, 3000);
		})*/
	]
	
	//Has random monsters
	,true
));

areas.push(new area(
	//function area (id, background, music, timeOfDay, topStart, leftStart, triggers, obstructions, characters, triggerAreas, hasRandomMonsters) 
	3,
	"Landro Village",
	"maps/labrynna/backgrounds/area3.png",
	"maps/labrynna/music/wind-sfx.ogg",
	0.5,
	"-1420px",
	"-444px",
	{},
	[
		new obstruction('genericObstruction', 'obstruction', 1331, 1073, 225, 10, true),
		new obstruction('genericObstruction', 'obstruction', 1781, 704, 92, 36, true),
		new obstruction('genericObstruction', 'obstruction', 1780, 859, 89, 38, true),
		new obstruction('genericObstruction', 'obstruction', 1731, 898, 112, 144, true),
		new obstruction('genericObstruction', 'obstruction', 1700, 1041, 168, 136, true),
		new obstruction('genericObstruction', 'obstruction', 1734, 553, 143, 146, true),
		new obstruction('genericObstruction', 'obstruction', 1629, 546, 42, 77, true),
		new obstruction('genericObstruction', 'obstruction', 1626, 440, 43, 75, true),
		new obstruction('genericObstruction', 'obstruction', 1708, 404, 130, 146, true),
		new obstruction('genericObstruction', 'obstruction', 310, 320, 1408, 81, true),
		new obstruction('genericObstruction', 'obstruction', 1506, 424, 28, 234, true),
		new obstruction('genericObstruction', 'obstruction', 1370, 407, 49, 78, true),
		new obstruction('genericObstruction', 'obstruction', 980, 411, 393, 37, true),
		new obstruction('genericObstruction', 'obstruction', 979, 411, 49, 308, true),
		new obstruction('genericObstruction', 'obstruction', 1075, 490, 193, 230, true),
		new obstruction('genericObstruction', 'obstruction', 1270, 490, 38, 34, true),
		new obstruction('genericObstruction', 'obstruction', 1321, 851, 190, 232, true),
		new obstruction('genericObstruction', 'obstruction', 1511, 851, 39, 95, true),
		new obstruction('genericObstruction', 'obstruction', 1512, 992, 42, 92, true),
		new obstruction('genericObstruction', 'obstruction', 1539, 891, 43, 35, true),
		new obstruction('genericObstruction', 'obstruction', 1530, 1009, 53, 36, true),
		new obstruction('genericObstruction', 'obstruction', 1321, 1193, 225, 231, true),
		new obstruction('genericObstruction', 'obstruction', 1359, 1423, 144, 81, true),
		new obstruction('genericObstruction', 'obstruction', 1581, 1623, 202, 274, true),
		new obstruction('genericObstruction', 'obstruction', 1781, 1173, 93, 611, true),
		new obstruction('genericObstruction', 'obstruction', 1376, 1562, 163, 139, true),
		new obstruction('genericObstruction', 'obstruction', 1272, 1538, 102, 77, true),
		new obstruction('genericObstruction', 'obstruction', 1177, 1525, 92, 51, true),
		new obstruction('genericObstruction', 'obstruction', 1048, 1565, 136, 40, true),
		new obstruction('genericObstruction', 'obstruction', 934, 1594, 137, 57, true),
		new obstruction('genericObstruction', 'obstruction', 789, 1463, 181, 153, true),
		new obstruction('genericObstruction', 'obstruction', 705, 838, 201, 625, true),
		new obstruction('genericObstruction', 'obstruction', 982, 1220, 187, 148, true),
		new obstruction('genericObstruction', 'obstruction', 1109, 1009, 77, 78, true),
		new obstruction('genericObstruction', 'obstruction', 915, 853, 186, 232, true),
		new obstruction('genericObstruction', 'obstruction', 703, 546, 202, 209, true),
		new obstruction('genericObstruction', 'obstruction', 772, 396, 179, 149, true),
		new obstruction('genericObstruction', 'obstruction', 388, 618, 103, 78, true),
		new obstruction('genericObstruction', 'obstruction', 547, 620, 100, 73, true),
		new obstruction('genericObstruction', 'obstruction', 386, 879, 103, 75, true),
		new obstruction('genericObstruction', 'obstruction', 545, 882, 101, 73, true),
		new obstruction('genericObstruction', 'obstruction', 386, 1010, 187, 149, true),
		new obstruction('genericObstruction', 'obstruction', 220, 672, 131, 75, true),
		new obstruction('genericObstruction', 'obstruction', 220, 830, 131, 74, true),
		new obstruction('genericObstruction', 'obstruction', 332, 404, 88, 134, true),
		new obstruction('genericObstruction', 'obstruction', 315, 541, 36, 129, true),
		new obstruction('genericObstruction', 'obstruction', 243, 906, 106, 124, true),
		new obstruction('genericObstruction', 'obstruction', 198, 1031, 89, 163, true),
		new obstruction('genericObstruction', 'obstruction', 337, 1215, 304, 237, true),
		new obstruction('genericObstruction', 'obstruction', 284, 1189, 97, 55, true),
		new obstruction('genericObstruction', 'obstruction', 641, 1367, 63, 68, true)
	],
	[
		new mapCharacter(
			"oldman",
			"1539px",
			"670px",
			"maps/labrynna/sprites/oldman.gif",
			function () {},
			function () {
				
				if (typeof currentArea.triggers["TheRisingThreat"] == "undefined") {
					currentArea.triggers["TheRisingThreat"] = "given";
					stopAllMovement();
					message($("#oldman"), "Those wretched zombies ate my horses! Their attacks just keep coming more and more often. Could you help an old man out and purge some of these horrible beings?", 8000, 0);
					givePlayerQuest(new quest(1, "The Rising Threat", "The forests around the village are riddled with zombies. Somehow they are multiplying so it would be helpful to thin the herd. Kill a few to ease the pressure on Landro Village.", [
						new questObjective(
							1, "Kill 5 Mindless Zombies", 5, 0
						)
					]));
					setTimeout(function () {canMove=true;}, 8000);
				} else if (getQuestById(1) == -1) {
					message($("#oldman"), "Thank you so much for the help, friend!", 5000, 0);
				} else if (!questIsComplete(getQuestById(1))) {
					message($("#oldman"), "Finish killing those zombies yet?", 6000, 0);
				} else {
					completeQuest(getQuestById(1));
				}
				
				
			},
			true
		),
		
		new mapCharacter(
			"galennaGuard",
			"316px",
			"772px",
			"maps/labrynna/sprites/galennaGuard.gif",
			function () {},
			function () {},
			false
		),
		
		new mapCharacter(
			"galennaGrunt1",
			"908px",
			"760px",
			"maps/labrynna/sprites/galennaGrunt.gif",
			function () {},
			function () {
				if (typeof currentArea.triggers["grunt1"] == "undefined") {
					stopAllMovement();
					currentArea.triggers["grunt1"] = 1;
					message($("#galennaGrunt1"), "No one is to enter the Haven of the Stone, by order of the Mistress' decree!", 3000, 0);
					setTimeout(function () { 
						startBattle(player, new character(
							"Dark Grunt",
							2,
							false,
							25,
							25,
							"maps/labrynna/sprites/oldman.gif",
							"maps/labrynna/battle-sprites/galennaGrunt.png",
							[new item("Shade", "Offensive Spell", 10)],
							5,
							false,
							"",
							"maps/labrynna/music/battle-music-boss.ogg",
							function () { 
								if (typeof currentArea.triggers["grunt2"] != "undefined") {
									message($("#galennaGrunt1"), "Aaah!", 1500, 0, "up");
									faceSprite($("#galennaGrunt2"), "up");
									moveMapCharacter(getCharacterById("galennaGrunt1"), "500px", "760px", 1000, function () {toggleMapCharacter(getCharacterById("galennaGrunt1"))});
									moveMapCharacter(getCharacterById("galennaGrunt2"), "500px", "803px", 1000, function () {toggleMapCharacter(getCharacterById("galennaGrunt2"))});
								}
							}
						)
					);}, 3500);
				} else {
					message($("#galennaGrunt1"), "You may have beaten me, but my friend is even more powerful!", 3000, 0);
				}
			},
			true
		),
		
		new mapCharacter(
			"galennaGrunt2",
			"908px",
			"803px",
			"maps/labrynna/sprites/galennaGrunt.gif",
			function () {},
			function () {
				if (typeof currentArea.triggers["grunt2"] == "undefined") {
					stopAllMovement();
					currentArea.triggers["grunt2"] = 1;
					message($("#galennaGrunt2"), "Stand back citizen! This is Dark Syndicate territory!", 3000, 0);
					setTimeout(function () { 
						startBattle(player, new character(
							"Dark Grunt",
							2,
							false,
							25,
							25,
							"maps/labrynna/sprites/oldman.gif",
							"maps/labrynna/battle-sprites/galennaGrunt.png",
							[new item("Shade", "Offensive Spell", 10)],
							4,
							false,
							"",
							"maps/labrynna/music/battle-music-boss.ogg",
							function () { 
								if (typeof currentArea.triggers["grunt1"] != "undefined") {
									message($("#galennaGrunt1"), "Aaah!", 1500, 0, "up");
									faceSprite($("#galennaGrunt2"), "up");
									moveMapCharacter(getCharacterById("galennaGrunt1"), "500px", "760px", 1000, function () {toggleMapCharacter(getCharacterById("galennaGrunt1"))});
									moveMapCharacter(getCharacterById("galennaGrunt2"), "500px", "803px", 1000, function () {toggleMapCharacter(getCharacterById("galennaGrunt2"))});
								}
							}
						)
					);}, 3500);
				} else {
					message($("#galennaGrunt2"), "You may have beaten me, but my friend is even more powerful!", 3000, 0);
				}
			},
			true
		)
		
	],
	[
		new triggerArea(
			"landroVillage-forestPath",
			true,
			1770,
			737,
			10,
			128,
			function () {
				buildArea(getAreaById(2), ["-210px", "-1538px"]);
			}
		),
		
		new triggerArea(
			"landroVillage-houseOfHealing",
			true,
			1514,
			949,
			28,
			39,
			function () {
				buildArea(getAreaById(100));
			}
		),
		
		new triggerArea(
			"galennaGuardEncounter",
			true,
			678,
			738,
			16,
			117,
			function () {
				if (typeof currentArea.triggers["galennaGuardEncounter"] == "undefined") {
					currentArea.triggers["galennaGuardEncounter"] = 1;
					stopAllMovement();
					faceSprite($("#player"), "up");
					playerFacing = "up";
					toggleMapCharacter(getCharacterById("galennaGuard"));
					faceSprite($("#galennaGuard"), "down");
					moveMapCharacter(getCharacterById("galennaGuard"), "598px", "786px", 3000, function () {
						message($("#galennaGuard"), "Halt! So you're the one causing all this trouble!", 5000, 0);
						message($("#galennaGuard"), "Very well, I will deal with you myself!", 5000, 5000);
						setTimeout(
							function () { startBattle(player, new character(
								"Dark Executive",
								4,
								false,
								50,
								50,
								"maps/labrynna/sprites/oldman.gif",
								"maps/labrynna/battle-sprites/galennaGuard.png",
								[new item("Shade", "Offensive Spell", 10)],
								6,
								false,
								"",
								"maps/labrynna/music/battle-music-boss.ogg",
								function () {
									message($("#galennaGuard"), "Gah! The Mistress will hear about this!", 2000, 0, "down");
									moveMapCharacter(getCharacterById("galennaGuard"), "1084px", "785px", 800, function () {
										toggleMapCharacter(getCharacterById("galennaGuard"));
									});
								}
							));
						}, 11000);
					});
				}
			}
		),
	],
	false
));

areas.push(new area(
	//function area (id, background, music, timeOfDay, topStart, leftStart, triggers, obstructions, characters, triggerAreas, hasRandomMonsters) 
	100,
	"The House of Healing",
	"maps/labrynna/backgrounds/healHouse.png",
	"maps/labrynna/music/houseOfHealing-music.ogg",
	0.0,
	-298,
	-218,
	{},
	[
		new obstruction('genericObstruction', 'obstruction', 621, 376, 74, 172, true),
		new obstruction('genericObstruction', 'obstruction', 620, 599, 62, 185, true),
		new obstruction('genericObstruction', 'obstruction', 230, 723, 412, 80, true),
		new obstruction('genericObstruction', 'obstruction', 228, 366, 433, 58, true),
		new obstruction('genericObstruction', 'obstruction', 272, 457, 61, 233, true),
		new obstruction('genericObstruction', 'obstruction', 206, 400, 72, 92, true),
		new obstruction('genericObstruction', 'obstruction', 233, 679, 43, 60, true),
		new obstruction('genericObstruction', 'obstruction', 445, 473, 10, 203, true),
		new obstruction('genericObstruction', 'obstruction', 333, 457, 203, 14, true),
		new obstruction('genericObstruction', 'obstruction', 505, 469, 32, 69, true),
		new obstruction('genericObstruction', 'obstruction', 505, 609, 31, 81, true),
		new obstruction('genericObstruction', 'obstruction', 328, 674, 208, 15, true),
		new obstruction('genericObstruction', 'obstruction', 660, 522, 32, 118, true)
	],
	[
		new mapCharacter(
			"yndruPriestess",
			"474px",
			"561px",
			"maps/labrynna/sprites/yndruPriestess.gif",
			function () {},
			function () {		
				stopAllMovement();
				message($("#yndruPriestess"), "Welcome to the House of Healing. Regardless of where you are in Labrynna, the God Yndru looks upon you with his healing gaze. Be refreshed, child!", 8000, 0);
				setTimeout(function () { canMove = true; player.currentHp = player.maxHp; }, 8000);
			},
			true
		)
	],
	[
		new triggerArea(
			"houseOfHealing-landroVillage",
			true,
			635,
			547,
			33,
			52,
			function () {
				buildArea(getAreaById(3), ["-1320px","-612px"]);
			}
		)
	],
	false
));