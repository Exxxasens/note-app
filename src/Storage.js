class EventEmitter {
    constructor() {
        this.events = {};
    }

    emit(name, ...args) {
    		if(!this.events[name]) return;
        this.events[name].map(fn => fn(...args));
        return this;
    }

    on(name, handler) {
        if(!this.events[name]) this.events[name] = [];
        this.events[name].push(handler);
        return handler;
    }

    removeListener(name, handler) {
        this.events[name] = this.events[name].filter(fn => fn !== handler);
        
        return this;
    }
		
    once(name, handler) {
        let wrapper = (...args) => {
        		handler(...args);
            this.removeListener(name, wrapper);
        }
        this.on(name, wrapper);
        return handler;
        
    }

}



class Storage extends EventEmitter {
    constructor() {
        super();
    }
    get(key) {
        if(!this.has(key)) throw new Error('Item doesn\'t exist');
        return JSON.parse(localStorage.getItem(key));
    }
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        this.emit('change');
        return value;
    }
    has(key) {
        return Boolean(localStorage.getItem(key));
    }
    addItem(key, value) {
        if(this.has(key)) throw new Error('Item is already exist');
        return this.set(key, value);
    }
    updateItem(key, options) {
        if(!this.has(key)) throw new Error('Item doesn\'t exist');
        let item = this.get(key);
        item = Object.assign(item, options);
        this.set(key, item);
        this.emit('change');
        return item;
    }
    deleteItem(key) {
        let item = localStorage.get(key);
        localStorage.removeItem(key)
        this.emit('change');
        return item;
    }
}

