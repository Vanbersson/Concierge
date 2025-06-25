import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-pegar-devolver',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, InputTextModule, InputNumberModule,
    IconFieldModule, InputMaskModule, InputGroupModule, InputIconModule, DialogModule, ReactiveFormsModule],
  templateUrl: './pegar-devolver.component.html',
  styleUrl: './pegar-devolver.component.scss'
})
export default class PegarDevolverComponent implements OnInit {
  visibleDialogPegar = false;

  formPegar = new FormGroup({
    codePassword: new FormControl<number | null>(null, Validators.required),
  });
  constructor() { }

  ngOnInit(): void {

  }
  showDialog() {
    this.visibleDialogPegar = true;
  }
  hideDialog() {
    this.visibleDialogPegar = false;
  }

}
