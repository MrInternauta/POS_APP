import { Routes } from '@angular/router';

export const CommonLayout_ROUTES: Routes = [

    //Dashboard
    {
        path: 'dashboard',
        loadChildren: () => import('../../pages/tabs.module').then(m => m.TabsPageModule),
    },

    // Charts
    // {
    //   path: 'changelog',
    //   children: [
    //       {
    //           path: '',
    //           redirectTo: '/changelog/changelog',
    //           pathMatch: 'full'
    //       },
    //       {
    //           path: '',
    //           loadChildren: () => import('../../changelog/changelog.module').then(m => m.ChangelogModule)
    //         },
    //     ]
    // },

    //Apps
    // {
    //     path: 'apps',
    //     data: {
    //         title: 'Apps'
    //     },
    //     children: [
    //         {
    //             path: '',
    //             redirectTo: '/dashboard',
    //             pathMatch: 'full'
    //         },
    //         {
    //             path: '',
    //             loadChildren: () => import('../../apps/apps.module').then(m => m.AppsModule)
    //         },
    //     ]
    // },

    //Component
    // {
    //     path: 'demo',
    //     component: ComponentsComponent,
    //     children: [
    //         {
    //             path: '',
    //             loadChildren: () => import('../../components/components.module').then(m => m.ComponentsModule)
    //         }
    //     ],
    //     data: {
    //         title: 'Components '
    //     }
    // },

    // Charts
    // {
    //   path: 'features',
    //   data: {
    //       title: 'features'
    //   },
    //   children: [
    //       {
    //           path: '',
    //           redirectTo: '/dashboard',
    //           pathMatch: 'full'
    //       },
    //       {
    //           path: '',
    //           loadChildren: () => import('../../features/features.module').then(m => m.FeaturesModule)
    //         },
    //     ]
    // },

    //Pages
    // {
    //     path: 'pages',
    //     data: {
    //         title: 'Pages '
    //     },
    //     children: [
    //         {
    //             path: '',
    //             redirectTo: '/dashboard',
    //             pathMatch: 'full'
    //         },
    //         {
    //             path: '',
    //             loadChildren: () => import('../../pages/pages.module').then(m => m.PagesModule)
    //         },
    //     ]
    // }
];