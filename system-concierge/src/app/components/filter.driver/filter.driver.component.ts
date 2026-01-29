import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms'

//PrimeNG
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
//Class
import { Driver } from '../../models/driver/driver';
import { DriverService } from '../../services/driver/driver.service';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-filterdriver',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TableModule, InputTextModule,
    InputGroupModule, ReactiveFormsModule, FormsModule, InputMaskModule, InputNumberModule,
    RadioButtonModule, InputIconModule, IconFieldModule],
  templateUrl: './filter.driver.component.html',
  styleUrl: './filter.driver.component.scss'
})
export class FilterDriverComponent {

  @Output() public outputDriver = new EventEmitter<Driver>();
  @Input() isDisabled: boolean = false;

  //Filter Client
  listDrivers: Driver[] = [];
  dialogSelectDriver: Driver = null;
  dialogVisibleDriver: boolean = false;
  dialogloadingDriver: boolean = false;

  formDriver = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl<string>(''),
    cpf: new FormControl<string>(''),
    rg: new FormControl<string | null>(null),
    cnhRegister: new FormControl<string | null>(null),
  });

  constructor(private driverService: DriverService) { }

  maskCPF(cpf: string): string {
    if (cpf == "") return "";
    const CPF = cpf.substring(0, 3) + "." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-" + cpf.substring(9, 11);
    return CPF;
  }
  public showDialog() {
    this.dialogVisibleDriver = true;
    this.cleanForm();
    this.dialogSelectDriver = null;
  }
  public hideDialog() {
    this.dialogVisibleDriver = false;
  }
  cleanForm() {
    this.formDriver.patchValue({
      id: null,
      name: "",
      cpf: '',
      rg: null,
      cnhRegister: null
    });
    this.listDrivers = [];
  }
  public async selectDriver() {
    if (this.dialogSelectDriver) {
      this.outputDriver.emit(this.dialogSelectDriver);
      this.hideDialog();
    }
  }
  async filterDriver() {
    const { value } = this.formDriver;
    this.listDrivers = [];

    if (value.id) {
      const result = await this.filterDriverId(value.id);
      if (result.status == 200) {
        this.listDrivers.push(result.body);
      }
    } else if (value.name) {
      this.listDrivers = await this.filterDriverName(value.name);
    } else if (value.cpf) {
      const result = await this.filterDriverCPF(value.cpf);
      if (result.status == 200) {
        this.listDrivers.push(result.body);
      }
    } else if (value.rg) {
      const result = await this.filterDriverRG(value.rg);
      if (result.status == 200) {
        this.listDrivers.push(result.body);
      }
    } else if (value.cnhRegister) {
      const result = await this.filterDriverCNHRegister(value.cnhRegister);
      if (result.status == 200) {
        this.listDrivers.push(result.body);
      }
    }
  }
  private async filterDriverId(id: number): Promise<HttpResponse<Driver>> {
    try {
      return lastValueFrom(this.driverService.filterId(id));
    } catch (error) {
      return error;
    }
  }
  private async filterDriverName(name: string): Promise<Driver[]> {
    try {
      return lastValueFrom(this.driverService.filterName(name));
    } catch (error) {
      return [];
    }
  }
  private async filterDriverCPF(cpf: string): Promise<HttpResponse<Driver>> {
    try {
      return lastValueFrom(this.driverService.filterCPF(cpf));
    } catch (error) {
      return error;
    }
  }
  private async filterDriverRG(rg: string): Promise<HttpResponse<Driver>> {
    try {
      return lastValueFrom(this.driverService.filterRG(rg));
    } catch (error) {
      return error;
    }
  }
  private async filterDriverCNHRegister(cnh: string): Promise<HttpResponse<Driver>> {
    try {
      return lastValueFrom(this.driverService.filterCNHRegister(cnh));
    } catch (error) {
      return error;
    }
  }
}
