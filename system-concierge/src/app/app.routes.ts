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
                        path: 'atendimento-veiculo',
                        title: 'Atendimento',
                        loadComponent: () => import('./views/concierge/vehicle.entry/vehicle.entry.component')
                    },
                    {
                        path: 'lista-entrada-veiculo',
                        title: 'Lista Veículos',
                        loadComponent: () => import('./views/concierge/vehicle/vehicle.component')
                    },
                    {
                        path: 'mannutencao-entrada-veiculo/:id',
                        title: 'Manutenção Entrada',
                        loadComponent: () => import('./views/concierge/manutencao/manutencao.component')
                    },
                    {
                        path: 'manutencao-modelo-veiculo',
                        title: 'Manutenção Modelo',
                        loadComponent: () => import('./views/concierge/register/vehicle.model.register/vehicle.model.register.component')
                    },
                    {
                        path: 'manutencao-veiculo',
                        title: 'Manutenção Veículo',
                        loadComponent: () => import('./views/concierge/register/vehicle.register/vehicle.register.component')
                    },
                ]
            },
            {
                path: 'oficina',
                children: [
                    {
                        path: 'manutencao-orcamento/:vehicleid',
                        title: 'Manutenção Orçamento',
                        loadComponent: () => import('./views/oficina/budget/budget.component')
                    },
                    {
                        path: 'pecas',
                        title: 'Peças',
                        loadComponent: () => import('./views/oficina/parts/parts.component')
                    },
                ]

            },
            {
                path: 'faturamento',
                children: [
                    {
                        path: 'manutencao-cliente',
                        title: 'Cliente',
                        loadComponent: () => import('./views/faturamento/manutencao-cliente/manutencao-cliente.component')
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
