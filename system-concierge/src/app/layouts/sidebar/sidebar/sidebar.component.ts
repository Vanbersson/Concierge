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
        icon: 'pi pi-book',
        items: [
          {
            key: '2_1',
            label: 'Consulta peças',
            visible: false,
          },
          {
            key: '2_2',
            label: 'Pedido de compra',
            visible: false,
            items: [
              {
                key: '2_2_0',
                label: 'Novo',
              },
              {
                key: '2_2_1',
                label: 'Consulta',
              },
            ]
          },
          {
            key: '2_3',
            label: 'Controle de equipamentos',
            items: [
              {
                key: '2_3_0',
                label: 'Pegar',

              },
              {
                key: '2_3_1',
                label: 'Devolver',

              },
              {
                key: '2_3_2',
                label: 'Cadastro',
                items: [
                  {
                    key: '2_3_2_0',
                    label: 'Material',
                  },
                  {
                    key: '2_3_2_1',
                    label: 'Mecânico',
                  }
                ]
              }
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
            label: 'Orçamento',
            items: [
              {
                key: '3_1_0',
                label: 'Atendimento',

              },
              {
                key: '3_1_1',
                label: 'Consulta',

              },
            ]
          },
          {
            key: '3_2',
            label: 'Manutenção Peças',
            routerLink: 'oficina/pecas'
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
