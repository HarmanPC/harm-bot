// this is where all the standard game commands are put
'use strict';
exports.commands = {
    'j': 'join',
    join: function (target, room, user) {
        if (!room || !room.game) return false;
        if (room.game.userHost === user.userid) return user.sendTo('You can\'t join your own game.');
        if (room.game.onJoin) room.game.onJoin(user);
    },
    leave: function (target, room, user) {
        if (!room || !room.game) return false;
        if (room.game.onLeave) room.game.onLeave(user);
    },
    rpl: "removeplayer",
    removeplayer: function(target, room, user) {
        if (!room || !room.game || !user.hasBotRank('host')) return false;
        if (room.game.state == 'signups') {
                if (room.game.onLeave) room.game.onLeave(Users.get(target));
                this.room.send(null, `${Users.get(target).name} is removed from playerlist.`);
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
        if (!room || !room.game || !user.hasBotRank('host')) return false;
        if (room.game.state == 'signups') {
                if (room.game.onJoin) room.game.onJoin(Users.get(target));
                this.room.send(null, `${Users.get(target).name} is added in playerlist.`);
        }
        else if (room.game.state == 'started') {
                room.game.state = 'signups';
                if (room.game.onJoin) room.game.onJoin(Users.get(target));
                room.game.state = 'started';
                this.room.send(null, `${Users.get(target).name} is added in playerlist.`);
        }
    },
    sub: "replace",
    replace: function (target, room, user) {
        if (!room || !room.game || room.game.gameId !== "host" || !user.hasBotRank('host')) return false;
        if (!target) return this.room.send(null, "Usage ``" + room.commandCharacter[0] + "sub [old player], [new player]``");
        let parts = target.split(",");
        if (parts.length !== 2) return this.room.send(null, "Usage ``" + room.commandCharacter[0] + "sub [old player], [new player]``");
        if (!room.users.has(toId(parts[1]))) this.room.send(null, "The new player is not in the room.");
        if (toId(parts[1]) === room.game.hostid) return this.room.send(null, "You cannot add the host into the game.");
        if (room.game.onJoin) room.game.onJoin(Users.get(parts[1]));
        if (room.game.onLeave) room.game.onLeave(Users.get(parts[0]));
        this.room.send(null, parts[1] + ' has joined the game.');
    },
    pl: 'players',
    players: function (target, room, user) {
        if (!room  || !room.game || !user.hasBotRank('host')) return false;
        if (room.game.postPlayerList) return room.game.postPlayerList();
    },
    start: function (target, room, user) {
        if (!room || !room.game || !user.hasBotRank('host')) return false;
        room.game.onStart();
    },
    autostart: function (target, room, user) {
        if (!room || !room.game || !user.hasBotRank('host')) return false;
        room.game.runAutoStart(target);
    },
    end: function (target, room, user) {
        if (!room || !room.game || !user.hasBotRank('+')) return false;
        if (room.game.hostid) {
            hostlog(Users.get(room.game.hostid).name + "'s host ended.");
            this.parse(`/promote ${room.game.hostid}, deauth`);
        }
        else {
            debatelog("The debate was forcibly ended. (" + room.game.type + ")");
        }
        room.game.destroy();
        this.room.send(null, "The debate has been ended.");
    },
    /*win: function (target, room, user){
        if (!room.game || room.game.gameId !== 'host' || !room || !user.hasBotRank('host')) return false;
        let targets = target.split(',');
        this.room.send(null, `${targets.length > 1 ? 'The winners are ' + targets.join(', ') : 'The winner is ' + Users.get(targets[0]).name}! Thanks for hosting.`);
        hostlog(`${targets.length > 1 ? 'The winners were ' + targets.join(', ') : 'The winner was ' + Users.get(targets[0]).name}, in ${Users.get(room.game.hostid).name}'s host.`);
        room.game.onEnd();
        this.parse(`/promote ${user.userid}, deauth`);
    },*/
    done: function (target, room, user) {
        if (!room || !room.game || room.game.gameId !== 'host' || !user.hasBotRank('host')) return false;
        hostlog(Users.get(room.game.hostid).name + "'s host ended.");
        room.game.onEnd();
        this.parse(`/promote ${user.userid}, deauth`);
        this.room.send(null, 'Thanks for hosting!');
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
/*globals toId*/
/*globals debatelog*/
/*globals hostlog*/