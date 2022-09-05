import axios from "axios";
import constants from "./zServiceConstants";

const APIclient = axios.create({
  baseURL: constants.url,
});

const getUserToken = () => {
  const token = localStorage.getItem("token");

  if (!token || token == "") {
    return;
  }

  return token;
};

export default {
  getAll() {
    return APIclient.get(`/offers`);
  },

  getOne(id) {
    return APIclient.get(`/offers/${id}`);
  },

  create(offer) {
    const config = {
      headers: { Authorization: `Bearer ${getUserToken()}` },
    };

    const body = {
      title: offer.title,
      discount: offer.discount,
      description: offer.description,
      photo: offer.photo,
      items: [],
    };

    offer.offerItems.forEach((offerItem) =>
      body.items.push({
        quantity: offerItem.quantity,
        id: Number(offerItem.item.id),
      })
    );

    console.log(body);

    return APIclient.post(`/offers/`, body, config);
  },

  edit(offer) {
    const config = {
      headers: { Authorization: `Bearer ${getUserToken()}` },
    };

    const body = {
      title: offer.title,
      discount: offer.discount,
      description: offer.description,
      photo: offer.photo,
      items: [],
    };

    offer.offerItems.forEach((offerItem) =>
      body.items.push({
        quantity: offerItem.quantity,
        id: Number(offerItem.item.id),
      })
    );

    return APIclient.patch(`/offers/${offer.id}`, body, config);
  },

  remove(id) {
    const config = {
      headers: { Authorization: `Bearer ${getUserToken()}` },
    };

    return APIclient.delete(`/offers/${id}`, config);
  },
};
