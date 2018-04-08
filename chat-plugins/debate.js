"use strict";

const Debate_FILE = "config/debate.json";
const DEFAULT_TIME = 5 * 60 * 1000;

const DebateManger = require ('../manager.js');
const DebateFile = new DebateManger(Debate_FILE);
exports.game = "debate";

class DebateGame extends Rooms.botGame {
	constructor (room, type, pl, time, topic) {
        super(room);
        
        this.gameId = "debate";
        this.gameName = "Debate";

        this.answerCommand = "special";
        this.allowJoins = true;

        this.state = "signups";
		this.args = [type, pl, Number(time), topic];
        this.playerObject = DebateGamePlayer;
		this.type = toId(type);

        if (this.type == "1v1") {
			this.p1 = pl[0];
			this.p2 = pl[1];
			this.sendRoom(`A Debate is starting between ${this.p1.name} and ${this.p2.name}!`);

			super.onJoin(this.p1);
			super.onJoin(this.p2);

			this.allowJoins = false;
			console.log("constructor".red);
			this.onStart();

		}
		else if (this.type == 'casual') {
			this.sendRoom('Debateinfo! A casual Debate is starting. (Free Join!)');
			this.onStart();

		}
		else {
			this.sendRoom("Debateinfo! A Debate is starting. ``" + this.room.commandCharacter[0] + "join`` to join the Debate. (" + this.type + ")");
		}
    }

    onStart() {
    	console.log("started".red);
		if ((this.userList.length < 2 || this.state !== "signups")) return;
 		this.state = "started";
		this.allowJoins = false;
    	//debatelog(`Players (${this.userList.length}): ${this.pl.join(", ")}`);

    	this.startingPlayers = this.userList.length;

    	this.startDebate();
    }

    postPlayerList() {
        this.players = this.userList.sort().map(u => this.users[u].name);

        this.sendRoom(`Players (${this.userList.length}): ${this.players.join(", ")}`);
    }

	loopTimeout(mode, time) {
		console.log("looping".red);
		if (mode == "1v1"){
			this.clock++;
			console.log(this.clock);
			console.log(this ? "yes" : "no");
			this.timer = setTimeout(() => {
				if (this.clock > 3) {
					this.sendRoom(`Time is up!`);
					this.sendRoom(`Debate over! A staff member or staff-approved non-Debater shall now judge the winner!`);
					this.onEnd();
				} else {
					this.sendRoom(`Time is up!`);
					console.log(this ? "yes" : "no");
					if (this.clock % 2 == 1) {
						this.sendRoom(`${this.p1.name}'s turn!`);
					} else if (this.clock % 2 == 0) {
						this.sendRoom(`${this.p1.name}'s turn!`);
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
		console.log(this ? "yes" : "no");
		if (this.type == "1v1") {
			let debate = {};
			console.log("started debate".red);
			this.clock = 0;
			console.log(this.args);
			if (!this.args[3]) {
				debate = {
					question: DebateFile.getQuestion()
				};
			} else {
				debate = {
					question: this.args[3]
				};
			}
			console.log(debate.question);
			this.DebateTopic = debate.question.trim();
			this.sendRoom(`The Debate has begun! The topic is: **${this.DebateTopic}?**`);
			this.sendRoom(`Both players get 5 minutes to agree on a side and do research!`);
			console.log(this.args[2]);

			this.timer = setTimeout(() => {
				this.sendRoom(`Time is up! The Debate shall now commence!`);
				this.sendRoom(`${this.p1.name}'s turn!`);
				console.log(this ? "yes" : "no");
				this.loopTimeout("1v1", (this.args[2] * 60 * 1000) || DEFAULT_TIME);
				console.log(this ? "yes" : "no");
			}, 1000);
		} else if (this.type == "teams") {
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
			this.team1 = [];
			let uList;
			for (let i = 0; i < (this.startingPlayers / 2); i++){
				uList = this.userList.sort().map(u => this.users[u].name);
				let player = uList[random(this.startingPlayers - i)];
				this.team1.push(player.toString() + " | ");
				uList.splice(uList.indexOf(player), 1);
			}
			this.team2 = uList;
			for (let i = 0; i < this.teamTwo.length; i++) {
				this.team2[i] = this.team2[i] + " | ";
			}
			this.debateTopic = debate.question.trim();
			this.sendRoom(`The Debate has begun! The topic is: **${this.debateTopic}?**`);
			this.sendRoom(`Team 1: ${this.teamOne.join(',')} vs Team 2: ${this.teamTwo.join(',')} 5 minutes to agree on a side and do research!`);
			this.timer = setTimeout(() => {
				this.sendRoom(`Time is up! The Debate shall now commence!`);
				this.sendRoom(`Team 1's turn!`);
				this.loopTimeout("teams", this.args[1] * 60 * 1000);
			}, 5 * 60 * 1000); 
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
        let debate = room.game;
		const everything = target.split(',');
		const type = everything[0];
		//if ((!type || !stuff) || (!(type === "1v1" && type === "teams"))) return;
        //if (debate && debate.gameId !== 'host' && debate.type) return room.post("There is already a Debate going on in this room! (" + debate.type + ")");

        if (type == "1v1") {
        	const pl = everything[1];
        	const time = everything[2];
        	const topic = everything[3];
        	const players = pl.split("vs").map(u => Users.get(u));
        	if (players[0].userid === players[1].userid) return room.post('Both players are same.');
        	debate = new DebateGame(room, type, players, time, topic);
        }
		//debatelog('Scripted debate started (' + debate.type + ')');
    },
	checkdebate: function (target, room, user){
		if (!room || !user.hasBotRank('+')) return false;
		let debate = room.game;
        if (debate && debate.gameId === 'host' && debate.official) return room.post(Users.get(debate.hostid).name + " is hosting" + debate.official ? " official Debate." : "." + debate.topic ? " Topic: " + debate.topic : "");
		if (debate && debate.gameId === 'debate') return room.post('A scripted Debate is in progress. ( ' + debate.type + ')');
		room.post('No Debate is going on right now.');
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
        	room.post("Added! (__" + question + "__)"); 
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
        	room.post("Deleted! (__" + question + "__)"); 
        }
    },
    debateqs:'debatequestions',
    debatequestions: function (target, room, user) {
        if (!user.hasBotRank("+") || !room) return false;
        if (DebateFile.isEmpty()) return room.post("There are no questions.");
        let questions = DebateFile.allQuestions();

        Tools.uploadToHastebin(questions.map(q => `Question: ${q.question}`).join("\n\n"), 
            link => room.post(`Debate questions(${questions.length}): ${link}`));
    },
	randquestion:'topic',
	randtopic: function (target, room, user) {
		if (!user.hasBotRank('host') || !room) return false;
		let question = DebateFile.getQuestion();
		room.post(question.question.trim() + "?");
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
/*globals Tools*/
/*globals Users*/
/*globals Rooms*/
/*globals debatelog*/
/*globals fs*/