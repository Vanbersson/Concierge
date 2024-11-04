import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

//PrimeNg
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

import { LayoutService } from '../../layout/service/layout.service';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, PanelMenuModule, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  providers: []
})
export class SidebarComponent implements OnInit {

  items!: MenuItem[];

  constructor(public layoutService: LayoutService, public el: ElementRef) { }

  ngOnInit(): void {

    this.items = [
      {
        key: '0',
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/',
        visible: true
      },
      {
        key: '1',
        label: 'Portaria',
        expanded: true,
        items: [
          {
            key: '1_1',
            label: 'Atendimento',
            routerLink: 'portaria/atendimento'
          },
          {
            key: '1_2',
            label: 'Veículos',
            routerLink: 'portaria/veiculos'
          },
          {
            key: '1_3',
            label: 'Manutenção',
            routerLink: 'portaria/manutencao',
            visible: false
          },
          {
            key: '1_4',
            label: 'Cadastro',
            items: [
              {
                key: '1_4_0',
                label: 'Modelo',
                routerLink: 'portaria/modelo-veiculo'
              },
              {
                key: '1_4_1',
                label: 'Veículo'
              }
            ]
          },

        ]
      },
      {
        key: '2',
        label: 'Peças',
        icon: 'pi pi-book',
        disabled: true,
        visible: false,
        items: [
          {
            key: '2_0',
            label: 'Consulta peças',
          },
          {
            key: '2_1',
            label: 'Pedido de compra',
            items: [
              {
                key: '2_1_0',
                label: 'Novo',
              },
              {
                key: '2_1_1',
                label: 'Consulta',
              },
            ]
          },
          {
            key: '2_2',
            label: 'Controle de equipamentos',
            items: [
              {
                key: '2_2_0',
                label: 'Pegar',

              },
              {
                key: '2_2_1',
                label: 'Devolver',

              },
              {
                key: '2_2_2',
                label: 'Cadastro',
                items: [
                  {
                    key: '2_2_2_0',
                    label: 'Material',
                  },
                  {
                    key: '2_2_2_1',
                    label: 'Mecânico',
                  }
                ]
              }
            ]
          }

        ]
      },
      {
        key: '3',
        label: 'Oficina',
        items: [
          {
            key: '3_0',
            label: 'Orçamento',
            items: [
              {
                key: '3_0_0',
                label: 'Atendimento',

              },
              {
                key: '3_0_1',
                label: 'Consulta',

              },
            ]
          }
        ]
      }, 
      {
        key: '4',
        label: 'Faturamento',
        items: [
          ,
          {
            key: '4_1',
            label: 'Manutenção Clientes'
          }
        ]
      },
      {
        key: '99',
        label: 'Configurações',
        items: [
          {
            key: '99_0',
            label: 'Empresa',
            icon: 'pi pi-building',
            routerLink: 'configuracao/empresa'
          },
          {
            key: '99_1',
            label: 'Cadastro Usuários',
            icon: 'pi pi-users',
            routerLink: 'configuracao/usuario'
          }
        ]
      }
    ];

  }






}
