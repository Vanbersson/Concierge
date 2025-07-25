import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormsModule, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
//PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
//Service
import { MechanicService } from '../../../../services/workshop/mechanic/mechanic.service';
import { ToolControlMaterialService } from '../../../../services/workshop/tool-control/tool-control-material.service';
import { ToolControlCategoryService } from '../../../../services/workshop/tool-control/tool-control-category.service';
//Class
import { Mechanic } from '../../../../models/workshop/mechanic/Mechanic';
import { ToolControlMaterial } from '../../../../models/workshop/toolcontrol/tool-control-material';
import { ToolControlCategory } from '../../../../models/workshop/toolcontrol/tool-control-category';
import { ToolControlMatMec } from '../../../../models/workshop/toolcontrol/tool-control-matmec';
import { StorageService } from '../../../../services/storage/storage.service';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ToolControlMatMecService } from '../../../../services/workshop/tool-control/tool-control-matmec.service';
import { ToolControlRequestService } from '../../../../services/workshop/tool-control/tool-control-request.service';
import { ToolControlRequest } from '../../../../models/workshop/toolcontrol/tool-control-request';
import { ToolcontrolReportService } from '../../../../services/workshop/tool-control/tool-control-report.service';
import { ToolControlReport } from '../../../../models/workshop/report/tool-control-report';
import { BusyService } from '../../../../components/loading/busy.service';

enum StatusRequest {
  PENDING = "Pending", COMPLETE = "Complete"
}
enum TypeMaterial {
  LOAN = "Loan", KIT = "Kit", AMBOS = "Ambos"
}
enum TypeCategory {
  FERRAMENTA = "Ferramenta", EPI = "EPI", UNIFORME = "Uniforme", OUTRO = "Outro"
}

class MatItem {
  requestStatus: string;
  requestTypeMaterial: string;
  requestUserId: number;
  requestId: number;
  requestInformation: string;
  requestDate: string;
  categoryId: number;
  categoryDesc: string;
  categoryType: string;
  matMecId: string;
  matMecQuantityReq: number;
  matMecMaterialId: number;
  matMecInformationRet: string;
  materialDesc: string;
  materialPhoto: string;
  mechanic: Mechanic;
}

@Component({
  selector: 'app-pegar-devolver',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, InputTextModule, InputNumberModule, MultiSelectModule,
    IconFieldModule, InputMaskModule, InputGroupModule, InputIconModule, DialogModule, ReactiveFormsModule, FormsModule, PasswordModule,
    ConfirmDialogModule, ToastModule, InputTextareaModule],
  templateUrl: './pegar-devolver.component.html',
  styleUrl: './pegar-devolver.component.scss',
  providers: [ConfirmationService, MessageService]
})
export default class PegarDevolverComponent implements OnInit {
  expandedRows = {};
  listfilterMec: ToolControlReport[] = [];
  selectedMaterials: MatItem[] = [];
  realPassword = '';
  //Dialog Pegar
  visibleDialogPegar = false;
  visibleDialogPegarInf = false;
  photoMec: string = "";
  quantityReqDefault = 1;
  quantitySelectDefaultMat = signal<number>(0);
  formCodePass = new FormGroup({
    maskedPassword: new FormControl<any>([''], Validators.required)
  });

  listMec: Mechanic[] = [];
  listCat: ToolControlCategory[] = [];
  private listMat: ToolControlMaterial[] = [];
  listMatTemp: ToolControlMaterial[] = [];
  listMatMec: ToolControlMatMec[] = [];
  //Dialog Devolver
  matereialReturned: boolean = false;
  visibleDialogDev = false;
  listReturnMaterial: MatItem[] = [];
  disabledSelectMat = false;
  listMechanicDev: Mechanic[] = [];
  photoMecDev: string = "";
  currentCodePassExpected: number;

  formPegar = new FormGroup({
    mechanic: new FormControl<Mechanic[] | null>([], Validators.required),
    material: new FormControl<ToolControlMaterial[] | null>([], Validators.required),
    categories: new FormControl<ToolControlCategory[] | null>([], Validators.required),
    inforReq: new FormControl<string>(""),
  });
  //Edit
  clonedMaterial: { [s: number]: ToolControlMaterial } = {};
  UNIFORME = TypeCategory.UNIFORME;

  constructor(
    private busyService: BusyService,
    private storageService: StorageService,
    private mechanicService: MechanicService,
    private categoryService: ToolControlCategoryService,
    private materialService: ToolControlMaterialService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private matMecService: ToolControlMatMecService,
    private requestService: ToolControlRequestService,
    private reportService: ToolcontrolReportService) { }

  ngOnInit(): void {
    //Inicia o loading
    this.busyService.busy();
    this.listMecEnabled();
    this.listCategory();
    this.listMaterial();
  }

  onInput(): void {
    const masked = this.formCodePass.get('maskedPassword')?.value;
    const realLength = this.realPassword.length;
    const maskedLength = masked.length;
    if (maskedLength < realLength) {
      // backspace ou remoção
      this.realPassword = this.realPassword.substring(0, maskedLength);
    } else {
      const newChar = masked.charAt(maskedLength - 1);
      this.realPassword += newChar;
    }
    // atualiza o campo com asteriscos
    this.formCodePass.get('maskedPassword')?.setValue('*'.repeat(this.realPassword.length), {
      emitEvent: false // evita loop de input
    });
  }
  private async filterMaterialMec() {
    for (let index = 0; index < this.listMec.length; index++) {
      const mechanic = this.listMec.at(index);
      this.reportService.filterMec(mechanic.id).subscribe(data => {
        //Adciona as informações do mecânico
        data.mechanic = mechanic;
        //Adiciona a lista de mecânico
        this.listfilterMec.push(data);
      });
    }
  }
  private listMecEnabled() {
    this.mechanicService.listAllEnabled().subscribe(data => {
      this.listMec = data;
      this.filterMaterialMec();
    });
  }
  private async listMaterial() {
    this.materialService.listAllEnabled().subscribe(data => {
      this.listMat = data;
      //Facha o loading
      this.busyService.idle();
    });
  }
  private listCategory() {
    this.categoryService.listAllEnabled().subscribe(data => {
      this.listCat = data;
    });
  }
  selectMechanic() {
    const { value } = this.formPegar;
    if (value.mechanic.length == 1 && this.photoMec == "") {
      this.photoMec = value.mechanic.at(0).photo;
    } else if (value.mechanic.length == 0 && this.photoMec != "") {
      this.photoMec = "";
      this.formPegar.patchValue({ categories: [], material: [] });
      this.listMatTemp = [];
    }
  }
  selectCategory() {
    const { value } = this.formPegar;
    if (value.categories.length == 1) {
      this.listMatTemp = [];
      //Quantidade de requisição padrão de categoria
      const quantityReq = value.categories.at(0).quantityReq;
      //Total permitido de seleção
      this.quantitySelectDefaultMat.set(quantityReq);
      //Habilitar a seleção de materiais
      this.disabledSelectMat = false;
      //limpa a lista temporaria
      this.listMatTemp = [];
      for (var mat of this.listMat) {
        if (value.categories.at(0).id == mat.categoryId && (mat.type == TypeMaterial.LOAN || mat.type == TypeMaterial.AMBOS) && mat.quantityAvailableLoan > 0) {
          //Quantidade padrão de requisição
          mat.quantityLoan = this.quantityReqDefault;
          //Adiciona o material
          this.listMatTemp.push(mat);
        }
      }

      if (value.categories.at(0).type == TypeCategory.FERRAMENTA || value.categories.at(0).type == TypeCategory.EPI) {
        // Filtra materiais que ainda não foram entregues ao mecânico selecionado
        const mecSelecionado = this.listfilterMec.find(m => m.mecId === value.mechanic.at(0).id);
        if (mecSelecionado) {
          this.listMatTemp = this.listMatTemp.filter(mat => {
            return !mecSelecionado.materials.some(mats => mats.matMecMaterialId === mat.id);
          });
          if (quantityReq > 0) {
            var qtdSelected = 0;
            for (var mat2 of mecSelecionado.materials) {
              if (mat2.categoryId == value.categories.at(0).id) {
                qtdSelected++;
              }
            }
            this.quantitySelectDefaultMat.set(this.quantitySelectDefaultMat() - qtdSelected);
            //Atingiu a quantidade máxima permitida da categoria
            //Desabilita a seleção de materiais
            if (qtdSelected >= quantityReq) {
              this.disabledSelectMat = true;
            }
          }
        }
      }

    } else {
      this.listMatTemp = [];
      this.formPegar.patchValue({ material: [] });
    }
  }
  selectMaterial() {
  }
  getMaterialPhoto(id: number): string {
    return this.listMat.find(material => material.id == id).photo;
  }
  cleanFormPegar() {
    this.formPegar.patchValue({
      mechanic: [],
      material: [],
      categories: [],
      inforReq: ""
    });
    this.photoMec = "";
  }
  showDialog() {
    this.cleanFormPegar();
    this.visibleDialogPegar = true;
  }
  hideDialog() {
    this.visibleDialogPegar = false;
  }
  showDialogInf() {
    this.visibleDialogPegarInf = true;
  }
  hideDialogInf() {
    this.visibleDialogPegarInf = false;
  }
  //Retorno de material
  showDialogDev() {
    this.visibleDialogDev = true;
  }
  hideDialogDev() {
    if (this.matereialReturned) {
      //Inicia o loading
      this.busyService.busy();
      this.selectedMaterials = [];
      this.listMec = [];
      this.listfilterMec = [];
      this.listMecEnabled();
      this.listMaterial();
      this.matereialReturned = false;
    }
    this.visibleDialogDev = false;
  }
  async returnMaterial() {
    //Vefica se a material selecionado
    if (this.selectedMaterials.length <= 0) {
      return;
    }
    this.listReturnMaterial = [];
    this.listMechanicDev = [];

    for (let index = 0; index < this.selectedMaterials.length; index++) {
      const element = this.selectedMaterials[index];
      const mecSelecionado = this.listfilterMec.filter(mec => {
        return mec.materials.find(mat => mat.requestId === element.requestId);
      });
      var item: MatItem = new MatItem();
      item.mechanic = new Mechanic();
      item.mechanic.id = mecSelecionado.at(0).mechanic.id;
      item.mechanic.name = mecSelecionado.at(0).mechanic.name;
      item.mechanic.photo = mecSelecionado.at(0).mechanic.photo;

      item.requestId = element.requestId;

      item.matMecId = element.matMecId;
      item.matMecMaterialId = element.matMecMaterialId;
      item.matMecQuantityReq = element.matMecQuantityReq;

      item.materialDesc = element.materialDesc;
      item.materialPhoto = this.getMaterialPhoto(element.matMecMaterialId)
      item.categoryId = element.categoryId;
      item.categoryDesc = element.categoryDesc;
      item.categoryType = this.listCat.find(cat => cat.id == element.categoryId).type;
      //Adiciona a lista de devolução
      this.listReturnMaterial.push(item);
      //Lista de mecânicos que estão devolvendo os materiais
      const mecFind = this.listMechanicDev.find(mec => mec.id === mecSelecionado.at(0).mechanic.id);
      if (!mecFind) {
        this.listMechanicDev.push(mecSelecionado.at(0).mechanic);
      }
    }
    this.showDialogDev();
  }
  async confirmReturnMaterial() {
    var errorMaterial: MatItem[] = [];
    var errorMec: Mechanic[] = [];
    for (var mec of this.listMechanicDev) {
      //Chama o confirma o código do mecânico
      const resultConfirm = await this.confirmCodePass(mec.name, mec.photo, mec.codePassword);
      //Materiais do mecânico
      const materialsMec = this.listReturnMaterial.filter(mechanic => mechanic.mechanic.id == mec.id);
      if (resultConfirm) {
        //Savar a devolução dos materiais
        for (var i = 0; i < materialsMec.length; i++) {
          const item = materialsMec[i];
          //Informações obrigatoria para EPI
          if (item.matMecInformationRet == null && item.categoryType == TypeCategory.EPI) {
            this.messageService.add({ severity: 'info', summary: 'EPI', detail: 'Informação não adicionada', icon: 'pi pi-info-circle' });
            return;
          } else if (item.matMecInformationRet == "" && item.categoryType == TypeCategory.EPI) {
            this.messageService.add({ severity: 'info', summary: 'EPI', detail: 'Informação não adicionada', icon: 'pi pi-info-circle' });
            return;
          }

          var matmec: ToolControlMatMec = new ToolControlMatMec();
          matmec.companyId = mec.companyId;
          matmec.resaleId = mec.resaleId;
          matmec.id = item.matMecId;
          matmec.requestId = item.requestId;
          matmec.quantityReq = item.matMecQuantityReq;
          matmec.quantityRet = item.matMecQuantityReq;
          matmec.dateRet = this.formatDateTime(new Date());
          matmec.userIdRet = this.storageService.id;
          matmec.informationRet = item.matMecInformationRet;
          matmec.materialId = item.matMecMaterialId;
          //Save
          const resultUpdateMat = await this.updateMatMec(matmec);
          if (resultUpdateMat.status == 200) {
            //Remove o material salvo
            this.listReturnMaterial = this.listReturnMaterial.filter(material => material.matMecId != matmec.id);
            this.matereialReturned = true;
          }
          //Último
          if (i == (materialsMec.length - 1)) {
            //Remove o mecânico
            this.listMechanicDev = this.listMechanicDev.filter(mechanic => mechanic.id != mec.id);
            this.messageService.add({ severity: 'success', summary: 'Materiais', detail: 'Devolução realizada com sucesso', icon: 'pi pi-check' });
          }
        }
      } else {
        errorMec = this.listMechanicDev;
        errorMaterial = materialsMec;
      }
    }

    if (errorMec.length == 0) {
      this.hideDialogDev();
    }
  }
  async confirmCodePass(name: string, photo: string, code: number): Promise<boolean> {
    //Foto do mecânico
    this.photoMecDev = photo;
    //Código atual
    this.currentCodePassExpected = code;
    //Limpa campo da senha
    this.cleanFormCodePass();
    //Aguarda a confirmação
    return new Promise<boolean>((resolve) => {
      this.confirmationService.confirm({
        key: 'confimMecCodePass',
        header: 'Colaborador',
        message: name,
        acceptLabel: 'Comfirmar',
        accept: () => {
          setTimeout(() => resolve(true), 300);
        },
        reject: () => {
          resolve(false);
        }
      });
    });
  }
  onConfirmCodePass(dv: ConfirmDialog) {
    if (Number.parseInt(this.realPassword) == this.currentCodePassExpected) {
      //Limpa código
      this.cleanFormCodePass();
      this.currentCodePassExpected = 0;
      dv.accept(); // Vai cair na lógica do `accept` da Promise
    } else {
      this.messageService.add({ severity: 'error', summary: 'Senha', detail: 'Senha incorreta', icon: 'pi pi-times', life: 3000 });
    }
  }
  onRowCollapse(event: TableRowCollapseEvent) {
    //this.messageService.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
  }
  onRowExpand(event: TableRowExpandEvent) {
    // this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
  }
  formatDateTime(date: Date): string {
    const datePipe = new DatePipe('en-US');

    // Obtém o fuso horário local no formato ±hh:mm
    const tzOffset = -date.getTimezoneOffset();
    const sign = tzOffset >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
    const minutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
    const timezone = `${sign}${hours}:${minutes}`;

    // Formata a data e adiciona o fuso horário
    return datePipe.transform(date, "yyyy-MM-dd'T'HH:mm:ss.SSS") + timezone;
  }
  cleanFormCodePass() {
    this.formCodePass.patchValue({ maskedPassword: "" });
    this.realPassword = "";
  }
  confirm() {
    //Limpa campo da senha
    this.cleanFormCodePass();
    //Aguarda a confirmação
    this.confirmationService.confirm({
      header: 'Senha Colaborador',
      message: 'Por favor digite sua senha.',
      acceptLabel: 'Comfirmar',
      accept: () => {
        this.validMechanicCodePass();
      },
      reject: () => {
      }
    });
  }
  private async validMechanicCodePass() {
    const { value } = this.formPegar;

    if (Number.parseInt(this.realPassword) != value.mechanic.at(0).codePassword) {
      this.messageService.add({ severity: 'error', summary: 'Senha', detail: "Senha incoreta.", icon: 'pi pi-times', life: 3000 });
      return;
    }
    //Inicia o loading
    this.busyService.busy();
    this.save();
  }
  private async save() {
    const { value } = this.formPegar;

    var req: ToolControlRequest = new ToolControlRequest();
    req.companyId = this.storageService.companyId;
    req.resaleId = this.storageService.resaleId;
    req.status = StatusRequest.PENDING;
    req.typeMaterial = TypeMaterial.LOAN;
    req.userIdReq = this.storageService.id;
    req.dateReq = this.formatDateTime(new Date());
    req.informationReq = value.inforReq;
    req.mechanicId = value.mechanic.at(0).id;
    const resultReq = await this.loanRequest(req);

    if (resultReq.status == 201) {
      req.id = resultReq.body.id;
      this.messageService.add({ severity: 'success', summary: 'Requisição', detail: 'Aberta com sucesso', icon: 'pi pi-check' });
    } else {
      return;
    }

    for (var item of value.material) {
      var matMec: ToolControlMatMec = new ToolControlMatMec();
      matMec.companyId = this.storageService.companyId;
      matMec.resaleId = this.storageService.resaleId;
      matMec.requestId = req.id;
      matMec.quantityReq = item.quantityLoan;
      matMec.materialId = item.id;
      const resultMatMec = await this.saveMatMec(matMec);

      if (resultMatMec.status == 201) {
        this.messageService.add({ severity: 'success', summary: 'Material', detail: item.description + ' salvo com sucesso', icon: 'pi pi-check' });
      }
    }
    this.hideDialog();
    this.listMec = [];
    this.listfilterMec = [];
    this.listMecEnabled();
    this.listMaterial();
  }
  private async loanRequest(req: ToolControlRequest): Promise<HttpResponse<ToolControlRequest>> {
    try {
      return await lastValueFrom(this.requestService.loanRequest(req));
    } catch (error) {
      return error;
    }
  }
  private async saveMatMec(matMec: ToolControlMatMec): Promise<HttpResponse<ToolControlMatMec>> {
    try {
      return await lastValueFrom(this.matMecService.save(matMec));
    } catch (error) {
      return error;
    }
  }
  private async updateMatMec(matMec: ToolControlMatMec): Promise<HttpResponse<ToolControlMatMec>> {
    try {
      return await lastValueFrom(this.matMecService.update(matMec));
    } catch (error) {
      return error;
    }
  }
  //Editar quantidade de material no empréstimo
  onRowEditInit(mat: ToolControlMaterial) {
    this.clonedMaterial[mat.id as number] = { ...mat };
  }
  onRowEditSave(mat: ToolControlMaterial) {
    delete this.clonedMaterial[mat.id as number];
    this.messageService.add({ severity: 'success', summary: 'Quantidade', detail: 'Alterada com sucesso.' });
  }
  onRowEditCancel(mat: ToolControlMaterial, index: number) {
    this.clonedMaterial[mat.id as number];
    delete this.clonedMaterial[mat.id as number];
  }

}
