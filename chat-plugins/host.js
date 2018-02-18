"use strict";
exports.game = 'host';
exports.aliases = ['host'];

class hostGame extends Rooms.botGame {
    constructor(room, target, target2) {
        super(room);
        
        this.gameId = "host";
        this.gameName = 'Host';
        
        this.official = false;
        this.userHost = toId(target);
        this.hostName = Users.get(target2).name;
        this.answerCommand = "special";
        this.state = "signups";
        this.allowJoins = true;
        
        this.sendRoom(`Debateinfo! ${this.hostName} is hosting. Do \`\`.join\`\` to join.`);
        
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

exports.commands = {
    host: function (target, room, user) {
        if (!room || !target[0] || !this.can("debate")) return false;
        target = target.split(',');
        if (room.game) return this.send("There is already a debate going on in this room! (By " + room.game.hostName + ")");
        room.game = new hostGame(room, target[0], target[1]);
        if (toId(target[1]) == 'official') return room.game.official = true;
    },
    subhost: function (target, room, user) {
        this.can('debate');
        this.send(target + ' has been subhosted.');
        room.game.userHost = toId(target);
        room.game.hostName = target;
    },
    parts: function (target, room, user) {
        let rank = Users.get(Monitor.username).hasRank(this.room, "%") ? "/wall " : "";
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
        if (!this.can('debate')) return false;
        let rank = Users.get(Monitor.username).hasRank(this.room, "%") ? "/wall " : "";
        target = target.split(',');
        if (target.length < 2) {
            this.send(`${rank} The winner is ${target[0]}! Thanks for hosting.`);
            Leaderboard.onWin('t', this.room, toId(target[0]), 10).write();
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
    if (!room ||  !this.can('debate')) return false;
    let winner = toId(target);
    this.send(`${Users.get(Monitor.username).hasRank(this.room, "%") ? "/wall " : ""} MVP points awarded to ${winner}!`);
    Leaderboard.onWin('t', this.room, winner, 4).write();
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
