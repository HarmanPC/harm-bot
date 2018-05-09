"use strict";

const Debate_FILE = "config/debate.json";
const DEFAULT_TIME = 5 * 60 * 1000;

const DebateManger = require ('../manager.js');
const DebateFile = new DebateManger(Debate_FILE);
exports.game = "debate";

class DebateGame extends Rooms.Debates {
	constructor (room, type, pl_time, topic_time, topic_nothing) { // _ means OR
		super(room);

		this.gameName = "Debate";
		this.gameId = toId(this.gameName);

		this.answerCommand = "special";
		this.allowJoins = true;

		this.state = "signups";
		this.playerObject = DebateGamePlayer;
		this.type = toId(type);
		this.players = this.userList.sort().map(u => this.users[u].name);

		if (this.type == "1v1") {
			this.args = [type, pl_time, Number(topic_time), topic_nothing];
			this.p1 = pl_time[0];
			this.p2 = pl_time[1];
			this.sendRoom(`A Debate is starting between ${this.p1.name} and ${this.p2.name}!`);

			super.onJoin(this.p1);
			super.onJoin(this.p2);

			this.allowJoins = false;
			this.onStart();
		}
		else {
			this.args = [type, pl_time, topic_time];
			this.sendRoom("Debateinfo! A Debate is starting. ``" + this.room.commandCharacter[0] + "join`` to join the Debate. (" + this.type + ")");
		}
	}

	onStart() {
		if ((this.userList.length < 2 || this.state !== "signups")) return;
 		this.state = "started";
		this.allowJoins = false;
		debatelog(`Players (${this.userList.length}): ${this.players.join(", ")}`);

		this.startingPlayers = this.userList.length;

		this.startDebate();
	}

	postPlayerList() {
		this.sendRoom(`Players (${this.userList.length}): ${this.players.join(", ")}`);
	}

	loopTimeout(mode, time) {
		if (mode == "1v1"){
			this.clock++;
			this.timer = setTimeout(() => {
				if (this.clock > 6 /* 3 rounds */) {
					this.sendRoom(`Time is up!`);
					this.sendRoom(`Debate over! A staff member or staff-approved non-Debater shall now judge the winner!`);
					this.onEnd();
				} else {
					this.sendRoom(`Time is up!`);
					if (this.clock % 2 == 1) {
						this.sendRoom(`${this.p2.name}'s turn!`);
					} else if (this.clock % 2 == 0) {
						this.sendRoom(`${this.p1.name}'s turn!`);
					}
					this.loopTimeout(mode, time);
				}
			}, DEFAULT_TIME);
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
			}, DEFAULT_TIME);
		}
	}

	startDebate() {
		clearTimeout(this.timer);
		if (this.type == "1v1") {
			let debate = {};
			this.clock = 0;
			if (!this.args[3]) {
				debate = {
					question: DebateFile.getQuestion()
				};
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
				this.sendRoom(`${this.p1.name}'s turn!`);
				this.loopTimeout("1v1", (this.args[2] * 60 * 1000) || DEFAULT_TIME);
			}, DEFAULT_TIME);
		} else if (this.type == "teams") {
			let debate = {};
			this.clock = 0;
			if (!this.args[2]) {
				debate = DebateFile.getQuestion();
			} else {
				debate = {
					question: this.args[2]
				};
			}
			this.team1 = [];
			let uList;
			for (let i = 0; i < (this.startingPlayers / 2); i++){
				uList = this.userList.sort().map(u => this.users[u].name);
				let player = uList[random(this.startingPlayers - i)];
				this.team1.push(player.toString() + " | ");
				uList.splice(uList.indexOf(player), 1);
			}
			this.team2 = uList;
			for (let i = 0; i < this.team2.length; i++) {
				this.team2[i] = this.team2[i] + " | ";
			}
			this.debateTopic = debate.question.trim();
			this.sendRoom(`The Debate has begun! The topic is: **${this.debateTopic}?**`);
			this.sendRoom(`Team 1: ${this.team1.join(',')} vs Team 2: ${this.team2.join(',')} 5 minutes to agree on a side and do research!`);
			this.timer = setTimeout(() => {
				this.sendRoom(`Time is up! The Debate shall now commence!`);
				this.sendRoom(`Team 1's turn!`);
				this.loopTimeout("teams", this.args[1] * 60 * 1000 || DEFAULT_TIME);
			}, DEFAULT_TIME);
		}
	}
	onEnd() {
		this.state = "ended";
		this.sendRoom(`Debate ended.`);
		debatelog('Debate ended.');
		this.destroy();
	}
}

class DebateGamePlayer extends Rooms.DebatePlayer {
	constructor (user, game) {
		super(user, game);
	}
}

exports.commands = {
	debate: function (target, room, user) {
		if (!room || !user.hasBotRank("+")) return false;
		const errMsg = "	  Please use the following way to start a debate.\n\n\n" +
			"For 1v1: \n" +
			".debate 1v1, [Player1 vs Player2], [Time / Default is 5], [Topic / default is random from database]\n\n" +
			"For Teams: \n" +
			".debate Teams, [Time / default is 5], [Topic / Default is random from database]";
		const everything = target.split(',').map(u => toId(u));
		const type = toId(everything[0]);
		if (!type || !everything[1] || !everything[2]) return this.send("!code " + errMsg);
		if (type !== "1v1" && type !== "teams") return this.send("!code " + errMsg);
		if (room.game && room.game.gameId !== 'host' && room.game.type) return this.send("There is already a Debate going on in this room! (" + room.game.type + ")");

		if (type == "1v1") {
			const pl = everything[1];
			const time = everything[2];
			const topic = everything[3];
			const players = pl.split("vs").map(u => Users.get(u));
			if (players[0].userid === players[1].userid) return this.send('Both players are same.');
			room.game = new DebateGame(room, type, players, time, topic);
		}
		if (type == "teams") {
			const time = everything[1];
			const topic = everything[2];
			room.game = new DebateGame(room, type, time, topic);
		}
		debatelog('Scripted debate started (' + room.game.type + ')');
	},
	checkdebate: function (target, room, user){
		if (!room || !user.hasBotRank('+')) return false;
		if (room.game && room.game.gameId === 'host') return this.send(Users.get(room.game.hostid).name + " is hosting" + room.game.official ? " official Debate." : "." + room.game.topic ? " Topic: " + room.game.topic : "");
		if (room.game && room.game.gameId === 'debate') return this.send('A scripted Debate is in progress. (' + room.game.type + ')');
		this.send('No Debate is going on right now.');
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
			this.send("Added! (__" + question + "__)"); 
		}
	},
	delq:'deletequestion',
	deletequestion: function (target, room, user) {
		if (!user.hasBotRank("+")) return false;
		if (!target) return this.send('``.deletequestion [question]``');
		let question = target.toString();
		if (!DebateFile.findQuestion(question)) return this.send("The question doesn't exist.");

		DebateFile.removeQuestion(question).write();
		if (!room) {
			this.send("Deleted! (__" + question + "__)"); 
		}
		else {
			this.send("Deleted! (__" + question + "__)"); 
		}
	},
	debateqs:'debatequestions',
	debatequestions: function (target, room, user) {
		if (!user.hasBotRank("+") || !room) return false;
		if (DebateFile.isEmpty()) return this.send("There are no questions.");
		let questions = DebateFile.allQuestions();

		Tools.uploadToHastebin(questions.map(q => `Question: ${q.question}`).join("\n\n"), 
			link => this.send(`Debate questions(${questions.length}): ${link}`));
	},
	randquestion:'topic',
	randtopic: function (target, room, user) {
		if (!user.hasBotRank('host') || !room) return false;
		let question = DebateFile.getQuestion();
		this.send(question.question.trim() + "?");
	},
	debatelogs: function (target, room, user) {
		if (!user.hasBotRank('%')) return false;
		if (room) return user.sendTo('Please use this command in my PMs only.');
		if (!fs.existsSync('./config/debatelogs.txt')) return user.sendTo('The debate logs are empty.');
		fs.readFile("./config/debatelogs.txt", "utf-8", (err, data) => { 
			if (!err) {
				Tools.uploadToHastebin("Debate logs \n\n" + data, link => user.sendTo("Debate logs: " + link));
			}
			else {
				user.sendTo('Error getting logs.');
				console.log(err);
			}
		});
	},
};
/*globals Tools Users Rooms debatelog fs toId random*/
