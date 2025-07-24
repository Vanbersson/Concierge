import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';

import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

//Enum
import { StatusEnabledDisabled } from '../../../../../models/enum/status-enabled-disabled';

//Service
import { ToolControlCategory } from '../../../../../models/workshop/toolcontrol/tool-control-category';
import { StorageService } from '../../../../../services/storage/storage.service';
import { ToolControlCategoryService } from '../../../../../services/workshop/tool-control/tool-control-category.service';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { BusyService } from '../../../../../components/loading/busy.service';

enum TypeCategory {
  FERRAMENTA = "Ferramenta", EPI = "EPI", UNIFORME = "Uniforme", OUTRO = "Outro"
}

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, InputTextModule, InputNumberModule, DialogModule, ToastModule,
    InputMaskModule, RadioButtonModule,
    ReactiveFormsModule, InputGroupModule, InputIconModule, ButtonModule, TableModule, IconFieldModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.scss',
  providers: [MessageService]
})
export default class CategoriaComponent implements OnInit {

  category: ToolControlCategory;
  enabled = StatusEnabledDisabled.enabled;
  disabled = StatusEnabledDisabled.disabled;
  typeOutro = TypeCategory.OUTRO;
  typeFerr = TypeCategory.FERRAMENTA;
  typeEPI = TypeCategory.EPI;
  typeUnif = TypeCategory.UNIFORME;
  categories: ToolControlCategory[] = []
  //Dialog
  visibleDialog: boolean = false;
  formCat = new FormGroup({
    status: new FormControl<string>(this.enabled, Validators.required),
    description: new FormControl<string>("", Validators.required),
    quantityReq: new FormControl<number | null>(null),
    type: new FormControl<string>(TypeCategory.OUTRO, Validators.required),
  });

  constructor(
    private busyService: BusyService,
    private messageService: MessageService,
    private storageService: StorageService,
    private categoryService: ToolControlCategoryService) { }
  ngOnInit(): void {
    //Inicia o loading
    this.busyService.busy();
    this.listAll();
  }
  private listAll() {
    this.categoryService.listAll().subscribe(data => {
      this.categories = data;
      //Fecha o loading
      this.busyService.idle();
    });
  }
  showDialog() {
    this.cleanForm();
    this.visibleDialog = true;
  }
  hideDialog() {
    this.visibleDialog = false;
  }
  cleanForm() {
    this.formCat.patchValue({
      description: "",
      status: this.enabled,
      quantityReq: null,
      type: this.typeOutro
    });
    this.category = null;
  }
  editCategory(cat: ToolControlCategory) {
    this.showDialog();
    this.category = cat;

    this.formCat.patchValue({
      description: cat.description,
      status: cat.status,
      type: cat.type,
      quantityReq: cat.quantityReq != 0 ? cat.quantityReq : null
    });
  }
  async saveCategory() {
    const { value, valid } = this.formCat;
    if (!valid) {
      return;
    }

    if (this.category == null) {
      //Save
      this.category = new ToolControlCategory();
      this.category.companyId = this.storageService.companyId;
      this.category.resaleId = this.storageService.resaleId;
      this.category.description = value.description;
      this.category.status = value.status;
      this.category.type = value.type;
      this.category.quantityReq = value.quantityReq != null ? value.quantityReq : 0;

      const resultSave = await this.saveCat(this.category);
      if (resultSave.status == 201) {
        this.category.id = resultSave.body.id;
        this.messageService.add({ severity: 'success', summary: 'Categoria', detail: 'Salva com sucesso', icon: 'pi pi-check' });
      }

    } else {
      //Update
      this.category.description = value.description;
      this.category.status = value.status;
      this.category.type = value.type;
      this.category.quantityReq = value.quantityReq != null ? value.quantityReq : 0;
      const resultUpdate = await this.updateCat(this.category);
      if (resultUpdate.status == 200) {
        this.messageService.add({ severity: 'success', summary: 'Categoria', detail: 'Atualizada com sucesso', icon: 'pi pi-check' });
      }
    }

    this.listAll();

  }
  private async saveCat(cat: ToolControlCategory): Promise<HttpResponse<ToolControlCategory>> {
    try {
      return await lastValueFrom(this.categoryService.saveCat(cat));
    } catch (error) {
      return error;
    }
  }
  private async updateCat(cat: ToolControlCategory): Promise<HttpResponse<ToolControlCategory>> {
    try {
      return await lastValueFrom(this.categoryService.updateCat(cat));
    } catch (error) {
      return error;
    }
  }

}
