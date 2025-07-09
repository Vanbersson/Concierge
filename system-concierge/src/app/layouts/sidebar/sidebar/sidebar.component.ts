import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

//PrimeNg
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { MenuItem, TreeNode } from 'primeng/api';

import { LayoutService } from '../../layout/service/layout.service';
import { StorageService } from '../../../services/storage/storage.service';
import { MenuUserService } from '../../../services/menu/menu-user.service';
import { lastValueFrom } from 'rxjs';



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
  userId: number = 0;

  constructor(private storageService: StorageService, public layoutService: LayoutService, public el: ElementRef) { }

  ngOnInit(): void {

    this.userId = this.storageService.id;

    this.menuItem = [
      {
        key: '0_0',
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/',
        visible: false
      },
      {
        key: '1_0',
        label: 'Portaria',
        visible: false,
        items: [
          {
            key: '1_1',
            label: 'Atendimento',
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
            key: '1_3',
            label: 'Manutenção',
            visible: false,
            routerLink: 'portaria/mannutencao-entrada-veiculo',
          },
          {
            key: '1_4',
            label: 'Cadastros',
            visible: false,
            items: [
              {
                key: '1_4_0',
                label: 'Modelo',
                visible: false,
                routerLink: 'portaria/manutencao-modelo-veiculo'
              },
              {
                id: '',
                key: '1_4_1',
                label: 'Veículo',
                routerLink: 'portaria/manutencao-veiculo',
                visible: false,
              }
            ]
          },

        ]
      },
      {
        key: '2_0',
        label: 'Peças',
        visible: false,
        items: [
          {
            key: '2_1',
            label: 'Consulta peças',
            visible: false,
          },
          {
            key: '2_2',
            label: 'Pedidos de compras',
            visible: false,
            items: [
              {
                key: '2_2_0',
                label: 'Pedidos',
                routerLink: 'pecas/pedido/compra',
                visible: false,
              }
            ]
          },
          {
            key: '2_99',
            label: 'Cadastro',
            visible: false,
            items: [

            ]
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
                label: 'Pegar/Devolver',
                routerLink:'oficina/controle-equipamento',
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
                    routerLink:'oficina/controle-equipamento/cadastro/categoria',
                    visible: false,
                  },
                  {
                    key: '3_2_1_1',
                    label: 'Material',
                    routerLink:"oficina/controle-equipamento/cadastro/material",
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
                routerLink:'oficina/cadastro/mecanico',
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
          ,
          {
            key: '4_1',
            label: 'Manutenção Clientes',
            visible: false,
            routerLink: 'faturamento/manutencao-cliente'
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
        label: 'Configurações',
        visible: false,
        items: [
          {
            key: '999_1',
            label: 'Empresa',
            visible: false,
            icon: 'pi pi-building',
            routerLink: 'configuracao/empresa'
          },
          {
            key: '999_2',
            label: 'Cadastro Usuários',
            visible: false,
            icon: 'pi pi-users',
            routerLink: 'configuracao/usuario'
          }
        ]
      }
    ];

    // Converte a string em um array de keys
    const keysToShow = this.storageService.menus.split(',');
    this.menuItem = this.menuItem.map(item => this.updateVisibility(item, keysToShow));
  }

  updateVisibility(item: MenuItem, keys: string[]): MenuItem {

    if (this.userId == 1) {
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



}
