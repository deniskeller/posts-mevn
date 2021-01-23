<template>
  <v-app id="inspire">
    <v-app-bar app color="green" dark>
      <v-app-bar-nav-icon @click.stop="mini = !mini" />
      <v-toolbar-title class="ml-0 pl-4" style="width: 300px">
        <span class="hidden-sm-and-down">MEVN project</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main> </v-main>

    <v-btn
      v-scroll="onScroll"
      bottom
      color="red"
      dark
      fab
      fixed
      right
      @click="toTop"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
export default {
  name: "Home",
  components: {},
  props: {
    source: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    moni: false,
  }),
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrolltop || 0;
      this.fab = top > 20;
    },
    totop() {
      this.$vuetify.goTo(0);
    },
  },
};
</script>
