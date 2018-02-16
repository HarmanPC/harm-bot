'use strict';
exports.game = 'debate';
exports.aliases = [];


class Debate extends Rooms.botGame {
    constructor(room)
    {
        super(room);
        this.allowJoins = true;
        this.gameId = "debate";
        this.gameName = 'Debate';
        
        this.sendRoom('A debate is starting! Use ``.join`` to join the debate.');
    }
}
exports.commands = {
    debate: function(target, room, user) 
    {
        if (!this.can('debate') || !room ) return false;
        if (room.game == 'host') return this.send(`${room.game.hostName} is hosting a game.`);
        room.game = new Debate(room);
    }
};
/* globals Rooms*/