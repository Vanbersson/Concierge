import { Component, EventEmitter, Output, signal } from '@angular/core';
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
import { ClientCompany } from '../../models/clientcompany/client-company';

//Service
import { ClientecompanyService } from '../../services/clientecompany/clientecompany.service';
import { StorageService } from '../../services/storage/storage.service';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

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

  public clientName = signal<string>('')

  //Filter Client
  dialogListClientCompany: ClientCompany[] = [];
  dialogSelectClientCompany: ClientCompany = null;
  dialogVisibleClientCompany: boolean = false;
  dialogloadingClientCompany: boolean = false;

  formClientCompanyFilter = new FormGroup({
    clientCompanyId: new FormControl<Number | null>(null),
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

  private async saveClient(client: ClientCompany): Promise<HttpResponse<ClientCompany>> {
    try {
      return await lastValueFrom(this.serviceClienteCompany.save(client));
    } catch (error) {
      return error;
    }
  }

  public filterClientCompany() {

    this.dialogloadingClientCompany = true;
    const { value } = this.formClientCompanyFilter;

    if (value.clientCompanyTipo == "j") {

      if (value.clientCompanyId) {
        this.serviceClienteCompany.getIdExternal$(value.clientCompanyId).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        }, (error) => {
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyFantasia) {
        this.serviceClienteCompany.getFantasiaJ$(value.clientCompanyFantasia).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyName) {
        this.serviceClienteCompany.getNameJ$(value.clientCompanyName).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyCnpj) {
        this.serviceClienteCompany.getCnpj$(value.clientCompanyCnpj).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        }, (error) => {
          this.dialogloadingClientCompany = false;
        });
      }
      else if (value.clientCompanyCpf || value.clientCompanyRg) {
        this.dialogloadingClientCompany = false;
      } else if (value.clientCompanyTipo) {
        this.serviceClienteCompany.getTipo$(value.clientCompanyTipo).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        });
      }

    } else {
      // P/Física

      if (value.clientCompanyId) {
        this.serviceClienteCompany.getIdExternal$(value.clientCompanyId).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        }, (error) => {
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyFantasia) {
        this.serviceClienteCompany.getFantasiaF$(value.clientCompanyFantasia).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyName) {
        this.serviceClienteCompany.getNameF$(value.clientCompanyName).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyCnpj) {
        this.dialogloadingClientCompany = false;
      } else if (value.clientCompanyCpf) {
        this.serviceClienteCompany.getCpf$(value.clientCompanyCpf).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        }, (error) => {
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyTipo) {
        this.serviceClienteCompany.getTipo$(value.clientCompanyTipo).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        });
      }

    }

  }

}
