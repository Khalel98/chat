<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :permanent="isPermanent"
      class="sidebar__container"
    >
      <div>
        <div class="profile" v-if="currentUser">
          <img :src="currentUser.img" alt="" />
          <div class="profile__body">
            <div class="profile__body__name">{{ currentUser.name }}</div>
            <div class="profile__body__nickname">
              {{ currentUser.nickname }}
            </div>
          </div>
        </div>

        <UsersView
          @start-chat="startChat"
          :userName="userName"
          :currentUser="currentUser"
          :childMethod="childMethod"
        />
      </div>
      <div>
        <button class="logout" @click="logout">
          <v-icon class="logout__icon" icon="mdi mdi-exit-to-app" />
          <div class="logout__title">Выйти</div>
          <div class="logout__icon"></div>
        </button>
      </div>
    </v-navigation-drawer>

    <v-app-bar>
      <SideBarMenu
        @openSideBar="drawer = !drawer"
        :isPermanent="isPermanent"
        :name="userName"
        @search="search"
      />
    </v-app-bar>

    <v-main class="mainContent">
      <!-- Chat Block -->
      <ChatBlock
        v-if="isChatting"
        :currentUser="currentUser"
        :isChatting="isChatting"
        :selectedUser="selectedUser"
        :isPermanent="isPermanent"
        @message-sent="scrollChatToBottom"
      />
    </v-main>
  </v-app>
</template>

<script>
import SideBarMenu from "@/components/layout/SideBarMenu.vue";
import UsersView from "@/components/UsersView.vue";
import ChatBlock from "@/components/ChatBlock.vue";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useChatStore } from "@/stores";

export default {
  components: {
    SideBarMenu,
    UsersView,
    ChatBlock,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const chatStore = useChatStore();
    const userId = route.params.id;
    const users = computed(() => chatStore.getUsers);
    const currentUser = ref(null);

    const defineCurrentUser = () => {
      currentUser.value = users.value.find((user) => user.id == userId);
    };

    const isChatting = ref(false);
    const selectedUser = ref(null);
    const userName = ref("");
    const messages = computed(() => chatStore.getMessages);

    const startChat = (user) => {
      selectedUser.value = user;
      userName.value = user.name;
      isChatting.value = true;
      if (!isPermanent.value) {
        drawer.value = false;
      }
      setTimeout(scrollChatToBottom, 0);
    };

    const scrollChatToBottom = () => {
      const chatContainer = document.querySelector(".chat");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    };

    const childMethod = ref(false);

    const search = () => {
      childMethod.value = !childMethod.value;
    };

    const logout = () => {
      console.log("Logging out...");
      router.push(`/`);
    };

    const drawer = ref(null);
    const screenWidth = ref(window.innerWidth);
    const isScreenSizeLessThan1100px = ref(screenWidth.value <= 1100);
    const isPermanent = ref(null);

    const handleResize = () => {
      screenWidth.value = window.innerWidth;
      isScreenSizeLessThan1100px.value = screenWidth.value <= 1100;

      isPermanent.value = !isScreenSizeLessThan1100px.value;
    };

    onMounted(() => {
      defineCurrentUser();
      window.addEventListener("resize", handleResize);
      handleResize();
      window.addEventListener("storage", () => {
        let array = JSON.parse(localStorage.getItem("messages"));
        let lastElement = array[array.length - 1];
        chatStore.messages.push(lastElement);
      });
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });

    return {
      drawer,
      screenWidth,
      isScreenSizeLessThan1100px,
      isPermanent,
      handleResize,
      currentUser,
      isChatting,
      selectedUser,
      userName,
      startChat,
      scrollChatToBottom,
      messages,
      userId,
      users,
      defineCurrentUser,
      search,
      childMethod,
      logout,
    };
  },
};
</script>
