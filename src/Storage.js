const Database = require('nedb')
const path = require('path');
const { app } = require('electron').remote;
const db = {
    notes: new Database({ filename: path.join(app.getPath('userData'), 'notes.db'), autoload: true }),
    catergories: new Database({ filename: path.join(app.getPath('userData'), 'categories.db'), autoload: true })
}

class StorageApi {
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
            db.catergories.find({}, (err, doc) => {
                if(err) reject(err);
                resolve(doc);
            });
        });
    }
    deleteNote(_id) {
        return new Promise((resolve, reject) => {
            db.notes.remove({ _id }, { multi: false }, (err, num) => {
                if(err) reject(err);
                resolve(num);
            });
        })
    }
    updateNote(_id, update) {
        return new Promise((resolve, reject) => {
            db.notes.update({ _id }, { $set: update }, {}, (err, num) => {
                if(err) reject(err);
                resolve(num);
            });
        });
    }
    clearAll() {
        return new Promise((resolve, reject) => 
            db.notes.remove({}, { multi: true }, (err, num) => err ? reject(err) : resolve(num))
        );
    }
}

export default StorageApi;