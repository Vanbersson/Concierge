import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//PrimeNg
import { PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { Router } from '@angular/router';


import { VehicleService } from '../../services/vehicle/vehicle.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CalendarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: []
})
export default class DashboardComponent implements OnInit, OnDestroy {

  qtdVehicleEntry = signal<number>(0);
  qtdVehicleExit = signal<number>(0);

  qtdVehicleBudgetWith = signal<number>(0);
  qtdVehicleBudgetWithout = signal<number>(0);

  constructor(private primeNGConfig: PrimeNGConfig, private router: Router, private vehicleService: VehicleService) {
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
  }
  ngOnDestroy(): void {

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



}
