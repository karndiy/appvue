import { createRouter, createWebHistory } from 'vue-router';
import IndexView from '@/components/IndexView';
//import Login from '@/components/Login'; // Adjust the import path as necessary
import GetToken from '../components/GetToken.vue';
import RegisterUser from '../components/RegisterUser.vue';
import LoginUser from '../components/LoginUser.vue';
import AllUsers from '../components/AllUsers.vue';
import ProFile from '../components/ProFile.vue';
//import LogoutUser from '../components/LogoutUser.vue';

const routes = [
  {    path: '/',    name: 'Index',    component: IndexView,  },
  {    path: '/get-token', name: 'gettoken', component: GetToken},
  {    path: '/register', name: 'register', component: RegisterUser },
  {    path: '/login', name: 'login', component: LoginUser },
  {    path: '/all-users',    name: 'allusers',    component: AllUsers,  },
  {    path: '/profile',    name: 'profile',    component: ProFile,  },
  //{    path: '/logout',    name: 'logout',    component: LogoutUser,  },
  // Uncomment and adjust the following lines as needed
 
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;