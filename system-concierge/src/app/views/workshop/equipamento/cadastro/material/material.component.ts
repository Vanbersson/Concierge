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
import { ToolControlMaterial } from '../../../../../models/workshop/toolcontrol/tool-control-material';
import { IMAGE_MAX_SIZE } from '../../../../../util/constants';
import { ToolControlCategory } from '../../../../../models/workshop/toolcontrol/tool-control-category';
import { ToolControlCategoryService } from '../../../../../services/workshop/tool-control/tool-control-category.service';
import { ToolControlMaterialService } from '../../../../../services/workshop/tool-control/tool-control-material.service';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { BusyService } from '../../../../../components/loading/busy.service';
import { MessageResponse } from '../../../../../models/message/message-response';
import { SuccessError } from '../../../../../models/enum/success-error';
import { TypeCategory } from '../../../../../models/enum/type-category';
import { PermissionService } from '../../../../../services/permission/permission.service';
import { PermissionUser } from '../../../../../models/permission/permission-user';
import { StatusEnum } from '../../../../../models/enum/status-enum';


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
  enabled = StatusEnum.ENABLED;
  disabled = StatusEnum.DISABLED;
  material!: ToolControlMaterial;
  category!: ToolControlCategory;
  listMat: ToolControlMaterial[] = [];
  listCat: ToolControlCategory[] = [];
  photoMat: string = "";

  visible: boolean = true;

  //Dialog
  editQuantityLoan = false;
  editQuantityKit = false;

  loan = typeMaterial.loan;
  kit = typeMaterial.kit;
  ambos = typeMaterial.ambos;

  formMat = new FormGroup({
    status: new FormControl<string>(this.enabled, Validators.required),
    type: new FormControl<string>(this.loan, Validators.required),
    numberCA: new FormControl<number | null>(null),
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
    private permissionService: PermissionService,
    private busyService: BusyService,
    private materialService: ToolControlMaterialService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private storageService: StorageService,
    private ngxImageCompressService: NgxImageCompressService,
    private categoryService: ToolControlCategoryService) { }

  ngOnInit(): void {
    //Inicia o loading
    this.busyService.busy();
    this.listAllCategory();
    this.listAllMaterial();
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
      //Fecha o loading
      this.busyService.idle();
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
      type: this.loan,
      numberCA: null
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

  async confirmEditQuant() {
    /* PERMISSION - 300 */
    /* PERMITIR ALTERAR A QUANTIDADE DE MATERIAIS */
    const permission = await this.searchPermission(300);
    if (!permission) { return; }

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
    this.category = this.listCat.find(cat => cat.id == this.material.categoryId);
    if (this.category.type == TypeCategory.EPI || this.category.type == TypeCategory.Uniforme) {
      this.visible = false;
    } else {
      this.visible = true;
    }

    this.formMat.patchValue({
      description: mat.description,
      status: mat.status,
      type: mat.type,
      numberCA: mat.numberCA != 0 ? mat.numberCA : null,
      categories: [this.getCategory(mat.categoryId)],
      validityDay: mat.validityDay != 0 ? mat.validityDay : null,
      quantityAccountingLoan: mat.quantityAccountingLoan,
      quantityAvailableLoan: mat.quantityAvailableLoan,
      quantityAccountingKit: mat.quantityAccountingKit,
      quantityAvailableKit: mat.quantityAvailableKit,
      photo: mat.photo
    });
    this.photoMat = mat.photo;
    this.disableQuantityAccountingLoan();
    this.disableQuantityAvailableLoan();
    this.editQuantityLoan = false;
    this.disableQuantityAccountingKit();
    this.disableQuantityAvailableKit();
    this.editQuantityKit = false;


  }
  async saveMaterial() {
    this.enableQuantityAccountingLoan();
    this.enableQuantityAvailableLoan();
    this.enableQuantityAccountingKit();
    this.enableQuantityAvailableKit();
    const { value, valid } = this.formMat;
    if (!valid) {
      this.disableQuantityAccountingLoan();
      this.disableQuantityAvailableLoan();
      this.editQuantityLoan = false;
      this.disableQuantityAccountingKit();
      this.disableQuantityAvailableKit();
      this.editQuantityKit = false;
      return;
    }

    if (this.material == null) {
      //Save
      this.material = new ToolControlMaterial();
      this.material.companyId = this.storageService.companyId;
      this.material.resaleId = this.storageService.resaleId;
      this.material.status = value.status;
      this.material.type = value.type;
      this.material.numberCA = value.numberCA ?? 0;
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
      } else {
        this.hideDialog();
        this.messageService.add({ severity: 'error', summary: 'Material', detail: 'Inválido', icon: 'pi pi-times' });
      }
    } else {
      //Update
      this.material.status = value.status;
      this.material.type = value.type;
      this.material.numberCA = value.numberCA ?? 0;
      this.material.description = value.description;
      this.material.categoryId = value.categories.at(0).id;
      this.material.validityDay = value.validityDay ?? 0;
      this.material.quantityAccountingLoan = value.quantityAccountingLoan ?? 0;
      this.material.quantityAvailableLoan = value.quantityAvailableLoan ?? 0;
      this.material.quantityAccountingKit = value.quantityAccountingKit ?? 0;
      this.material.quantityAvailableKit = value.quantityAvailableKit ?? 0;
      this.material.photo = value.photo;

      const resultSave = await this.updateMat(this.material);
      if (resultSave.status == 200 && resultSave.body.status == SuccessError.succes) {
        this.messageService.add({ severity: 'success', summary: resultSave.body.header, detail: resultSave.body.message, icon: 'pi pi-check' });
        this.material = resultSave.body.data;
        this.formMat.patchValue({
          quantityAccountingLoan: resultSave.body.data.quantityAccountingLoan,
          quantityAvailableLoan: resultSave.body.data.quantityAvailableLoan,
          quantityAccountingKit: resultSave.body.data.quantityAccountingKit,
          quantityAvailableKit: resultSave.body.data.quantityAvailableKit
        });
      } else if (resultSave.status == 200 && resultSave.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: resultSave.body.header, detail: resultSave.body.message, icon: 'pi pi-info-circle' });
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
  private async updateMat(mat: ToolControlMaterial): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.materialService.updateMat(mat));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: "Erro", detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async searchPermission(permission: number): Promise<boolean> {
    try {
      var result = await lastValueFrom(this.permissionService.filterUserPermission(this.storageService.companyId, this.storageService.resaleId, this.storageService.id, permission));
      if (result.status == 200 && result.body.status == SuccessError.succes) {
        return true;
      } else if (result.status == 200 && result.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
      }
      return false;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return false;
    }
  }

}
