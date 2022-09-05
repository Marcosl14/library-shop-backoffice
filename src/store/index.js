/* eslint-disable no-unused-vars */
import { createStore } from "vuex";

import router from "../router/index.js";

import categoriesService from "../services/categoriesService";
import itemsService from "../services/itemsService";
import offersService from "../services/offersService";
import userService from "../services/userService";

export default createStore({
  state: {
    items: [],
    categories: [],
    offers: [],
    cart: {},
    userData: {},
  },
  getters: {
    getUserData: (state) => {
      return state.userData;
    },
    getOffers: (state) => {
      return state.offers;
    },
    getOfferById: (state) => (id) => {
      if (state.offers.length == 0) {
        throw new Error(
          "No offers loaded, returning to offers view to load them"
        );
      } else {
        return state.offers.find((offer) => offer.id == id);
      }
    },
    getItems: (state) => {
      return state.items;
    },
    getCategories: (state) => {
      return state.categories;
    },
  },
  mutations: {
    setUserData(state) {
      userService
        .getData()
        .then((res) => {
          this.state.userData = res.data;
          const firstname = this.state.userData.firstname;
          if (firstname) {
            this.state.userData.firstname =
              firstname.charAt(0).toUpperCase() + firstname.slice(1);
          }

          const lastname = this.state.userData.lastname;
          if (lastname) {
            this.state.userData.lastname =
              lastname.charAt(0).toUpperCase() + lastname.slice(1);
          }
        })
        .catch((err) => {
          console.log(err.response.data.statusCode, err.response.data.message);
        });
    },
    setOffers(state) {
      offersService
        .getAll()
        .then((res) => {
          this.state.offers = res.data;
        })
        .catch((err) => {
          console.log(err.response.data.statusCode, err.response.data.message);
        });
    },
    setItems(state) {
      itemsService
        .getAll()
        .then((res) => {
          this.state.items = res.data;
        })
        .catch((err) => {
          console.log(err.response.data.statusCode, err.response.data.message);
        });
    },
    setFilteredItems(state, params) {
      itemsService
        .getAll(
          params.categoryId,
          params.orderBy,
          params.dir,
          params.page,
          params.searchProductString
        )
        .then((res) => {
          this.state.items = res.data;
        })
        .catch((err) => {
          console.log(err.response.data.statusCode, err.response.data.message);
        });
    },
    setCategories(state) {
      categoriesService
        .getAll()
        .then((res) => {
          this.state.categories = res.data;
        })
        .catch((err) => {
          console.log(err.response.data.statusCode, err.response.data.message);
        });
    },
  },
  actions: {
    login(context) {
      context.commit("setUserData");
    },
    logout(context) {
      localStorage.removeItem("token");
      this.state.userData = {};
    },
    addNewOffer(context, data) {
      const id = Math.random().toString(36).slice(2);

      const newOffer = {
        id,
        title: "",
        description: "",
        photo: "",
        discount: 0,
        offerItems: [],
      };

      this.state.offers.push(newOffer);

      return id;
    },
    undoChangesToOffer(context, data) {
      offersService
        .getOne(data.offerId)
        .then((res) => {
          const index = this.state.offers.findIndex(
            (offer) => offer.id == data.offerId
          );
          this.state.offers[index] = res.data;
        })
        .catch((err) => {
          console.log(err.response.data.statusCode, err.response.data.message);
        });
    },
    removeOfferItem(context, data) {
      const index = this.state.offers.findIndex(
        (offer) => offer.id == data.offerId
      );

      this.state.offers[index].offerItems = this.state.offers[
        index
      ].offerItems.filter((offerItem) => offerItem.id != data.itemId);
    },
    updateOfferItems(context, data) {
      const offerIndex = this.state.offers.findIndex(
        (offer) => offer.id == data.offerId
      );

      const currentItemIds = this.state.offers[offerIndex].offerItems.map(
        (item) => item.item.id
      );

      const newItems = [];
      currentItemIds.forEach((itemId) => {
        if (data.items.includes(itemId)) {
          const item = this.state.offers[offerIndex].offerItems.find(
            (item) => item.item.id == itemId
          );
          newItems.push(item);
        }
      });

      this.state.offers[offerIndex].offerItems = newItems;

      data.items.map((itemId) => {
        if (!currentItemIds.includes(itemId)) {
          let item;
          itemsService
            .getOne(itemId)
            .then((res) => {
              const item = res.data;
              this.state.offers[offerIndex].offerItems.push({
                id: `ne${item.id}`,
                quantity: 1,
                item,
              });
            })
            .catch((err) => {
              console.log(
                err.response.data.statusCode,
                err.response.data.message
              );
            });
          return item;
        }
      });
      router.push({ path: `/oferta/${data.offerId}` });
    },
    updateOfferDetailsForVuex(context, data) {
      const offerIndex = this.state.offers.findIndex(
        (offer) => offer.id == data.offerId
      );

      this.state.offers[offerIndex].title = data.title;
      this.state.offers[offerIndex].description = data.description;
      this.state.offers[offerIndex].photo = data.photo;
      this.state.offers[offerIndex].discount = data.discount;
    },
    updateOfferItemsQuantity(context, data) {
      const offerIndex = this.state.offers.findIndex(
        (offer) => offer.id == data.offerId
      );

      const itemIndex = this.state.offers[offerIndex].offerItems.findIndex(
        (item) => item.id == data.itemId
      );

      this.state.offers[offerIndex].offerItems[itemIndex].quantity =
        data.quantity;
    },
    removeOffer(context, data) {
      const offerIndex = this.state.offers.findIndex(
        (offer) => offer.id == data.offerId
      );
      router.push({ name: "offers" });
      this.state.offers.splice(offerIndex, 1);
    },
  },
  modules: {},
});
