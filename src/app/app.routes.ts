import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'articles',
    pathMatch: 'full'
  },
  {
    path: 'articles',
    loadComponent: () => 
      import('./components/articles/articles.component').then((m) => m.ArticlesComponent)
  },
  {
    path: 'panier',
    loadComponent: () =>
      import('./components/panier/panier.component').then((m) => m.PanierComponent),
  },
];
