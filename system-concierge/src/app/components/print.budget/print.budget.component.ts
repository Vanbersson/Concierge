import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';

//Print
import printJS from 'print-js';
import { Budget } from '../../models/budget/budget';
import { ClientCompany } from '../../models/clientcompany/client-company';
import { VehicleEntry } from '../../models/vehicle/vehicle-entry';
import { BudgetRequisition } from '../../models/budget/budget-requisition';
import { BudgetServiceItem } from '../../models/budget/budget-item-service';
import { BudgetItem } from '../../models/budget/budget-item';
import { ClientFisJurEnum } from '../../models/clientcompany/client-fisjur-enum';

//Service


@Component({
  selector: 'app-printbudget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print.budget.component.html',
  styleUrl: './print.budget.component.scss'
})
export class PrintBudgetComponent {

  budget: Budget = new Budget();
  listBudgetRequisition: BudgetRequisition[] = [];
  listBudgetServiceItem: BudgetServiceItem[] = [];
  listBudgetItem: BudgetItem[] = [];
  clientCompany: ClientCompany = new ClientCompany();
  vehicleEntry: VehicleEntry = new VehicleEntry();

  juridica: string = ClientFisJurEnum.juridica;

  totalService: number;
  totalServiceDiscount: number;
  totalPart: number;
  totalPartDiscount: number;
  totalGeral: number;

  constructor() { }
  maskPlaca(placa: string): string {
    if (placa == "") return "";
    return placa.substring(0, 3) + "-" + placa.substring(3, 7);
  }
  maskCNPJ(cnpj: string): string {
    const CNPJ = cnpj.substring(0, 2) + "." + cnpj.substring(2, 5) + "." + cnpj.substring(5, 8) + "/" + cnpj.substring(8, 12) + "-" + cnpj.substring(12, 14);
    return CNPJ;
  }
  maskCPF(cpf: string): string {
    const CPF = cpf.substring(0, 3) + "." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-" + cpf.substring(9, 11);
    return CPF;
  }
   formatNumberBudget(id: number): string {

    var code = "";

    if (id.toString().length == 1) {
      code = "00000" + id;
    } else if (id.toString().length == 2) {
      code = "0000" + id;
    } else if (id.toString().length == 3) {
      code = "000" + id;
    } else if (id.toString().length == 4) {
      code = "00" + id;
    } else if (id.toString().length == 5) {
      code = "0" + id;
    } else if (id.toString().length >= 6) {
      code = id.toString();
    }

    return code;
  }

  public async print(budget: Budget, listBudgetRequisition: BudgetRequisition[], listBudgetServiceItem: BudgetServiceItem[], listBudgetItem: BudgetItem[], clientCompany: ClientCompany, vehicleEntry: VehicleEntry) {

    this.budget = budget;
    this.listBudgetRequisition = listBudgetRequisition;
    this.listBudgetServiceItem = listBudgetServiceItem;
    this.listBudgetItem = listBudgetItem;
    this.clientCompany = clientCompany;
    this.vehicleEntry = vehicleEntry;

    this.totalService = 0;
    this.totalServiceDiscount = 0;
    this.totalPart = 0;
    this.totalPartDiscount = 0;
    this.totalGeral = 0;

    for (var service of this.listBudgetServiceItem) {
      this.totalService += service.price * service.hourService;
      this.totalServiceDiscount += service.discount;
    }

    for (var part of this.listBudgetItem) {
      this.totalPart += part.price * part.quantity;
      this.totalPartDiscount += part.discount;
    }

    if ((this.totalPart - this.totalPartDiscount) >= (this.totalService - this.totalServiceDiscount)) {
      this.totalGeral = (this.totalPart - this.totalPartDiscount) + (this.totalService - this.totalServiceDiscount);
    } else {
      this.totalGeral = (this.totalService - this.totalServiceDiscount) + (this.totalPart - this.totalPartDiscount);
    }

    setTimeout(() => {
      const print = document.getElementById('print-budgetId');
      print.style.display = 'block';
      printJS({
        printable: 'print-budgetId',
        type: 'html',
        targetStyles: ['*'], // Inclui todos os estilos aplicáveis
        scanStyles: true,
        documentTitle: 'Orçamento',
        font_size:'10pt'
      });
      print.style.display = 'none';
    }, 200);
  }


}
