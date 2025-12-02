import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

//PrimeNg
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';

//Service
import { CompanyService } from '../../../services/company/company.service';

//Class
import { Company } from '../../../models/company/Company';
import { Resale } from '../../../models/resale/resale';
import { ResaleService } from '../../../services/resale/resale.service';
import { StatusEnabledDisabled } from '../../../models/enum/status-enabled-disabled';


@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, TabViewModule, TableModule, FormsModule, ReactiveFormsModule, IconFieldModule,InputIconModule,
    InputTextModule, ButtonModule, InputMaskModule, ToastModule, InputNumberModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
  providers: [MessageService]
})
export default class CompanyComponent {

  private company: Company;
  enabled: string = StatusEnabledDisabled.enabled;

  resales: Resale[] = [];

  formCompany = new FormGroup({
    id: new FormControl<number | null>({value:null,disabled:true}),
    status: new FormControl<string>('', Validators.required),
    name: new FormControl<string>('', Validators.required),
    cnpj: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', Validators.required),
    cellphone: new FormControl<string>(''),
    phone: new FormControl<string>('', Validators.required),
    zipCode: new FormControl<string>('', Validators.required),
    state: new FormControl<string>('', Validators.required),
    city: new FormControl<string>('', Validators.required),
    neighborhood: new FormControl<string>('', Validators.required),
    address: new FormControl<string>('', Validators.required),
    addressNumber: new FormControl<string>('', Validators.required),
    addressComplement: new FormControl<string>(''),
  });

  constructor(private companyService: CompanyService, private resaleService: ResaleService, private messageService: MessageService) {
    this.getCompanies();
    this.getResales();
  }
  maskCNPJ(cnpj: string): string {
    const CNPJ = cnpj.substring(0, 2) + "." + cnpj.substring(2, 5) + "." + cnpj.substring(5, 8) + "/" + cnpj.substring(8, 12) + "-" + cnpj.substring(12, 14);
    return CNPJ;
  }

  private getCompanies() {
    this.companyService.getCompanyFilterId$(1).subscribe(data => {
      this.company = data;
      this.loadingForm();
    });
  }

  private getResales() {
    this.resaleService.getFilterCompany(1).subscribe(data => {
      this.resales = data;
    });
  }

  private loadingForm() {
    this.formCompany.patchValue({
      id: this.company.id,
      name: this.company.name,
      cnpj: this.company.cnpj,
      email: this.company.email,
      cellphone: this.company.cellphone,
      phone: this.company.phone,
      zipCode: this.company.zipCode,
      state: this.company.state,
      city: this.company.city,
      neighborhood: this.company.neighborhood,
      address: this.company.address,
      addressNumber: this.company.addressNumber,
      addressComplement: this.company.addressComplement
    });
  }



}
