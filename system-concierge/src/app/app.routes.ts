import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () => import('./layouts/layout/layout.component'),
        children: [

            {
                path: '',
                title: 'Dashboard',
                loadComponent: () => import('./views/dashboard/dashboard.component')
            },
            {
                path: 'dashboard',
                title: 'Dashboard',
                loadComponent: () => import('./views/dashboard/dashboard.component')
            },
            {
                path: 'portaria',
                children: [

                    {
                        path: 'atendimento',
                        title: 'Atendimento',
                        loadComponent: () => import('./views/concierge/atendimento/atendimento.component')
                    },
                    {
                        path: 'veiculos',
                        title: 'Veículos',
                        loadComponent: () => import('./views/concierge/veiculos/veiculos.component')
                    },
                    {
                        path: 'manutencao/:id',
                        title: 'Manutenção',
                        loadComponent: () => import('./views/concierge/manutencao/manutencao.component')
                    },
                    {
                        path: 'modelo-veiculo',
                        title: 'Modelos veículo',
                        loadComponent: () => import('./views/concierge/modelo-veiculo/modelo-veiculo.component')
                    },
                ]
            }
        ]

    },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./views/login/login.component'),
    },
    {
        path: '**',
        loadComponent: () => import('./views/not-found/not-found.component')
    }
];
