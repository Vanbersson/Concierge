import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
//PrimeNG
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
//Class
import { Part } from '../../models/parts/Part';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
//Service
import { BusyService } from '../loading/busy.service';
import { PartService } from '../../services/parts/part.service';
import { StorageService } from '../../services/storage/storage.service';
import { StatusEnum } from '../../models/enum/status-enum';
import { MessageResponse } from '../../models/message/message-response';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SuccessError } from '../../models/enum/success-error';

@Component({
  selector: 'app-filterparts',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, InputTextModule,
    InputGroupModule, DialogModule, ReactiveFormsModule, ToastModule, InputNumberModule],
  templateUrl: './filter.parts.component.html',
  styleUrl: './filter.parts.component.scss',
  providers: [MessageService]
})
export class FilterPartsComponent {
  visibleParts: boolean = false;
  @Output() public outputPart = new EventEmitter<Part>();
  disabledButtonSelected = true;
  disabledButtonDelete = true;


  listParts: Part[] = [];
  listPartsSelected: Part[] = [];
  selectedPart!: Part;
  deleteSelectPart!: Part;




  formFilterParts = new FormGroup({
    filterCode: new FormControl<string>(''),
    filterDesc: new FormControl<string>(''),
  });




  requiredFiel: boolean = false;
  formSelectPart = new FormGroup({
    selecDesc: new FormControl(''),
    selecPrice: new FormControl<number>(0),
    selecDiscount: new FormControl<number>(0),
    selecQtdAvailable: new FormControl<number>(0)
  });
  constructor(private partsService: PartService,
    private busyService: BusyService,
    private storageService: StorageService,
    private messageService: MessageService) { }
  showDialogParts() {
    this.visibleParts = true;
    this.clearFormFilter();
    this.clearFormSelected();
    this.disableFormSelected();
  }
  hideDialogParts() {
    this.visibleParts = false;
  }
  private addRequireQtd() {
    this.formSelectPart.controls['selecQtdAvailable'].addValidators(Validators.required);
    this.formSelectPart.controls['selecQtdAvailable'].updateValueAndValidity();
  }
  async selectPartsConfirme() {
    /*  if (this.selectedParts) {
       const { value } = this.formSelectPart;
 
       if (value.selecQtdAvailable == 0 || value.selecQtdAvailable == null) {
         this.requiredFiel = true;
         this.addRequireQtd();
         return;
       }
 
       this.selectedParts.companyId = this.storageService.companyId;
       this.selectedParts.resaleId = this.storageService.resaleId;
       this.selectedParts.status = StatusEnum.ENABLED;
       this.selectedParts.description = value.selecDesc;
         this.selectedParts.qtdAvailable = value.selecQtdAvailable;
        this.selectedParts.discount = value.selecDiscount;
        this.selectedParts.price = value.selecPrice; 
 
        const resultPart = await this.savePart(this.selectedParts);
 
       this.outputPart.emit(this.selectedParts);
       this.visibleParts = false; 
     } */
  }
  /*  private async savePart(part: Part): Promise<HttpResponse<Part>> {
     try {
       return await lastValueFrom(this.partsService.save(part))
     } catch (error) {
       return error;
     }
   } */
  public async filterPart() {
    this.busyService.busy();
    //clear selection
    // this.clearFormSelected();
    //  this.disableFormSelected();
    //clear parts list
    this.listParts = [];
    const { value } = this.formFilterParts;

    if (value.filterCode != '') {
      this.formFilterParts.get('filterDesc').setValue("");
      const partsResult = await this.filterCode(value.filterCode);
      if (partsResult.status == 200 && partsResult.body.status == SuccessError.succes) {
        this.listParts = partsResult.body.data;
      }

    } else if (value.filterDesc != '') {
      const partsResult = await this.filterDesc(value.filterDesc);
      if (partsResult.status == 200 && partsResult.body.status == SuccessError.succes) {
        this.listParts = partsResult.body.data;
      }
    }
    this.busyService.idle();
  }
  private async filterCode(code: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.partsService.filterCode(code));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async filterDesc(desc: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.partsService.filterDesc(desc));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private disableFormSelected() {
    this.formSelectPart.get('selecDesc').disable();
    this.formSelectPart.get('selecQtdAvailable').disable();
    this.formSelectPart.get('selecPrice').disable();
    this.formSelectPart.get('selecDiscount').disable();
  }
  private enableFormSelected() {
    this.formSelectPart.get('selecDesc').enable();
    this.formSelectPart.get('selecQtdAvailable').enable();
    this.formSelectPart.get('selecPrice').enable();
    this.formSelectPart.get('selecDiscount').enable();
  }
  onSelectEventParts(event: any) {
    /*  this.formSelectPart.patchValue({
       selecDesc: this.selectedParts.description,
       selecQtdAvailable: 0,
       selecDiscount: 0,
       //selecPrice: this.selectedParts.price,
     }); */
    this.disabledButtonSelected = false;
    //this.enableFormSelected();
  }
  onUnSelectEventParts(event: any) {
   /*  this.formSelectPart.patchValue({
      selecDesc: "",
      selecQtdAvailable: 0,
      selecPrice: 0,
      selecDiscount: 0
    }) */
    this.disabledButtonSelected = true;
   // this.disableFormSelected();
  }
  clearAll() {
    this.formFilterParts.patchValue({
      filterCode: "",
      filterDesc: "",

    });
    this.formSelectPart.patchValue({
      selecDesc: "",
      selecQtdAvailable: 0,
      selecPrice: 0,
      selecDiscount: 0
    });
    this.requiredFiel = false;
    // this.selectedParts = null;
    //this.partsDisabledButton = true;
    this.listParts = [];
  }
  clearFormFilter() {
    this.formFilterParts.patchValue({
      filterCode: "",
      filterDesc: ""
    });
  }
  clearFormSelected() {
    this.formSelectPart.patchValue({
      selecDesc: "",
      selecQtdAvailable: 0,
      selecPrice: 0,
      selecDiscount: 0
    });
    this.requiredFiel = false;
    // this.selectedParts = null;
    //this.partsDisabledButton = true;
  }
}
