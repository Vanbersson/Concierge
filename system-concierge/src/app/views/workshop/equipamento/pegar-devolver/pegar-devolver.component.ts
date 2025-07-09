import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormsModule, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
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
enum StatusRequest {
  PENDING = "Pending", COMPLETE = "Complete"
}

class MatMec {
  mecName: string = "";
  mecPhoto: string = "";
  requestId?: number = 0;
  requestDateReq?: string = "";
  matMecId?: string = "";
  categoryId?: number = 0;
  categoryDesc?: string = "";
  materialId?: number = 0;
  materialDesc?: string = "";
  materialPhoto?: string = "";
  materialQuantReq?: number = 0;
  materialInfReq?: string = "";
}


@Component({
  selector: 'app-pegar-devolver',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, InputTextModule, InputNumberModule, MultiSelectModule,
    IconFieldModule, InputMaskModule, InputGroupModule, InputIconModule, DialogModule, ReactiveFormsModule, FormsModule,
    ConfirmDialogModule, ToastModule, InputTextareaModule],
  templateUrl: './pegar-devolver.component.html',
  styleUrl: './pegar-devolver.component.scss',
  providers: [ConfirmationService, MessageService]
})
export default class PegarDevolverComponent implements OnInit {

  expandedRows = {};
  listfilterMec: ToolControlReport[] = [];
  selectedMaterials: MatMec[] = [];

  //Dialog Pegar
  visibleDialogPegar = false;
  visibleDialogPegarInf = false;
  photoMec: string = "";
  quantityReqDefault = 1;
  codePass: number | null = null;

  listMec: Mechanic[] = [];
  listCat: ToolControlCategory[] = [];

  private listMat: ToolControlMaterial[] = [];
  listMatTemp: ToolControlMaterial[] = [];
  listMatMec: ToolControlMatMec[] = [];

  //Dialog Devolver
  visibleDialogDev = false;
  listDev: MatMec[] = [];

  formPegar = new FormGroup({
    mechanic: new FormControl<Mechanic[] | null>([], Validators.required),
    material: new FormControl<ToolControlMaterial[] | null>([], Validators.required),
    categories: new FormControl<ToolControlCategory[] | null>([], Validators.required),
    inforReq: new FormControl<string>(""),
  });
  constructor(
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
    this.listMecEnabled();
    this.listCategory();
    this.listMaterial();
  }
  private async filterMaterialMec() {
    for (var mec of this.listMec) {
      this.reportService.filterMec(mec.id).subscribe(data => {
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

      this.listMatTemp = [];
      for (var mat of this.listMat) {
        if (value.categories.at(0).id == mat.categoryId && (mat.type == "Loan" || mat.type == "Ambos")) {
          this.listMatTemp.push(mat);
        }
      }

      // Filtra materiais que ainda não foram entregues ao mecânico selecionado
      const mecSelecionado = this.listfilterMec.find(m => m.mecId === value.mechanic.at(0).id);

      if (mecSelecionado) {

        this.listMatTemp = this.listMatTemp.filter(mat => {
          return !mecSelecionado.materials.some(mats => mats.materialId === mat.id);
        });

      }

    } else {
      this.listMatTemp = [];
      this.formPegar.patchValue({ material: [] });
    }
  }
  selectMaterial() {

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

  showDialogDev() {
    //this.cleanFormPegar();
    this.visibleDialogDev = true;
  }
  hideDialogDev() {
    this.visibleDialogDev = false;
  }

  async listReq() {

this.listDev = [];

    for (let index = 0; index < this.selectedMaterials.length; index++) {
      const element = this.selectedMaterials[index];
      const resultFilter = await this.filterRequest(element.requestId);

      var matMec: MatMec = new MatMec();
      matMec.mecName = resultFilter['mecName'].toString();
      matMec.mecPhoto = resultFilter['mecPhoto'].toString();
      matMec.requestId = element.requestId;
      matMec.materialPhoto = element.materialPhoto;
      matMec.materialDesc = element.materialDesc;
      matMec.categoryDesc = element.categoryDesc;

      this.listDev.push(matMec);
    }
    console.log(this.listDev);
    this.showDialogDev();
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
  confirm() {
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

    if (this.codePass != value.mechanic.at(0).codePassword) {
      this.messageService.add({ severity: 'error', summary: 'Senha', detail: "Senha incoreta.", icon: 'pi pi-times', life: 3000 });
      return;
    }

    this.save();
  }
  private async save() {
    const { value } = this.formPegar;

    var req: ToolControlRequest = new ToolControlRequest();
    req.companyId = this.storageService.companyId;
    req.resaleId = this.storageService.resaleId;
    req.status = StatusRequest.PENDING;
    req.userIdReq = this.storageService.id;
    req.dateReq = this.formatDateTime(new Date());
    req.mechanicId = value.mechanic.at(0).id;

    const resultReq = await this.saveRequest(req);

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
      matMec.quantityReq = this.quantityReqDefault;
      matMec.informationReq = value.inforReq;
      matMec.materialId = item.id;

      const resultMatMec = await this.saveMatMec(matMec);

      if (resultMatMec.status == 201) {
        this.messageService.add({ severity: 'success', summary: 'Material', detail: item.description + ' salvo com sucesso', icon: 'pi pi-check' });
      }

      this.hideDialog();
      this.listMecEnabled();
      this.listMaterial();
    }
  }

  private async saveRequest(req: ToolControlRequest): Promise<HttpResponse<ToolControlRequest>> {
    try {
      return await lastValueFrom(this.requestService.save(req));
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
  private async filterRequest(req: number): Promise<HttpResponse<any>> {
    try {
      return await lastValueFrom(this.reportService.filterRequest(req));
    } catch (error) {
      return error;
    }
  }

}
