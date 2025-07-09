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
import { MessageService, ConfirmationService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

//Service
import { StorageService } from '../../../../../services/storage/storage.service';
import { NgxImageCompressService } from 'ngx-image-compress';
//Enum
import { StatusEnabledDisabled } from '../../../../../models/enum/status-enabled-disabled';
import { ToolControlMaterial } from '../../../../../models/workshop/toolcontrol/tool-control-material';
import { IMAGE_MAX_SIZE } from '../../../../../util/constants';
import { ToolControlCategory } from '../../../../../models/workshop/toolcontrol/tool-control-category';
import { ToolControlCategoryService } from '../../../../../services/workshop/tool-control/tool-control-category.service';
import { ToolControlMaterialService } from '../../../../../services/workshop/tool-control/tool-control-material.service';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';


enum typeMaterial {
  loan = "Loan",
  kit = "Kit",
  ambos = "Ambos"
}

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [CommonModule, InputTextModule, InputNumberModule, DialogModule, ToastModule,
    InputMaskModule, RadioButtonModule, MultiSelectModule, ConfirmDialogModule,
    ReactiveFormsModule, InputGroupModule, InputIconModule, ButtonModule, TableModule, IconFieldModule],
  templateUrl: './material.component.html',
  styleUrl: './material.component.scss',
  providers: [ConfirmationService, MessageService]
})
export default class MaterialComponent implements OnInit {
  visibleDialog = false;
  enabled = StatusEnabledDisabled.enabled;
  disabled = StatusEnabledDisabled.disabled;

  material: ToolControlMaterial;

  listMat: ToolControlMaterial[] = [];
  listCat: ToolControlCategory[] = [];

  photoMat: string = "";

  //Dialog
  editQuantityLoan = false;
  editQuantityKit = false;

  loan = typeMaterial.loan;
  kit = typeMaterial.kit;
  ambos = typeMaterial.ambos;


  formMat = new FormGroup({
    status: new FormControl<string>(this.enabled, Validators.required),
    type: new FormControl<string>(this.loan, Validators.required),
    description: new FormControl<string>("", Validators.required),
    quantityAccountingLoan: new FormControl<number>(0, Validators.required),
    quantityAvailableLoan: new FormControl<number>(0, Validators.required),
    quantityAccountingKit: new FormControl<number>(0, Validators.required),
    quantityAvailableKit: new FormControl<number>(0, Validators.required),
    validityDay: new FormControl<number | null>(null),
    categories: new FormControl<ToolControlCategory[] | null>([], Validators.required),
    photo: new FormControl<string | null>(null),
  });

  constructor(
    private materialService: ToolControlMaterialService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private storageService: StorageService,
    private ngxImageCompressService: NgxImageCompressService,
    private categoryService: ToolControlCategoryService) { }

  ngOnInit(): void {
    this.listAllMaterial();
    this.listAllCategory();
    this.disableQuantityAccountingLoan();
    this.disableQuantityAvailableLoan();
    this.disableQuantityAccountingKit();
    this.disableQuantityAvailableKit();
  }
  private listAllCategory() {
    this.categoryService.listAllEnabled().subscribe(data => {
      this.listCat = data;
    });
  }

  allCategoriesDesc(id: number): string {
    var desc = "";
    for (var cat of this.listCat) {
      if (id == cat.id) {
        desc = cat.description;
      }
    }

    return desc;
  }

  getCategory(id: number): ToolControlCategory {
    var category: ToolControlCategory;
    for (var cat of this.listCat) {
      if (id == cat.id) {
        category = cat;
      }
    }
    return category;
  }
  private listAllMaterial() {
    this.materialService.listAll().subscribe(data => {
      this.listMat = data;
    });
  }
  cleanForm() {
    this.formMat.patchValue({
      description: "",
      categories: [],
      validityDay: null,
      quantityAccountingLoan: 0,
      quantityAvailableLoan: 0,
      quantityAccountingKit: 0,
      quantityAvailableKit: 0,
      photo: "",
      type: this.loan
    });

    this.photoMat = "";
    this.material = null;
  }

  newMaterial() {
    this.showDialog();

    this.disableQuantityAccountingLoan();
    this.disableQuantityAvailableLoan();
    this.editQuantityLoan = false;

    this.disableQuantityAccountingKit();
    this.disableQuantityAvailableKit();
    this.editQuantityKit = false;

  }
  showDialog() {
    this.cleanForm();
    this.visibleDialog = true;
  }
  hideDialog() {
    this.visibleDialog = false;
  }
  onSelectFile() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.photoMat = base64Data;
          this.formMat.patchValue({ photo: this.photoMat });
        });
      }
    });
  }
  deleteFile() {
    this.formMat.patchValue({ photo: "" });
    this.photoMat = "";
  }
  enableQuantityAccountingLoan() {
    this.formMat.get("quantityAccountingLoan").enable();
  }
  disableQuantityAccountingLoan() {
    this.formMat.get("quantityAccountingLoan").disable();
  }
  enableQuantityAccountingKit() {
    this.formMat.get("quantityAccountingKit").enable();
  }
  disableQuantityAccountingKit() {
    this.formMat.get("quantityAccountingKit").disable();
  }
  enableQuantityAvailableLoan() {
    this.formMat.get("quantityAvailableLoan").enable();
  }
  disableQuantityAvailableLoan() {
    this.formMat.get("quantityAvailableLoan").disable();
  }
  enableQuantityAvailableKit() {
    this.formMat.get("quantityAvailableKit").enable();
  }
  disableQuantityAvailableKit() {
    this.formMat.get("quantityAvailableKit").disable();
  }
  confirmEditQuant() {
    this.confirmationService.confirm({
      header: 'Alterar Quantidade?',
      message: 'Por favor comfirme para alterar.',
      acceptLabel: 'Comfirmar',
      accept: () => {

        switch (this.formMat.get("type").value) {
          case this.loan:
            if (this.editQuantityKit == false) {
              this.enableQuantityAccountingLoan();
              this.editQuantityLoan = true;
            }
            break;
          case this.kit:
            if (this.editQuantityLoan == false) {
              this.enableQuantityAccountingKit();
              this.editQuantityKit = true;
            }
            break;
          default:
            this.enableQuantityAccountingLoan();
            this.editQuantityLoan = true;
            this.enableQuantityAccountingKit();
            this.editQuantityKit = true;
            break;
        }
      },
      reject: () => {

      }
    });
  }

  editMat(mat: ToolControlMaterial) {
    this.showDialog();
    this.material = mat;
    this.formMat.patchValue({
      description: mat.description,
      status: mat.status,
      type: mat.type,
      categories: [this.getCategory(mat.categoryId)],
      validityDay: mat.validityDay != 0 ? mat.validityDay : null,
      quantityAccountingLoan: mat.quantityAccountingLoan,
      quantityAvailableLoan: mat.quantityAvailableLoan,
      quantityAccountingKit: mat.quantityAccountingKit,
      quantityAvailableKit: mat.quantityAvailableKit,
      photo: mat.photo
    });
    this.photoMat = mat.photo;
  }
  async saveMaterial() {
    this.enableQuantityAccountingLoan();
    this.enableQuantityAvailableLoan();

    this.enableQuantityAccountingKit();
    this.enableQuantityAvailableKit();

    const { value, valid } = this.formMat;

    if (!valid) {
      return;
    }

    if (this.material == null) {
      //Save
      this.material = new ToolControlMaterial();
      this.material.companyId = this.storageService.companyId;
      this.material.resaleId = this.storageService.resaleId;
      this.material.status = value.status;
      this.material.type = value.type;
      this.material.description = value.description;
      this.material.categoryId = value.categories.at(0).id;
      this.material.validityDay = value.validityDay ?? 0;
      this.material.quantityAccountingLoan = value.quantityAccountingLoan ?? 0;
      this.material.quantityAvailableLoan = value.quantityAvailableLoan ?? 0;
      this.material.quantityAccountingKit = value.quantityAccountingKit ?? 0;
      this.material.quantityAvailableKit = value.quantityAvailableKit ?? 0;
      this.material.photo = value.photo;

      const resultSave = await this.saveMat(this.material);
      if (resultSave.status == 201) {
        this.material.id = resultSave.body.id;
        this.material.quantityAccountingLoan = resultSave.body.quantityAccountingLoan ?? 0;
        this.material.quantityAvailableLoan = resultSave.body.quantityAvailableLoan ?? 0;
        this.material.quantityAccountingKit = resultSave.body.quantityAccountingKit ?? 0;
        this.material.quantityAvailableKit = resultSave.body.quantityAvailableKit ?? 0;

        this.formMat.patchValue({
          quantityAccountingLoan: resultSave.body.quantityAccountingLoan,
          quantityAvailableLoan: resultSave.body.quantityAvailableLoan,
          quantityAccountingKit: resultSave.body.quantityAccountingKit,
          quantityAvailableKit: resultSave.body.quantityAvailableKit
        });

        this.messageService.add({ severity: 'success', summary: 'Material', detail: 'Salvo com sucesso', icon: 'pi pi-check' });
      }
    } else {
      //Update

      this.material.status = value.status;
      this.material.type = value.type;
      this.material.description = value.description;
      this.material.categoryId = value.categories.at(0).id;
      this.material.validityDay = value.validityDay ?? 0;
      this.material.quantityAccountingLoan = value.quantityAccountingLoan ?? 0;
      this.material.quantityAvailableLoan = value.quantityAvailableLoan ?? 0;
      this.material.quantityAccountingKit = value.quantityAccountingKit ?? 0;
      this.material.quantityAvailableKit = value.quantityAvailableKit ?? 0;
      this.material.photo = value.photo;

      const resultSave = await this.updateMat(this.material);
      if (resultSave.status == 200) {
        this.material = resultSave.body;
        this.formMat.patchValue({
          quantityAccountingLoan: resultSave.body.quantityAccountingLoan,
          quantityAvailableLoan: resultSave.body.quantityAvailableLoan,
          quantityAccountingKit: resultSave.body.quantityAccountingKit,
          quantityAvailableKit: resultSave.body.quantityAvailableKit
        });
        this.messageService.add({ severity: 'success', summary: 'Material', detail: 'Atualizado com sucesso', icon: 'pi pi-check' });
      }
    }

    this.disableQuantityAccountingLoan();
    this.disableQuantityAvailableLoan();
    this.editQuantityLoan = false;

    this.disableQuantityAccountingKit();
    this.disableQuantityAvailableKit();
    this.editQuantityKit = false;

    this.listAllMaterial();
  }
  private async saveMat(mat: ToolControlMaterial): Promise<HttpResponse<ToolControlMaterial>> {
    try {
      return await lastValueFrom(this.materialService.saveMat(mat));
    } catch (error) {
      return error;
    }
  }
  private async updateMat(mat: ToolControlMaterial): Promise<HttpResponse<ToolControlMaterial>> {
    try {
      return await lastValueFrom(this.materialService.updateMat(mat));
    } catch (error) {
      return error;
    }
  }

}
