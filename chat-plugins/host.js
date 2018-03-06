"use strict";
exports.game = 'host';

class hostGame extends Rooms.botGame {
    constructor(room, target) {
        super(room);
        
        this.gameId = "host";
        this.gameName = 'Host';
        this.official = false;
        
	    let targets = target.split(',');
	    if (toId(targets[1]) == 'official') this.official = true;
	    
	    this.hostName = Users.get(targets[0]).name;
	    this.userHost = toId(targets[0]);
	    
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
        if (!room || !target || !user.hasBotRank('+')) return false;
        if (!room.users.has(toId(target))) return this.room.send(null,'The user "' + Users.get(target).name + '" is not in the room.');
        if (room.game && room.game.gameId == 'host') return this.room.send(null, room.game.hostName + ' is hosting.');
        if (room.game && room.game.gameId == 'debate') return this.room.send(null,'There is already a debate going on in this room! (' + room.game.type + ')');
        this.parse(`${Users.get(toId(target)).hasBotRank('+') ? '/kek' : '/promote ' + target + ', host'}`); 
        room.game = new hostGame(room, target);
    },
    subhost: function (target, room, user) {
        if (!room || !room.game || room.game.gameId !== 'host' || !target || !user.hasBotRank('+')) return false;
        this.parse(`${Users.get(toId(target)).hasBotRank('+') ? '/kek' : '/promote ' + target + ', host'}`);
        this.parse(`${Users.get(room.game.userHost).hasBotRank('+') ? '/kek' : '/promote ' + room.game.userHost + ', deauth'}`);
        this.room.send(null,Users.get(target).name + ' has been subhosted.');
        room.game.hostName = Users.get(target).name;
	    room.game.userHost = toId(target);
    },
    parts: function (target, room, user) {
        let rank = Users.get(Monitor.username).hasRank(this.room, "%") ? "/wall " : "";
        if (!user.hasBotRank('+')) return false;
        target = target.split(',');
        if (target.length < 2) {
            this.room.send(null,`${rank} Participation points awarded to ${target[0]}.`);
            Leaderboard.onWin('t', this.room, target[0], 4).write();
        }
        else if (target.length > 1) {
            for (let i=0; i<=target.length - 1; i++) {
                Leaderboard.onWin('t', this.room, toId(target[i]), 4).write();
            }
            this.room.send(null,`${rank} Participation points awarded to ${target.join(',')}.`);
        }
    },
    officialwin: function (target, room, user) {
        if (!user.hasBotRank('+')) return false;
        let rank = Users.get(Monitor.username).hasRank(this.room, "%") ? "/wall " : "";
        target = target.split(',');
        if (target.length < 2) {
            this.room.send(null,`${rank} The winner is ${target[0]}! Thanks for hosting.`);
            Leaderboard.onWin('t', this.room, toId(target[0]), 10).write();
        }
        else if (target.length > 1) {
            for (let i=0; i<=target.length - 1; i++) {
                Leaderboard.onWin('t', this.room, toId(target[i]), 10).write();
            }
            this.room.send(null,`${rank}The winners are ${target.join(', ')}! Thanks for hosting.`);
        }
        else {
            this.room.send(null,rank + 'The winner is ' + target[0] + '! Thanks for hosting.');
        }
        room.game.onEnd();
    },
    mvp: function (target, room, user) {
    if (!room ||  !user.hasBotRank('+')) return false;
    let winner = toId(target);
    this.room.send(null,`${Users.get(Monitor.username).hasRank(this.room, "%") ? "/wall " : ""} MVP points awarded to ${Users.get(winner).name}!`);
    Leaderboard.onWin('t', this.room, winner, 4).write();
    },
    next: function (target, user, room) {
		this.can('debate');
		let d = new Date();
		let n = d.getHours();
		let m = d.getMinutes();
		let time = 60 * 1000 * 60;
		let millis = (60 - m) * 60 * 1000;
		if (n < 6) {
			millis += (5 - n) * time;
		} else if (n < 17) {
			millis += (16 - n) * time;
		} else if (n < 23) {
			millis += (22 - n) * time;
		} else {
			millis += (30 - n) * time;
		}
		this.send("The next official is in " + millisToTime(millis) + ".");
	},
};
/* globals Leaderboard*/
/* globals Users*/ 
/* globals toId*/
/* globals Monitor*/
/* globals Rooms*/