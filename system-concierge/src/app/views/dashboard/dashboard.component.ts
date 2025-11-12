import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//PrimeNg
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

//Service
import { VehicleService } from '../../services/vehicle/vehicle.service';
import { StorageService } from '../../services/storage/storage.service';
import { RouterStateSnapshot } from '@angular/router';
import { CanComponentDeactivate } from './can-deactivate.guard.ts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CalendarModule,ConfirmDialogModule, ToastModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [ConfirmationService, MessageService]
})
export default class DashboardComponent implements OnInit, CanComponentDeactivate {
  qtdVehicleEntry = signal<number>(0);
  qtdVehicleExit = signal<number>(0);

  qtdVehicleBudgetWith = signal<number>(0);
  qtdVehicleBudgetWithout = signal<number>(0);

  btnBack = false; // controle para saber se o usuário clicou no button voltar

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService, private storageService: StorageService,
    private primeNGConfig: PrimeNGConfig,
    private vehicleService: VehicleService,
  ) {
  }

  ngOnInit(): void {
    this.primeNGConfig.setTranslation({
      accept: 'Accept',
      reject: 'Cancel',
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
      dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
      monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      monthNamesShort: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sm'
    });

    this.qtdVehicles();

    // Detecta o botão de voltar
    window.onpopstate = () => {
      this.btnBack = true;
    };
  }

  qtdVehicles() {
    var qtdBudgetWith = 0;
    var qtdBudgetWithOut = 0;
    this.vehicleService.allPendingAuthorization$().subscribe((data) => {
      this.qtdVehicleEntry.set(data.length);

      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.budgetStatus != 'semOrcamento') {
          qtdBudgetWith += 1;
          this.qtdVehicleBudgetWith.set(qtdBudgetWith);
        } else {
          qtdBudgetWithOut += 1;
          this.qtdVehicleBudgetWithout.set(qtdBudgetWithOut);
        }

      }
    });

    this.vehicleService.allAuthorized$().subscribe((data) => {
      this.qtdVehicleExit.set(data.length);
    });
  }

  canDeactivate(nextState?: RouterStateSnapshot): Promise<boolean> | boolean {
    // Apenas confirmar se for sair para o login
    const nextUrl = nextState?.url || '';
    console.log(nextUrl)

    if (nextUrl.includes('/login')) {
      return new Promise<boolean>((resolve) => {
        this.confirmationService.confirm({
          header: 'Sair?',
          message: 'Deseja realmente sair e ir para a tela de login?',
          accept: () => {
            this.storageService.deleteStorage();
            resolve(true);
          },
          reject: () => {
            this.btnBack = false;
            resolve(false);
          }
        });
      });
    }

    // Caso contrário, permite sair sem perguntar
    return true;
  }
  onChange() {
    this.btnBack = true;
  }
}
