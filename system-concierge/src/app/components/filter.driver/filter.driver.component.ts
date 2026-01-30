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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
//Class
import { Driver } from '../../models/driver/driver';
import { DriverService } from '../../services/driver/driver.service';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { MessageResponse } from '../../models/message/message-response';
import { SuccessError } from '../../models/enum/success-error';
import { StatusEnum } from '../../models/enum/status-enum';

@Component({
  selector: 'app-filterdriver',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TableModule, InputTextModule, ToastModule,
    InputGroupModule, ReactiveFormsModule, FormsModule, InputMaskModule, InputNumberModule,
    RadioButtonModule, InputIconModule, IconFieldModule],
  templateUrl: './filter.driver.component.html',
  styleUrl: './filter.driver.component.scss',
  providers: [MessageService]
})
export class FilterDriverComponent {
  @Output() public outputDriver = new EventEmitter<Driver>();
  @Input() isDisabled: boolean = false;

  enabled = StatusEnum.ENABLED;
  disabled = StatusEnum.DISABLED;

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

  constructor(private driverService: DriverService, private messageService: MessageService) { }

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
    this.dialogSelectDriver = null;
  }
  public async selectDriver() {
    if (this.dialogSelectDriver) {
      if (this.dialogSelectDriver.status == this.enabled) {
        this.outputDriver.emit(this.dialogSelectDriver);
        this.hideDialog();
      }
    }
  }
  async filterDriver() {
    const { value } = this.formDriver;
    this.listDrivers = [];

    if (value.id) {
      const result = await this.filterDriverId(value.id);
      if (result.status == 200 && result.body.status == SuccessError.succes) {
        this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
        this.listDrivers.push(result.body.data);
      }
      if (result.status == 200 && result.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
      }
    } else if (value.name) {
      const result = await this.filterDriverName(value.name);
      if (result.status == 200 && result.body.status == SuccessError.succes) {
        this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
        this.listDrivers = result.body.data;
      }
      if (result.status == 200 && result.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
      }
    } else if (value.cpf) {
      const result = await this.filterDriverCPF(value.cpf);
      if (result.status == 200 && result.body.status == SuccessError.succes) {
        this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
        this.listDrivers.push(result.body.data);
      }
      if (result.status == 200 && result.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
      }
    } else if (value.rg) {
      const result = await this.filterDriverRG(value.rg);
      if (result.status == 200 && result.body.status == SuccessError.succes) {
        this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
        this.listDrivers.push(result.body.data);
      }
      if (result.status == 200 && result.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
      }
    } else if (value.cnhRegister) {
      const result = await this.filterDriverCNHRegister(value.cnhRegister);
      if (result.status == 200 && result.body.status == SuccessError.succes) {
        this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
        this.listDrivers.push(result.body.data);
      }
      if (result.status == 200 && result.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
      }
    }
  }
  private async filterDriverId(id: number): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.driverService.filterId(id));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async filterDriverName(name: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.driverService.filterName(name));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async filterDriverCPF(cpf: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.driverService.filterCPF(cpf));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async filterDriverRG(rg: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.driverService.filterRG(rg));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async filterDriverCNHRegister(cnh: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.driverService.filterCNHRegister(cnh));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
}
