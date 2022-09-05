<template>
  <main>
    <div class="main-container">
      <h1>Listado de ofertas</h1>
      <button @click="createNewOffer()">Crear Nueva Oferta</button>
      <div class="offer-items-container">
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
          <tr v-for="offer in offers" :key="offer.id">
            <td>{{ offer.id }}</td>
            <td>
              <img
                :src="offer.photo"
                :alt="offer.title"
                class="product-photo"
              />
            </td>
            <td>{{ firstLetterUpperCase(offer.title) }}</td>
            <td>{{ offer.price }}</td>
            <td>{{ offer.discount }}</td>
            <td>{{ offer.priceWithDiscount }}</td>
            <td>
              <button @click="offerInfo(offer.id)">
                <i class="fa-solid fa-pencil"></i>
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters({
      offers: "getOffers",
    }),
    firstLetterUpperCase() {
      return (stringToConvert) =>
        `${stringToConvert.charAt(0).toUpperCase() + stringToConvert.slice(1)}`;
    },
  },
  methods: {
    ...mapActions(["addNewOffer"]),
    offerInfo(id) {
      this.$router.push({ path: `/oferta/${id}` });
    },
    async createNewOffer() {
      const id = await this.addNewOffer();
      console.log(id);
      this.$router.push({ path: `/oferta/${id}` });
    },
  },
};
</script>

<style scoped>
.main-container h1 {
  margin-bottom: 0.5em;
}

.offer-items-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
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

.product-photo {
  width: 400px;
}
</style>
