<template>
  <v-app>
    <v-main>
      <IndexView/>
    </v-main>
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import IndexView from './components/IndexView.vue'

export default {
  name: 'App',

  components: {
    //HelloWorld,
    IndexView,
  },

  data: () => ({
    //
  }),
}
</script>./components/IndexView.vue
