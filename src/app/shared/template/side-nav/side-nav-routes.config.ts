import {
  SideNavInterface
} from '../../interfaces/side-nav.type';

export const ROUTES: SideNavInterface[] = [
  {
    path: '',
    title: 'Dashboard',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'appstore-add',
    submenu: [],
  },
  {
    path: 'products',
    title: 'Products',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'rise',
    submenu: [],
  },

  {
    path: 'categories',
    title: 'Categories',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'rise',
    submenu: [],
  },

  {
    path: 'providers',
    title: 'Providers',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'rise',
    submenu: [],
  },

  {
    path: 'users',
    title: 'Users',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'rise',
    submenu: [
      {
        path: '/users/roles',
        title: 'Roles',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: [],
      },
    ],
  },
];
