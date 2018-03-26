"use strict";
exports.game = 'host';

class hostGame extends Rooms.botGame {
    constructor(room, target) {
        super(room);

        this.gameId = "host";
        this.gameName = 'Host';
        this.official = false;

        this.hostid = toId(target);
        this.pl;

        this.answerCommand = "special";
        this.state = "signups";
        this.allowJoins = true;
        this.topic = '';

        this.sendRoom(`Debateinfo! ${Users.get(this.hostid).name} is hosting. Do \`\`.join\`\` to join.`);

    }
    onStart(user) {
        if (this.state !== "signups") return false;
        hostlog(Users.get(this.hostid).name + "'s debate started.");
        hostlog(this.postPlayerList());
        this.state = 'started';
        this.sendRoom(`Signups are now closed.`);
        this.startingPlayers = this.userList.length;
        this.postPlayerList();
    }
    postPlayerList() {
        this.pl = this.userList.sort().map(u => this.users[u].name);

        this.sendRoom(`Players (${this.userList.length}): ${this.pl.join(", ")}`);
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
    } else {
        response = minutes + " minute" + (minutes === 1 ? "" : "s");
    }
    return response;
};

exports.commands = {
    host: function (target, room, user) {
        if (!room || !target || !user.hasBotRank('+')) return false;
        target = target.split(',');
        if (!room.users.has(toId(target[0]))) return this.room.send(null,'The user "' + Users.get(target).name + '" is not in the room.');
        if (room.game && room.game.gameId == 'host') return this.room.send(null, Users.get(room.game.hostid).name + ' is hosting.');
        if (room.game && room.game.gameId == 'debate') return this.room.send(null,'There is already a debate going on in this room! (' + room.game.type + ')');
        if (toId(target[1]) === 'official') {
           room.game = new hostGame(room, target[0]);
           officiallog(Users.get(target).name + " hosted official.");
           room.game.official = true;
           return;
        }
        this.parse(`${Users.get(toId(target)).hasBotRank('+') ? '/kek' : '/promote ' + target + ', host'}`); 
        room.game = new hostGame(room, target[0]);
        hostlog(Users.get(target[0]).name + " hosted.");
    },
    subhost: function (target, room, user) {
        if (!room || !room.game || room.game.gameId !== 'host' || !target || !user.hasBotRank('+')) return false;
        this.parse(`${Users.get(toId(target)).hasBotRank('+') ? '/kek' : '/promote ' + target + ', host'}`);
        this.parse(`${Users.get(room.game.userHost).hasBotRank('+') ? '/kek' : '/promote ' + room.game.userHost + ', deauth'}`);
        this.room.send(null, Users.get(target).name + ' has been subhosted.');
        hostlog(Users.get(target).name + " subhosted " + Users.get(room.game.hostid).name + "'s host.");
        room.game.hostid = toId(target);
    },
    settopic: function (target, room, user) {
        if (!user.hasBotRank('host') || !room.game || !room.game.gameId === "host" || !target) return false;
        room.game.topic = target;
        this.room.send(null, 'The topic has been set to: ' + target);
    },
    topic: function (target, room, user) {
        if (!user.hasBotRank('host') || !room.game || !room.game.gameId === "host" ) return false;
        if (!room.game.topic) return this.room.send(null, 'There is no topic.');
        this.room.send(null, 'Topic is: ' + room.game.topic);
    },
    parts:'participations',
    participations: function (target, room, user) {
        if (!user.hasBotRank('+') || !target) return false;
        target = target.split(',');
        if (target.length == 1) {
            this.room.send(null,`/wall Participation points awarded to ${target[0]}.`);
            Leaderboard.onWin('t', this.room, toId(target[0]), 4).write();
            officiallog(`Participation points awarded to ${target[0]}.`);
        }
        else if (target.length > 1) {
            for (let i = 0; i <= target.length - 1; i++) {
                Leaderboard.onWin('t', this.room, toId(target[i]), 4).write();
            }
            this.room.send(null,`/wall Participation points awarded to ${target.join(',')}.`);
            officiallog(`Participation points awarded to ${target.join(',')}.`);
        }
    },
    win: function (target, room, user) {
        if (!user.hasBotRank('+') || !room || !room.game || !target) return false;
        //if (!room.game.official) return this.room.send(null,'This host isn\'t official.');
        target = target.split(',');
        if (target.length < 2) {
            this.room.send(null,`/wall The winner is ${target[0]}! Thanks for hosting.`);
            Leaderboard.onWin('t', this.room, toId(target[0]), 10).write();
            officiallog('The official winner was ' + Users.get(target[0]).name + '.');
            hostlog('The official winner was ' + Users.get(target[0]).name + '.');
        }
        else if (target.length > 1) {
            for (let i=0; i<=target.length - 1; i++) {
                Leaderboard.onWin('t', this.room, toId(target[i]), 10).write();
            }
            this.room.send(null, '/wall The winners are ' + target.join(', ') + '! Thanks for hosting.');
            officiallog('The official winners were ' + target.join(', ') + '.');
            hostlog('The official winners were ' + target.join(', ') + '.');
        }
        room.game.onEnd();
    },
    mvp:'mostvaluableplayer',
    mostvaluableplayer: function (target, room, user) {
    if (!room ||  !user.hasBotRank('+')) return false;
    let winner = toId(target);
    this.room.send(null,`/wall MVP points awarded to ${Users.get(winner).name}!`);
    officiallog(`MVP points awarded to ${Users.get(winner).name}!`);
    Leaderboard.onWin('t', this.room, winner, 4).write();
    },
    hostpoints: function (target, room, user) {
        if (!user.hasBotRank('+') || !target) return false;
        this.room.send(null,`/wall Host points were awarded to ${Users.get(target).name}.`);
        Leaderboard.onWin('t', this.room, toId(target), 6).write();
        officiallog('The host was ' + Users.get(target).name + '.');
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
	hostlogs: function (target, room, user) {
		if (!user.hasBotRank('%')) return false;
		if (room) return user.sendTo('Please use this command in my PMs only.');
		if (!fs.existsSync('./config/hostlogs.txt')) return user.sendTo('The host logs are empty.');
		fs.readFile("./config/hostlogs.txt", "utf-8", (err, data) => { 
			if (!err) {
				Tools.uploadToHastebin("Host logs\n\n" + data, link => user.sendTo("Host logs: " + link));
			}
			else {
				user.sendTo('Error getting logs.');
				console.log(err);
			}
		});
    },
    officiallogs: function (target, room, user) {
        if (!user.hasBotRank('%')) return false;
        if (room) return user.sendTo('Please use this command in my PMs only.');
        if (!fs.existsSync('./config/officiallogs.txt')) return user.sendTo('The official logs are empty.');
        fs.readFile("./config/officiallogs.txt", "utf-8", (err, data) => { 
			if (!err) {
				Tools.uploadToHastebin("Official logs\n\n" + data, link => user.sendTo("Official logs: " + link));
			}
			else {
				user.sendTo('Error getting logs.');
				console.log(err);
			}
		});
    }
};
/*globals Leaderboard*/
/*globals Users*/ 
/*globals toId*/
/*globals officiallog*/
/*globals Rooms*/
/*globals hostlog*/
/*globals Tools*/
/*globals fs*/