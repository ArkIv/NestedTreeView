//events - a super-basic Javascript (publish subscribe) pattern

class Event {
  constructor() {
    this.events = {};
  }
  /**
   *
   * @param {*} eventName  имя собыития
   * @param {*} fn  функция
   * @param {*} key? функции меняются в компонентак при перерисовке, а для удаления подписки, помечаем ключом
   *  ключ можно применить если лень искать место для отписки события  например mounted / unmounted)
   */
  on(eventName, fn, key = "_empty_") {
    this.off(eventName, fn, key);

    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push({ key: key, func: fn });
    console.log("add event " + eventName);
  }

  off(eventName, fn, key = "_empty_") {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (
          (this.events[eventName][i].key === key &&
            this.events[eventName][i].key !== "_empty_") ||
          this.events[eventName][i].func === fn
        ) {
          this.events[eventName].splice(i, 1);
          console.log("delete event " + eventName);
          break;
        }
      }
    }
  }

  emit(eventName, data1, data2) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function(item) {
        item.func(data1, data2);
      });
    }
  }
}

export default new Event();
