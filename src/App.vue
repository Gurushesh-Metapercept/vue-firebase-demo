<template>
  <div>
    <input v-model="newItemName" type="text" placeholder="New Item" />
    <button @click="addItem">Add Item</button>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
        <button @click="deleteItem(item.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState(["items"]),
  },
  data() {
    return {
      newItemName: "",
    };
  },
  created() {
    this.fetchItems();
  },
  methods: {
    ...mapActions(["fetchItems", "addItem", "deleteItem"]),
    addItem() {
      const item = { name: this.newItemName };
      this.addItem(item);
      this.newItemName = "";
    },
  },
};
</script>
