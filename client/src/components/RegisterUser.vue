<template>
    <v-container>
      <!-- Displaying registration result -->
      <v-label>Register </v-label>
      <v-alert v-if="registrationResult.message" :type="registrationResult.type" dense dismissible>
        {{ registrationResult.message }}
      </v-alert>
  
      <v-form @submit.prevent="registerUser">
        <v-text-field v-model="user.username" label="Username" required></v-text-field>
        <v-text-field v-model="user.password" label="Password" type="password" required></v-text-field>
        <!-- Add more fields as necessary -->
        <v-btn type="submit" color="success">Register</v-btn>
        
       
      </v-form>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        APIToken: '', // This will hold our token
        user: {
          username: '',
          password: '',
          // Initialize other fields here
        }, // Initial state for registration result
        
         registrationResult: {
            message: '',
            type: 'info' // 'success' for successful messages, 'error' for error messages
        },
        
      };
    },
    mounted() {
      this.getToken(); // Get the token when the component mounts
    },
    methods: {
      async getToken() {
        try {
          const response = await axios.get('http://localhost:3000/gettoken');
          console.log(response.data);
          if (response.data && response.data.token) {
            this.APIToken = response.data.token;
            localStorage.setItem('APIToken', response.data.token); // Storing the token for later use            
          }
        } catch (error) {
          console.error(error);
        }
      },
  
      async registerUser() {
        try {
            console.log(this.user.username,this.user.password,);
          const response = await axios.post('http://localhost:3000/register', {           
            username:this.user.username,
            password:this.user.password, 
            apitoken:this.APIToken          
            
          }, {
            headers: {
              'Authorization': `Bearer ${this.APIToken}`,
            },
          });
          console.log(response.data);
          this.registrationResult = {
                message: 'Registration successful!',
                type: 'success'
            };

            setTimeout(() => {
            // Redirect to LoginUser.vue component
            this.$router.push({ name: 'login' }); // Assuming 'Login' is the name of the route that leads to LoginUser.vue
        }, 3000); // 3000 milliseconds = 3 seconds
          // Process registration confirmation here
          // You might want to reset the form or navigate the user to a different page
        } catch (error) {
            this.registrationResult = {
                message: 'Registration failed. Please try again.',
                type: 'error'
            };
          // Pro
          console.error(error);
          // Handle the error (e.g., show an error message)
        }
      },
    },
  };
  </script>
  