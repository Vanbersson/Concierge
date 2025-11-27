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
import { PartsService } from '../../services/parts/parts.service';
import { StorageService } from '../../services/storage/storage.service';
import { StatusEnabledDisabled } from '../../models/enum/status-enabled-disabled';

@Component({
  selector: 'app-filterparts',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, InputTextModule, InputGroupModule, DialogModule, ReactiveFormsModule, InputNumberModule],
  templateUrl: './filter.parts.component.html',
  styleUrl: './filter.parts.component.scss'
})
export class FilterPartsComponent {
  visibleParts: boolean = false;
  @Output() public outputPart = new EventEmitter<Part>();
  partsDisabledButton = true;
  listParts: Part[] = [];
  selectedParts!: Part;
  requiredFiel: boolean = false;

  formFilterParts = new FormGroup({
    filterCode: new FormControl(''),
    filterDesc: new FormControl(''),
  });
  formSelectPart = new FormGroup({
    selecDesc: new FormControl(''),
    selecPrice: new FormControl<number>(0),
    selecDiscount: new FormControl<number>(0),
    selecQtdAvailable: new FormControl<number>(0)
  });
  constructor(private partsService: PartsService, private busyService: BusyService, private storageService: StorageService) { }
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
    if (this.selectedParts) {
      const { value } = this.formSelectPart;

      if (value.selecQtdAvailable == 0 || value.selecQtdAvailable == null) {
        this.requiredFiel = true;
        this.addRequireQtd();
        return;
      }

      this.selectedParts.companyId = this.storageService.companyId;
      this.selectedParts.resaleId = this.storageService.resaleId;
      this.selectedParts.status = StatusEnabledDisabled.enabled;
      this.selectedParts.description = value.selecDesc;
      this.selectedParts.qtdAvailable = value.selecQtdAvailable;
      this.selectedParts.discount = value.selecDiscount;
      this.selectedParts.price = value.selecPrice;

      const resultPart = await this.savePart(this.selectedParts);

      this.outputPart.emit(this.selectedParts);
      this.visibleParts = false;
    }
  }
  private async savePart(part: Part): Promise<HttpResponse<Part>> {
    try {
      return await lastValueFrom(this.partsService.save(part))
    } catch (error) {
      return error;
    }
  }
  public async filterParts() {
    this.busyService.busy();
    //clear selection
    this.clearFormSelected();
    this.disableFormSelected();
    //clear parts list
    this.listParts = [];
    const { value } = this.formFilterParts;

    if (value.filterCode != '') {
      this.formFilterParts.get('filterDesc').setValue("");
      const partsResult = await this.getPartsFilterCode(value.filterCode);
      if (partsResult.status == 200) {
        this.listParts = partsResult.body;
      }

    } else if (value.filterDesc != '') {
      const partsResult = await this.getPartsFilterDesc(value.filterDesc);
      if (partsResult.status == 200) {
        this.listParts = partsResult.body;
      }
    }
    this.busyService.idle();
  }
  private async getPartsFilterCode(code: string): Promise<HttpResponse<Part[]>> {
    try {
      return await lastValueFrom(this.partsService.getExternalFilterCode$(code));
    } catch (error) {
      return error;
    }
  }
  private async getPartsFilterDesc(desc: string): Promise<HttpResponse<Part[]>> {
    try {
      return await lastValueFrom(this.partsService.getExternalFilterDesc$(desc));
    } catch (error) {
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
    this.formSelectPart.patchValue({
      selecDesc: this.selectedParts.description,
      selecQtdAvailable: 0,
      selecDiscount: 0,
      selecPrice: this.selectedParts.price,
    });
    this.partsDisabledButton = false;
    this.enableFormSelected();
  }
  onUnSelectEventParts(event: any) {
    this.formSelectPart.patchValue({
      selecDesc: "",
      selecQtdAvailable: 0,
      selecPrice: 0,
      selecDiscount: 0
    })
    this.partsDisabledButton = true;
    this.disableFormSelected();
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
    this.selectedParts = null;
    this.partsDisabledButton = true;
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
    this.selectedParts = null;
    this.partsDisabledButton = true;
  }
}
