"use strict";
exports.game = 'host';

class hostGame extends Rooms.Debates {
    constructor(room, target) {
        super(room);

        this.gameId = "host";
        this.gameName = 'Host';
        this.official = false;

        this.hostid = toId(target);

        this.answerCommand = "special";
        this.state = "signups";
        this.allowJoins = true;
        this.topic = '';

        this.sendRoom(`Debateinfo! ${Users.get(this.hostid).name} is hosting. Do \`\`.join\`\` to join.`);

    }
    onStart(user) {
        if (this.state !== "signups") return false;
        hostlog(Users.get(this.hostid).name + "'s debate started.");
        hostlog('Players (' + this.startingPlayers + '): ' +  this.players.join(', '));
        this.state = 'started';
        this.sendRoom(`Signups are now closed.`);
        this.startingPlayers = this.userList.length;
        this.postPlayerList();
    }
    postPlayerList() {
        this.players = this.userList.sort().map(u => this.users[u].name);

        this.sendRoom(`Players (${this.userList.length}): ${this.players.join(", ")}`);
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
        const person = Users.get(target[0]);

        if (!room.users.has(person.userid)) return room.post('The user "' + person.name + '" is not in the room.');
        if (room.game && room.game.gameId == 'host') {
            room.post(person.name + ' was added to hostqueue.');
            queue.push(person.userid);
            return;
        }
        if (room.game && room.game.gameId == 'debate') return room.post('There is already a debate going on in this room! (' + room.game.type + ')');
        if (toId(target[1]) === 'official') {
           room.game =  new hostGame(room, person.userid);
           officiallog(person.name + " hosted official.");
           room.game.official = true;
           return;
        }
        if (queue.indexOf(person.userid) > -1) {
            queue.splice(person.userid, 1);
        }

        this.parse(`${person.hasBotRank('+') ? '/kek' : '/promote ' + person.userid + ', host'}`);
        room.game = new hostGame(room, person.userid);
        hostlog(person.name + " hosted.");
    },
    dehost: function (target, room, user) {
        if (!user.hasBotRank('+') || !room) return false;
        target = Users.get(target);
        if (!(queue.indexOf(target.id) > -1)) return room.post(target.name + ' is not in the hostqueue.');
        queue.splice(target, 1);
        room.post(target.name + ' has been removed from hostqueue.');
    },
    subhost: function (target, room, user) {
        let debate = room.game;
        target = Users.get(target);
        if (!room || !debate || debate.gameId !== 'host' || !target || !user.hasBotRank('+')) return false;
        this.parse(`${target.id.hasBotRank('+') ? '/kek' : '/promote ' + target + ', host'}`);
        this.parse(`${Users.get(debate.userHost).hasBotRank('+') ? '/kek' : '/promote ' + debate.userHost + ', deauth'}`);
        room.post(target.name + ' has been subhosted.');
        hostlog(target.name + " subhosted " + Users.get(debate.hostid).name + "'s host.");
        debate.hostid = target.id;
    },
    hostqueue: function (target, room, user) {
        if (!room || !user.hasBotRank('+')) return false;
        if (!queue.length) return room.post('Hostqueue is empty.');
        let msg = 'Hostqueue: ' + queue.map(str => '__' + Users.get(str).name + '__').join(', ');
        room.post(msg);
    },
    settopic: function (target, room, user) {
        if (!user.hasBotRank('host') || !room || !room.game || !room.game.gameId === "host" || !target) return false;
        room.game.topic = target;
        room.post('The topic has been set to: ' + target);
    },
    topic: function (target, room, user) {
        if (!user.hasBotRank('host') || !room || !room.game || !room.game.gameId === "host" ) return false;
        if (!room.game.topic) return room.post('There is no topic.');
        room.post('Topic is: ' + room.game.topic);
    },
    parts:'participations',
    participations: function (target, room, user) {
        if (!user.hasBotRank('+') || !room || !target) return false;
        target = target.split(',').map(u => toId(u));
        for (let i = 0; i <= target.length - 1; i++) {
            Leaderboard.onWin('t', this.room, target[i], 4).write();
        }
        room.post('/wall Participation points awarded to ' + target.map(u => Users.get(u).name).join(', ') + '.');
        officiallog('Participation points awarded to ' +  target.map(u => Users.get(u).name).join(', ') + '.');
    },
    win: function (target, room, user) {
        if (!user.hasBotRank('+') || !room || !room.game || !target) return false;
        //if (!room.game.official) return room.post('This host isn\'t official.');
        target = target.split(',').map(u => toId(u));
        for (let i = 0; i <= target.length - 1; i++) {
            Leaderboard.onWin('t', this.room, target[i], 10).write();
        }
        let everyone = target.map(u => Users.get(u).name).join(', ');

        room.post('/wall The winner' + target.length < 2 ? ' is' : 's are ' + everyone + '! Thanks for hosting.');
        officiallog('The official winner' + target.length < 2 ? ' is ' : ' were ' + everyone + '.');
        hostlog('The official winner' + target.length < 2 ? 'is ' : ' were ' + everyone + '.');
        room.game.onEnd();
    },
    mvp:'mostvaluableplayer',
    mostvaluableplayer: function (target, room, user) {
    if (!room ||  !user.hasBotRank('+')) return false;
    const winner = Users.get(target);
    room.post(`/wall MVP points awarded to ${winner.name}!`);
    officiallog(`MVP points awarded to ${winner.name}!`);
    Leaderboard.onWin('t', this.room, winner.id, 4).write();
    },
    hostpoints: function (target, room, user) {
        if (!user.hasBotRank('+') || !target || !room) return false;
        const host = Users.get(target);
        room.post(`/wall Host points were awarded to ${host.name}.`);
        Leaderboard.onWin('t', this.room, host.id, 6).write();
        officiallog('The host was ' + host.name + '.');
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
/*globals Leaderboard Users toId officiallog Rooms hostlog Tools fs queue*/