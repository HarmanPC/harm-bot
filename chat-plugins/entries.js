"use strict";

Config.settableCommands.entries = true;

exports.commands = {
    e: "entry",
    entry: function (target, room, user) {
        if (!room || !this.can("broadcast")) return false;
        let entries = Object.keys(Db("entries").get(room.id, {}));
        if (!entries.length) return false;
        
        let id = parseInt(target);
        
        let quote = id && entries[id - 1] ? entries[id - 1] : entries[Math.floor(Math.random() * entries.length)];
        
        this.send(quote);
    },
    
    addentry: function (target, room, user) {
        if (!room || !this.can("entries")) return false;
        
        if (Db("entries").has([room.id, target])) return this.send("The entry already exists.");
        
        Db("entries").set([room.id, target], 1);
        this.send("Added a new entry.");
    },
    
    deleteentry: "delentry",
    delentry: function (target, room, user) {
        if (!room || !this.can("broadcast")) return false;
        
        if (parseInt(target)) {
            let id = parseInt(target);
            let entries = Object.keys(Db("entries").get(room.id, {}));
            if (!entries[id - 1]) return this.send("Invalid entry ID.");
            
            target = entries[id - 1];
        }
        
        if (!Db("entries").has([room.id, target])) return this.send("The entry does not exists.");
        
        Db("entries").delete([room.id, target]);
        this.send("Deleted the entry.");
    },
    entries:"todolist",
    todolist: function (target, room, user) {
        if (!room) {
            if (!Rooms.rooms.has(toId(target, true))) return this.send("Invalid room.");
            room = Rooms.get(target);
        }
        
        if (!user.can("entries", room)) return false;
        let entries = Object.keys(Db("entries").get(room.id, {}))
            .map((q, i) => (i + 1) + ". " + q);
        
        Tools.uploadToHastebin(entries.join("\n\n"), link => this.send("To Do List for " + room.name + ": " + link));
    }
};
/*globals toId*/
/*globals Rooms*/
/*globals Config*/
/*globals Db*/
/*globals Tools*/