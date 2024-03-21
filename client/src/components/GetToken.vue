<template>
    <v-container>
      <v-alert v-if="DataResult.message" :type="DataResult.type" dense dismissible closable>
        {{ DataResult.message }}
        
      </v-alert>    
      <!-- Displaying registration result -->


      <v-row no-gutters>
        <v-col cols="12">
        <v-sheet class="pa-2 ma-1">
       
            <v-card>
              <v-card-text >
               URL: https://ggapi-uat.5k2an3or4q209.xyz/ggapi 
              </v-card-text>

            </v-card>
        </v-sheet>
      </v-col>

      <v-col cols="12">
        <v-sheet class="pa-2 ma-1">

          <v-btn color="primary" @click="getToken">Get Token</v-btn>           <!-- <div>{{ GetToken.token }}</div> -->
          <v-card v-if="GetToken && GetToken.token !== ''" style="background-color: gray; color: white; padding-top: 5px;">
            <v-card-text >
              TOKEN: {{ GetToken.token }}
            </v-card-text>
          </v-card>
          
        </v-sheet>
      </v-col>
      <v-col cols="12">
        <v-sheet class="pa-2 ma-1">
          <v-btn color="primary" @click="getagentbalance">Get Agent Balance</v-btn> 
           <div>{{ AgentInfo }}</div>
        </v-sheet>
      </v-col>
    </v-row>

     
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data (){
      return {
        GetToken:'',
        AgentInfo:'',
        DataResult: {
            message: '',
            type: 'info' // 'success' for successful messages, 'error' for error messages
        },
      }
    },

    methods: {
      async getToken() {
        try {
          const response = await axios.get('http://localhost:3000/gettoken');
          console.log(response.data);
          this.GetToken = response.data
          this.DataResult = {
                message: response.data.token,
                type: 'success'
            };
          // Process token here
        } catch (error) {
          this.DataResult = {
                message: error,
                type: 'error'
            };
          console.error(error);
        }
      },

      async getagentbalance() {
        try {
          this.getToken()
          const response = await axios.post('http://localhost:3000/getagentbalance',{
            apitoken:this.GetToken.token

          });
          console.log(response.data);

          if(response.data.success == true){

            this.AgentInfo= response.data
            this.DataResult = {
                message: 'Agent Balance:' + this.AgentInfo.CurrentBalance,
                type: 'success'
            };

          }
          else{

            this.AgentInfo= response.data
            this.DataResult = {
                message: 'Not Get data agent balanced',
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
  