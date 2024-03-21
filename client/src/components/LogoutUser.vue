<template>
    <div class="logout">
      <p>Logging out...</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LogoutUser',
    mounted() {
      this.logoutUser();
    },
    methods: {
      logoutUser() {
        // Clear user data from local storage or Vuex store
        //localStorage.removeItem('userToken');
        localStorage.clear();
        // Add any other cleanup your app needs on logout
  
        // Redirect to login page or home page
        this.$router.replace({ name: 'login' });
      },
    },
  };
  </script>
  
  <style scoped>
  .logout {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  </style>
  