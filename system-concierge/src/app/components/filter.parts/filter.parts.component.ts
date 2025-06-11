import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
export class FilterPartsComponent  {
  visibleParts: boolean = false;
  @Output() public outputPart = new EventEmitter<Part>();
  partsDisabledButton = true;
  listParts: Part[] = [];
  selectedParts!: Part;

  formParts = new FormGroup({
    filterCode: new FormControl(''),
    filterDesc: new FormControl(''),
    selecDesc: new FormControl(''),
    selecPrice: new FormControl<number>(0),
    selecDiscount: new FormControl<number>(0),
    selecQtdAvailable: new FormControl<number>(0)
  });
  constructor(private partsService: PartsService, private busyService: BusyService, private storageService: StorageService) { }
  showDialogParts() {
    this.visibleParts = true;
  }
  hideDialogParts() {
    this.visibleParts = false;
  }
  async selectPartsConfirme() {
    if (this.selectedParts) {
      const { value } = this.formParts;

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

    this.listParts = [];
    const { value } = this.formParts;

    if (value.filterCode != '') {
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
  private PartsDisable() {
    this.formParts.get('selecQtdAvailable').disable();
    this.formParts.get('selecPrice').disable();
    this.formParts.get('selecDiscount').disable();
  }
  private PartsEnable() {
    this.formParts.get('selecQtdAvailable').enable();
    this.formParts.get('selecPrice').enable();
    this.formParts.get('selecDiscount').enable();
  }
  onSelectEventParts(event: any) {
    this.formParts.patchValue({
      selecDesc: this.selectedParts.description,
      selecQtdAvailable: 0,
      selecDiscount: 0,
      selecPrice: this.selectedParts.price,
    });
    this.partsDisabledButton = false;
    this.PartsEnable();
  }
  onUnSelectEventParts(event: any) {
    this.formParts.patchValue({
      selecDesc: "",
      selecQtdAvailable: 0,
      selecPrice: 0,
      selecDiscount: 0
    })
    this.partsDisabledButton = true;


    this.PartsDisable();

  }
  cleanParts() {
    this.formParts.patchValue({
      filterCode: "",
      filterDesc: "",
      selecDesc: "",
      selecQtdAvailable: 0,
      selecPrice: 0,
      selecDiscount: 0
    })
    this.selectedParts = null;
    this.partsDisabledButton = true;
  }
}
