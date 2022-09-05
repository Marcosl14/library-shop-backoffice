<template>
  <main>
    <div class="main-container">
      <h1>Listado de Productos</h1>
      <div class="secondary-container">
        <div class="side-panel-container">
          <button @click="removeFilters()">Eliminar filtros</button>
          <br />
          <h3>Buscar:</h3>
          <div class="search-product-container">
            <input
              type="text"
              name="searchProduct"
              v-model="searchProductString"
            />
            <button @click="searchItems()">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <br />
          <h3>Paginas:</h3>
          <div class="pages-container">
            <button :disabled="disabledReduceButton" @click="reducePage">
              -
            </button>
            <p>{{ items.meta ? items.meta.currentPage : 1 }}</p>
            <button :disabled="disabledIncreaseButton" @click="increasePage">
              +
            </button>
            <p>de {{ items.meta ? items.meta.totalPages : 1 }} páginas</p>
          </div>
          <br />
          <h3>Ordenar por:</h3>
          <select name="orderBy" v-model="orderBy" @change="setItemsFiltered()">
            <option value="title">Nombre</option>
            <option value="description">Descripción</option>
            <option value="brand">Marca</option>
          </select>
          <select name="orderBy" v-model="dir" @change="setItemsFiltered()">
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
          <br />
          <h3>Categorias:</h3>
          <div class="categories-panel">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectCategory(category.id)"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
        <div class="product-items-container">
          <button @click="createNewItem()">Crear Nuevo Item</button>
          <table class="products">
            <tr>
              <th>Id</th>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Descuento</th>
              <th>Precio con descuento</th>
              <th>Acciones</th>
            </tr>
            <tr v-for="item in items.items" :key="item.id">
              <td>{{ item.id }}</td>
              <td><img :src="item.photo" :alt="item.title" /></td>
              <td>{{ firstLetterUpperCase(item.title) }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.discount }}</td>
              <td>{{ item.priceWithDiscount }}</td>
              <td>
                <button @click="itemInfo(offer.id)">
                  <i class="fa-solid fa-pencil"></i>
                </button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

const DEFAULT_ORDER_BY = "title";
const DEFAULT_DIR = "asc";
const DEFAULT_PAGE = 1;
const DEFAULT_SEARCH_PRODUCT_STRING = "";

export default {
  components: {},
  data() {
    return {
      selectedCategory: "",
      orderBy: DEFAULT_ORDER_BY,
      dir: DEFAULT_DIR,
      page: DEFAULT_PAGE,
      searchProductString: DEFAULT_SEARCH_PRODUCT_STRING,
      selectedItems: [],
      offer: {},
    };
  },
  computed: {
    ...mapGetters({
      items: "getItems",
      categories: "getCategories",
    }),
    disabledReduceButton() {
      if (this.page > 1) {
        return false;
      }
      return true;
    },
    disabledIncreaseButton() {
      if (!this.items.meta) {
        return true;
      }
      if (this.page < this.items.meta.totalPages) {
        return false;
      }
      return true;
    },
    firstLetterUpperCase() {
      return (stringToConvert) =>
        `${stringToConvert.charAt(0).toUpperCase() + stringToConvert.slice(1)}`;
    },
  },
  methods: {
    ...mapMutations(["setItems", "setCategories", "setFilteredItems"]),
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
      this.page = DEFAULT_PAGE;
      this.setItemsFiltered();
    },
    setSelectedItems() {},
    removeFilters() {
      this.selectedCategory = "";
      this.orderBy = DEFAULT_ORDER_BY;
      this.dir = DEFAULT_DIR;
      this.page = 1;
      this.searchProductString = DEFAULT_SEARCH_PRODUCT_STRING;
      this.setItems();
    },
    searchItems() {
      this.page = 1;
      this.setItemsFiltered();
    },
    setItemsFiltered() {
      this.setFilteredItems({
        categoryId: this.selectedCategory,
        orderBy: this.orderBy,
        dir: this.dir,
        page: this.page,
        searchProductString: this.searchProductString,
      });
    },
    reducePage() {
      if (this.page > 1) {
        this.page--;
        this.setItemsFiltered();
      }
    },
    increasePage() {
      if (this.page < this.items.meta.totalPages) {
        this.page++;
        this.setItemsFiltered();
      }
    },
  },
  created: function () {
    this.setItems();
    this.setCategories();
  },
};
</script>

<style scoped>
.main-container h1 {
  margin-bottom: 0.5em;
}

.secondary-container {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.side-panel-container {
  display: flex;
  flex-direction: column;
  width: 200px;
  margin-right: 20px;
}

.search-product-container {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.categories-panel {
  display: flex;
  flex-direction: column;
}

.pages-container {
  display: flex;
  flex-direction: row;
}

.product-items-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 85%;
}

.products {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

.products td,
.products th {
  border: 1px solid #ddd;
  padding: 8px;
}

.products tr:nth-child(even) {
  background-color: #f2f2f2;
}

.products tr:hover {
  background-color: #ddd;
}

.products th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04aa6d;
  color: white;
}
</style>
