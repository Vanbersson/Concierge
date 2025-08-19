import { Component, OnInit, signal, ViewChild } from '@angular/core';
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
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';

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
import { PrintEpiComponent } from '../../../../components/print.epi/print.epi.component';

enum StatusRequest {
  OPEN = "Open", DELIVERY = "Delivered", COMPLETE = "Complete"
}
enum TypeRequest {
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
  matMecDelivUserId: number;
  matMecDelivUserName: string;
  matMecDelivDate: string;
  matMecDelivQuantity: number;
  matMecDelivInfor: string;
  matMecReturUserId: number;
  matMecReturUserName: string;
  matMecReturDate: string;
  matMecReturQuantity: number;
  matMecReturInfor: string;
  matMecMaterialId: number;
  matMecMaterialDesc: string;
  matMecMaterialNumberCA: number;
  materialPhoto: string;
  mechanic: Mechanic;
}

@Component({
  selector: 'app-pegar-devolver',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, InputTextModule, InputNumberModule, MultiSelectModule, DividerModule, CheckboxModule,
    IconFieldModule, InputMaskModule, InputGroupModule, InputIconModule, DialogModule, ReactiveFormsModule, FormsModule, PasswordModule, RadioButtonModule,
    ConfirmDialogModule, ToastModule, InputTextareaModule, CalendarModule, PrintEpiComponent],
  templateUrl: './pegar-devolver.component.html',
  styleUrl: './pegar-devolver.component.scss',
  providers: [ConfirmationService, MessageService]
})
export default class PegarDevolverComponent implements OnInit {
  expandedRows = {};
  listfilterMec: ToolControlReport[] = [];
  selectedMaterials: MatItem[] = [];
  currentCodePassReal = '';
  currentCodePassExpected: number;
  request: ToolControlRequest;
  isDeliveryMaterial: boolean = false;
  //Dialog Requisição de mateiais
  listRequest: ToolControlRequest[] = [];
  visibleDialogPegar = false;
  photoMec: string = "";
  quantityReqDefault = 1;
  quantitySelectDefaultMat = signal<number>(0);
  tempListMarSelected: ToolControlMaterial[] = [];
  formCodePass = new FormGroup({
    maskedPassword: new FormControl<any>([''], Validators.required)
  });
  formPegar = new FormGroup({
    requestComplete: new FormControl<string>({ value: '', disabled: true }),
    request: new FormControl<ToolControlRequest[]>([]),
    mechanic: new FormControl<Mechanic[] | null>([], Validators.required),
    material: new FormControl<ToolControlMaterial[] | null>([], Validators.required),
    categories: new FormControl<ToolControlCategory[] | null>([], Validators.required),
    inforReq: new FormControl<string>(""),
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
  //Edit
  clonedMaterial: { [s: number]: ToolControlMaterial } = {};
  UNIFORME: string = TypeCategory.UNIFORME;
  EPI: string = TypeCategory.EPI;
  FERRAMENTA: string = TypeCategory.FERRAMENTA;
  OUTRO = TypeCategory.OUTRO;
  selectTypeCategory: string = "";
  //Dialog request
  listRequestPendent: ToolControlRequest[] = [];
  visibleDialogRequest = false;
  formRequest = new FormGroup({
    mechanic: new FormControl<Mechanic[] | null>([], Validators.required),
    type: new FormControl<string>(TypeCategory.OUTRO, Validators.required),
    inforReq: new FormControl<string>("", Validators.required),
  });

  //Detalhe requisição
  visibleDialogDetailsRequest = false;
  listMaterialDetailsRequest: ToolControlMatMec[] = [];
  formDetailsRequest = new FormGroup({
    requestId: new FormControl<number | null>(null),
    requestStatus: new FormControl<string>(""),
    requestType: new FormControl<string>(""),
    requestDate: new FormControl<string | Date>(""),
    requestInformation: new FormControl<string>(""),
    requestUserId: new FormControl<number | null>(null),
    requestUserName: new FormControl<string>(""),
    requestCategoryType: new FormControl<string>(""),
    requestMechanicName: new FormControl<string>(""),
  });

  @ViewChild('printEPIComponent') printEPIComponent!: PrintEpiComponent;

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
    private reportService: ToolcontrolReportService) {
  }
  ngOnInit(): void {
    this.init();
  }
  onInput(): void {
    const masked = this.formCodePass.get('maskedPassword')?.value;
    const realLength = this.currentCodePassReal.length;
    const maskedLength = masked.length;
    if (maskedLength < realLength) {
      // backspace ou remoção
      this.currentCodePassReal = this.currentCodePassReal.substring(0, maskedLength);
    } else {
      const newChar = masked.charAt(maskedLength - 1);
      this.currentCodePassReal += newChar;
    }
    // atualiza o campo com asteriscos
    this.formCodePass.get('maskedPassword')?.setValue('*'.repeat(this.currentCodePassReal.length), {
      emitEvent: false // evita loop de input
    });
  }
  private async init() {
    //Inicia o loading
    this.busyService.busy();
    const resultCat = await this.listCategory();
    this.listCat = resultCat;
    const resultMat = await this.listMaterialEnabled();
    this.listMat = resultMat;
    const resultMec = await this.listMecEnabled();
    this.listMec = resultMec;
    this.filterMaterialMec();
    //Facha o loading
    this.busyService.idle();
  }
  //Request
  private async saveNewRequest(req: ToolControlRequest): Promise<HttpResponse<ToolControlRequest>> {
    try {
      return await lastValueFrom(this.requestService.newRequest(req));
    } catch (error) {
      return error;
    }
  }
  private async updateRequest(req: ToolControlRequest): Promise<HttpResponse<ToolControlRequest>> {
    try {
      return await lastValueFrom(this.requestService.updateRequest(req));
    } catch (error) {
      return error;
    }
  }
  private async filterRequestId(id: number): Promise<HttpResponse<ToolControlRequest>> {
    try {
      return await lastValueFrom(this.requestService.filterRequestId(id));
    } catch (error) {
      return error;
    }
  }
  private async listRequestStatus(status: string): Promise<ToolControlRequest[]> {
    try {
      return await lastValueFrom(this.requestService.listRequestStatus(status));
    } catch (error) {
      return [];
    }
  }
  selectRequest() {
    if (this.formPegar.get('request').value.length >= 1) {
      this.request = this.formPegar.get('request').value.at(0);
      this.formPegar.get("requestComplete").enable();
    } else {
      this.request = null;
      this.formPegar.get("requestComplete").setValue('');
      this.formPegar.get("requestComplete").disable();
    }

    console.log(this.formPegar.get("requestComplete").value)
  }
  //Material
  private async listMaterialEnabled(): Promise<ToolControlMaterial[]> {
    try {
      return await lastValueFrom(this.materialService.listAllEnabled());
    } catch (error) {
      return [];
    }
  }
  selectMaterial() {
    this.tempListMarSelected = this.formPegar.get('material').value;
  }
  getMaterialPhoto(id: number): string {
    return this.listMat.find(material => material.id == id).photo;
  }
  //Categoria
  private async listCategory(): Promise<ToolControlCategory[]> {
    try {
      return await lastValueFrom(this.categoryService.listAllEnabled());
    } catch (error) {
      return [];
    }
  }
  selectCategory() {
    const { value } = this.formPegar;
    if (value.categories.length == 1) {
      //Tipo de categoria
      this.selectTypeCategory = value.categories.at(0).type;
      //Quantidade de requisição padrão de categoria
      const quantityReq = value.categories.at(0).quantityReq;
      //Total permitido de seleção
      this.quantitySelectDefaultMat.set(quantityReq);
      //Habilitar a seleção de materiais
      this.disabledSelectMat = false;
      //limpa a lista temporaria
      this.listMatTemp = [];
      this.tempListMarSelected = [];
      for (var mat of this.listMat) {
        if (value.categories.at(0).id == mat.categoryId && (mat.type == TypeRequest.LOAN || mat.type == TypeRequest.AMBOS) && mat.quantityAvailableLoan > 0) {
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
      this.selectTypeCategory = "";
      this.listMatTemp = [];
      this.tempListMarSelected = [];
      this.formPegar.get('material').setValue([]);
    }
  }
  getCategoryDesc(id: number): string {
    return this.listCat.find(cat => cat.id == id).description;
  }
  getCategory(id: number): ToolControlCategory {
    return this.listCat.find(cat => cat.id == id);
  }
  //Mecânicos
  private async listMecEnabled(): Promise<Mechanic[]> {
    try {
      return await lastValueFrom(this.mechanicService.listAllEnabled());
    } catch (error) {
      return [];
    }
  }
  async selectMechanic() {
    const { value } = this.formPegar;
    if (value.mechanic.length == 1) {
      this.photoMec = value.mechanic.at(0).photo;
      this.listRequest = await this.listRequestMechanic(value.mechanic.at(0).id);
    } else {
      this.photoMec = "";
      this.formPegar.patchValue({ categories: [], material: [] });
      this.listMatTemp = [];
      this.tempListMarSelected = [];
    }
  }
  getMechanicName(id: number): string {
    return this.listMec.find(mec => mec.id == id).name;
  }
  onConfirmCodePassMechanic(dv: ConfirmDialog) {
    if (Number.parseInt(this.currentCodePassReal) == this.currentCodePassExpected) {
      //Limpa código
      this.cleanFormCodePass();
      this.currentCodePassExpected = 0;
      dv.accept(); // Vai cair na lógica do `accept` da Promise
    } else {
      this.messageService.add({ severity: 'error', summary: 'Senha', detail: 'Senha incorreta', icon: 'pi pi-times', life: 3000 });
    }
  }
  async confirmCodePassMechanic(name: string, photo: string, code: number): Promise<boolean> {
    //Foto do mecânico
    this.photoMec = photo;
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
  private cleanFormCodePass() {
    this.formCodePass.patchValue({ maskedPassword: "" });
    this.currentCodePassReal = "";
  }
  //MatMec
  private async filterMatMecRequesId(requestId: number): Promise<ToolControlMatMec[]> {
    try {
      return await lastValueFrom(this.matMecService.filterRequesId(requestId));
    } catch (error) {
      return [];
    }
  }

  //
  private async filterMaterialMec() {
    for (let index = 0; index < this.listMec.length; index++) {
      const mechanic = this.listMec.at(index);

      var resultMec = await this.filterMec(mechanic.id);
      if (resultMec.status == 200) {
        //Adciona as informações do mecânico
        resultMec.body.mechanic = mechanic;
        //Adiciona a lista de mecânico
        this.listfilterMec.push(resultMec.body);
      }
    }
  }
  private async filterMec(id: number): Promise<HttpResponse<ToolControlReport>> {
    try {
      return await lastValueFrom(this.reportService.filterMec(id));
    } catch (error) {
      return error;
    }
  }

  private async listRequestMechanic(id: number): Promise<ToolControlRequest[]> {
    try {
      return await lastValueFrom(this.requestService.filterMechanicId(id));
    } catch (error) {
      return [];
    }
  }
  cleanFormPegar() {
    this.formPegar.patchValue({
      requestComplete: '',
      request: [],
      mechanic: [],
      material: [],
      categories: [],
      inforReq: ""
    });
    this.photoMec = "";
    this.formPegar.get("requestComplete").disable();
    this.tempListMarSelected = [];
    this.request = null;
    this.listRequest = [];
  }
  //Nova solicitação
  public showDialogReq() {
    this.cleanFormRequest();
    this.listRequestPend();
    this.visibleDialogRequest = true;
  }
  private async listRequestPend() {
    this.listRequestPendent = await this.listRequestStatus(StatusRequest.OPEN);
    const resultDeli = await this.listRequestStatus(StatusRequest.DELIVERY);
    resultDeli.map(d => {
      this.listRequestPendent.push(d);
    });
  }
  hideDialogReq() {
    this.visibleDialogRequest = false;
  }
  private cleanFormRequest() {
    this.formRequest.patchValue({
      mechanic: [],
      type: TypeCategory.OUTRO,
      inforReq: ""
    });
  }
  async newRequest() {
    const { value } = this.formRequest;
    var req: ToolControlRequest = new ToolControlRequest();
    req.companyId = this.storageService.companyId;
    req.resaleId = this.storageService.resaleId;
    req.status = StatusRequest.OPEN;
    req.requestType = TypeRequest.LOAN;
    req.requestDate = this.formatDateTime(new Date());
    req.requestInformation = value.inforReq;
    req.requestUserId = this.storageService.id;
    req.requestUserName = this.storageService.name;
    req.categoryType = value.type;
    req.mechanicId = value.mechanic.at(0).id;
    const resultReq = await this.saveNewRequest(req);
    if (resultReq.status == 201) {
      this.messageService.add({ severity: 'success', summary: 'Requisição', detail: 'Aberta com sucesso', icon: 'pi pi-check' });
      this.listRequestPend();
    }
  }
  async completeRequest(req: ToolControlRequest) {
    req.status = StatusRequest.COMPLETE;
    const resultUpdate = await this.updateRequest(req);
    if (resultUpdate.status == 200) {
      this.messageService.add({ severity: 'success', summary: 'Solicitação', detail: 'Encerrada com sucesso', icon: 'pi pi-check' });
      this.listRequestPend();
    }
  }
  //Retorno de material
  showDialogDev() {
    this.visibleDialogDev = true;
  }
  async hideDialogDev() {
    if (this.matereialReturned) {
      //Inicia o loading
      this.busyService.busy();
      this.matereialReturned = false;
      this.selectedMaterials = [];
      this.listMec = [];
      this.listfilterMec = [];
      const resultMec = await this.listMecEnabled();
      this.listMec = resultMec;
      this.filterMaterialMec();
      //Fecha o loading
      this.busyService.idle();
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
      item.matMecDelivQuantity = element.matMecDelivQuantity;
      item.matMecMaterialDesc = element.matMecMaterialDesc;
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
      const resultConfirm = await this.confirmCodePassMechanic(mec.name, mec.photo, mec.codePassword);
      //Materiais do mecânico
      const materialsMec = this.listReturnMaterial.filter(mechanic => mechanic.mechanic.id == mec.id);
      if (resultConfirm) {
        //Savar a devolução dos materiais
        for (var i = 0; i < materialsMec.length; i++) {
          const item = materialsMec[i];
          //Informações obrigatoria para EPI
          if (item.matMecReturInfor == null && item.categoryType == TypeCategory.EPI) {
            this.messageService.add({ severity: 'info', summary: 'EPI', detail: 'Informação não adicionada', icon: 'pi pi-info-circle' });
            return;
          } else if (item.matMecReturInfor == "" && item.categoryType == TypeCategory.EPI) {
            this.messageService.add({ severity: 'info', summary: 'EPI', detail: 'Informação não adicionada', icon: 'pi pi-info-circle' });
            return;
          }
          const resultMatMec = await this.filterMatMecId(item.matMecId);
          if (resultMatMec.status != 200) {
            return;
          }
          var matmec: ToolControlMatMec = resultMatMec.body;
          matmec.returnUserId = this.storageService.id;
          matmec.returnUserName = this.storageService.name;
          matmec.returnDate = this.formatDateTime(new Date());
          matmec.returnQuantity = item.matMecDelivQuantity;
          matmec.returnInformation = item.matMecReturInfor;
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
  //
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
  //Entrega de Material
  showDialogDeliveryMat() {
    this.cleanFormPegar();
    this.visibleDialogPegar = true;
  }
  async hideDialogDeliveryMat() {
    this.visibleDialogPegar = false;
    //Verifica se teve maerial salvo e alterar o status da solicitação
    if (this.isDeliveryMaterial) {
      //Inicia o loading
      this.busyService.busy();
      this.isDeliveryMaterial = false;
      //lista mecânicos
      this.listfilterMec = [];
      await this.filterMaterialMec();
      this.request = null;
      //Facha o loading
      this.busyService.idle();
    }
  }
  async confirmDeliveryMaterial() {
    const { value } = this.formPegar;
    const result = await this.confirmCodePassMechanic(value.mechanic.at(0).name, value.mechanic.at(0).photo, value.mechanic.at(0).codePassword);
    if (result)
      this.save();
  }
  private async save() {
    const { value } = this.formPegar;
    //nova solicitação
    if (this.request == null) {
      this.request = new ToolControlRequest();
      this.request.companyId = this.storageService.companyId;
      this.request.resaleId = this.storageService.resaleId;
      this.request.status = StatusRequest.OPEN;
      this.request.requestType = TypeRequest.LOAN;
      this.request.requestDate = this.formatDateTime(new Date());
      this.request.requestInformation = value.inforReq;
      this.request.requestUserId = this.storageService.id;
      this.request.requestUserName = this.storageService.name;
      this.request.categoryType = value.categories.at(0).type;
      this.request.mechanicId = value.mechanic.at(0).id;
      const resultReq = await this.saveNewRequest(this.request);
      if (resultReq.status == 201) {
        this.request.id = resultReq.body.id;
        this.messageService.add({ severity: 'success', summary: 'Requisição', detail: 'Aberta com sucesso', icon: 'pi pi-check' });
      } else {
        return;
      }
    }
    //Salvar materiais
    for (var index = 0; index < this.tempListMarSelected.length; index++) {
      var item = this.tempListMarSelected[index];
      var matMec: ToolControlMatMec = new ToolControlMatMec();
      matMec.companyId = this.storageService.companyId;
      matMec.resaleId = this.storageService.resaleId;
      matMec.requestId = this.request.id;
      matMec.deliveryUserId = this.storageService.id;
      matMec.deliveryUserName = this.storageService.name;
      matMec.deliveryDate = this.formatDateTime(new Date());
      matMec.deliveryQuantity = item.quantityLoan;
      matMec.deliveryInformation = item.informationLoan;
      matMec.materialId = item.id;
      matMec.materialDescription = item.description;
      matMec.materialNumberCA = item.numberCA ?? 0;
      if (matMec.materialNumberCA == 0 && value.categories.at(0).type == TypeCategory.EPI) {
        this.messageService.add({ severity: 'info', summary: 'EPI', detail: 'C.A. não adicionado', icon: 'pi pi-info-circle' });
        return;
      }
      const resultMatMec = await this.saveMatMec(matMec);
      if (resultMatMec.status == 201) {
        this.isDeliveryMaterial = true;
        this.messageService.add({ severity: 'success', summary: 'Material', detail: item.description + ' salvo com sucesso', icon: 'pi pi-check' });
        //Remover os materiais salvo
        this.tempListMarSelected = this.tempListMarSelected.filter(mat => mat.id != matMec.materialId);
        this.formPegar.patchValue({ material: this.tempListMarSelected });
        index--;
      }
    }


    if (this.isDeliveryMaterial) {
      //Atualiza status
      this.request.status = StatusRequest.DELIVERY;
      const resultStatus = await this.updateRequest(this.request);
      if (resultStatus.status == 200) {
        this.messageService.add({ severity: 'success', summary: 'Solicitação', detail: 'Atualizada com sucesso', icon: 'pi pi-check' });
      }
    }

    if (this.tempListMarSelected.length == 0) {
      if (this.formPegar.get('requestComplete').value == "") {
        this.request.status = StatusRequest.COMPLETE;
        const resultStatus = await this.updateRequest(this.request);
        if (resultStatus.status == 200) {
          this.messageService.add({ severity: 'success', summary: 'Solicitação', detail: 'Atualizada com sucesso', icon: 'pi pi-check' });
        }
      }
      this.hideDialogDeliveryMat();
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
  private async filterMatMecId(id: string): Promise<HttpResponse<ToolControlMatMec>> {
    try {
      return await lastValueFrom(this.matMecService.filterId(id));
    } catch (error) {
      return error;
    }
  }
  //Editar quantidade de material no empréstimo
  onRowEditInit(mat: ToolControlMaterial) {
    this.clonedMaterial[mat.id as number] = { ...mat };
  }
  onRowEditSave(mat: ToolControlMaterial, index: number) {
    const category = this.getCategory(mat.categoryId);
    //Verifica se o EPI tem C.A informado caso não cancelar
    if (category.type == TypeCategory.EPI) {
      if (mat.numberCA == null || mat.numberCA == 0) {
        this.tempListMarSelected[index] = this.clonedMaterial[mat.id as number];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Número do C.A obrigatório.' });
        return;
      } else {
        delete this.clonedMaterial[mat.id as number];
        this.messageService.add({ severity: 'success', summary: 'C.A', detail: 'Alterado com sucesso.' });
      }
    }

    if (category.type == TypeCategory.UNIFORME) {
      if (mat.quantityLoan <= 0) {
        this.tempListMarSelected[index] = this.clonedMaterial[mat.id as number];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Quantidade inválida.' });
      } else {
        delete this.clonedMaterial[mat.id as number];
        this.messageService.add({ severity: 'success', summary: 'Quantidade', detail: 'Alterada com sucesso.' });
      }
    }
  }
  onRowEditCancel(mat: ToolControlMaterial, index: number) {
    this.tempListMarSelected[index] = this.clonedMaterial[mat.id as number];
    delete this.clonedMaterial[mat.id as number];
  }
  //Detalhe requisição
  async showDialogDetails(requesId: number) {

    //Inicia o loading
    this.busyService.busy();
    const resultRequest = await this.filterRequestId(requesId);
    const resultMatMec = await this.filterMatMecRequesId(requesId);
    if (resultRequest.status == 200) {
      this.formDetailsRequest.patchValue({
        requestId: requesId,
        requestStatus: resultRequest.body.status == StatusRequest.DELIVERY ? "Entregue" : "Encerrado",
        requestType: "Empréstimo",
        requestDate: new Date(resultRequest.body.requestDate),
        requestUserId: resultRequest.body.requestUserId,
        requestUserName: resultRequest.body.requestUserName,
        requestInformation: resultRequest.body.requestInformation,
        requestMechanicName: this.getMechanicName(resultRequest.body.mechanicId)
      });

      this.listMaterialDetailsRequest = resultMatMec;

      this.visibleDialogDetailsRequest = true;
    }

    this.busyService.idle();
  }
  hideDialogDetails() {
    this.visibleDialogDetailsRequest = false;
  }

  //print EPI

  printEPI() {


    var listPrint: ToolControlMatMec[] = [];
    const req: ToolControlRequest = new ToolControlRequest();

    for (var item of this.listMaterialDetailsRequest) {
      const catId = this.listMat.find(mat => mat.id == item.materialId).categoryId;
      const catType = this.listCat.find(cat => cat.id == catId).type;

      if (catType == TypeCategory.EPI) {
        listPrint.push(item);
      }
    }



    this.printEPIComponent.print(req, listPrint);
  }

}
