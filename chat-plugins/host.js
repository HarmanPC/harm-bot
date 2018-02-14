"use strict";
exports.game = 'host';
exports.aliases = ['host'];

class hostGame extends Rooms.botGame {
    constructor(room, target, target2) {
        super(room);
        
        this.gameId = "host";
        this.gameName = 'Host';
        
        this.scorecap = [];
        this.official = false;
        this.userHost = toId(target);
        this.answerCommand = "special";
        this.state = "signups";
        this.allowJoins = true;
        
        this.sendRoom(`Debateinfo! ${this.userHost} is hosting. Do \`\`.join\`\` to join.`);
        
    }
    onStart(user) {
        if (this.state !== "signups") return false;
        this.state = 'started';
        this.sendRoom(`Signups are now closed.`);
        this.startingPlayers = this.userList.length;
        this.postPlayerList();
    }
    postPlayerList() {
        let pl = this.userList.sort().map(u => this.users[u].name);
        
        this.sendRoom(`Players (${this.userList.length}): ${pl.join(", ")}`);
    }
     onEnd() {
        this.state = "ended";
        this.destroy();
    }
}
<<<<<<< HEAD
=======
function getRank(room, message){
    Users.get(Monitor.username).hasRank(room, "%") ? "wall " : "" + message;
}
>>>>>>> 658dd9cacf721b02c78d3e12ef3e97d831b9e248
let millisToTime = function(millis){
	let seconds = millis/1000;
	let hours = Math.floor(seconds/3600);
	let minutes = Math.floor((seconds-hours*3600)/60);
	let response;
	if(hours>0){
		response = hours + " hour" + (hours === 1 ? "" : "s") + " and " + minutes + " minute" + (minutes === 1 ? "" : "s");
	}else{
		response = minutes + " minute" + (minutes === 1 ? "" : "s");
	}
	return response;
};
<<<<<<< HEAD
let rank = Users.get(Monitor.username).hasRank(this.room, "%") ? "/wall " : "";
=======

>>>>>>> 658dd9cacf721b02c78d3e12ef3e97d831b9e248
exports.commands = {
    host: function (target, room, user) {
        if (!room || !target[0] || !this.can("games")) return false;
        target = target.split(',');
        if (room.game) return this.send("There is already a debate going on in this room! (By " + room.game.userHost + ")");
        room.game = new hostGame(room, target[0], target[1]);
        if (toId(target[1]) == 'official') return room.game.official = true;
    },
    subhost: function (target, room, user) {
        this.send(target + ' has been subhosted.');
        room.game.userHost = toId(target);
    },
    parts: function (target, room, user) {
         if (!user.can('debate')) return false;
        target = target.split(',');
        if (target.length < 2) {
            this.send(`${rank} Participation points awarded to ${target[0]}.`);
            Leaderboard.onWin('t', this.room, target[0], 4).write();
        }
        else if (target.length > 1) {
            for (let i=0; i<=target.length - 1; i++) {
                Leaderboard.onWin('t', this.room, toId(target[i]), 4).write();
            }
            this.send(`${rank} Participation points awarded to ${target.join(',')}.`);
        }
    },
    officialwin: function (target, room, user) {
        if (!user.can('debate')) return false;
        let rank = Users.get(Monitor.username).hasRank(this.room, "%") ? "/wall " : "";
        target = target.split(',');
        if (target.length < 2) {
            this.send(`${rank} The winner is ${target[0]}! Thanks for hosting.`);
            Leaderboard.onWin('t', this.room, target[0], 10).write();
        }
        else if (target.length > 1) {
            for (let i=0; i<=target.length - 1; i++) {
                Leaderboard.onWin('t', this.room, toId(target[i]), 10).write();
            }
            this.send(`${rank}The winners are ${target.join(', ')}! Thanks for hosting.`);
        }
        else {
            this.send(rank + 'The winner is ' + target[0] + '! Thanks for hosting.');
        }
        room.game.onEnd();
    },
    mvp: function (target, room, user) {
    if (!room || !user.can('debate')) return false;
    let winner = toId(target);
    this.send(`${Users.get(Monitor.username).hasRank(this.room, "%") ? "/wall " : ""} MVP points awarded to ${winner}!`);
    Leaderboard.onWin('t', this.room, winner, 4).write();
    },
    win: function (target, room, user){
        if (!room.game || !room || !user.can('debate') || room.game.userHost != user.userid) return false;
        target = target.split(',');
        this.send(`${target.length > 1 ? 'The winners are ' + target[0]: 'The winner is ' + target.join(',')}`);
    },
    next: function (target, user, room) {
		this.can('games');
		let d = new Date();
		let n = d.getHours();
		let m = d.getMinutes();
		let millis = (60 - m) * 60 * 1000;
		if (n < 6) {
			millis += (5 - n) * 60 * 60 * 1000;
		} else if (n < 17) {
			millis += (16 - n) * 60 * 60 * 1000;
		} else if (n < 23) {
			millis += (22 - n) * 60 * 60 * 1000;
		} else {
			millis += (30 - n) * 60 * 60 * 1000;
		}
		this.send("The next official is in " + millisToTime(millis) + ".");
	},
};
/* globals Leaderboard*/
/* globals Users*/ 
/* globals toId*/
/* globals Monitor*/
/* globals Rooms*/
