"use strict";

const DEBATE_FILE = "data/debate.json";
const DebateManager = require("../debate-manager");

exports.game = "debate";

const Debate = new DebateManager(DEBATE_FILE);

class DebateGame extends Rooms.botGame {
    constructor (room, arg) {
        super(room);
        
        this.gameId = "debate";
        this.gameName = "Debate";
        
        this.answerCommand = "special";
        this.allowJoins = true;
        
        this.state = "signups";
        
        this.playerObject = DebateGamePlayer;
		this.args = arg.split(',');
        if (this.args[0].toLowerCase() == "1v1") {
        	if (this.args[1].split("vs")[0].trim() == this.args[1].split("vs")[1].trim()) {
				this.sendRoom('Both players are same.');
				return this.onEnd();
			}
			this.sendRoom(`A Debate is starting between ${Users.get(this.args[1].split("vs")[0].trim()).name} and ${Users.get(this.args[1].split("vs")[1].trim()).name}!`);
			
			super.onJoin(Users.get(this.args[1].split("vs")[0].trim()));
			super.onJoin(Users.get(this.args[1].split("vs")[1].trim()));
			
			this.allowJoins = false;
			
			this.pone = Users.get(this.args[1].split("vs")[0].trim()).name;
			this.ptwo = Users.get(this.args[1].split("vs")[1].trim()).name;
			
			this.onStart();
		} else {
			this.sendRoom("A Debate is starting. ``" + this.room.commandCharacter[0] + "join`` to join the debate. (" + this.type + ")");
		}
		 this.type = this.args[0];
    }
    
    onStart() {
        if (this.userList.length < 2 || this.state !== "signups") return;
		if (this.userList.length % 2 !== 0 && this.args[0].toLowerCase == "teams") return;
        this.state = "started";
        this.startingPlayers = this.userList.length;
        
        this.prepTurn();
    }
    
    postPlayerList() {
        let pl = this.userList.sort().map(u => this.users[u].name);
        
        this.sendRoom(`Players (${this.userList.length}): ${pl.join(", ")}`);
    }
    
    prepTurn() {
        this.postPlayerList();
		
		this.startDebate();
    }
	
	loopTimeout(mode, time) {
		if (mode == "1v1"){
			this.clock++;
			console.log(this.clock);
			this.timer = setTimeout(() => {
				if (this.clock > 3) {
					this.sendRoom(`Time is up!`);
					this.sendRoom(`Debate over! A staff member or staff-approved non-debater shall now judge the winner!`);
					this.onEnd();
				} else {
					this.sendRoom(`Time is up!`);
					if (this.clock % 2 == 1) {
						this.sendRoom(`${this.ptwo}'s turn!`);
					} else if (this.clock % 2 == 0) {
						this.sendRoom(`${this.pone}'s turn!`);
					}
					this.loopTimeout(mode, time);
				}
			}, time);
			
		}
		if (mode == "teams"){
			this.clock++;
			this.timer = setTimeout(() => {
				if (this.clock > 3) {
					this.sendRoom(`Time is up!`);
					this.sendRoom(`Debate over! A staff member or staff-approved user shall now judge the winning team`);
					this.onEnd();
				} else {
					this.sendRoom(`Time is up!`);
					if (this.clock % 2 == 0) {
						this.sendRoom(`Team 1's turn!`);
					} else if (this.clock % 2) {
						this.sendRoom(`Team 2's turn!`);
					}
					this.loopTimeout(mode, time);
				}
			}, time);
		}
	}
	
	startDebate() {
		clearTimeout(this.timer);
		if (this.args[0].toLowerCase() == "casual") {
			let debate;
			if (!this.args[2]) {
				debate = Debate.getQuestion();
			} else {
				debate = {
					question: this.args[2]
				};
			}
			this.debateTopic = debate.question.trim();
			this.sendRoom(`The debate has begun! The topic is: **${this.debateTopic}?**`);
			if (this.args[1] && !isNaN(this.args[1])) {
				this.timer = setTimeout(() => {
					this.sendRoom(`Time's up! The debate has ended!`);
					this.onEnd();
				}, (parseInt(this.args[1]) * 1000 * 60) || 5 * 60 * 1000);
			}
		}
		if (this.args[0].toLowerCase() == "1v1") {
			let debate;
			this.clock = 0;
			if (!this.args[3]) {
				debate = Debate.getQuestion();
			} else {
				debate = {
					question: this.args[3]
				};
			}
			this.debateTopic = debate.question.trim();
			this.sendRoom(`The debate has begun! The topic is: **${this.debateTopic}?**`);
			this.sendRoom(`Both players get 5 minutes to agree on a side and do research!`);
			this.timer = setTimeout(() => {
				this.sendRoom(`Time is up! The debate shall now commence!`);
				this.sendRoom(`${Users.get(this.args[1].split("vs")[0].trim())}'s turn!`);
				this.loopTimeout("1v1", (this.args[2] * 60 * 1000) || 3 * 60 * 1000);
			}, 5 * 60 * 1000);
		}
		if (this.args[0].toLowerCase() == "teams") {
			let debate;
			this.clock = 0;
			if (!this.args[2]) {
				debate = Debate.getQuestion();
			} else {
				debate = {
					question: this.args[2]
				};
			}
			this.teamOne = [];
			let uList;
			for (let i = 0; i < (this.startingPlayers / 2); i++){
				uList = this.userList.sort().map(u => this.users[u].name);
				let player = uList[Math.floor(Math.random() * (this.startingPlayers - i))];
				this.teamOne.push(player.toString() + " | ");
				uList.splice(uList.indexOf(player), 1);
			}
			this.teamTwo = uList;
			for (let i = 0; i < this.teamTwo.length; i++) {
				this.teamTwo[i] = this.teamTwo[i] + " | ";
			}
			this.debateTopic = debate.question.trim();
			this.sendRoom(`The debate has begun! The topic is: **${this.debateTopic}?**`);
			this.sendRoom(`Team 1: ${this.teamOne.join(',')} vs Team 2: ${this.teamTwo.join(',')} 5 minutes to agree on a side and do research!`);
			this.timer = setTimeout(() => {
				this.sendRoom(`Time is up! The debate shall now commence!`);
				this.sendRoom(`Team 1's turn!`);
				this.loopTimeout("teams", this.args[1] * 60 * 1000);
			}, 5 * 60 * 1000); 
		}
	}

    onEnd() {
        this.state = "ended";
		this.sendRoom(`Debate ended.`);
        this.destroy();
    }
}

class DebateGamePlayer extends Rooms.botGamePlayer {
    constructor (user, game) {
        super(user, game);
    }
}

exports.commands = {
    debate: function (target, room, user) {
        if (!room || !this.can("debate")) return false;
        if (room.game && room.game.gameId !== 'host') return this.send("There is already a debate going on in this room! (" + room.game.type + ")");
			room.game = new DebateGame(room, target);
    },
    addq:'addquestion',
    addquestion: function (target, room, user) {
        if (!user.hasBotRank("%")) return false;
        
        let question = target.toString();
        
        if (Debate.findQuestion(question)) return this.send("The question already exists.");
        
        Debate.addQuestion(question).write();
        
        this.send("Added!");
    },
    delq:'deletequestion',
    deletequestion: function (target, room, user) {
        if (!user.hasBotRank("%")) return false;
        
        let question = target.toString();
        
        Debate.removeQuestion(question).write();
    },
    debateqs:'debatequestions',
    debatequestions: function (target, room, user) {
        if (!user.hasBotRank("+")) return false;
        let questions = Debate.allQuestions();
        
        Tools.uploadToHastebin(questions.map(q => `Question: ${q.question}`).join("\n\n"), 
            link => user.sendTo(`${questions.length} questions - ${link}`));
    },
    topic: function (target, room, user) {
	if (!user.hasBotRank("+")) return false;
		
	let question = Debate.getQuestion();
		
	this.send(question.question.trim() + "?");
	}
};
/*globals Tools*/
/*globals Users*/
/*globals Rooms*/
