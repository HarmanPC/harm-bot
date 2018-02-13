'use strict';

class debate {
    constructor(room, topic, user1, user2) {
        this.room = room;
        this.users = {};
        this.userList = [];
        this.debate = "debate";
        this.debateName = "Debate";
        this.allowJoins = false;
        this.state = null;
        this.answerCommand = "special";
        this.allowRenames = false;

        this.playerType = null;
    }

    sendRoom(message) {
        this.room.send(null,message);
    }

    buildPlayerList() {
        return {count: this.userList.length, players: this.userList.sort().map(u => this.users[u].name).join(", ")};
    }

    postPlayerList() {
        let pl = this.buildPlayerList();
        this.sendRoom(`Players (${pl.count}): ${pl.players}`);
    }

    onEnd() {
        this.destroy();
    }

    destroy() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        delete this.room.debate;
    }
}

class DebatePlayer {
    constructor(user, game) {
        this.name = user.name;
        this.userid = user.userid;
        this.user = user;
        
        this.debate = debate;
    }
}

module.exports = {
    debate: debate,
    dPlayer: DebatePlayer,
};
