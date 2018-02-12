'use strict';
exports.game = "diddlydice";
exports.aliases = ["dd"];
class ddGame extends Rooms.botGame{
    constructor(room){
        super(room);
        
        this.gameName = "Diddly Dice";
        this.gameId = "diddlydice";
        
        this.maxBid = [];
        this.bidder = [];
        this.allowJoins = true;
        this.state = "signups";
        this.answerCommand = "special";
        
        this.sendRoom(`Harmgame! A new game of Diddly Dice is starting. Use \`\`.join\`\` to join.`);
    }
    onStart(){
        this.sendRoom(`Signups are now closed.`);
        this.state = "started";
        this.startingPlayers = this.userList.length;
        this.init();
    }
    init(room){
        this.sendRoom("Bid a number between 1 - 100 by using ``.bid``");
        this.postPlayerList();
        this.time = setInterval(() => { 
            this.sendRoom('Bidding time is over!');
            clearInterval(this.time);
            this.checkWin();
        }, 30 * 1000);
    }
    checkWin(){
        this.state = "started";
        this.sendRoom(`Good luck to ${this.bidder} with ${this.maxBid}!`);
        let rand = Math.floor(Math.random() * 100) + 1;
        if (rand >= this.maxBid){
            this.sendRoom(`The randomly chosen number is ${rand}! GG ${this.bidder}`);
            this.onEnd(toId(this.bidder));
        }
        else if (rand < this.maxBid && this.userList.length == 2) {
            this.sendRoom(`The randomly chosen number is ${rand}! RIP ${this.bidder}`);
            this.eliminate(toId(this.bidder));
            this.onEnd(this.userList);
        }
        else {
            this.sendRoom(`The randomly chosen number is ${rand}! RIP ${this.bidder}`);
            this.eliminate(this.bidder);
            this.bidder = [];
            this.maxBid = [];
            this.init();
        }
        
    }
    eliminate(person){
        this.userList.splice(this.userList.indexOf(person), 1);
        delete this.users[person];
    }
    postPlayerList(){
        let pl = this.userList.sort().map(u => this.users[u].name);
        this.sendRoom(`Players (${this.userList.length}): ${pl.join(', ')}`);
    }
    onEnd(winner){
        if (winner){
            Leaderboard.onWin('diddlydice',this.room, winner, this.startingPlayers).write();
        }
        this.destroy();
    }
}

exports.commands = {
    // disabling games
  /*  diddlydice: function (target, room, user) {
        if (!room || !user.can('broadcast')) return false;
        if (room.game) return this.send(`There is already a game going in this room. (${room.game.gameName})`);
        room.game = new ddGame(room);
    },*/
     bid: function(target, room, user)
     {
         if (!room.game) return false;
         if (target > 100 || target <= 0) return false;
         if (target < room.game.maxBid) return user.sendTo(`The highest bid is ${room.game.maxBid}`);
         if (target > room.game.maxBid) {
             room.game.maxBid = target;
             room.game.bidder = user.name;
         }
     },
     maxbid: function(target, room, user){
         if (!room.game) return false;
         this.send(`The max bid is: ${room.game.maxBid} | Bidder: ${room.game.bidder}`);
     }
};
/*globals toId*/
/*globals Leaderboard*/
/*globals Rooms*/