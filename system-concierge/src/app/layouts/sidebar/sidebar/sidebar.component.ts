import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarItemComponent } from '../sidebar-item/sidebar-item.component';


import { MatSidenavModule } from '@angular/material/sidenav';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SideBarMenuItem } from '../../../interfaces/sidebar-menu-item';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarItemComponent, MatSidenavModule, ScrollingModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: []
})
export class SidebarComponent implements OnInit {

  model: SideBarMenuItem[] = [];

  visibleSidebar = signal(true);

  @Input() set collapsedSideBar(val: boolean) {
    this.visibleSidebar.set(val);
  }

  constructor() { }

  ngOnInit(): void {
    this.model = <SideBarMenuItem[]>([

      {
        title: 'Home', label: 'Dashboard', icon: 'pi pi-home', routerlink: 'dashboard',
      },
      {
        title: 'Portaria', itens: [
          { label: 'Atendimento', icon: 'pi pi-book', routerlink: 'portaria/atendimento' },
          { label: 'Veículos', icon: 'pi pi-car', routerlink: 'portaria/veiculos' },
          { label: 'Saída autorizada', icon: 'pi pi-sign-out', routerlink: 'portaria/saida-autorizada' },
          { label: 'Modelos veículo', icon: 'pi pi-sign-out', routerlink: 'portaria/modelo-veiculo' }

        ]
      },
      {
        title: 'Atendimento', itens: [
          { label: 'Atendimento', icon: 'pi pi-id-card', routerlink: 'atendimento/atendimento' },
          { label: 'Orçamento', icon: 'pi pi-verified', routerlink: '' }
        ]
      },
      {
        title: 'Compras', itens: [
          { label: 'Pedido de compra', icon: 'pi pi-id-card', routerlink: '' },
          { label: 'Pedidos', icon: 'pi pi-verified', routerlink: '' }
        ]
      },
      {
        title: 'Ferramenta e EPI', itens: [
          { label: 'Entrega Ferramenta', icon: 'pi pi-id-card', routerlink: '' },
          { label: 'Estoque Ferramenta', icon: 'pi pi-verified', routerlink: '' },
          { label: 'Entrega EPI', icon: 'pi pi-id-card', routerlink: '' },
          { label: 'Estoque EPI', icon: 'pi pi-verified', routerlink: '' }
        ]
      }
    ]);

  }

  get size() {
    return true;
  }



}
