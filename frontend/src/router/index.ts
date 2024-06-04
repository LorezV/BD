import { useUserStore } from "@/store";
import { createWebHistory, createRouter } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/views/MainLayout.vue"),
      children: [
        {
          name: "program-list",
          path: "program/list",
          component: () => import("@/views/program/ProgramList.vue"),
        },
        {
          name: "program-create",
          path: "program/create",
          component: () => import("@/views/program/ProgramCreate.vue"),
        },
        {
          name: "program-view",
          path: "program/view/:programId",
          component: () => import("@/views/program/ProgramView.vue"),
        },
        {
          name: "broadcast-list",
          path: "broadcast/list",
          component: () => import("@/views/broadcast/BroadcastList.vue"),
        },
        {
          name: "broadcast-create",
          path: "broadcast/create",
          component: () => import("@/views/broadcast/BroadcastCreate.vue"),
        },
        {
          name: "announcement-list",
          path: "announcement/list",
          component: () => import("@/views/announcement/AnnouncementList.vue"),
        },
        {
          name: "profile-view",
          path: "profile/view",
          component: () => import("@/views/profile/ProfileView.vue"),
        },
      ],
    },
    {
      path: "/auth",
      component: () => import("@/views/auth/AuthLayout.vue"),
      children: [
        {
          name: "sign-in",
          path: "sign-in",
          component: () => import("@/views/auth/SignInView.vue"),
        },
        {
          name: "sign-up",
          path: "sign-up",
          component: () => import("@/views/auth/SignUpView.vue"),
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  try {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      await userStore.fetchUser();
    }
  } catch (error: unknown) {
    console.error(error);
  }

  next();
});

export default router;
