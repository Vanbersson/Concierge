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
import { StatusEnabledDisabled } from '../../models/enum/status-enabled-disabled';
import { SuccessError } from '../../models/enum/success-error';
//Service
import { ClientecompanyService } from '../../services/clientecompany/clientecompany.service';
import { StorageService } from '../../services/storage/storage.service';

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

  public clientName = signal<string>('')
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

  constructor(private serviceClienteCompany: ClientecompanyService, private storageService: StorageService) { }

  //Filter Client
  public showDialogFilterClientCompany() {
    this.dialogVisibleClientCompany = true;
  }
  public hideDialogFilterClientCompany() {
    this.dialogVisibleClientCompany = false;
  }
  public async selectClientCompany() {
    if (this.dialogSelectClientCompany) {
      //Emit 
      this.dialogSelectClientCompany.companyId = this.storageService.companyId;
      this.dialogSelectClientCompany.resaleId = this.storageService.resaleId;
      this.dialogSelectClientCompany.status = StatusEnabledDisabled.enabled;
      this.dialogSelectClientCompany.contactName = "";
      this.dialogSelectClientCompany.contactEmail = "";
      this.dialogSelectClientCompany.contactDDDPhone = "";
      this.dialogSelectClientCompany.contactPhone = "";
      this.dialogSelectClientCompany.contactDDDCellphone = "";
      this.dialogSelectClientCompany.contactCellphone = "";
      const resultClient = await this.saveClient(this.dialogSelectClientCompany);
      this.outputClient.emit(this.dialogSelectClientCompany);
      this.clientName.set(this.dialogSelectClientCompany.name);
      this.dialogVisibleClientCompany = false;
    }
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
          //Api externa
          this.serviceClienteCompany.FilterIdExternal(value.clientCompanyId).subscribe((data) => {
            if (data.at(0).cnpj != this.dialogListClientCompany.at(0).cnpj) {
              data.map(c => {
                this.dialogListClientCompany.push(c);
              });
            }
          });
        }
        if (result.status == 200 && result.body.status == SuccessError.error) {
          //Api externa
          this.serviceClienteCompany.FilterIdExternal(value.clientCompanyId).subscribe((data) => {
            this.dialogListClientCompany = data;
          });
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
          //Api externa
          this.serviceClienteCompany.filterCnpjExternal(value.clientCompanyCnpj).subscribe((data) => {
            if (data.at(0).cnpj != this.dialogListClientCompany.at(0).cnpj) {
              data.map(c => {
                this.dialogListClientCompany.push(c);
              });
            }
          });
        }
        if (result.status == 200 && result.body.status == SuccessError.error) {
          //Api externa
          this.serviceClienteCompany.filterCnpjExternal(value.clientCompanyCnpj).subscribe((data) => {
            this.dialogListClientCompany = data;
          });
        }
      }
    } else {
      // P/Física
      if (value.clientCompanyId) {
        const result = await this.filterId(value.clientCompanyId);
        if (result.status == 200 && result.body.status == SuccessError.succes) {
          this.dialogListClientCompany.push(result.body.data);
          //Api externa
          this.serviceClienteCompany.FilterIdExternal(value.clientCompanyId).subscribe((data) => {
            if (data.at(0).cnpj != this.dialogListClientCompany.at(0).cnpj) {
              data.map(c => {
                this.dialogListClientCompany.push(c);
              });
            }
          });
        }
        if (result.status == 200 && result.body.status == SuccessError.error) {
          //Api externa
          this.serviceClienteCompany.FilterIdExternal(value.clientCompanyId).subscribe((data) => {
            this.dialogListClientCompany = data;
          });
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
          //Api externa
          this.serviceClienteCompany.filterCpfExternal(value.clientCompanyCpf).subscribe((data) => {
            if (data.at(0).cpf != this.dialogListClientCompany.at(0).cpf) {
              data.map(c => {
                this.dialogListClientCompany.push(c);
              });
            }
          });
        }
        if (result.status == 200 && result.body.status == SuccessError.error) {
          //Api externa
          this.serviceClienteCompany.filterCpfExternal(value.clientCompanyCpf).subscribe((data) => {
            this.dialogListClientCompany = data;
          });
        }
      }
    }
    this.dialogloadingClientCompany = false;
  }
  private async saveClient(client: ClientCompany): Promise<HttpResponse<ClientCompany>> {
    try {
      return await lastValueFrom(this.serviceClienteCompany.save(client));
    } catch (error) {
      return error;
    }
  }
  private async filterId(id: number): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.serviceClienteCompany.filterId(id));
    } catch (error) {
      return error;
    }
  }
  private async filterJFantasia(fantasia: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.serviceClienteCompany.filterJFantasia(fantasia));
    } catch (error) {
      return error;
    }
  }
  private async filterFFantasia(fantasia: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.serviceClienteCompany.filterFFantasia(fantasia));
    } catch (error) {
      return error;
    }
  }
  private async filterJName(name: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.serviceClienteCompany.filterJName(name));
    } catch (error) {
      return error;
    }
  }
  private async filterFName(name: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.serviceClienteCompany.filterFName(name));
    } catch (error) {
      return error;
    }
  }
  private async filterCNPJ(cnpj: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.serviceClienteCompany.filterCNPJ(cnpj));
    } catch (error) {
      return error;
    }
  }
  private async filterCPF(cpf: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.serviceClienteCompany.filterCPF(cpf));
    } catch (error) {
      return error;
    }
  }

}
