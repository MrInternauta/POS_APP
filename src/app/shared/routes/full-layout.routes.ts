import { Routes, RouterModule } from '@angular/router';

export const FullLayout_ROUTES: Routes = [
    {
        path: 'authentication',
        loadChildren: () => import('../../auth/pages/login.module').then(m => m.LoginPageModule)
    }
];
