<template>
  <main>
    <div class="main-container">
      <h1>Iniciar Sesión!!!</h1>
      <div class="form-container">
        <div>
          <form class="form" action="" @submit.prevent="onSubmit">
            <label for="email-input">Email</label>
            <input type="text" name="email-input" v-model="email" />
            <transition>
              <label
                class="error-label"
                v-if="error.includes('USER_NOT_FOUND')"
              >
                El usuario ingresado no se encuentra registrado.
              </label>
            </transition>
            <transition>
              <label class="error-label" v-if="error.includes('Unauthorized')">
                El usuario ingresado no se encuentra registrado.
              </label>
            </transition>
            <transition>
              <label
                class="error-label"
                v-if="error.includes('EMAIL_NOT_VALID')"
              >
                El email ingresado no es válido.
              </label>
            </transition>

            <label for="password-input">Contraseña</label>
            <input type="password" name="password-input" v-model="password" />
            <transition>
              <label
                class="error-label"
                v-if="error.includes('WRONG_PASSWORD')"
              >
                La contraseña ingresada no es válida.
              </label>
            </transition>
            <transition>
              <label class="error-label" v-if="error.includes('Unauthorized')">
                La contraseña ingresada no es válida.
              </label>
            </transition>

            <br />
            <input type="submit" value="Iniciar Sesión" @click="senddata()" />
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions } from "vuex";
import userService from "../services/userService";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    ...mapActions(["login"]),
    senddata() {
      userService
        .login(this.email, this.password)
        .then((res) => {
          localStorage.setItem("token", res.data.access_token);
          this.login({ email: this.email, password: this.password });
          this.$router.push({ name: "offers" });
        })
        .catch((err) => {
          const statusCode = err.response.data.statusCode;
          const errorMessage = err.response.data.message;
          if (
            statusCode != 400 ||
            statusCode != 401 ||
            statusCode != 403 ||
            statusCode != 404
          ) {
            console.log(statusCode, errorMessage);
          }
          this.error = errorMessage;
        });
    },
  },
};
</script>

<style scoped>
.main-container h1 {
  margin-bottom: 0.5em;
}

.form-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}

.form-container div {
  width: 50%;
}

.form {
  display: flex;
  flex-direction: column;
}

.form input {
  width: 50%;
}

.button-link {
  color: var(--color-red);
  text-decoration: underline;
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
