import Vue from "vue";
import Vuex from "vuex";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "@firebase/auth";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    todosList: [],
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
      console.log("user state changed:", state.user);
    },
  },
  actions: {
    async login(context, { email, password }) {
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (res) {
        context.commit("setUser", res.user);
        console.log("login successfull..");
      } else {
        console.log("login failed..");
      }
    },

    async addTodo(context, payload) {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;

        // Create a reference to the "users" collection
        const usersRef = collection(db, "users");

        // Create a reference to the document with the current user's ID
        const userDocRef = doc(usersRef, userId);

        // Create a reference to the "todos" subcollection within the user's document
        const todosRef = collection(userDocRef, "todos");

        // Store a new todo in the "todos" subcollection
        await addDoc(todosRef, {
          todo: payload.todo,
        })
          .then((docRef) => {
            console.log("Todo stored with ID: ", docRef.id);
          })
          .catch((error) => {
            console.error("Error storing todo: ", error);
          });
      }
    },
    fetchTodos() {
      const user = auth.currentUser;
      if (user) {
        onAuthStateChanged(auth, (user) => {
          const userId = user.uid;
          const usersRef = collection(db, "users");
          const userDocRef = doc(usersRef, userId);
          const todosRef = collection(userDocRef, "todos");
          const q = query(todosRef);

          onSnapshot(q, (snapshot) => {
            const todos = [];
            snapshot.forEach((doc) => {
              const todo = {
                id: doc.id,
                ...doc.data(),
              };
              todos.push(todo);
            });
            this.state.todosList = todos;
          });
        });
      }
    },

    deleteTodo(context, id) {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const usersRef = collection(db, "users");
        const userDocRef = doc(usersRef, userId);
        const todosRef = collection(userDocRef, "todos");
        const todoDocRef = doc(todosRef, id);

        deleteDoc(todoDocRef)
          .then(() => {
            console.log("Todo deleted");
          })
          .catch((error) => {
            console.error("Error deleting todo: ", error);
          });
      }
    },

    editTodo(context, { todoId, editedTodo }) {
      console.log(context, todoId, editedTodo);

      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const usersRef = collection(db, "users");
        const userDocRef = doc(usersRef, userId);
        const todosRef = collection(userDocRef, "todos");
        const todoDocRef = doc(todosRef, todoId);
        // Update the todo document

        updateDoc(todoDocRef, {
          todo: editedTodo,
        })
          .then(() => {
            console.log("Todo updated successfully");
          })

          .catch((error) => {
            console.error("Error updating todo: ", error);
          });
      }
    },
  },
  getters: {},
});

export default store;
