import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ClientCategory } from '../../../../models/clientcompany/client-category';
import { ClientCategoryService } from '../../../../services/clientecompany/client-category.service';
import { lastValueFrom } from 'rxjs';
import { StatusEnum } from '../../../../models/enum/status-enum';

import { DividerModule } from 'primeng/divider';
import { MessageResponse } from '../../../../models/message/message-response';
import { HttpResponse } from '@angular/common/http';
import { StorageService } from '../../../../services/storage/storage.service';
import { BusyService } from '../../../../components/loading/busy.service';
import { SuccessError } from '../../../../models/enum/success-error';

@Component({
  selector: 'app-client-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastModule, InputTextModule, InputNumberModule, DividerModule,
    InputGroupModule, IconFieldModule, TableModule, RadioButtonModule,
    ButtonModule, InputIconModule, DialogModule],
  templateUrl: './client-category.component.html',
  styleUrl: './client-category.component.scss',
  providers: [MessageService]
})
export default class ClientCategoryComponent implements OnInit {
  visibleDialog: boolean = false;
  enabled = StatusEnum.ENABLED;
  disabled = StatusEnum.DISABLED;
  categories: ClientCategory[] = [];
  category!: ClientCategory;
  isNewCat: boolean = true;

  formCat = new FormGroup({
    id: new FormControl<number | null>({ value: null, disabled: true }),
    status: new FormControl<StatusEnum>(this.enabled, Validators.required),
    description: new FormControl<string>("", Validators.required),
  });

  constructor(
    private storageService: StorageService,
    private busyService: BusyService,
    private categoryService: ClientCategoryService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.init();
  }

  private async init() {
    //open Load
    this.busyService.busy();
    const result = await this.listAllCategories();
    //Close Load
    this.busyService.idle();
    this.categories = result.body.data;
  }

  private showDialog() {
    this.cleanForm();
    this.visibleDialog = true;
  }

  newCategory() {
    this.isNewCat = true;
    this.showDialog();
  }

  hideDialog() {
    this.visibleDialog = false;
  }

  private cleanForm() {
    this.formCat.patchValue({
      id: null,
      description: "",
      status: StatusEnum.ENABLED
    });
  }
  edit(cat: ClientCategory) {
    this.showDialog();

    this.isNewCat = false;
    this.category = cat;

    this.formCat.patchValue({
      id: cat.id,
      description: cat.description,
      status: cat.status
    });
  }
  save() {
    if (this.isNewCat) {
      this.saveCat();
    } else {
      this.updateCat();
    }
  }

  private async saveCat() {
    const { value, valid } = this.formCat;
    if (!valid) {
      return;
    }
    this.category = new ClientCategory();
    this.category.companyId = this.storageService.companyId;
    this.category.resaleId = this.storageService.resaleId;
    this.category.status = value.status;
    this.category.description = value.description;

    //open Load
    this.busyService.busy();
    const resultSave = await this.saveCategory(this.category);
    //Close Load
    this.busyService.idle();
    if (resultSave.status == 201 && resultSave.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: resultSave.body.header, detail: resultSave.body.message, icon: 'pi pi-check' });
      this.category = resultSave.body.data;
      this.formCat.patchValue({ id: this.category.id });
      this.isNewCat = false;
      this.init();
    }
    if (resultSave.status == 201 && resultSave.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: resultSave.body.header, detail: resultSave.body.message, icon: 'pi pi-info-circle' });
    }
  }
  private async updateCat() {

    const { value, valid } = this.formCat;
    if (!valid) {
      return;
    }

    this.category.status = value.status;
    this.category.description = value.description;

    //open Load
    this.busyService.busy();
    const resultSave = await this.updateCategory(this.category);
    //Close Load
    this.busyService.idle();
    if (resultSave.status == 200 && resultSave.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: resultSave.body.header, detail: resultSave.body.message, icon: 'pi pi-check' });
      this.init();
    }
    if (resultSave.status == 200 && resultSave.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: resultSave.body.header, detail: resultSave.body.message, icon: 'pi pi-info-circle' });
    }
  }
  private async listAllCategories(): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.categoryService.listAll());
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async saveCategory(cat: ClientCategory): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.categoryService.save(cat));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async updateCategory(cat: ClientCategory): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.categoryService.update(cat));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
}
