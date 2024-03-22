<template>
  <div class="section__login">
    <div class="section__login__content">
      <div class="section__login__preview">
        <div class="section__login__preview__header">
          <img src="@/assets/logo.svg" alt="" />
          <h1 class="section__login__preview__title">Chat</h1>
        </div>
        <p class="section__login__preview__subtitle">Простой чат</p>
        <p class="section__login__preview__subtitle">
          Тестовое задание от компании Oktrening
        </p>
      </div>
      <div class="login__wrapper">
        <div class="login__form">
          <div class="login__form__title">Войти</div>

          <div
            class="login__form__item"
            v-for="user in users"
            :key="user.id"
            @click="chooseUser(user.id)"
          >
            <v-list-item
              :prepend-avatar="user.img"
              :subtitle="user.nickname"
              :title="user.name"
            >
            </v-list-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useChatStore } from "@/stores";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = useChatStore();
    const router = useRouter();

    const users = store.getUsers;

    const chooseUser = (id) => {
      router.push(`/chat/${id}`);
    };

    return {
      users,
      chooseUser,
    };
  },
};
</script>
