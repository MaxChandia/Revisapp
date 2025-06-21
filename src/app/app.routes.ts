import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { User } from './features/user/user';

export const routes: Routes = [
    {
        path:'',
        component:Home
    },
    {
        path:'user',
        component:User
    }
];
