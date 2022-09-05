<template>
  <main>
    <div class="main-container">
      <h1>Hola {{ userData.firstname }} {{ userData.lastname }}!</h1>
      <div class="user-panel">
        <div class="user-panel-container">
          <h2>Cerrar sesión:</h2>
          <button @click="userLogout">Cerrar Sesión</button>
          <br />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters({
      userData: "getUserData",
    }),
  },
  methods: {
    ...mapActions(["logout"]),
    userLogout() {
      this.logout();
      this.$router.push({ name: "offers" });
    },
  },
};
</script>

<style scoped>
.main-container h1 {
  margin-bottom: 0.5em;
}

.user-panel {
  display: flex;
  flex-direction: row;
}

.user-panel-container {
  display: flex;
  flex-direction: column;
  width: 20%;
  margin-right: 50px;
}

.side-panel-container {
  width: 80%;
}

.form-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}

.form-container div {
  width: 100%;
}

.form {
  display: flex;
  flex-direction: column;
}

.form input {
  width: 50%;
}

.button-container {
  display: flex;
  flex-direction: row;
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
