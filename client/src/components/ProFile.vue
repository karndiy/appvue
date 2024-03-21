<template>
    <v-container>
      <v-label>USER PROFILE </v-label>
       <v-alert v-if="AlertResult.message" :type="AlertResult.type" dense dismissible closable>
          {{ AlertResult.message }}
        </v-alert> 
    
      <v-card  v-if="userInfo"
        class="mx-auto my-8"
        elevation="16"
        max-width="auto"
      >
      
      <v-card-item>
        <v-card-title>
            Username: {{ userInfo.username }}
        </v-card-title>
        <v-card-subtitle>
            balance: {{userInfo.balance }}
        </v-card-subtitle>
      </v-card-item>
  
      <v-card-text>
        Status: {{userInfo.status }}
      </v-card-text>
      <!-- Deposit Button -->
      <v-card-actions class="justify-center">
      <v-btn  link  @click="showDepositDialog = true">Deposit</v-btn>
      
      <!-- Withdraw Button -->
      <v-btn  :disabled="userInfo.balance < 1" @click="showWithdrawDialog = true">Withdraw</v-btn>      
      </v-card-actions>

        <!-- Deposit Dialog -->
        <v-dialog v-model="showDepositDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>Deposit</v-card-title>
          <v-card-text>
            <!-- Add your deposit form or information here -->
            <p>Deposit amount:</p>
            <!-- Example input field -->
            <v-text-field label="Amount" v-model="depositAmount"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="performDeposit">Deposit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Withdraw Dialog -->
      <v-dialog v-model="showWithdrawDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>Withdraw</v-card-title>
          <v-card-text>
            <!-- Add your withdraw form or information here -->
            <p>Withdraw amount:</p>
            <!-- Example input field -->
            <v-text-field label="Amount" v-model="withdrawAmount"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="performWithdraw">Withdraw</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-card> 
    
    <div v-else>
      <p>Loading user information...</p>
    </div>
  </v-container>
</template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ProFile',
    data() {
      return {
        APIToken: '',
        username:'',
        ip_address:'',
        userInfo: null,
        AlertResult: {
            message: '',
            type: 'info', // 'success' for successful messages, 'error' for error messages
            
          },
      showDepositDialog: false,
      showWithdrawDialog: false,
      depositAmount: 0,
      withdrawAmount: 0
      };
    },
    mounted() {
      
      this.loadUserCredentials();
      this.fetchUserInfo();
      
    },
    methods: {
      // Method to hide the alert
       
      async loadUserCredentials() {
          console.log('Loading user credentials');
          this.ip_address = localStorage.getItem('ip_address');
          this.APIToken = localStorage.getItem('APIToken');
          this.username = localStorage.getItem('user_username');
          console.log(this.username, this.APIToken);
      },

      async fetchUserInfo() {
        try {    
               
            console.log('fetchUserInfo')
          // Replace '/userinfo' with the full URL if your backend is hosted elsewhere
            const response = await axios.post('http://localhost:3000/userinfo', {
            username: this.username, // This should be dynamic based on your app's context
            apitoken: this.APIToken, // This should also be dynamic or stored securely
          });
          console.log(response.data)
          this.AlertResult = {
                message: 'Welcome to the User: '+ this.username,
                type: 'success',
                visible: true,
            };
  
          this.userInfo = response.data;
          this.withdrawAmount = this.userInfo.balance
        } catch (error) {
            this.AlertResult = {
                message: 'Info failed. Please try again. ' ,
                type: 'error',
                visible: true,
            };
            setTimeout(() => {
            // Redirect to LoginUser.vue component
            this.$router.push({ name: 'login' }); // Assuming 'Login' is the name of the route that leads to LoginUser.vue
           
          }, 3000); // 3000 milliseconds = 3 seconds
          console.error('There was an error fetching the user info:', error);
          // Handle the error (e.g., show an error message to the user)
        }
      },

      performDeposit() {
      // Implement deposit logic here
      console.log("Depositing:", this.depositAmount);
      this.mm_deposit() ;      
      this.showDepositDialog = false; // Close dialog
      },
      performWithdraw() {
        // Implement withdraw logic here
        console.log("Withdrawing:", this.withdrawAmount);
        this.mm_withdrawal()
        this.showWithdrawDialog = false; // Close dialog
      },
     
      async mm_deposit() {
        try {
          //this.getToken()
         
          const response = await axios.post('http://localhost:3000/deposit',{
            apitoken:this.APIToken,
            username:this.username,
            amount:this.depositAmount,
            ip:this.ip_address,

          });
          console.log(response.data);

          if(response.data.success == true){
          console.log('balance now:' + response.data.balance)
            this.data_deposit= response.data
            this.userInfo.balance =  response.data.balance
            this.AlertResult = {
                message: this.userInfo.username + '| order deposit:' + this.depositAmount + ' | Balance:'  + this.userInfo.balance ,
                type: 'success'
            };

          }
          else{

            this.AgentInfo= response.data
            this.AlertResult = {
                message: 'Not data deposit:',
                type: 'error'
            };
          }          
          // Process token here
        } catch (error) {
          this.DataResult = {
                message: error,
                type: 'error'
            };
          console.error(error);
        }
      },
      async mm_withdrawal() {
        try {         
         
          const response = await axios.post('http://localhost:3000/withdrawal',{
            apitoken:this.APIToken,
            username:this.username,
            amount:this.withdrawAmount,
            ip:this.ip_address,

          });
          console.log(response.data);
          if(response.data.success == true){
          console.log('balance now:' + response.data)          
            this.userInfo.balance =  response.data.balance            
            this.AlertResult = {
                message: this.userInfo.username + '| order withdrawal:' + this.withdrawAmount + ' | Balance:'  + this.userInfo.balance ,
                type: 'success'
            };

          }
          else{

            this.AgentInfo= response.data
            this.AlertResult = {
                message: 'Not data withdrawal:',
                type: 'error'
            };
          }          
          // Process token here
        } catch (error) {
          this.DataResult = {
                message: error,
                type: 'error'
            };
          console.error(error);
        }

      },
    },    
  };
  </script>
  
  <style scoped>
  /* Add styles for your profile component here */
  </style>
  