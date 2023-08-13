import { ActivatedRoute, Router } from '@angular/router';

export function getQueryParam(router: Router, key: string): string {
  let currentRoute: ActivatedRoute | null = router.routerState.root;
  let titleText = '';
  do {
    const childrenRoutes = currentRoute.children;
    currentRoute = null;
    childrenRoutes.forEach((routes) => {
      if (routes?.outlet === 'primary') {
        if (routes?.snapshot?.queryParams[key]) {
          titleText = routes.snapshot?.queryParams[key];
        }
        currentRoute = routes;
      }
    });
  } while (currentRoute);

  return titleText;
}

export function getData(router: Router, key: string): string {
  let currentRoute: ActivatedRoute | null = router.routerState.root;
  let value = '';
  do {
    const childrenRoutes = currentRoute.children;
    currentRoute = null;
    childrenRoutes.forEach((routes) => {
      if (routes?.outlet === 'primary') {
        if (routes?.snapshot?.data[key]) {
          value = routes.snapshot?.data[key];
        }
        currentRoute = routes;
      }
    });
  } while (currentRoute);

  return value;
}
