import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    users: JSON.parse(localStorage.getItem("users")) || [
      {
        id: 1,
        name: "Денисов Кирилл",
        nickname: "kirill.denisov@gmail.com",
        img: "https://img.freepik.com/free-photo/portrait-of-an-interesting-young-man-in-winter-clothes_158595-914.jpg?w=1060&t=st=1711056154~exp=1711056754~hmac=0c7a47c7b71075716b431ed3040c5a8a887048de10d0c11871d50788b82873b1",
      },
      {
        id: 2,
        name: "Васильев Никита",
        nickname: "nikita.vasilev@gmail.com",
        img: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?w=1800&t=st=1711056182~exp=1711056782~hmac=bad4b645fc735b406c45751f37779e6c643aca35627b13c0f627f4c31b7289b1",
      },
      {
        id: 3,
        name: "Герасимов Фёдор",
        nickname: "fedorov.gerasimov@gmail.com",
        img: "https://cdn.vuetifyjs.com/images/john.png",
      },
    ],
    messages: JSON.parse(localStorage.getItem("messages")) || [],
  }),
  getters: {
    getUsers: (state) => state.users,
    getMessages: (state) => state.messages,
  },
  actions: {
    sendMessage({ sender, receiver, content }) {
      const timestamp = Date.now();
      // Add message to the messages array with timestamp
      this.messages.push({ sender, receiver, content, timestamp });
      // Save messages to local storage
      localStorage.setItem("messages", JSON.stringify(this.messages));
    },
    saveUsers(users) {
      this.users = users;
      localStorage.setItem("users", JSON.stringify(users));
    },
  },
});
