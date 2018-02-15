// this is where all the standard game commands are put
'use strict';
exports.commands = {
    'j': 'join',
    join: function(target, room, user) {
        if (!room || !room.game || room.game.userHost == user.userid) return false;
        if (room.game.onJoin) room.game.onJoin(user);
    },
    rpl: "removeplayer",
    removeplayer: function(target, room, user) {
        this.can('debate');
        if (!room || !room.game || user.userid != room.game.userHost) return false;
        if (room.game.state == 'signups') {
            if (room.game.onLeave) room.game.onLeave(Users.get(target));
            this.send(`${Users.get(target).name} is removed from playerlist`);
        }
        room.game.state = 'signups';
        if (room.game.onLeave) room.game.onLeave(Users.get(target));
        room.game.state = 'started';
        this.send(`${Users.get(target).name} is removed from playerlist.`);
    },
    apl:'addplayer',
    addplayer: function(target, room, user){
        this.can('debate');
        if (!room || !room.game || user.userid != room.game.userHost) return false;
        if (room.game.state == 'signups') {
            if (room.game.onJoin) room.game.onJoin(Users.get(target));
            this.send(`${Users.get(target).name} is added in playerlist`);
        }
        room.game.state = 'signups';
        if (room.game.onJoin) room.game.onJoin(Users.get(target));
        room.game.state = 'started';
        this.send(`${Users.get(target).name} is added in playerlist.`);
    },
    sub: function (target, room, user) {
        this.can('debate');
        if (!room.game || !room || room.game.userHost != user.userid) return false;
        target = target.split(',');
        if (!target[0] || !target[1]) return this.send('Format: ``.sub [user] , [sub user]``');
        if (room.game.onLeave) room.game.onLeave(Users.get(target[0]));
        if (room.game.onJoin) room.game.onJoin(Users.get(target[1]));
        this.send(`${target[1]} is added in playerlist as sub for ${target[0]}`);
    },
    leave: function(target, room, user) {
        if (!room || !room.game) return false;
        if (room.game.onLeave) room.game.onLeave(user);
    },
    players: function(target, room, user) {
        if (!room || !user.can('debate') || !room.game) return false;
        if (room.game.postPlayerList) room.game.postPlayerList();
    },
    start: function(target, room, user) {
        if (!room || !user.can('broadcast') || !room.game) return false;
        if (room.game.onStart) room.game.onStart();
    },
    checkdebate: function (target, room, user){
        this.can("games");
        if (room.game && room.game.official == true) return this.send(room.game.hostName + " is hosting official debate.");
        if (room.game && room.game.official == false) return this.send(room.game.hostName + " is hosting a debate.");
        else this.send(`No debate is going on right now.`);
    },
    autostart: function (target, room, user) {
        if (!room || !user.can('broadcast') || !room.game) return false;
        if (room.game.runAutoStart) room.game.runAutoStart(target);
    },
    end: function(target, room, user) {
        this.can('debate');
        if (!room || !room.game) return false;
        room.game.destroy();
        this.send("The debate has been ended.");
    },
    hangman: function (target, room, user) {
        this.can('debate');
        let poke = Tools.shuffle(Object.keys(Tools.Words))[0];
        this.send(`/hangman create ${poke}, ${Tools.Words[poke]}`);
        this.send('/wall Use ``/guess`` to guess.');
    },
    /*globals Tools*/
    /*globals Users*/
};