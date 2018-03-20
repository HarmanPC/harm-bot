"use strict";

const Debate_FILE = "config/debate.json";

exports.game = "debate";
const DebateManger = require ('../debate-manager.js');
const DebateFile = new DebateManger(Debate_FILE);

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
		this.type = this.args[0];
		if (this.args[0].toLowerCase() !== '1v1' && this.args[0].toLowerCase() !== 'casual' && this.args[0].toLowerCase() !== 'teams') {
			this.sendRoom('Invalid mode.');
			this.destroy();
		}
        if (this.args[0].toLowerCase() == "1v1") {
			if (this.args[1].split("vs")[0].trim() == this.args[1].split("vs")[1].trim()) {
				this.sendRoom('Both players are same.');
				return this.onEnd();
			}
			this.sendRoom(`A Debate is starting between ${Users.get(this.args[1].split("vs")[0].trim()).name} and ${Users.get(this.args[1].split("vs")[1].trim()).name}!`);
			
			super.onJoin(Users.get(this.args[1].split("vs")[0].trim()));
			super.onJoin(Users.get(this.args[1].split("vs")[1].trim()));
			
			this.allowJoins = false;
			this.state = "started";
			
			this.pone = Users.get(this.args[1].split("vs")[0].trim()).name;
			this.ptwo = Users.get(this.args[1].split("vs")[1].trim()).name;
			
			this.onStart();
		} else if (this.args[0].toLowerCase() == 'casual') {
			this.sendRoom('Debateinfo! A casual Debate is starting. (Free Join!)');
			this.onStart();
		} else {
			this.sendRoom("Debateinfo! A Debate is starting. ``" + this.room.commandCharacter[0] + "join`` to join the Debate. (" + this.type.toLowerCase() + ")");
		}
    }
    
    onStart() {
	if ((this.userList.length < 2 || this.state !== "signups") && !this.args[0].toLowerCase() == 'casual') return;
	if ((this.userList.length % 2 !== 0 && this.args[0].toLowerCase == "teams") && !this.args[0].toLowerCase() == 'casual') return;
 	this.state = "started";
	this.allowJoins = false;
	if (this.args[0].toLowerCase() == 'casual') this.allowJoins = true;
        this.startingPlayers = this.userList.length;
        
        this.prepTurn();
    }
    
    postPlayerList() {
        let pl = this.userList.sort().map(u => this.users[u].name);
        
        this.sendRoom(`Players (${this.userList.length}): ${pl.join(", ")}`);
    }
    
    prepTurn() {
        if (!this.args[0].toLowerCase() == 'casual') this.postPlayerList();
		
		this.startDebate();
    }
	
	loopTimeout(mode, time) {
		if (mode == "1v1"){
			this.clock++;
			debatelog('The debate clock: ' + this.clock);
			this.timer = setTimeout(() => {
				if (this.clock > 3) {
					this.sendRoom(`Time is up!`);
					this.sendRoom(`Debate over! A staff member or staff-approved non-Debater shall now judge the winner!`);
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
		if (this.args[0].toLowerCase().trim() == "casual") {
			let debate;
			if (!this.args[2]) {
				debate = DebateFile.getQuestion();
			} else {
				debate = {
					question: this.args[2]
				};
			}
			this.debateTopic = debate.question.trim();
			this.sendRoom(`The debate has begun! The topic is: **${this.debateTopic}?** This is a casual debate; Anyone may join or leave partway through.`);
			this.timer = setTimeout(() => {
				this.sendRoom(`Time's up! The Debate has ended!`);
				this.onEnd();
			}, (parseInt(this.args[1]) * 1000 * 60 || 5 * 60 * 1000));
		} else if (this.args[0].toLowerCase() == "1v1") {
			let debate;
			this.clock = 0;
			if (!this.args[3]) {
				debate = DebateFile.getQuestion();
			} else {
				debate = {
					question: this.args[3]
				};
			}
			this.DebateTopic = debate.question.trim();
			this.sendRoom(`The Debate has begun! The topic is: **${this.DebateTopic}?**`);
			this.sendRoom(`Both players get 5 minutes to agree on a side and do research!`);
			this.timer = setTimeout(() => {
				this.sendRoom(`Time is up! The Debate shall now commence!`);
				this.sendRoom(`${Users.get(this.args[1].split("vs")[0].trim()).name}'s turn!`);
				this.loopTimeout("1v1", (this.args[2] * 60 * 1000) || 3 * 60 * 1000);
			}, 5 * 60 * 1000);
		} else if (this.args[0].toLowerCase() == "teams") {
			let debate;
			this.clock = 0;
			if (!this.args[2]) {
				debate = {
				    question: DebateFile.getQuestion()
				};
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
			this.sendRoom(`The Debate has begun! The topic is: **${this.debateTopic}?**`);
			this.sendRoom(`Team 1: ${this.teamOne.join(',')} vs Team 2: ${this.teamTwo.join(',')} 5 minutes to agree on a side and do research!`);
			this.timer = setTimeout(() => {
				this.sendRoom(`Time is up! The Debate shall now commence!`);
				this.sendRoom(`Team 1's turn!`);
				this.loopTimeout("teams", this.args[1] * 60 * 1000);
			}, 5 * 60 * 1000); 
		} else {
			this.sendRoom('The mode ' + this.args[0].toLowerCase() + ' doesn\'t exist.');
			this.onEnd();
		}
	}
    onEnd() {
        this.state = "ended";
		this.sendRoom(`Debate ended.`);
		debatelog('Debate ended.');
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
        if (!room || !user.hasBotRank("+")) return false;
		if (!target) return this.room.send(null, 'Usage: ``.debate [casual/teams/1v1], [Time per round / sets default if left blank], [Topic / sets random topic from .debateqs]``');
        if (room.game && room.game.gameId !== 'host' && !room.game.type) return this.room.send(null, "There is already a Debate going on in this room!");
        if (room.game && room.game.gameId !== 'host' && room.game.type) return this.room.send(null, "There is already a Debate going on in this room! (" + room.game.type + ")");
		room.game = new DebateGame(room, target);
		debatelog('Scripted debate started (' + room.game.type + ')');
    },
	checkdebate: function (target, room, user){
		if (!room || !user.hasBotRank('+')) return false;
        if (room.game && room.game.gameId === 'host' && room.game.official == true) return this.room.send(null, room.game.hostName + " is hosting official Debate.");
		if (room.game && room.game.gameId === 'host' && room.game.official == false) return this.room.send(null, room.game.hostName + " is hosting a Debate.");
		if (room.game && room.game.gameId === 'debate') return this.room.send(null, `A scripted Debate is in progress. (${room.game.type})`);
		this.room.send(null, `No Debate is going on right now.`);
	},
	addq:'addquestion',
    addquestion: function (target, room, user) {
        if (!user.hasBotRank("+")) return false;
        if (!target) return this.send('``.addquestion [question]``');
        let question = target.toString();
        
        if (DebateFile.findQuestion(question)) return this.send("The question already exists.");
        
        DebateFile.addQuestion(question).write();
        if (!room) {
        	this.send("Added! (__" + question + "__)"); 
        }
        else {
        	this.room.send(null,"Added! (__" + question + "__)"); 
        }
    },
    delq:'deletequestion',
    deletequestion: function (target, room, user) {
        if (!user.hasBotRank("+")) return false;
        if (!target) return this.send('``.deletequestion [question]``');
        let question = target.toString();
        
        DebateFile.removeQuestion(question).write();
        if (!room) {
        	this.send("Deleted! (__" + question + "__)"); 
        }
        else {
        	this.room.send(null,"Deleted! (__" + question + "__)"); 
        }
    },
    debateqs:'debatequestions',
    debatequestions: function (target, room, user) {
        if (!user.hasBotRank("+")) return false;
        let questions = DebateFile.allQuestions();
        
        Tools.uploadToHastebin(questions.map(q => `Question: ${q.question}`).join("\n\n"), 
            link => this.room.send(null, `Debate questions(${questions.length}): ${link}`));
    },
	question:'topic',
	topic: function (target, room, user) {
		if (!user.hasBotRank('host')) return false;
		let question = DebateFile.getQuestion();
		this.room.send(null, question.question.trim() + "?");
	},
	debatelogs: function (target, room, user) {
		if (!user.hasBotRank('%')) return false;
		if (room) return user.sendTo('Please use this command in my PMs only.');
		fs.readFile("./config/debatelogs.txt", "utf-8", (err, data) => { 
			if (!err) {
				Tools.uploadToHastebin("Debate logs \n\n" + data, link => user.sendTo("Debate logs: " + link));
			}
			else {
				user.sendTo('Error getting logs.');
				console.log(err);
			}
		});
	}
};
/*globals Tools*/
/*globals Users*/
/*globals Rooms*/
/*globals debatelog*/
/*globals fs*/