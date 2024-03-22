<template>
  <div class="sidebar__menu">
    <div class="sidebar__menu__text">{{ name }}</div>

    <div class="sidebar__menu__actions">
      <div class="sidebar__menu__actions__notification">
        <v-btn icon="mdi mdi-magnify" @click="search"></v-btn>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(item, i) in items" :key="i">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div class="sidebar__menu__actions__controls">
        <v-app-bar-nav-icon
          v-if="!isPermanent"
          color="black"
          @click="openSideBar"
        ></v-app-bar-nav-icon>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";

export default {
  props: {
    isPermanent: Boolean,
    name: String,
  },
  data() {
    return {
      items: [
        { title: "Посмотреть информацию" },
        { title: "Скрыть уведомления" },
        { title: "Заблокировать" },
      ],
    };
  },
  methods: {
    openSideBar() {
      this.$emit("openSideBar");
    },
    search() {
      this.$emit("search");
    },
  },
};
</script>
