<template>
  <div class="main">
    <p v-if="msg">{{ msg }}</p>
    <div v-if="!msg" class="add__wrapper">
      <input v-model="email" type="email" placeholder="email" />
      <input type="password" v-model="password" placeholder="password" />
      <button @click="loginHandler">login</button>
    </div>

    <div v-if="msg">
      <div class="addForm">
        <input type="text" placeholder="Add" v-model="newTodo" />
        <button @click="addTodo">Add Todo</button>
      </div>
      <div class="wrapper">
        <div v-for="todo in tList" :key="todo.id" class="card">
          <div @click="editHandler(todo.id, todo.todo)">
            {{ todo.todo }}
          </div>
          <span @click="deleteHandler(todo.id)">x</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      msg: "",
      newTodo: "",
      edited: "",
    };
  },
  methods: {
    async loginHandler() {
      try {
        await this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
        });
        this.msg = "Login successfull...";
        this.$store.dispatch("fetchTodos");
      } catch (error) {
        console.log(error);
      }
    },

    addTodo() {
      if (this.newTodo !== "") {
        this.$store.dispatch("addTodo", {
          todo: this.newTodo,
        });

        this.newTodo = "";
      }
    },

    deleteHandler(id) {
      this.$store.dispatch("deleteTodo", id);
    },

    editHandler(todoId, todoText) {
      const editedTodo = prompt("Edit Todo", todoText);
      this.edited = editedTodo;
      console.log(this.edited);
      if (this.edited !== null) {
        this.$store.dispatch("editTodo", {
          todoId: todoId,
          editedTodo: this.edited,
        });
      }
    },
  },
  computed: {
    tList() {
      return this.$store.state.todosList;
    },
  },

  async mounted() {
    this.$store.dispatch("fetchTodos");
  },
};
</script>

<style scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid #00000046;
  padding: 1rem;
  max-width: 700px;
  margin: 0 auto;
}
ul {
  list-style-type: none;
}
span {
  color: red;
  margin-left: 2rem;
  cursor: pointer;
}
.wrapper {
  display: flex;
  flex-direction: column;
}
.addForm {
  margin-bottom: 2rem;
}
button,
input {
  margin-left: 1rem;
}
.add__wrapper {
  display: block;
}
.card {
  background: rgb(238, 237, 237);
  padding: 5px 1.5rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  display: flex;
  max-width: 200px;
  justify-content: space-between;
}
</style>

