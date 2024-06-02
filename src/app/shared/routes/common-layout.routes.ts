import { Routes } from '@angular/router';

export const CommonLayout_ROUTES: Routes = [
  //Dashboard
  //   {
  //     path: 'dashboard',
  //     loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
  // },
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
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'dashboard',
  // },
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('../../pages/statistics/tab1.module').then(
  //       (m) => m.Tab1PageModule
  //     ),
  //   // loadChildren: () =>
  //   //   import('../../pages/tabs.module').then((m) => m.TabsPageModule),
  // },
  {
    path: 'xxxxxx',
    data: {
      title: 'Pages ',
    },
    children: [
      // {
      //   path: '',
      //   redirectTo: '/dashboard',
      //   pathMatch: 'full',
      // },
      {
        path: '',
        loadChildren: () =>
          import('../../pages/dashboard/tab1.module').then(
            (m) => m.Tab1PageModule
          ),
        // loadChildren: () =>
        //   import('../../pages/tabs.module').then((m) => m.TabsPageModule),
      },
    ],
  },
];
