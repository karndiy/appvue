<template>
  <v-data-table
    :headers="headers"
    :items="users"
    class="elevation-1"
  >   
     <!-- eslint-disable-next-line vue/valid-v-slot -->
     <template v-slot:item.actions="{ item }">
      <!-- <v-btn small color="primary"  @click=" depositUser(item) , showDepositDialog = true">Deposit</v-btn> -->
      <v-btn small color="success" @click="prepareDeposit(item)">Deposit</v-btn>
      <v-btn small color="warning" @click="prepareWithdraw(item)">Withdraw</v-btn>
      <!-- <v-btn small color="primary" @click="editUser(item)">Edit</v-btn>
      <v-btn small color="error" @click="deleteUser(item.id)">Delete</v-btn> -->
    </template>
      
  </v-data-table>

    <!-- Deposit Dialog -->
    <v-dialog v-model="showDepositDialog" persistent max-width="600px" >
      <v-card>
        <v-card-title>Deposit</v-card-title>
        <v-card-text>
          <p>Deposit amount for {{ currentUser.username }}:</p>
          <v-text-field label="Amount"  v-model="depositAmount"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green darken-1" text @click="performDeposit">Deposit</v-btn>
          
          <v-spacer></v-spacer>
          <v-btn  text="Close" @click="showDepositDialog = false"  ></v-btn>
        </v-card-actions>      
      </v-card>
    </v-dialog> 

    <!-- withdraw Dialog -->
    <v-dialog v-model=" showWithdrawDialog" persistent max-width="600px" >
      <v-card>
        <v-card-title>Withdraw</v-card-title>
        <v-card-text>
          <p>Withdraw amount for {{ currentUser.username }}:</p>
          <v-text-field label="Amount"  v-model="withdrawAmount"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="orange-darken-4" text @click="performWithdraw">Withdraw</v-btn>
          
          <v-spacer></v-spacer>
          <v-btn   color="red-accent-4"   text="Close" @click="showWithdrawDialog = false"  ></v-btn>
        </v-card-actions>      
      </v-card>
    </v-dialog> 




  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card>
      <v-card-title class="text-h5">Alert</v-card-title>
      <v-card-text>{{ alertMessage }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  <!-- Trigger Button (for demonstration) -->
  <!-- <v-btn @click="triggerAlert()">Show Alert Dialog</v-btn> -->
</template>

<script>

import axios from 'axios';

export default { 

  data() {
    return {
      users: [],
      headers: [
        { title: 'ID', value: 'id' , sortable: true},
        { title: 'Username', value: 'username', sortable: true },
        { title: 'Actions', value: 'actions'},
      ],
      ip_address:'',
      showDepositDialog: false,
      showWithdrawDialog: false,
      depositAmount: 0, // Add this line
      withdrawAmount:0,
      selectedUserId: null, // Track the selected user's ID for operations
      alertMessage:'',
      dialog:false,
    };
  },
  mounted() {
    this.loadUserCredentials()
    this.fetchUsers();
  },
  methods: {
    async loadUserCredentials() {
          console.log('Loading user credentials');
          this.ip_address = localStorage.getItem('ip_address');
          this.APIToken = localStorage.getItem('APIToken');        
        
      },
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3000/getallusers');
        this.users = response.data;
      } catch (error) {
        console.error('There was an error fetching the users:', error);
      }
    },
    depositUser(user) {
      console.log(user.id);
      // Handle user edit
      console.log('Deposit user:', user.username);
      this.selectedUserId = user.id; // Store the selected user's ID
      this.showDepositDialog = true;
      // Example: navigate to user edit page with user id
      // this.$router.push({ name: 'edit-user', params: { userId: user.id }});
    },
    withdrawUser(userId) {
      // Handle user edit
      console.log('Withdraw user:',  userId);
      // Example: navigate to user edit page with user id
      // this.$router.push({ name: 'edit-user', params: { userId: user.id }});
    },
    editUser(user) {
      // Handle user edit
      console.log('Edit user:', user);
      // Example: navigate to user edit page with user id
      // this.$router.push({ name: 'edit-user', params: { userId: user.id }});
    },
    deleteUser(userId) {
      // Handle user deletion
      console.log('Delete user with ID:', userId);
      // Add your code here to call API to delete user then fetch users list again
      // Example:
      // axios.delete(`http://localhost:3000/deleteuser/${userId}`).then(() => {
      //   this.fetchUsers();
      // }).catch(error => {
      //   console.error('Error deleting user:', error);
      // });
    },

      // Deposit
      performDeposit() {

      // Implement deposit logic here
      console.log("Depositing", this.depositAmount, "to user ID:", this.currentUser.id);
      this.mm_deposit()
      this.showDepositDialog = false; // Close dialog 
      },

      prepareDeposit(user) {
     
      //console.log("Depositing:", this.depositAmount, "to user ID:", this.selectedUserId);
      this.currentUser = user; // Set the current user to the one selected
      console.log('....... prepareDeposit ........')
      console.log('this.currentUser:', this.currentUser.username);
      console.log('this.id:', this.currentUser.id);
      console.log('....... end prepareDeposit ........')
      
      this.depositAmount = null; // Reset or set an initial deposit amount
      this.showDepositDialog = true; // Show the dialog
    },

    async mm_deposit() {
        try {
          //this.getToken()
          console.log('.......mm_deposit........')
          console.log(this.currentUser.username)
          console.log(this.depositAmount)
          console.log('.......end mm_deposit........')

          const response = await axios.post('http://localhost:3000/deposit',{
            apitoken:this.APIToken,
            username:this.currentUser.username,
            amount:this.depositAmount,
            ip:this.ip_address,

          });
          console.log(response.data);

          if(response.data.success == true){
          console.log('balance now:' + response.data.balance)
            this.data_deposit= response.data
            this.currentUser.balance =  response.data.balance
            this.AlertResult = {
                message: this.currentUser.username + '| order deposit:' + this.depositAmount + ' | Balance:'  + this.currentUser.balance ,
                type: 'success'
            };

           // const msg =  this.currentUser.username + " Deposited amount: " + this.depositAmount + " THB"
           const msg =  this.currentUser.username + '| order deposit:' + this.depositAmount + ' | Balance:'  + this.currentUser.balance 
           this.triggerAlert(msg )

          }
          else{

            this.AgentInfo= response.data
            this.AlertResult = {
                message: 'Not data deposit error :' + response.data.error,
                type: 'error'
            };
            const msg = 'Not data deposit  error:'  + response.data.error
            this.triggerAlert(msg )
          }          
          // Process token here
        } catch (error) {
          this.DataResult = {
                message: error,
                type: 'error'
            };
            
            const msg = error
            this.triggerAlert(msg )

          console.error(error);
        }
      },


      // Withdraw
      performWithdraw() {
      // Implement deposit logic here
      console.log("Withdrawing", this.withdrawAmount, "to user ID:", this.currentUser.id);
      this.mm_withdraw()
      this.showWithdrawDialog = false; // Close dialog 
      },

      prepareWithdraw(user) {
      //console.log("Depositing:", this.depositAmount, "to user ID:", this.selectedUserId);
      this.currentUser = user; // Set the current user to the one selected
      console.log('....... prepareWithdraw ........')
      console.log('this.currentUser:', this.currentUser.username);
      console.log('this.id:', this.currentUser.id);
      console.log('....... end prepareWithdraw ........')


      this.WithdrawAmount = null; // Reset or set an initial deposit amount
      this.fetchCurrentUser();
      this.showWithdrawDialog = true; // Show the dialog
      },

      async mm_withdraw() {
        try {     
          
          //this.getToken()
          console.log('.......withdraw........')
          console.log(this.currentUser.username)
          console.log(this.withdrawalAmount)
          console.log('.......end withdrawa........')
          
         
          const response = await axios.post('http://localhost:3000/withdrawal',{
            apitoken:this.APIToken,
            username:this.currentUser.username,
            amount:this.withdrawAmount,
            ip:this.ip_address,

          });
          console.log(response.data);
          if(response.data.success == true){
          console.log('withdraw now:' + response.data)          
            this.currentUser.balance  =  response.data.balance            
            // this.AlertResult = {
            //     message: this.currentUser.username + '| order withdrawal:' + this.withdrawAmount + ' | Balance:'  + this.userInfo.balance ,
            //     type: 'success'
            // };

          const msg =  this.currentUser.username + '| order deposit:' + this.withdrawAmount + ' | Balance:'  + this.currentUser.balance 
           this.triggerAlert(msg )

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
      async fetchCurrentUser() {
        try {    
               
            console.log('fetchUserInfo')
          // Replace '/userinfo' with the full URL if your backend is hosted elsewhere
            const response = await axios.post('http://localhost:3000/userinfo', {
            username: this.currentUser.username, // This should be dynamic based on your app's context
            apitoken: this.APIToken, // This should also be dynamic or stored securely
          });
          console.log(response.data)
          // this.AlertResult = {
          //       message: 'Welcome to the User: '+ this.username,
          //       type: 'success',
          //       visible: true,
          //   };  
          if(response.data.balance != null){
            this.currentUser.balance  =  response.data.balance  
          this.withdrawAmount = this.currentUser.balance 
          }else{
            this.withdrawAmount =0;
          }
          
        } catch (error) {
            this.AlertResult = {
                message: 'call cerent_username ' ,
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


    triggerAlert(msg=''){
      console.log('click alert...');
      this.alertMessage =  msg;
      this.dialog = true; // Corrected from `dialog.value = true;`

    }
  },
};
</script>

<style scoped>
/* Add custom styles here if necessary */
</style>
