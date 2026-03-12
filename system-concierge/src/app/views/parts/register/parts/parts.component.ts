import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { Part } from '../../../../models/parts/Part';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';


import { YesNot } from '../../../../models/enum/yes-not';
import { StatusEnum } from '../../../../models/enum/status-enum';
import { UnitMeasureService } from '../../../../services/parts/unit/unit.measure.service';
import { BusyService } from '../../../../components/loading/busy.service';
import { UnitMeasure } from '../../../../models/parts/unit/unit.measure';
import { lastValueFrom } from 'rxjs';
import { BrandService } from '../../../../services/brand/brand.service';
import { Brand } from '../../../../models/brand/brand';
import { GroupPart } from '../../../../models/parts/group/group.part';
import { GroupPartService } from '../../../../services/parts/group/group.part.service';

interface IAdditionDiscount {
  discount: string;
}


@Component({
  selector: 'app-parts',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, TabViewModule, TableModule, RadioButtonModule, DividerModule,
    ReactiveFormsModule, IconFieldModule, DropdownModule, InputIconModule, InputNumberModule, DialogModule, ToastModule],
  templateUrl: './parts.component.html',
  styleUrl: './parts.component.scss',
  providers: [MessageService]
})
export default class PartsComponent implements OnInit {

  visibleDialog: boolean = false;
  private isNewPart: boolean = false;
  isLoadingGroup: boolean = false;
  private part!: Part;
  parts: Part[] = [];
  partBrands: Brand[] = [];
  partGroups: GroupPart[] = [];
  partCategories: any[]=[];
  partUnits: UnitMeasure[] = [];
  additionDiscount: IAdditionDiscount[] = [];

  yes = YesNot.yes;
  not = YesNot.not;

  enabled = StatusEnum.ENABLED;
  disabled = StatusEnum.DISABLED;

  formPart = new FormGroup({
    status: new FormControl<string>(this.enabled),
    priceNow: new FormControl<number>(0, Validators.required),
    priceOld: new FormControl<number>(0, Validators.required),
    priceWarranty: new FormControl<number>(0, Validators.required),
    additionDiscount: new FormControl<IAdditionDiscount | null>(null, Validators.required),//Acrécimo, Desconto, Ambos, Nenhum
    id: new FormControl<number | null>({ value: null, disabled: true }),
    code: new FormControl<string>('', [Validators.required, Validators.maxLength(50)]),
    unit: new FormControl<UnitMeasure | null>(null, Validators.required),
    description: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),

    brand: new FormControl<Brand | null>(null, Validators.required),
    group: new FormControl<any>(null, Validators.required),
  });

  constructor(
    private groupService: GroupPartService,
    private brandService: BrandService,
    private unitService: UnitMeasureService,
    private messageService: MessageService,
    private busyService: BusyService) { }

  ngOnInit(): void {
    this.init();
  }

  private async init() {
    this.busyService.busy();
    this.partUnits = await this.unitListAllEnabled();
    this.partBrands = await this.brandListAllEnabled();
    this.busyService.idle();

    this.additionDiscount = [{ discount: 'Acrécimo' }, { discount: 'Desconto' }, { discount: 'Ambos' }, { discount: 'Nenhum' }];;
  }

  showNewPart() {
    this.isNewPart = true;
    this.part = new Part();
    this.cleanForm();
    this.showDialog();
  }

  private showDialog() {
    this.visibleDialog = true;
  }
  hideDialog() {
    this.visibleDialog = false;
  }
  private cleanForm() {
    this.formPart.patchValue({
      status: this.enabled,
      priceNow: 0,
      priceOld: 0,
      priceWarranty: 0,
      additionDiscount: null,
      id: null,
      code: '',
      unit: null,
      description: '',
      brand: null,
      group: null,

    });

    this.isLoadingGroup = false;
  }
  async onBrandSelected(event: any) {
    this.isLoadingGroup = true;
    this.partGroups = [];
    this.formPart.get('group').setValue(null);
    this.partGroups = await this.filterGroupBrand(event.value.id);
    this.isLoadingGroup = false;
  }
  private async brandListAllEnabled(): Promise<Brand[]> {
    try {
      return await lastValueFrom(this.brandService.listAllEnabled());
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return [];
    }
  }
  private async unitListAllEnabled(): Promise<UnitMeasure[]> {
    try {
      return await lastValueFrom(this.unitService.listAllEnabled());
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return [];
    }
  }
  private async filterGroupBrand(brandId: number): Promise<GroupPart[]> {
    try {
      return await lastValueFrom(this.groupService.filterBrand(brandId));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return [];
    }
  }
}
