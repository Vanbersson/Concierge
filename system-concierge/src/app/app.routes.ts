import { Routes } from '@angular/router';
import { authGuardGuard } from './services/login/auth-guard.guard';

export const routes: Routes = [
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./views/login/login.component'),
    },
    {
        path: '',
        loadComponent: () => import('./layouts/layout/layout.component'),
        canActivateChild: [authGuardGuard],
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
            },
            {
                path: 'oficina',
                children: [
                    {
                        path: 'orcamento/:id',
                        title: 'Orçamento',
                        loadComponent: () => import('./views/oficina/budget/budget.component')
                    },
                ]

            },
            {
                path: 'configuracao',
                children: [
                    {
                        path: 'empresa',
                        title: 'Empresa',
                        loadComponent: () => import('./views/settings/company/company.component')

                    },
                    {
                        path: 'usuario',
                        title: 'Usuário',
                        loadComponent: () => import('./views/settings/user/user.component')

                    }
                ]

            },
            {
                path: '**',
                loadComponent: () => import('./views/not-found/not-found.component')
            }
        ]

    }
];
