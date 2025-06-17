import { Component } from '@angular/core';
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
  selector: 'app-mechanic',
  standalone: true,
  imports: [CommonModule,InputTextModule,InputNumberModule,InputMaskModule,InputGroupModule,InputIconModule,ButtonModule,TableModule,IconFieldModule],
  templateUrl: './mechanic.component.html',
  styleUrl: './mechanic.component.scss'
})
export class MecanicoComponent {

}
