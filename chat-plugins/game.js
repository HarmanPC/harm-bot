// this is where all the standard game commands are put
'use strict';
exports.commands = {
    'j': 'join',
    join: function(target, room, user) {
        if (!room || !room.game || room.game.userHost === user.userid) return false;
        if (room.game.onJoin) room.game.onJoin(user);
    },
    leave: function(target, room, user) {
        if (!room || !room.game) return false;
        if (room.game.onLeave) room.game.onLeave(user);
    },
    rpl: "removeplayer",
    removeplayer: function(target, room, user) {
        if (!room || !room.game || !(user.hasBotRank('+') || user.userid == room.game.userHost)) return false;
        if (room.game.state == 'signups') {
            if (room.game.onLeave) room.game.onLeave(Users.get(target));
            this.room.send(null, `${Users.get(target).name} is removed from playerlist`);
        }
        else if (room.game.state == 'started') { 
            room.game.state = 'signups';
            if (room.game.onLeave) room.game.onLeave(Users.get(target));
            room.game.state = 'started';
            this.room.send(null, `${Users.get(target).name} is removed from playerlist.`);
        }
    },
    apl:'addplayer',
    addplayer: function (target, room, user) {
        if (!room || !room.game || !(user.hasBotRank('+') || user.userid == room.game.userHost)) return false;
        if (room.game.state == 'signups') {
            if (room.game.onJoin) room.game.onJoin(Users.get(target));
            this.room.send(null, `${Users.get(target).name} is added to playerlist`);
        }
        else if (room.game.state == 'started') {
            room.game.state = 'signups';
            if (room.game.onJoin) room.game.onJoin(Users.get(target));
            room.game.state = 'started';
            this.room.send(null, `${Users.get(target).name} is added to playerlist.`);
        }
    },
    sub: "replace",
    replace: function (target, room, user) {
        if (!room || !(user.hasBotRank('+') || user.userid == room.game.userHost) || !room.game || room.game.gameId !== "host"  || room.game.state === "signups") return false;
        if (!room || !(!user.hasBotRank('+') || user.userid == room.game.userHost) || !room.game || room.game.gameId !== "host"  || room.game.state === "signups") return false;
        if (!target) return this.room.send(null, room.commandCharacter[0] + "sub [old player], [new player]");
        let parts = target.split(",");
        if (parts.length !== 2) return this.room.send(null, room.commandCharacter[0] + "sub [old player], [new player]");
        if (!room.users.has(toId(parts[1]))) this.room.send(null, "The sub player is not in the room.");
        if (toId(parts[1]) === room.game.userHost) return this.room.send(null, "You cannot add the host into the game.");
        if (room.game.onJoin) return room.game.onJoin(Users.get(target[1]));
        if (room.game.onLeave) return room.game.onLeave(Users.get(target[0]));
        this.room.send(null, target[1] + ' has joined the game.');
    },
	pl: 'players',
    players: function (target, room, user) {
        if (!room || !(user.hasBotRank('+') || user.userid == room.game.userHost) || !room.game) return false;
        if (room.game.postPlayerList) return room.game.postPlayerList();
    },
    start: function(target, room, user) {
        if (!room || !(user.hasBotRank('+') || user.userid == room.game.userHost) || !room.game) return false;
        if (room.game.onStart) return room.game.onStart();
    },
    autostart: function (target, room, user) {
        if (!room ||  !(user.hasBotRank('+') || user.userid == room.game.userHost) || !room.game) return false;
        if (room.game.runAutoStart) return room.game.runAutoStart(target);
    },
    end: function(target, room, user) {
        if (!room || !(user.hasBotRank('+') || user.userid == room.game.userHost) || !room.game) return false;
        room.game.destroy();
        this.room.send(null, "The debate has been ended.");
    },
    win: function (target, room, user){
        if (!room.game || room.game.gameId !== 'host' || !room  || !(user.hasBotRank('+') || room.game.userHost == user.userid)) return false;
        let targets = target.split(',');
        this.room.send(null, `${target.length > 1 ? 'The winners are ' + targets.join(', ') : 'The winner is ' + Users.get(target[0]).name}! Thanks for hosting.`);
        if (!room.game || room.game.gameId !== 'host' || !room  || !(!user.hasBotRank('+') || room.game.userHost == user.userid)) return false;
        target = target.split(',');
        this.room.send(null, `${target.length > 1 ? 'The winners are ' + target.join(', ') : 'The winner is ' + Users.get(target[0]).name}! Thanks for hosting.`);
        room.game.onEnd();
    },
    hangman: function (target, room, user) {
		if (!room || !user.hasBotRank('+')) return false;
        let poke = Tools.shuffle(Object.keys(Tools.Words))[0];
        this.room.send(null, `/hangman create ${poke}, ${Tools.Words[poke]}`);
        this.room.send(null, '/wall Use ``/guess`` to guess.');
    },
};
/*globals Tools*/
/*globals Users*/
