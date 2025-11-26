import { Component, DoCheck, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterStateSnapshot } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
//PrimeNg
import { ChartModule } from 'primeng/chart';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
//Service
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { StorageService } from '../../services/storage/storage.service';
//Components
import { FilterClientComponent } from '../../components/filter.client/filter.client.component';
import { CanComponentDeactivate } from './can-deactivate.guard.ts';
//Class
import { ClientCompany } from '../../models/clientcompany/client-company';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, FormsModule, ButtonModule, CalendarModule, ConfirmDialogModule, ToastModule, InputTextModule, FilterClientComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [ConfirmationService, MessageService]
})
export default class DashboardComponent implements OnInit, CanComponentDeactivate, DoCheck {
  //Vehicle
  countVehicle: Array<number> = [0, 0, 0, 0];
  //ClientCompany
  clientCompany!: ClientCompany;
  clientName: string;
  selectClientCompany = signal<ClientCompany>(new ClientCompany());
  clientData1: any;
  clientOptions1: any;
  clientData2: any;
  clientOptions2: any;

  btnBack = false; // controle para saber se o usuário clicou no button voltar

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private storageService: StorageService,
    private primeNGConfig: PrimeNGConfig,
    private dashboardService: DashboardService
  ) {
  }
  ngDoCheck(): void {
    //Client
    if (this.selectClientCompany().id != 0) {
      this.clientCompany = this.selectClientCompany();
      this.clientName = this.clientCompany.name;
      //Search client
      this.searchClient(this.clientCompany.id);
      this.selectClientCompany.set(new ClientCompany());
    }
  }

  ngOnInit(): void {
    // Detecta o botão de voltar
    window.onpopstate = () => {
      this.btnBack = true;
    };
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
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.clientData1 = {
      labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      datasets: [
        {
          label: 'Ano: 2024',
          //data: [540, 325, 402, 320, 540, 325, 702, 620, 540, 325, 702, 920],
          backgroundColor: ['rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgb(255, 159, 64)'],
          borderWidth: 1
        },
        {
          label: 'Ano: 2025',
          // data: [240, 325, 702, 620, 50, 325, 702, 620, 140, 425, 102, 220],
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgb(54, 162, 235)'],
          borderWidth: 1
        }
      ]
    };
    this.clientOptions1 = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
    this.clientData2 = {
      labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      datasets: [
        {
          label: 'Ano: 2024',
          fill: false,
          borderColor: documentStyle.getPropertyValue('--orange-500'),
          backgroundColor: documentStyle.getPropertyValue('--orange-100'),
          borderWidth: 1,
          tension: 0.4
        },
        {
          label: 'Ano: 2025',
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          backgroundColor: documentStyle.getPropertyValue('--blue-100'),
          borderWidth: 1,
          tension: 0.4
        }
      ]
    };
    this.clientOptions2 = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
    this.init();
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

  async init() {
    const responseVehicle = await this.countVehiclePenAuthBud();
    if (responseVehicle.status == 200) {
      this.countVehicle = responseVehicle.body;
    }

    const responseClientData1 = await this.countVehicleFilterYear(2024);
    if (responseClientData1.status == 200) {
      for (const d of responseClientData1.body) {
        this.clientData1.datasets[0].data.push(d);
      }
    }
    const responseClientData2 = await this.countVehicleFilterYear(2025);
    if (responseClientData2.status == 200) {
      for (const d of responseClientData2.body) {
        this.clientData1.datasets[1].data.push(d);
      }
    }
    //Update graphic
    this.clientData1 = { ... this.clientData1 };

    const resultClientData1 = await this.countYesServiceFilterYear(2024);
    if (resultClientData1.status == 200) {
      for (const d of resultClientData1.body) {
        this.clientData2.datasets[0].data.push(d);
      }
    }
    const resultClientData2 = await this.countYesServiceFilterYear(2025);
    if (resultClientData2.status == 200) {
      for (const d of resultClientData2.body) {
        this.clientData2.datasets[1].data.push(d);
      }
    }
    //Update graphic
    this.clientData2 = { ...this.clientData2 };
  }
  async searchClient(clientId: number) {
    this.clientData1.datasets[0].data = [];
    this.clientData1.datasets[1].data = [];
    const responseClientData1 = await this.countVehicleFilterYearClient(2024, clientId);
    if (responseClientData1.status == 200) {
      for (const d of responseClientData1.body) {
        this.clientData1.datasets[0].data.push(d);
      }
    }
    const responseClientData2 = await this.countVehicleFilterYearClient(2025, clientId);
    if (responseClientData2.status == 200) {
      for (const d of responseClientData2.body) {
        this.clientData1.datasets[1].data.push(d);
      }
    }
    //Update graphic
    this.clientData1 = { ... this.clientData1 };
    //Clear data
    this.clientData2.datasets[0].data = [];
    this.clientData2.datasets[1].data = [];
    const resultClientData1 = await this.countYesServiceFilterYearClient(2024, clientId);
    if (resultClientData1.status == 200) {
      for (const d of resultClientData1.body) {
        this.clientData2.datasets[0].data.push(d);
      }
    }
    const resultClientData2 = await this.countYesServiceFilterYearClient(2025, clientId);
    if (resultClientData2.status == 200) {
      for (const d of resultClientData2.body) {
        this.clientData2.datasets[1].data.push(d);
      }
    }
    this.clientData2 = { ...this.clientData2 }
  }

  private async countVehiclePenAuthBud(): Promise<HttpResponse<any[]>> {
    try {
      return await lastValueFrom(this.dashboardService.countVehiclePenAuthBud());
    } catch (error) {
      return error;
    }
  }
  private async countYesServiceFilterYear(year: number): Promise<HttpResponse<any[]>> {
    try {
      return await lastValueFrom(this.dashboardService.countYesServiceFilterYear(year));
    } catch (error) {
      return error;
    }
  }
  private async countNotServiceFilterYear(year: number): Promise<HttpResponse<any[]>> {
    try {
      return await lastValueFrom(this.dashboardService.countNotServiceFilterYear(year));
    } catch (error) {
      return error;
    }
  }
  private async countYesServiceFilterYearClient(year: number, clientId: number): Promise<HttpResponse<any[]>> {
    try {
      return await lastValueFrom(this.dashboardService.countYesServiceFilterYearClient(year, clientId));
    } catch (error) {
      return error;
    }
  }
  private async countVehicleFilterYear(year: number): Promise<HttpResponse<any[]>> {
    try {
      return await lastValueFrom(this.dashboardService.countVehicleFilterYear(year));
    } catch (error) {
      return error;
    }
  }
  private async countVehicleFilterYearClient(year: number, clientId: number): Promise<HttpResponse<any[]>> {
    try {
      return await lastValueFrom(this.dashboardService.countVehicleFilterYearClient(year, clientId));
    } catch (error) {
      return error;
    }
  }
}
