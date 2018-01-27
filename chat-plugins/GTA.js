"use strict";

const ROUND_DURATION = 30000;
const WAIT_DURATION = 2000;

const GTA_FILE = "data/gta.json";
const GtaManager = require("../GTA-manager");

exports.game = "guessthatauth";
exports.aliases = ["gta"];

const GTA = new GtaManager(GTA_FILE);

class GtaGame extends Rooms.botGame {
    constructor(room, scorecap) {
        super(room);
        
        this.scorecap = Math.abs(parseInt(scorecap) || 5);
        
        this.gameId = "gta";
        this.gameName = "Guess That Auth";
        
        this.answers = [];
        this.question = null;
        
        this.answered = false;
        this.round = 0;
        
        this.onInit();
    }
    
    onInit() {
        
        if (this.scorecap > 25) {
            this.sendRoom("That's a too long scorecap.");
            return this.onEnd();
        }
        if (GTA.isEmpty()) {
            this.sendRoom("There are no GTA questions loaded. Game automatically ended.");
            return this.onEnd();
        }
        this.sendRoom(`Harmgame! A new game of GTA is starting! (Free Join) First to ${this.scorecap} points win!`);
        this.onInitRound();
    }
    
    onInitRound() {
        let entry = GTA.getQuestion();
        this.question = entry.question;
        this.answers = entry.answers;
        this.round++;
        this.answered = false;
        
        clearTimeout(this.timer);
        this.sendRoom('Round ' + this.round + ' | Global: ' + this.question[0] + ' | Room: ' + this.question[1] + '.');
        this.timer = setTimeout(() => {
            this.sendRoom(`Time's up! The correct answer${(this.answers.length > 1 ? "s are" : " is")}: ${this.answers.join(", ")}`);
            this.timer = setTimeout(() => this.onInitRound(), WAIT_DURATION);
        }, ROUND_DURATION);
    }
    
    onGuess(user, target) {
        target = toId(target);
        if (!this.answers.map(p => toId(p)).includes(target) || this.answered) return;
        
        clearTimeout(this.timer);
        this.answered = true;
        if (!(user.userid in this.users)) {
            this.users[user.userid] = new Rooms.botGamePlayer(user);
            this.users[user.userid].points = 0;
            this.userList.push(user.userid);
        }
        
        let player = this.users[user.userid];
        player.points++;
        
        this.sendRoom(`${user.name} got the right answer and has ${player.points} points!${this.answers.length > 1 ? ` Possible Answers: ${this.answers.join(", ")}` : ""}`);
        
        if (this.scorecap <= player.points) {
            this.onEnd(player);
        } else {
            this.timer = setTimeout(() => this.onInitRound(), WAIT_DURATION);
        }
    }
    
    onEnd(winner) {
        if (winner) {
            this.sendRoom(`Congratulations to ${winner.name} for winning the game of GTA!`);
            
            Leaderboard.onWin("gta", this.room, winner.userid, this.scorecap);
        }
        this.destroy();
    }
    
    getScoreBoard() {
        return "/wall Points: " + Object.keys(this.users).sort().map((u) => {
            return "__" + this.users[u].name + "__ (" + this.users[u].points + ")";
        }).join(", ");
    }
}

exports.commands = {
    gta: function (target, room, user) {
        if (!room || !this.can("games")) return false;
        if (room.game) return this.send("There is already a game going on in this room! (" + room.game.gameName + ")");
        room.game = new GtaGame(room, target);
    },
    
    gtarepost: function (target, room, user) {
        if (!room || !this.can("games") || !room.game || room.game.gameId !== "gta") return false;
        this.send(`Round ${room.game.round} | ${room.game.question}`);
    },
    
    gtaskip: function (target, room, user) {
        if (!room || !this.can("games") || !room.game || room.game.gameId !== "gta") return false;
        this.send(`The correct answer${(room.game.answers.length > 1 ? "s are" : " is")}: ${room.game.answers.join(", ")}`);
        room.game.onInitRound();
    },
    
    addgta: function (target, room, user) {
        if (!user.hasBotRank("%")) return false;
        
        let [question, answers] = target.split("/").map(p => p.trim());
        if (!question || !answers) return this.send("Invalid question/answer pair.");
        question = question.split(",").map(p => p.trim());
        answers = answers.split(",").map(p => p.trim());
        if (answers.some(a => !toId(a))) return this.send("All answers must have alphanumeric characters.");
        
        if (GTA.findQuestion(question)) return this.send("The question already exists.");
        
        GTA.addQuestion(question, answers).write();
        
        this.send("Added!");
    },
    
    deletegta: function (target, room, user) {
        if (!user.hasBotRank("%")) return false;
        if (!GTA.findQuestion(target)) return this.send("The question does not exist.");
        
        GTA.removeQuestion(target).write();
        
        this.send("Deleted.");
    },
    
    gtalist: function (target, room, user) {
        if (!user.hasBotRank("+")) return false;
        let questions = GTA.allQuestions();
        
        Tools.uploadToHastebin(questions.map(q => `Global: ${q.question[0]} Room: ${q.question[1]} \nAnswer(s): ${q.answers.join(", ")}`).join("\n\n"), 
            link => user.sendTo(`${questions.length} questions - ${link}`));
    },
};