import { defineStore } from "pinia";

export const useToastStore = defineStore("toast", {
  state: () => ({
    show: false,
    message: "",
    type: "success" // success | error | info
  }),

  actions: {
    success(msg) {
      this.message = msg;
      this.type = "success";
      this.show = true;
      this.autoHide();
    },

    error(msg) {
      this.message = msg;
      this.type = "error";
      this.show = true;
      this.autoHide();
    },

    info(msg) {
      this.message = msg;
      this.type = "info";
      this.show = true;
      this.autoHide();
    },

    autoHide() {
      setTimeout(() => {
        this.show = false;
      }, 2500);
    }
  }
});
