import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { Part } from '../../../../models/parts/Part';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';


import { YesNot } from '../../../../models/enum/yes-not';
import { StatusEnum } from '../../../../models/enum/status-enum';




@Component({
  selector: 'app-parts',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, TabViewModule, TableModule, RadioButtonModule, DividerModule,
    ReactiveFormsModule, IconFieldModule, DropdownModule, InputIconModule, InputNumberModule, DialogModule, ToastModule],
  templateUrl: './parts.component.html',
  styleUrl: './parts.component.scss',
  providers: [MessageService]
})
export default class PartsComponent implements OnInit, OnDestroy {

  visibleDialogNew: boolean = false;
  parts: Part[] = [];
  brands: any[] = [];
  partGroups: any[] = [];

  yes = YesNot.yes;
  not = YesNot.not;

  enabled = StatusEnum.ENABLED;
  disabled = StatusEnum.DISABLED;

  formPart = new FormGroup({
    id: new FormControl<number | null>({ value: null, disabled: true }),
    code: new FormControl<string>(''),
    status: new FormControl<string>(this.enabled),
    brand: new FormControl<any>(null),
    group: new FormControl<any>(null),
    description: new FormControl<string>(''),
    permissionDiscount: new FormControl<string>(''),//Acrécimo, Desconto, Ambos, Nenhum
  });

  constructor() { }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {

  }

  showDialog() {
    this.visibleDialogNew = true;
  }


}
