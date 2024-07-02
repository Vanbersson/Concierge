import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';



import { MatSidenavModule } from '@angular/material/sidenav';
import { ScrollingModule } from '@angular/cdk/scrolling';


//PrimeNg
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, ScrollingModule, PanelMenuModule, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  providers: []
})
export class SidebarComponent implements OnInit {

  items!: MenuItem[];



  visibleSidebar = signal(true);

  @Input() set collapsedSideBar(val: boolean) {
    this.visibleSidebar.set(val);
  }

  constructor() { }



  ngOnInit(): void {

    this.items = [
      {
        key: '0',
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: 'dashboard',
        visible: true
      },
      {
        key: '1',
        label: 'Portaria',
        icon: 'pi pi-truck',
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
        icon: 'pi pi-calendar',
        items: [
          {
            key: '3_0',
            label: 'Orçamento',
            items: [
              {
                key: '3_0_0',
                label: 'Novo',

              },
              {
                key: '3_0_1',
                label: 'Consulta',

              },
            ]
          },


        ]
      }
    ];

  }

  toggleAll() {
    const expanded = !this.areAllItemsExpanded();
    this.items = this.toggleAllRecursive(this.items, expanded);
  }

  private toggleAllRecursive(items: MenuItem[], expanded: boolean): MenuItem[] {
    return items.map((menuItem) => {
      menuItem.expanded = expanded;
      if (menuItem.items) {
        menuItem.items = this.toggleAllRecursive(menuItem.items, expanded);
      }
      return menuItem;
    });
  }

  private areAllItemsExpanded(): boolean {
    return this.items.every((menuItem) => menuItem.expanded);
  }

  get size() {
    return true;
  }



}
