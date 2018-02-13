'use strict';

class debate extends Rooms.debate{
  constructor(room, topic, p1, p2){
      super(room);
      this.allowJoins = true;
      this.topic = topic;
      this.player1 = p1;
      this.player2 = p2;
      this.userList = [];
      this.state = 'signups';
      this.sendRoom(`/wall A debate for:- Topic: ${this.topic} | **${this.player1}** VS **${this.player2}** is starting.`);
  }
  onStart(){
      this.state = 'started';
      this.sendRoom('/wall Signups are now closed');
      this.postPlayerList();
  }
  // planned 
  makeRandomTeams(){
      if (this.userList.length%2 != 0) return false;
      let rand = this.userList[Math.floor(Math.random() * this.userList.length - 1)];
      
  }
}
exports.commands = {
    debate: function(target, room, user){
        if (!user.can('debate')) return false;
        target = target.split(',');
        let topic = target[0];
        let player1 = target[1];
        let player2 = target[2];
        if (!topic || !player1 || !player2) return this.send('Format: `` ' +  room ? room.commandCharacter[0] : Config.defaultCharacter + 'debate [topic], [player 1], [player2]``');
        room.game = new debate(room, topic, player1, player2);
    },
    startdebate: function (target, room, user) {
        if (!user.can('debate')) return false;
        if (room.debate) return room.debate.onStart();
    },
    enddebate: function (target, room, user) {
        if (!user.can('games')) return false;
        room.debate.destroy();
        this.send(`The debate has been ended.`);
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