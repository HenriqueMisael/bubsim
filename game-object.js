class GameObject {

  listeners = {};
  constructor(id) {
    this.id = id;
  }

  addListener(eventType, listener) {
    if(this.listeners.hasOwnProperty(eventType)) {
      this.listeners[eventType].push(listener);
    } else {
      this.listeners[eventType] = [listener];
    }
  }

  dispatch(eventType) {
    if(this.listeners.hasOwnProperty(eventType)) {
      this.listeners[eventType].forEach(func => func({dispatcher: this}));
    }
  }
}
