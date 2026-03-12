import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrandService } from '../../../../services/brand/brand.service';
import { lastValueFrom } from 'rxjs';
import { MessageResponse } from '../../../../models/message/message-response';
import { HttpResponse } from '@angular/common/http';

import { MessageService, PrimeNGConfig } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { Brand } from '../../../../models/brand/brand';
import { ButtonModule } from 'primeng/button';
import { StatusEnum } from '../../../../models/enum/status-enum';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BusyService } from '../../../../components/loading/busy.service';
import { SuccessError } from '../../../../models/enum/success-error';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, InputTextModule, IconFieldModule, RadioButtonModule, InputIconModule,
    ButtonModule, InputNumberModule, ReactiveFormsModule, TableModule, ToastModule, DialogModule],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss',
  providers: [MessageService]
})
export default class BrandComponent implements OnInit {
  private isNewBrand: boolean = true;
  private brand!: Brand;
  enabled = StatusEnum.ENABLED;
  disabled = StatusEnum.DISABLED;

  formBrand = new FormGroup({
    status: new FormControl<StatusEnum>(this.enabled),
    name: new FormControl<string>('', [Validators.required, Validators.maxLength(100)])
  });

  listBrands: Brand[] = [];
  dialogVisible: boolean = false;

  constructor(
    private brandService: BrandService,
    private messageService: MessageService,
    private busyService: BusyService) { }

  ngOnInit(): void {
    this.init();
  }
  private async init() {
    this.busyService.busy();
    this.listBrands = await this.listAll();
    this.busyService.idle();
  }
  showNewBrand() {
    this.isNewBrand = true;
    this.brand = new Brand();
    this.cleanForm();
    this.showDialog();
  }
  showDialog() {
    this.dialogVisible = true;
  }
  hideDialog() {
    this.dialogVisible = false;
  }
  cleanForm() {
    this.formBrand.patchValue({
      name: '',
      status: this.enabled
    });
  }
  edit(b: Brand) {
    this.isNewBrand = false;
    this.brand = b;
    this.cleanForm();
    this.showDialog();

    this.formBrand.patchValue({
      name: this.brand.name,
      status: this.brand.status
    });
  }
  save() {
    if (this.isNewBrand) {
      this.saveNewBrand();
    } else {
      this.saveUpdateBrand();
    }
  }

  private async saveNewBrand() {
    const { value, valid } = this.formBrand;
    if (!valid) {
      return;
    }
    this.brand.name = value.name;
    this.brand.status = value.status;

    this.busyService.busy();
    const result = await this.saveNew(this.brand);
    this.busyService.idle();
    if (result.status == 201 && result.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
      this.hideDialog();
      this.init();
    }
    if (result.status == 201 && result.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
    }
  }
  private async saveUpdateBrand() {
    const { value, valid } = this.formBrand;
    if (!valid) {
      return;
    }
    this.brand.name = value.name;
    this.brand.status = value.status;

    this.busyService.busy();
    const result = await this.saveUpdate(this.brand);
    this.busyService.idle();
    if (result.status == 200 && result.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
      this.hideDialog();
      this.init();
    }
    if (result.status == 200 && result.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
      this.hideDialog();
      this.init();
    }
  }

  private async saveNew(b: Brand): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.brandService.save(b));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async saveUpdate(b: Brand): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.brandService.update(b));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async listAll(): Promise<Brand[]> {
    try {
      return await lastValueFrom(this.brandService.listAll());
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return [];
    }
  }

}
