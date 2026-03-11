import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
//PrimeNg
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
//Service
import { LayoutService } from '../../layout/service/layout.service';
import { StorageService } from '../../../services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, PanelMenuModule, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  providers: []
})
export class SidebarComponent implements OnInit {

  menuItem!: MenuItem[];

  constructor(private storageService: StorageService,
    public layoutService: LayoutService,
    public el: ElementRef,
    private router: Router) { }

  ngOnInit(): void {
    this.menuItem = [
      {
        key: '0_0',
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard',
        visible: false
      },
      {
        key: '1_0',
        label: 'Portaria',
        visible: false,
        items: [
          {
            key: '1_1',
            label: 'Entrada de Veículo',
            visible: false,
            routerLink: 'portaria/atendimento-veiculo'
          },
          {
            key: '1_2',
            label: 'Veículos',
            visible: false,
            routerLink: 'portaria/lista-entrada-veiculo'
          },
          {
            key: '1_5',
            label: 'Saída de Veículo',
            visible: false,
            routerLink: 'portaria/saida-veiculo'
          },
          {
            key: '1_3',
            label: 'Motorista',
            visible: false,
            routerLink: 'portaria/manutencao-motorista',
          },
          {
            key: '1_99',
            label: 'Cadastros',
            visible: false,
            items: [
              {
                key: '1_99_0',
                label: 'Modelo',
                visible: false,
                routerLink: 'portaria/manutencao-modelo-veiculo'
              },
              {
                id: '',
                key: '1_99_1',
                label: 'Veículo',
                routerLink: 'portaria/manutencao-veiculo',
                visible: false,
              }
            ]
          },
          {
            key: '1_100',
            label: 'Módulo',
            visible: false,
            routerLink: 'portaria/module'
          }

        ]
      },
      {
        key: '2_0',
        label: 'Peças',
        visible: false,
        items: [
          {
            key: '2_1',
            label: 'Atendimento',
            visible: false,
          },
          {
            key: '2_2',
            label: 'Consultas',
            visible: false,
            items: [
              {
                key: '2_2_0',
                label: 'Orçamentos',
                visible: false,
              }
            ]
          },
          {
            key: '2_3',
            label: 'Compras',
            visible: false,
            items: [
              {
                key: '2_3_0',
                label: 'Pedidos de compras',
                routerLink: 'pecas/compras/pedido/compra',
                visible: false,
              }
            ]
          },
          {
            key: '2_99',
            label: 'Cadastros',
            visible: false,
            items: [
              {
                key: '2_99_0',
                label: 'Peças',
                routerLink: 'pecas/cadastros/pecas',
                visible: false,
              },
              {
                key: '2_99_1',
                label: 'Grupo de Peças',
                visible: false,
              },
              {
                key: '2_99_2',
                label: 'Categoria de Peças',
                visible: false,
              },
              {
                key: '2_99_3',
                label: 'Unidades de Medida',
                routerLink:'pecas/cadastros/unit',
                visible: false,
              }
            ]
          },
          {
            key: '2_100',
            label: 'Módulo',
            visible: false,
          }
        ]
      },
      {
        key: '3_0',
        label: 'Oficina',
        visible: false,
        items: [
          {
            key: '3_1',
            label: 'Orçamentos',
            visible: false
          },
          {
            key: '3_2',
            label: 'Controle de equipamentos',
            visible: false,
            items: [
              {
                key: '3_2_0',
                label: 'Requisições',
                routerLink: 'oficina/controle-equipamento',
                visible: false,
              },
              {
                key: '3_2_1',
                label: 'Cadastro',
                visible: false,
                items: [
                  {
                    key: '3_2_1_0',
                    label: 'Categoria',
                    routerLink: 'oficina/controle-equipamento/cadastro/categoria',
                    visible: false,
                  },
                  {
                    key: '3_2_1_1',
                    label: 'Material',
                    routerLink: "oficina/controle-equipamento/cadastro/material",
                    visible: false,
                  }
                ]
              }
            ]
          },
          {
            key: '3_99',
            label: 'Cadastro',
            visible: false,
            items: [
              {
                key: '3_99_0',
                label: 'Mecânico',
                routerLink: 'oficina/cadastro/mecanico',
                visible: false
              }
            ]
          }
        ]
      },
      {
        key: '4_0',
        label: 'Faturamento',
        visible: false,
        items: [
          {
            key: '4_1',
            label: 'Manutenção Clientes',
            visible: false,
            routerLink: 'faturamento/manutencao-cliente'
          },
          {
            key: '4_99',
            label: 'Cadastros',
            visible: false,
            items: [
              {
                key: '4_99_0',
                label: 'Categoria de Clientes',
                visible: false,
                routerLink: 'faturamento/register-client-category'
              }
            ]
          }
        ]
      },
      {
        key: '100_0',
        label: 'Relatório',
        visible: false,
        items: [
          {
            key: '100_1',
            label: 'Portaria',
            visible: false,
            items: [
              {
                key: '100_1_0',
                label: 'Veículos',
                visible: false,
                routerLink: 'relatorio/portaria/veiculo'
              }

            ]
          },
          {
            key: '100_2',
            label: 'Peças',
            visible: false,
            items: [
              {
                key: '100_2_0',
                label: 'Pedidos de compras',
                visible: false,
                routerLink: 'relatorio/pecas/pedidos'
              }

            ]

          }
        ]
      },
      {
        key: '999_0',
        label: 'Configuração',
        visible: false,
        items: [
          {
            key: '999_2',
            label: 'Cadastros',
            items: [
              {
                key: '999_2_0',
                label: 'Empresa',
                visible: false,
                icon: 'pi pi-building',
                routerLink: 'configuracao/cadastros/empresa'
              },
              {
                key: '999_2_1',
                label: 'Usuários',
                visible: false,
                icon: 'pi pi-users',
                routerLink: 'configuracao/cadastros/usuarios'
              },
              {
                key: '999_2_2',
                label: 'Marcas',
                visible: false,
                routerLink:'configuracao/cadastros/marcas'
              }
            ]
          },
          {
            label: 'Sair',
            icon: 'pi pi-sign-out',
            command: () => this.closeSession()
          }
        ]
      }
    ];
    // Converte a string em um array de keys
    const keysToShow = this.storageService.menus.split(',');
    this.menuItem = this.menuItem.map(item => this.updateVisibility(item, keysToShow));
  }

  updateVisibility(item: MenuItem, keys: string[]): MenuItem {
    if (this.storageService.id == 1) {
      item.visible = true;
    }
    if (keys.includes(item['key'])) {
      item.visible = true;
    }
    if (item.items) {
      item.items = item.items.map(subItem => this.updateVisibility(subItem, keys));
    }
    return item;
  }
  closeSession() {
    this.navigatorLogin();
  }

  private navigatorLogin() {
    this.router.navigateByUrl("/login");
  }
}
