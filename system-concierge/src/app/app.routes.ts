import { Routes } from '@angular/router';
import { authRouterGuard } from './guards/router/auth-router.guard';
import { authLoginGuard } from './guards/auth/auth-login.guard';


export const routes: Routes = [

    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./views/login/login.component'),
        canActivate: [authLoginGuard]
    },
    {
        path: '',
        loadComponent: () => import('./components/valid-login/valid-login.component') 
    },
    {
        path: 'v1',
        loadComponent: () => import('./layouts/layout/layout.component'),
        canMatch: [authRouterGuard],
        children: [

            {
                path: 'dashboard',
                title: 'Dashboard',
                loadComponent: () => import('./views/dashboard/dashboard.component')
            },
            {
                path: 'portaria/atendimento',
                title: 'Atendimento',
                loadComponent: () => import('./views/concierge/atendimento/atendimento.component')
            },
            {
                path: 'portaria/veiculos',
                title: 'Veículos',
                loadComponent: () => import('./views/concierge/veiculos/veiculos.component')
            },
            {
                path: 'portaria/manutencao/:id',
                title: 'Manutenção',
                loadComponent: () => import('./views/concierge/manutencao/manutencao.component')
            },
            {
                path: 'portaria/modelo-veiculo',
                title: 'Modelos veículo',
                loadComponent: () => import('./views/concierge/modelo-veiculo/modelo-veiculo.component')
            },
            {
                path: 'atendimento/atendimento',
                title: 'Atendimento',
                loadComponent: () => import('./views/atendimento/atendimento.component')
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]

    },
    {
        path: '**',
        loadComponent: () => import('./views/not-found/not-found.component')
    }
];
