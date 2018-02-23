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
        if (!room || !room.game || !(!user.hasBotRank('+') || user.userid == room.game.userHost)) return false;
        if (room.game.state == 'signups') {
            if (room.game.onLeave) room.game.onLeave(Users.get(target));
            this.send(`${Users.get(target).name} is removed from playerlist`);
        }
        else if (room.game.state == 'started') { 
            room.game.state = 'signups';
            if (room.game.onLeave) room.game.onLeave(Users.get(target));
            room.game.state = 'started';
            this.send(`${Users.get(target).name} is removed from playerlist.`);
        }
    },
    apl:'addplayer',
    addplayer: function (target, room, user) {
        if (!room || !room.game || !(!user.hasBotRank('+') || user.userid == room.game.userHost)) return false;
        if (room.game.state == 'signups') {
            if (room.game.onJoin) room.game.onJoin(Users.get(target));
            this.send(`${Users.get(target).name} is added to playerlist`);
        }
        else if (room.game.state == 'started') {
            room.game.state = 'signups';
            if (room.game.onJoin) room.game.onJoin(Users.get(target));
            room.game.state = 'started';
            this.send(`${Users.get(target).name} is added to playerlist.`);
        }
    },
    sub: "replace",
    replace: function (target, room, user) {
        if (!room || !(!user.hasBotRank('+') || user.userid == room.game.userHost) || !room.game || room.game.gameId !== "host"  || room.game.state === "signups") return false;
        if (!target) return this.send(room.commandCharacter[0] + "sub [old player], [new player]");
        let parts = target.split(",");
        if (parts.length !== 2) return this.send(room.commandCharacter[0] + "sub [old player], [new player]");
        if (!room.users.has(toId(parts[1]))) this.send("The sub player is not in the room.");
        if (toId(parts[1]) === room.game.userHost) return this.send("You cannot add the host into the game.");
        if (room.game.onJoin) return room.game.onJoin(Users.get(target[1]));
        if (room.game.onLeave) return room.game.onLeave(Users.get(target[0]));
        this.send(target[1] + ' has joined the game.');
    },
	pl: 'players',
    players: function (target, room, user) {
        if (!room || !user.hasBotRank('+') || !room.game) return false;
        if (room.game.postPlayerList) room.game.postPlayerList();
    },
    start: function(target, room, user) {
        if (!room || !user.user.hasBotRank('+') || !room.game) return false;
        if (room.game.onStart) room.game.onStart();
    },
    autostart: function (target, room, user) {
        if (!room ||  !user.hasBotRank('+') || !room.game) return false;
        if (room.game.runAutoStart) room.game.runAutoStart(target);
    },
    end: function(target, room, user) {
        if (!room || !user.hasBotRank('+') || !room.game) return false;
        room.game.destroy();
        this.send("The debate has been ended.");
    },
    win: function (target, room, user){
        if (!room.game ||room.game.gameId !== 'host' || !room  || !user.hasBotRank('+') || room.game.userHost !== user.userid) return false;
        target = target.split(',');
        this.send(`${target.length > 1 ? 'The winners are ' + target.join(', ') : 'The winner is ' + Users.get(target[0]).name}! Thanks for hosting.`);
        room.game.onEnd();
    },
    hangman: function (target, room, user) {
        let poke = Tools.shuffle(Object.keys(Tools.Words))[0];
        this.send(`/hangman create ${poke}, ${Tools.Words[poke]}`);
        this.send('/wall Use ``/guess`` to guess.');
    },
};
/*globals Tools*/
/*globals Users*/
