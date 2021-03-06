const { EventEmitter } = require('events');
const Database = require('nedb')
const path = require('path');
const app = require('electron').remote.app
const onload = (e) => {
    if(e) return console.log(e);
    console.log('ok, loaded');
}
const db = {
    notes: new Database({ 
        filename: path.join(app.getPath('userData'), 'notes.db'), 
        autoload: true, 
        onload 
    }),
    categories: new Database({
        filename: path.join(app.getPath('userData'), 'categories.db'), 
        autoload: true, 
        onload 
    })
}

class StorageApi extends EventEmitter {
    getAllNotes() {
        return new Promise((resolve, reject) => {
            db.notes.find({}, (err, doc) => {
                if(err) reject(err);
                resolve(doc);
            });
        });
    }
    getNoteById(id) {
        return new Promise((resolve, reject) => {
            db.notes.findOne({ id }, (err, doc) => {
                if(err) reject(err);
                resolve(doc);
            })
        });
    }
    addNote(note) {
        return new Promise((resolve, reject) => {
            db.notes.insert({ ...note, createdAt: Date.now(), updatedAt: Date.now() }, (err, doc) => {
                if(err) reject(err);
                this.emit('update');
                resolve(doc);
            });
        })
    }
    getAllNotesByCategory(name) {
        return new Promise((resolve, reject) => {
            db.notes.find({ 'category.name': name }, (err, doc) => {
                if(err) reject(err);
                resolve(doc);
            })
        })
    }
    getAllCategories() {
        return new Promise((resolve, reject) => {
            db.categories.find({}, (err, doc) => {
                if(err) reject(err);
                resolve(doc);
            });
        });
    }
    addCategory(category) {
        return new Promise((resolve, reject) => {
            db.categories.insert({ ...category, createdAt: Date.now(), updatedAt: Date.now() }, (err, doc) => {
                if(err) reject(err);
                this.emit('update');
                resolve(doc);
            });
        });
    }
    deleteCategory(_id) {
        return new Promise((resolve, reject) => {
            db.categories.remove({ _id }, { multi: false }, (err) => {
                if(err) reject(err);
                db.notes.update({ category: _id }, { $set: { category: null } }, {}, (err, num) => {
                    if(err) reject(err);
                    console.log('deleted: ' + num + ' categories');
                    this.emit('update');
                    resolve(num);
                });
            });
        });
    }
    deleteNote(_id) {
        return new Promise((resolve, reject) => {
            db.notes.remove({ _id }, { multi: false }, (err, num) => {
                if(err) reject(err);
                this.emit('update')
                resolve(num);
            });
        })
    }
    updateNote(_id, update) {
        return new Promise((resolve, reject) => {
            db.notes.update({ _id }, { $set: update }, {}, (err, num) => {
                if(err) reject(err);
                this.emit('update');
                resolve(num);
            });
        });
    }
    updateCategory(_id, update) {
        return new Promise((resolve, reject) => {
            db.categories.update({ _id }, { $set: update }, {}, (err, num) => {
                if(err) reject(err);
                this.emit('update');
                resolve(num);
            });
        });
    }
    clearAllNotes() {
        return new Promise((resolve, reject) => 
            db.notes.remove({}, { multi: true }, (err, num) => {
                if(err) reject(err);
                this.emit('update');
                resolve(num)
            })
        );
    }
    clearAllCategories() {
        return new Promise((resolve, reject) => 
            db.categories.remove({}, { multi: true }, (err, num) => {
                if(err) reject(err);
                this.emit('update');
                resolve(num)
            })
        );
    }
    clearCategory(_id) {
        return new Promise((resolve, reject) => {
            db.notes.remove({ category: _id }, { multi: true }, (err, num) => {
                console.log(`deleted ${num} notes`);
                if(err) reject(err);
                this.deleteCategory(_id)
                    .then(resolve)
                    .catch(reject);
            });
        });
    }
    async syncDatabase() {

    }
    async getAllNotesWithCategories() {
        let notes = await this.getAllNotes();
        const categories = await this.getAllCategories();
        notes = notes.map(note => {
            let idx = categories.findIndex(({ _id }) => _id === note.category);
            return { ...note, category: categories[idx] };
        });
        return notes;
    }
}

module.exports = StorageApi;