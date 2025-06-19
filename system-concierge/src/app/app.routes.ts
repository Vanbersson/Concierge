import { Routes } from '@angular/router';
import { authGuardGuard } from './services/login/auth-guard.guard';
import { vehicleEntryGuard } from './guard/concierge/vehicle.entry.guard';

export const routes: Routes = [
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./views/login/login.component'),
    },
    {
        path: 'orcamento/aprovacao',
        title: 'Aprovação',
        loadComponent: () => import('./views/workshop/budget/approbation/approbation.component'),
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
                        loadComponent: () => import('./views/concierge/vehicle.entry/vehicle.entry.component'),
                        canActivate: [vehicleEntryGuard]
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
                path: 'pecas',
                children: [
                    {
                        path: 'pedido/compra',
                        title: 'Pedido de compra',
                        loadComponent: () => import('./views/parts/purchase.order/purchase.order.component')
                    },

                    {
                        path: 'cadastro/pecas',
                        title: 'Peças',
                        loadComponent: () => import('./views/parts/register/parts/parts.component')
                    },
                ]
            },
            {
                path: 'oficina',
                children: [
                    {
                        path: 'manutencao-orcamento/:vehicleid',
                        title: 'Manutenção Orçamento',
                        loadComponent: () => import('./views/workshop/budget/budget/budget.component')
                    },
                    {
                        path: 'controle-equipamento',
                        title: 'Controle de Equipamentos',
                        loadComponent: () => import('./views/workshop/equipamento/pegar-devolver/pegar-devolver.component')
                    },
                    {
                        path: 'controle-equipamento/cadastro/categoria',
                        title: 'Categoria',
                        loadComponent: () => import('./views/workshop/equipamento/cadastro/categoria/categoria.component')
                    },
                    {
                        path: 'cadastro/mecanico',
                        title: 'Mecânico',
                        loadComponent: () => import('./views/workshop/register/mechanic/mechanic.component')
                    }
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
                path: 'relatorio',
                children: [
                    {
                        path: 'portaria/veiculo',
                        loadComponent: () => import('./views/report/concierge/vehicle/vehicle.component')
                    },
                    {
                        path: 'pecas/pedidos',
                        loadComponent: () => import('./views/report/part/purchase.order/purchase.order.component')
                    }
                ]
            }
        ]
    },
    {
        path: '**',
        title: 'Pagina não encontrada',
        loadComponent: () => import('./views/not-found/not-found.component')
    },
];
