import api from "@/api";
import { defineStore } from "pinia";

export interface IUser {
  id: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  typeId: number;
}

export interface IUserStoreState {
  user: IUser | null;
}

export const useUserStore = defineStore("user", {
  state: (): IUserStoreState => {
    return {
      user: null,
    };
  },
  actions: {
    async fetchUser() {
      const response = await api.get("/user/me");
      if (response.status === 200) {
        this.user = response.data;
      }
    },

    async signIn(email: string, password: string) {
      const response = await api.post("/auth/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
    },

    async signUp(
      email: string,
      password: string,
      phoneNumber: string,
      firstName: string,
      lastName: string
    ) {
      const response = await api.post("/auth/register", {
        email,
        password,
        phoneNumber,
        firstName,
        lastName,
      });
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
    },

    async logOut() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});
