<template>
  <main>
    <div class="main-container">
      <div class="offer-item-info">
        <h2>Oferta:</h2>
        <transition>
          <label
            class="error-label"
            v-if="error.includes('Forbidden resource')"
          >
            El usuario no tiene privilegios para realizar dicha acción.
          </label>
        </transition>

        <transition>
          <label class="error-label" v-if="error.includes('Unauthorized')">
            El usuario ingresado no se encuentra registrado.
          </label>
        </transition>

        <div>
          <label>Nombre:</label>
          <input type="text" v-model="title" />

          <transition>
            <label
              class="error-label"
              v-if="error.includes('DESCRIPTION_MAX_LENGTH: 1000')"
            >
              El largo de la descripción debe ser inferior a 1000 caracteres.
            </label>
          </transition>

          <transition>
            <label
              class="error-label"
              v-if="error.includes('TITLE_MAX_LENGTH: 100')"
            >
              El nombre no puede tener mas de 100 caracteres.
            </label>
          </transition>

          <transition>
            <label
              class="error-label"
              v-if="error.includes('EMPTY_TITLE_FIELD')"
            >
              El nombre no puede estar vacío.
            </label>
          </transition>
        </div>

        <div v-if="photo != ''">
          <label>Imagen:</label>
          <img class="offer-item-photo" :src="photo" :alt="title" />
        </div>

        <div>
          <label>URL de la imagen: </label>
          <input type="text" v-model="photo" />

          <transition>
            <label
              class="error-label"
              v-if="
                error.includes('PHOTO_MUST_BE_A_URL_ADRESS') ||
                error.includes('photo must be an URL address')
              "
            >
              La URL de la foto no es valida.
            </label>
          </transition>

          <transition>
            <label
              class="error-label"
              v-if="error.includes('PHOTO_MAX_LENGTH: 100')"
            >
              El largo de la URL de la foto debe ser inferior a 100 caracteres.
            </label>
          </transition>
        </div>

        <div>
          <label>Descripcion:</label>
          <input type="text" v-model="description" />

          <transition>
            <label
              class="error-label"
              v-if="error.includes('DESCRIPTION_MAX_LENGTH: 1000')"
            >
              El largo de la descripción debe ser inferior a 1000 caracteres.
            </label>
          </transition>

          <transition>
            <label
              class="error-label"
              v-if="error.includes('EMPTY_DESCRIPTION_FIELD')"
            >
              La descripción no puede estar vacía.
            </label>
          </transition>
        </div>

        <div>
          <label>Descuento: </label>
          <input type="number" v-model="discount" min="1" max="99" />

          <transition>
            <label
              class="error-label"
              v-if="error.includes('DISCOUNT_VALUE_MUST_BE_LOWER_THAN_100')"
            >
              El descuento debe ser inferior al 99%.
            </label>
          </transition>

          <transition>
            <label
              class="error-label"
              v-if="error.includes('DISCOUNT_VALUE_MUST_BE_HIGHER_THAN_0')"
            >
              El descuento debe ser superior al 0%.
            </label>
          </transition>
        </div>

        <br />

        <div>
          <h2>Acciones:</h2>
          <div>
            <button @click="undoChanges()">Deshacer</button>
            <button @click="addItems()">Agregar Productos</button>
            <button @click="saveChanges()">Guardar Cambios</button>
            <button @click="deleteOffer()">Eliminar Oferta</button>
            <button @click="getBack()">Volver a Ofertas</button>
          </div>
          <div>
            <transition>
              <label
                class="error-label"
                v-if="error.includes('Forbidden resource')"
              >
                Tu usuario no posee los privilegios necesarios para realizar
                ésta acción.
              </label>
            </transition>
          </div>
        </div>

        <br />
        <h2>Listado de elementos:</h2>

        <transition>
          <label class="error-label" v-if="error.includes('EMPTY_ITEMS_ARRAY')">
            El listado de items que contiene la oferta, no puede estar vacío.
          </label>
        </transition>

        <transition>
          <label class="error-label" v-if="error.includes('ITEM_ID_NOT_FOUND')">
            Uno de los items seleccionados no existe.
          </label>
        </transition>

        <table class="products">
          <thead>
            <th>Id</th>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </thead>
          <tbody v-if="offer.offerItems.length > 0">
            <tr v-for="item in offer.offerItems" :key="item.id">
              <td>{{ item.id }}</td>
              <td><img :src="item.item.photo" :alt="item.item.title" /></td>
              <td>{{ item.item.title }}</td>
              <td>${{ item.item.price }}</td>
              <td>
                <div class="quantity-container">
                  <button @click="decreaseQuantity(item.id)">-</button>
                  <p>{{ item.quantity }}</p>
                  <button @click="increaseQuantity(item.id)">+</button>
                </div>
              </td>
              <td>
                <button @click="removeItem(item.id)">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <ul>
                  <li>Precio: ${{ totalPrice.toFixed(2) }}</li>
                  <li>Descuento: {{ discount }}%</li>
                  <li>Precio con descuento: ${{ priceWithDiscount }}</li>
                </ul>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import offersService from "../services/offersService";

export default {
  data() {
    return {
      newOffer: false,
      offer: {},
      error: "",
      title: "",
      description: "",
      discount: 0,
      photo: "",
    };
  },
  computed: {
    totalPrice() {
      if (this.offer?.offerItems) {
        return this.offer.offerItems
          .map((element) => element.item.price * element.quantity)
          .reduce((prev, curr) => prev + curr, 0);
      } else {
        return 0;
      }
    },
    priceWithDiscount() {
      return (this.totalPrice * (1 - this.discount / 100)).toFixed(2);
    },
  },
  methods: {
    ...mapActions([
      "removeOfferItem",
      "undoChangesToOffer",
      "updateOfferDetailsForVuex",
      "updateOfferItemsQuantity",
      "removeOffer",
    ]),
    ...mapMutations(["setOffers"]),
    undoChanges() {
      this.undoChangesToOffer({ offerId: this.offer.id });
    },
    removeItem(itemId) {
      this.removeOfferItem({ offerId: this.offer.id, itemId });
    },
    addItems() {
      this.updateOfferDetailsForVuex({
        offerId: this.offer.id,
        title: this.title,
        description: this.description,
        photo: this.photo,
        discount: this.discount,
      });
      this.$router.push({ path: `/seleccionar-producto/${this.offer.id}` });
    },
    saveChanges() {
      if (this.newOffer) {
        const newOffer = {
          title: this.title,
          description: this.description,
          photo: this.photo,
          discount: this.discount,
          offerItems: this.offer.offerItems,
        };
        offersService
          .create(newOffer)
          .then(() => {
            this.setOffers();
            this.$router.push({ name: "offers" });
          })
          .catch((err) => {
            console.log(err);
            const statusCode = err.response.data.statusCode;
            const errorMessage = err.response.data.message;

            if (
              statusCode != 400 ||
              statusCode != 401 ||
              statusCode != 403 ||
              statusCode != 409
            ) {
              console.log(statusCode, errorMessage);
            }

            this.error = errorMessage;
          });
        return;
      }

      const editedOffer = {
        id: this.offer.id,
        title: this.title,
        description: this.description,
        photo: this.photo,
        discount: this.discount,
        offerItems: this.offer.offerItems,
      };

      offersService
        .edit(editedOffer)
        .then(() => {
          this.setOffers();
          this.$router.push({ name: "offers" });
        })
        .catch((err) => {
          console.log(err);
          const statusCode = err.response.data.statusCode;
          const errorMessage = err.response.data.message;

          if (
            statusCode != 400 ||
            statusCode != 401 ||
            statusCode != 403 ||
            statusCode != 409
          ) {
            console.log(statusCode, errorMessage);
          }

          this.error = errorMessage;
        });
    },
    deleteOffer() {
      if (this.newOffer) {
        this.removeOffer({ offerId: this.offer.id });
        this.$router.push({ name: "offers" });
        return;
      }
      offersService
        .remove(this.offer.id)
        .then(() => {
          this.removeOffer({ offerId: this.offer.id });
        })
        .catch((err) => {
          console.log(err);
          const statusCode = err.response.data.statusCode;
          const errorMessage = err.response.data.message;

          if (
            statusCode != 400 ||
            statusCode != 401 ||
            statusCode != 403 ||
            statusCode != 409
          ) {
            console.log(statusCode, errorMessage);
          }

          this.error = errorMessage;
        });
    },
    getBack() {
      this.$router.push({ name: "offers" });
    },
    increaseQuantity(itemId) {
      const index = this.offer.offerItems.findIndex(
        (item) => item.id == itemId
      );
      let quantity = this.offer.offerItems[index].quantity;

      quantity++;

      this.updateOfferItemsQuantity({
        offerId: this.offer.id,
        itemId,
        quantity,
      });
    },
    decreaseQuantity(itemId) {
      const index = this.offer.offerItems.findIndex(
        (item) => item.id == itemId
      );
      let quantity = this.offer.offerItems[index].quantity;

      if (quantity > 1) {
        quantity--;
      }

      this.updateOfferItemsQuantity({
        offerId: this.offer.id,
        itemId,
        quantity,
      });
    },
  },
  created: function () {
    const offerId = this.$route.params.id;
    try {
      this.offer = this.$store.getters.getOfferById(offerId);

      this.title = this.offer.title;
      this.description = this.offer.description;
      this.photo = this.offer.photo;
      this.discount = this.offer.discount;

      const regex = /[a-zA-Z]/;
      if (regex.test(offerId)) {
        this.newOffer = true;
      }
    } catch (err) {
      console.log(err);
      this.$router.push({ name: "offers" });
    }
  },
};
</script>

<style scoped>
.main-container h1 {
  margin-bottom: 0.5em;
}

.offer-item-info {
  display: flex;
  flex-direction: column;
}

.offer-item-info > div {
  display: flex;
  flex-direction: column;
}

.offer-item-photo {
  width: 300px;
}

.price {
  display: flex;
  flex-direction: row;
}

.price h2 {
  text-decoration: line-through;
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

.quantity-container {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.quantity-container p {
  margin: 0px 10px;
}

.error-label {
  color: var(--color-red);
}

.v-enter-from {
  transform: translateX(-200px);
  opacity: 0;
}

.v-enter-active {
  transition: all 0.3s ease-out;
}

.v-enter-to {
  opacity: 1;
}

.v-leave-from {
  opacity: 1;
}

.v-leave-active {
  transition: all 0.5s ease-in;
}

.v-leave-to {
  transform: translateX(200px);
  opacity: 0;
}
</style>
