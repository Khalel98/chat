<template>
  <div class="chat">
    <div
      v-for="(message, index) in filteredMessages"
      :key="index"
      class="message"
    >
      <div class="message__self" v-if="message.sender === currentUser.name">
        <div class="message__block">
          <p class="message__content">{{ message.content }}</p>
          <span class="message__time">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
      <div class="message__other" v-if="message.sender === selectedUser.name">
        <div class="message__block">
          <span class="message__content">{{ message.content }}</span>
          <span class="message__time">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
    </div>
    <div class="chat__input" :class="isPermanent ? 'partwidth' : ''">
      <input type="text" v-model="newMessage" @keyup.enter="sendMessage" />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useChatStore } from "@/stores";

export default {
  props: {
    currentUser: Object,
    isChatting: Boolean,
    selectedUser: Object,
    isPermanent: Boolean,
  },
  emits: ["message-sent"],
  setup(props, { emit }) {
    const chatStore = useChatStore();
    const newMessage = ref("");
    const messages = computed(() => chatStore.getMessages);

    const filteredMessages = computed(() =>
      messages.value.filter(
        (msg) =>
          (msg.sender === props.currentUser.name &&
            msg.receiver === props.selectedUser.name) ||
          (msg.sender === props.selectedUser.name &&
            msg.receiver === props.currentUser.name)
      )
    );

    const sendMessage = () => {
      if (newMessage.value.trim() !== "") {
        chatStore.sendMessage({
          sender: props.currentUser.name,
          receiver: props.selectedUser.name,
          content: newMessage.value,
        });
        newMessage.value = "";
      }
    };

    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    watch(
      () => Object.keys(messages.value).map((key) => messages.value[key]),
      (newMessages, oldMessages) => {
        if (Object.keys(newMessages).length > Object.keys(oldMessages).length) {
          setTimeout(function () {
            emit("message-sent");
          }, 0);
        }
      },
      { deep: true }
    );

    return {
      newMessage,
      filteredMessages,
      sendMessage,
      formatTime,
    };
  },
};
</script>
