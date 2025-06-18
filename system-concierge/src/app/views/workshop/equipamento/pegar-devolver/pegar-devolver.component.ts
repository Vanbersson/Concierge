import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

//PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-pegar-devolver',
  standalone: true,
  imports: [CommonModule, ButtonModule,TableModule,InputTextModule,InputNumberModule,
    IconFieldModule,InputMaskModule,InputGroupModule,InputIconModule],
  templateUrl: './pegar-devolver.component.html',
  styleUrl: './pegar-devolver.component.scss'
})
export default class PegarDevolverComponent implements OnInit{

  constructor(){}

  ngOnInit(): void {
    
  }

}
