import Vue from "vue";
import Vuex from "vuex";
import { db } from "./firebase";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    items: [],
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items;
    },
    ADD_ITEM(state, item) {
      state.items.push(item);
    },
    UPDATE_ITEM(state, updatedItem) {
      const index = state.items.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        Vue.set(state.items, index, updatedItem);
      }
    },
    DELETE_ITEM(state, itemId) {
      state.items = state.items.filter((item) => item.id !== itemId);
    },
  },
  actions: {
    async fetchItems({ commit }) {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        commit("SET_ITEMS", items);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },

    async addItem({ commit }, item) {
      try {
        const docRef = await addDoc(collection(db, "items"), item);
        const newItem = { id: docRef.id, ...item };
        commit("ADD_ITEM", newItem);
      } catch (error) {
        console.error("Error adding item:", error);
      }
    },
    async updateItem({ commit }, item) {
      try {
        const itemRef = doc(db, "items", item.id);
        await updateDoc(itemRef, item);
        commit("UPDATE_ITEM", item);
      } catch (error) {
        console.error("Error updating item:", error);
      }
    },
    async deleteItem({ commit }, itemId) {
      try {
        await deleteDoc(doc(db, "items", itemId));
        commit("DELETE_ITEM", itemId);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
  },
});
