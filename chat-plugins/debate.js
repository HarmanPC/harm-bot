'use strict';

class debate extends Rooms.debate{
  constructor(room,target){
      super(room);
      this.allowJoins = true;
      target = target.split(',');
      this.topic = [target[0]];
      this.player1 = [target[1]];
      this.player2 = [target[2]];
      this.sendRoom(`/modchat +`);
      this.sendRoom(`/wall A debate for:- Topic: ${this.topic} | **${this.player1}** VS ${this.player2} is starting.`);
      this.sendRoom(`/roomvoice ${this.player1}`);
      this.sendroom(`/roomvoice ${this.player2}`);
  }
}
exports.commands = {
    debate: function(target, room, user){
        if (!user.can('games')) return false;
        target = target.split(',');
        let topic = target[0];
        let player1 = target[1];
        let player2 = target[2];
        if (!topic || !player1 || !player2) return this.send('Format: `` ' + Config + 'debate [topic], [player 1], [player2]``');
        room.game = new debate(room);
    },
    enddebate: function (target, room, user) {
        if (!user.can('games')) return false;
        room.debate.destroy();
        this.send(`The debate has been ended.`);
        this.send(`/roomdeauth ${room.debate.player1}`);
        this.send(`/roomdeauth ${room.debate.player2}`);
    },
    debateplayers: function(target, room, user) {
        if (!room || !user.can('games') || !room.debate) return false;
        if (room.debate.postPlayerList) room.debate.postPlayerList();
    },
    'dj': 'debatejoin',
    debatejoin: function(target, room, user) {
        if (!room || !room.debate) return false;
        if (room.debate.onJoin) room.debate.onJoin(user);
    },
    'dl':'debateleave',
    debateleave: function(target, room, user) {
        if (!room || !room.debate) return false;
        if (room.debate.onleave) room.debate.onLeave(user);
    },
};
/*globals Rooms*/
/*globals Config*/