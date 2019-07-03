export default class HideTabStore {

  static hideStore = null;

  static setStore(store) {
    HideTabStore.hideStore = store;
  }

  static getStore() {
    if (typeof HideTabStore.hideStore['get'] !== 'function') {
      throw "You need to set a store. This can be anything as long it returns an array. Set the store by using the method setStore()";
    }
    return HideTabStore.hideStore.get();
  }

}
