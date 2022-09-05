<template>
  <header>
    <div>
      <nav>
        <RouterLink to="/">Ofertas</RouterLink>
        <RouterLink to="/producto">Productos</RouterLink>
      </nav>
    </div>
    <div>
      <nav>
        <RouterLink v-if="userData.firstname" to="/usuario"
          >Bienvenido {{ userData.firstname }}!</RouterLink
        >
        <RouterLink v-else to="/iniciar-sesion">Iniciar Sesión</RouterLink>
      </nav>
    </div>
  </header>
  <div class="main-view">
    <RouterView class="navigation-body" />
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      userData: "getUserData",
    }),
  },
  methods: {
    ...mapMutations(["setUserData", "setOffers"]),
  },
  created: function () {
    this.setUserData();
    this.setOffers();
  },
};
</script>

<style>
@import "@/assets/base.css";

#app {
  margin: 0 auto;
  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: var(--color-black);
  transition: 0.4s;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a {
  display: inline-block;
  box-shadow: inset 0px 1px 0px 0px var(--color-pink);
  background: var(--color-red);
  background-color: var(--color-red);
  border-radius: 6px;
  border: 1px solid #d02718;
  display: inline-block;
  cursor: pointer;
  color: var(--color-black);
  padding: 6px 24px;
  text-decoration: none;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 1px 1px 0px var(--color-pink);
  margin-right: 5px;
}

nav a:hover {
  background: linear-gradient(
    to bottom,
    var(--color-red) 5%,
    var(--color-red) 100%
  );
  background-color: var(--color-red);
}

nav a.router-link-exact-active {
  box-shadow: inset 0px 1px 0px 0px var(--color-green);
  background: var(--color-green);
  background-color: var(--color-green);
  border: 1px solid var(--color-green);
  color: var(--color-black);
  text-decoration: underline;
  text-shadow: 1px 1px 0px var(--color-green);
}

nav div {
  height: 100%;
}

.navigation-body {
  width: 100%;
  margin-top: 0.5em;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: 0px;
    padding: 0px;
  }

  #app {
    display: flex;
    flex-direction: column;
    place-items: center;
    width: 100vw;
  }

  header {
    display: flex;
    flex-direction: row;
    place-items: center;
    justify-content: space-between;

    width: 100vw;
    padding: 0.5rem 0rem 0.5rem 1rem;
  }

  header div:last-of-type {
    margin-right: 1em;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    font-size: 1rem;

    margin-top: 0;

    display: flex;
    flex-direction: row;
  }

  .main-view {
    min-height: 100vh;
    min-width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    padding-left: 1rem;
    padding-right: 1.5rem;
  }
}
</style>
