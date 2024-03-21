<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item @click="navigateTo('gettoken')">
          <v-list-item-title>Get Token</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo('register')">
          <v-list-item-title>Register</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!isLoggedIn" @click="navigateTo('login')">
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isLoggedIn" @click="navigateTo('profile')">
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isLoggedIn" @click="navigateTo('allusers')">
          <v-list-item-title>AllUsers</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isLoggedIn" @click="logout">
          <v-list-item-title>LOGOUT</v-list-item-title>
        </v-list-item>
       
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>All Portal {{routerName}}</v-toolbar-title>
    </v-app-bar> 

    <v-main>
      <v-container>
         <router-view></router-view>  
         
      </v-container>
       
    </v-main> 
  </v-app>
</template>

<script>
import axios from 'axios';
export default {
  name: 'App',
  data: () => ({
    drawer: false,
    ipAddress:'',
    routerName:'',
    localStorage: false,
  }),
  mounted() {
      this.main_getip();
    },
  computed: {
    // Check if user is logged in (e.g., by checking for an 'APIToken' in localStorage)
    isLoggedIn() {
      return localStorage.getItem('APIToken') !== null;
    },
  },
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
      this.routerName = this.$router.name
      this.drawer = false; // Close drawer after navigation
    },
    cLogin() {
      // Logic to clear the authentication token and other logout procedures
    
      // Potentially redirect the user to the login page or home page
      this.$router.push({ name: 'login' });
    },
    logout() {
      // Logic to clear the authentication token and other logout procedures
      localStorage.clear();
      //localStorage.removeItem('APIToken');
      // Potentially redirect the user to the login page or home page
      this.$router.push({ name: 'login' });
    },

   async main_getip(){
      const response = await axios.get('https://api.ipify.org?format=json');
      this.ipAddress = response.data.ip;
      console.log('me.ip-> ' + this.ipAddress)
      localStorage.setItem('ip_address', this.ipAddress);
      if( localStorage.getItem('user_username') != ''){
        this.$router.push({ name: 'profile' });
      }else{
        this.$router.push({ name: 'login' });
      }
      
   
    }
  },
};
</script>

<style>
/* Global styles */
</style>