import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
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
import { ClientCompany } from '../../models/clientcompany/client-company';
import { MessageResponse } from '../../models/message/message-response';
import { SuccessError } from '../../models/enum/success-error';
//Service
import { StorageService } from '../../services/storage/storage.service';
import { StatusEnum } from '../../models/enum/status-enum';
import { ClientCompanyService } from '../../services/clientecompany/client-company.service';

@Component({
  selector: 'app-filterclient',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TableModule, InputTextModule,
    InputGroupModule, ReactiveFormsModule, FormsModule, InputMaskModule, InputNumberModule,
    RadioButtonModule, InputIconModule, IconFieldModule],
  templateUrl: './filter.client.component.html',
  styleUrl: './filter.client.component.scss'
})
export class FilterClientComponent {
  @Output() public outputClient = new EventEmitter<ClientCompany>();
  @Input() isDisabled: boolean = false;

  enabled = StatusEnum.ENABLED;
  disabled = StatusEnum.DISABLED;

  //Filter Client
  dialogListClientCompany: ClientCompany[] = [];
  dialogSelectClientCompany: ClientCompany = null;
  dialogVisibleClientCompany: boolean = false;
  dialogloadingClientCompany: boolean = false;
  formClientCompanyFilter = new FormGroup({
    clientCompanyId: new FormControl<number | null>(null),
    clientCompanyFantasia: new FormControl<string>(''),
    clientCompanyName: new FormControl<string>(''),
    clientCompanyCnpj: new FormControl<string>(''),
    clientCompanyCpf: new FormControl<string>(''),
    clientCompanyRg: new FormControl<string | null>(null),
    clientCompanyTipo: new FormControl<string>('j'),
  });

  constructor(private clientService: ClientCompanyService, private storageService: StorageService) { }

  //Filter Client
  public showDialogFilterClientCompany() {
    this.dialogVisibleClientCompany = true;
  }
  
  public hideDialogFilterClientCompany() {
    this.dialogVisibleClientCompany = false;
  }

  public async selectClientCompany() {
    if (this.dialogSelectClientCompany) {
      if (this.dialogSelectClientCompany.status == this.enabled) {
        this.outputClient.emit(this.dialogSelectClientCompany);
        this.dialogVisibleClientCompany = false;
      }
    }
  }

  maskCNPJ(cnpj: string): string {
    if (cnpj == "") return "";
    const CNPJ = cnpj.substring(0, 2) + "." + cnpj.substring(2, 5) + "." + cnpj.substring(5, 8) + "/" + cnpj.substring(8, 12) + "-" + cnpj.substring(12, 14);
    return CNPJ;
  }

  maskCPF(cpf: string): string {
    if (cpf == "") return "";
    const CPF = cpf.substring(0, 3) + "." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-" + cpf.substring(9, 11);
    return CPF;
  }

  public async filterClientCompany() {
    this.dialogListClientCompany = [];
    this.dialogloadingClientCompany = true;
    const { value } = this.formClientCompanyFilter;

    if (value.clientCompanyTipo == "j") {
      if (value.clientCompanyId) {
        const result = await this.filterId(value.clientCompanyId);
        if (result.status == 200 && result.body.status == SuccessError.succes) {
          this.dialogListClientCompany.push(result.body.data);
        }
        if (result.status == 200 && result.body.status == SuccessError.error) {

        }
      } else if (value.clientCompanyFantasia) {
        const result = await this.filterJFantasia(value.clientCompanyFantasia);
        if (result.status == 200 && result.body.status == SuccessError.succes) {
          this.dialogListClientCompany = result.body.data;
        }
        if (result.status == 200 && result.body.status == SuccessError.error) {

        }
      } else if (value.clientCompanyName) {
        const result = await this.filterJName(value.clientCompanyName);
        if (result.status == 200 && result.body.status == SuccessError.succes) {
          this.dialogListClientCompany = result.body.data;
        }
        if (result.status == 200 && result.body.status == SuccessError.error) {

        }
      } else if (value.clientCompanyCnpj) {
        const result = await this.filterCNPJ(value.clientCompanyCnpj);
        if (result.status == 200 && result.body.status == SuccessError.succes) {
          this.dialogListClientCompany.push(result.body.data);
        }
        if (result.status == 200 && result.body.status == SuccessError.error) {

        }
      }
    } else {
      // P/Física
      if (value.clientCompanyId) {
        const result = await this.filterId(value.clientCompanyId);
        if (result.status == 200 && result.body.status == SuccessError.succes) {
          this.dialogListClientCompany.push(result.body.data);
        }
        if (result.status == 200 && result.body.status == SuccessError.error) {

        }
      } else if (value.clientCompanyFantasia) {
        const result = await this.filterFFantasia(value.clientCompanyFantasia);
        if (result.status == 200 && result.body.status == SuccessError.succes) {
          this.dialogListClientCompany = result.body.data;
        }
        if (result.status == 200 && result.body.status == SuccessError.error) {

        }
      } else if (value.clientCompanyName) {
        const result = await this.filterFName(value.clientCompanyName);
        if (result.status == 200 && result.body.status == SuccessError.succes) {
          this.dialogListClientCompany = result.body.data;
        }
        if (result.status == 200 && result.body.status == SuccessError.error) {

        }
      } else if (value.clientCompanyCpf) {
        const result = await this.filterCPF(value.clientCompanyCpf);
        if (result.status == 200 && result.body.status == SuccessError.succes) {
          this.dialogListClientCompany.push(result.body.data);
        }
        if (result.status == 200 && result.body.status == SuccessError.error) {

        }
      }
    }
    this.dialogloadingClientCompany = false;
  }

  private async filterId(id: number): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.clientService.filterId(id));
    } catch (error) {
      return error;
    }
  }
  private async filterJFantasia(fantasia: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.clientService.filterJFantasia(fantasia));
    } catch (error) {
      return error;
    }
  }
  private async filterFFantasia(fantasia: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.clientService.filterFFantasia(fantasia));
    } catch (error) {
      return error;
    }
  }
  private async filterJName(name: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.clientService.filterJName(name));
    } catch (error) {
      return error;
    }
  }
  private async filterFName(name: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.clientService.filterFName(name));
    } catch (error) {
      return error;
    }
  }
  private async filterCNPJ(cnpj: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.clientService.filterCNPJ(cnpj));
    } catch (error) {
      return error;
    }
  }
  private async filterCPF(cpf: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.clientService.filterCPF(cpf));
    } catch (error) {
      return error;
    }
  }

}
