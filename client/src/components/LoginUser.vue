<template>
  <v-container>
    <v-label>LOGIN </v-label>
    <v-alert v-if="LoginResult.message" :type="LoginResult.type" dense dismissible closable>
        {{ LoginResult.message }}
      </v-alert>
    <v-form @submit.prevent="loginUser">
      <v-text-field v-model="user.username" label="Username" required></v-text-field>
      <v-text-field v-model="user.password" label="Password" type="password" required></v-text-field>
      <v-btn type="submit" color="success">Login</v-btn>
    </v-form>
    <v-card
    v-if="user.membersiteurl"
    class="mx-auto my-8"
    elevation="16"
    max-width="344"
  >
    <!-- <v-card v-text="resResult"></v-card> -->
    <v-card-item>
      <v-card-title>
        Username: {{ user.username }}
      </v-card-title>
      <v-card-subtitle>
        test
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      {{ user.membersiteurl }}
    </v-card-text>
  </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  name: 'LoginUser',
  data() {
    return { 
      APIToken: '',
      resResult:'',
      
      user: {
        username: '',
        password: '',
        token:'',
        membersiteurl:'',
      },
      LoginResult: {
            message: '',
            type: 'info', // 'success' for successful messages, 'error' for error messages
            visible: true,
          },
    };
  },
  mounted() {
      this.getToken(); // Get the token when the component mounts
    },
  methods: {

       // Method to hide the alert
       hideAlert() {
      this.LoginResult.visible = false;
    },

    showAlertWithTimeout() {
      this.LoginResult.visible = true; // Make sure the alert is visible
      setTimeout(() => {
        this.hideAlert();
      }, 5000); // Set delay of 5 seconds
    },

    async getToken() {
        try {
          
          const response = await axios.get('http://localhost:3000/gettoken');
        
          if (response.data && response.data.token) {
            this.APIToken = response.data.token;
            console.log('getToken : ' + this.APIToken )
            localStorage.setItem('APIToken', response.data.token); // Storing the token for later use            
          }
        } catch (error) {
          console.error(error);
        }
      },
    async loginUser() {
      // Implementation for user login
      try {
            //this.getToken();
            console.log(this.user.username,this.user.password,);
            const response = await axios.post('http://localhost:3000/login', {           
            username:this.user.username,
            password:this.user.password, 
            apitoken:this.APIToken          
            
          }, {
            headers: {
              'Authorization': `Bearer ${this.APIToken}`,
            },
          });
          console.log(response.data);

          if (response.data.success == true){

            this.LoginResult = {
                message: 'Login successful!',
                type: 'success'
            };
           localStorage.setItem('user_username', this.user.username);
           localStorage.setItem('user_token', response.data.token);           
           localStorage.setItem('user_membersiteurl', response.data.membersiteurl);
          
          this.user.token = response.data.token
          this.user.membersiteurl = response.data.membersiteurl
          this.resResult = response.data.token + ' ' +  response.data.membersiteurl
          setTimeout(() => {
            // Redirect to LoginUser.vue component
            this.$router.push({ name: 'profile' }); // Assuming 'Login' is the name of the route that leads to LoginUser.vue
            this.showAlertWithTimeout()
          }, 3000); // 3000 milliseconds = 3 seconds

          }else{

            this.LoginResult = {
                message: 'Login failed : ' + response.data.error,
                type: 'error'
            };
            setTimeout(() => {
            // Redirect to LoginUser.vue component
            this.$router.push({ name: 'login' }); // Assuming 'Login' is the name of the route that leads to LoginUser.vue
            this.showAlertWithTimeout()
          }, 3000); // 3000 milliseconds = 3 seconds
          }
            
        } catch (error) {
            this.LoginResult = {
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
