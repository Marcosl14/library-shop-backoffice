import axios from "axios";
import constants from "./zServiceConstants";

const APIclient = axios.create({
  baseURL: constants.url,
});

export default {
  getAll(categoryId, orderBy, dir, page, searchProductString) {
    const params = {
      categoryId,
      orderBy,
      dir,
      page,
      searchProductString,
    };

    params.categoryId ? params.categoryId : delete params.categoryId;
    params.orderBy ? params.orderBy : delete params.orderBy;
    params.dir ? params.dir : delete params.dir;
    params.page ? params.page : delete params.page;
    params.searchProductString
      ? params.searchProductString
      : delete params.searchProductString;

    return APIclient.get(`/items`, { params });
  },

  getOne(id) {
    return APIclient.get(`/items/${id}`);
  },
};
