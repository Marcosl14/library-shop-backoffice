import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProductSelection from "../views/ProductSelection.vue";
import OfferItemView from "../views/OfferItemView.vue";
import LogInView from "../views/LogInView.vue";
import UserView from "../views/UserView.vue";
import ProductView from "../views/ProductView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "offers",
      component: HomeView,
    },
    {
      path: "/oferta",
      name: "offer-empty",
      component: OfferItemView,
    },
    {
      path: "/oferta/:id",
      name: "offer-by-id",
      component: OfferItemView,
    },
    {
      path: "/seleccionar-producto/:id",
      name: "product-selection",
      component: ProductSelection,
    },
    {
      path: "/producto",
      name: "product",
      component: ProductView,
    },
    {
      path: "/iniciar-sesion",
      name: "log-in",
      component: LogInView,
    },
    {
      path: "/usuario",
      name: "user",
      component: UserView,
    },
  ],
});

export default router;
