var time = 0;
'use strict';
exports.commands = {
    'j': 'join',
    join: function (target, room, user) {
        let debate = room.game;
        if (!room || !debate) return;
        if (user.hasBotRank('host')) return user.sendTo('You can\'t join your own game.');
        if (debate.userList.includes(user.userid)) return user.sendTo("You have already joined!");
        debate.onJoin(user);
        user.sendTo("You have joined the debate.");
    },
    leave: function (target, room, user) {
        let debate = room.game;
        if (!room || !debate || !debate.allowJoins || !debate.userList.includes(user.userid)) return;
        debate.onLeave(user);
        user.sendTo("You have left the debate.");
    },
    rpl: "removeplayer",
    removeplayer: function(target, room, user) {
        if (!room || !room.game || !user.hasBotRank('host')) return;
        let state = room.game.state;
        let leave = room.game.onLeave;
        target = Users.get(target);
        if (state == 'signups') {
                leave(target);
                this.room.send(null, `${target.name} is removed from playerlist.`);
        }
        else if (state == 'started') {
                state = 'signups';
                leave(target);
                state = 'started';
                this.room.send(null, `${target.name} is removed from playerlist.`);
        }
    },
    apl:'addplayer',
    addplayer: function (target, room, user) {
        if (!room || !room.game || !user.hasBotRank('host')) return;
        let state = room.game.state;
        let join = room.game.onJoin;
        target = Users.get(target);
        if (state == 'signups') {
                join(target);
                this.room.send(null, `${target.name} is added in playerlist.`);
        }
        else if (state == 'started') {
                state = 'signups';
                join(target);
                state = 'started';
                this.room.send(null, `${target.name} is added in playerlist.`);
        }
    },
    sub: "replace",
    replace: function (target, room, user) {
        if (!room || !room.game || room.game.gameId !== "host" || !user.hasBotRank('host')) return;
        if (!target) return room.post("Usage ``" + room.commandCharacter[0] + "sub [old player], [new player]``");
        let debate = room.game;

        target = target.split(",").map(u => Users.get(u));
        if (target.length !== 2) return room.post("Usage ``" + room.commandCharacter[0] + "sub [old player], [new player]``");

        if (!room.users.has(target[1].id)) room.post("The new player is not in the room.");
        if (target[1].id === debate.hostid) return room.post("You cannot add the host into the game.");

        debate.onJoin(target[1]);
        debate.onLeave(target[0]);
        room.post(target[1].name + ' has joined the game.');
    },
    pl: 'players',
    players: function (target, room, user) {
        if (!room  || !room.game || !user.hasBotRank('host')) return;
        if (room.game.postPlayerList) return room.game.postPlayerList();
    },
    start: function (target, room, user) {
        if (!room || !room.game || !user.hasBotRank('host')) return;
        room.game.onStart();
    },
    autostart: function (target, room, user) {
        if (!room || !room.game || !user.hasBotRank('host')) return;
        room.game.runAutoStart(target);
    },
    end: function (target, room, user) {
        if (!room || !room.game || !user.hasBotRank('+')) return;
        let debate = room.game;
        if (debate.hostid) {
            hostlog(Users.get(debate.hostid).name + "'s host ended.");
            this.parse(`/promote ${debate.hostid}, deauth`);
        }
        else {
            debatelog("The debate was forcibly ended. (" + debate.type + ")");
        }
        debate.destroy();
        room.post("The debate has been ended.");
    },
    /*win: function (target, room, user){
        if (!room.game || room.game.gameId !== 'host' || !room || !user.hasBotRank('host')) return;
        let targets = target.split(',');
        this.room.send(null, `${targets.length > 1 ? 'The winners are ' + targets.join(', ') : 'The winner is ' + Users.get(targets[0]).name}! Thanks for hosting.`);
        hostlog(`${targets.length > 1 ? 'The winners were ' + targets.join(', ') : 'The winner was ' + Users.get(targets[0]).name}, in ${Users.get(room.game.hostid).name}'s host.`);
        room.game.onEnd();
        this.parse(`/promote ${user.userid}, deauth`);
    },*/
    done: function (target, room, user) {
        if (!room || !room.game || room.game.gameId !== 'host' || !user.hasBotRank('host')) return;
        hostlog(Users.get(room.game.hostid).name + "'s host ended.");
        this.parse(`/promote ${room.game.hostid}, deauth`);
        room.game.onEnd();
        this.room.send(null, 'Thanks for hosting!');
    },
    hangman: function (target, room, user) {
		if (!room || !user.hasBotRank('+')) return;
		if ((Date.now() - time) < 9000000) return room.post('2:30 hours must have been passed for the last Hangman to start a new Hangman.');
        let poke = Tools.shuffle(Object.keys(Tools.Words))[0];
        room.post(`/hangman create ${poke}, ${Tools.Words[poke]}`);
        room.post('/wall Use ``/guess`` to guess.');
        time = Date.now();
    },
};
/*globals Tools*/
/*globals Users*/
/*globals debatelog*/
/*globals hostlog*/
