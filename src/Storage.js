const { app } = require('electron').remote;
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events').EventEmitter;

class Storage  extends EventEmitter {
    constructor(filePath) {
        super();
        if(!filePath) throw new Error('path is required!');
        this._path = filePath;
        this.data = {
            collections: {},
            collectionList: []
        };
        this.init = false;
    }

    loadFromFile() {
        if(fs.existsSync(this._path)) {
            fs.readFile(this._path, {}, (err, result) => {
                if(err) {
                    console.log(err);
                    throw new Error('Failed to read file: ' + this._path);
                }
                this.data = JSON.parse(result.toString());
                this.init = true;
                this.emit('ready');

            })
        } else {
            fs.open(this._path, 'a+', (err) => {
                fs.writeFileSync(this._path, JSON.stringify(this.data));
                this.emit('ready');
                this.init = true;
                if(err) {
                    console.log(err);
                    throw new Error('Failed to open file: ' + this._path);
                }
            });
        }
    }
    
    saveData() {
        console.log(this.data);
        fs.writeFileSync(this._path, JSON.stringify(this.data));
    }

    generateID() {
        // Modeled after base64 web-safe chars, but ordered by ASCII.
        var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
      
        // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
        var lastPushTime = 0;
      
        // We generate 72-bits of randomness which get turned into 12 characters and appended to the
        // timestamp to prevent collisions with other clients.  We store the last characters we
        // generated because in the event of a collision, we'll use those same characters except
        // "incremented" by one.
        var lastRandChars = [];
      
        return (function() {
            var now = new Date().getTime();
            var duplicateTime = (now === lastPushTime);
            lastPushTime = now;
        
            var timeStampChars = new Array(8);
            for (var i = 7; i >= 0; i--) {
                timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
                now = Math.floor(now / 64);
            }
            if (now !== 0) throw new Error('We should have converted the entire timestamp.');
        
            var id = timeStampChars.join('');
        
            if (!duplicateTime) {
                for (i = 0; i < 12; i++) {
                    lastRandChars[i] = Math.floor(Math.random() * 64);
                }
            } else {
                for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
                    lastRandChars[i] = 0;
                }
                lastRandChars[i]++;
            }
            for (i = 0; i < 12; i++) {
                id += PUSH_CHARS.charAt(lastRandChars[i]);
            }
            if(id.length != 20) throw new Error('Length should be 20.');
        
            return id;
        })();
    }
    createCollection(name) {
        if(this.data.collectionList.findIndex((collection) => collection === name) >= 0) {
            throw new Error('collection is already exist');
        }
        this.data.collectionList.push(name);
        this.data.collections[name] = {};
    }
    getAllCollections() {
        return this.data.collectionList;
    }
    getCollection(name) {
        return this.data.collections[name];
    }
    getItem(collection, id) {
        return this.data.collections[collection][id];
    }
    getAllItems(collection) {
        return Object.values(this.data.collections[collection]);
    }
    deleteItem(collection, id) {
        delete this.data.collections[collection][id];
        this.saveData();
        return this;
    }
    addItem(collection, data) {
        const id = this.generateID();
        if(!this.data.collections[collection]) return new Error(collction + ' is not exist');
        if(this.data.collections[collection][id]) return this.addItem(collection, data);
        const createdAt = new Date();
        const updatedAt = new Date();
        this.data.collections[collection][id] = { ...data, id, createdAt, updatedAt };
        this.saveData();
        return this.data.collections[collection][id];
    }
}
module.exports = new Storage(path.join(app.getPath('userData'), 'storage.json'));