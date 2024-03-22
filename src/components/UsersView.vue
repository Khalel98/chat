<template>
  <div class="users">
    <div class="users__filter">
      <v-text-field
        ref="searchField"
        v-model="filterText"
        append-inner-icon="mdi mdi-magnify"
        label="Поиск"
        variant="outlined"
        hide-details
      ></v-text-field>
    </div>
    <div
      v-for="user in filteredUsers"
      :key="user.id"
      class="users__profile"
      @click="startChat(user)"
      :class="user.name === userName ? 'active' : ''"
    >
      <img :src="user.img" alt="" />
      <div class="users__profile__body">
        <div class="users__profile__body__name">
          {{ user.name }}
        </div>
        <div class="users__profile__body__nickname">
          {{
            limit(
              lastMessages[user.id]
                ? lastMessages[user.id].content
                : "Нет сообщений"
            )
          }}
        </div>
        <span>{{
          formatTime(
            lastMessages[user.id] ? lastMessages[user.id].timestamp : "No data"
          )
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useChatStore } from "@/stores";

export default {
  props: {
    userName: String,
    currentUser: Object,
    childMethod: Boolean,
  },
  setup(props, { emit }) {
    const chatStore = useChatStore();
    const messages = computed(() => chatStore.getMessages);

    const search = () => {
      if (searchField.value) {
        searchField.value.focus();
      }
    };

    const otherUsers = computed(() => {
      return props.currentUser
        ? chatStore.getUsers.filter((user) => user.id !== props.currentUser.id)
        : [];
    });

    const lastMessages = computed(() => {
      const lastMessages = {};
      for (const user of otherUsers.value) {
        const lastMessage = messages.value
          .filter(
            (msg) =>
              (msg.sender === props.currentUser.name &&
                msg.receiver === user.name) ||
              (msg.sender === user.name &&
                msg.receiver === props.currentUser.name)
          )
          .slice(-1)[0];
        lastMessages[user.id] = lastMessage;
      }
      return lastMessages;
    });

    const formatTime = (timestamp) => {
      if (timestamp != "No data") {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      } else {
        return "";
      }
    };

    const limit = (message) => {
      if (message.length > 20) {
        return message.slice(0, 20) + "...";
      } else {
        return message;
      }
    };

    const filterText = ref("");
    const filteredUsers = computed(() => {
      return otherUsers.value.filter((user) =>
        user.name.toLowerCase().includes(filterText.value.toLowerCase())
      );
    });

    const startChat = (user) => {
      emit("start-chat", user);
    };

    watch(
      () => props.childMethod,
      (newValue) => {
        console.log("childMethod changed:", newValue);
        search();
      }
    );

    const searchField = ref(null);

    return {
      filterText,
      filteredUsers,
      lastMessages,
      startChat,
      searchField,
      search,
      formatTime,
      limit,
    };
  },
};
</script>

<style lang="scss" scoped></style>
