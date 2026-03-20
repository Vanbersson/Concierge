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
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';


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
import { CategoryPart } from '../../../../models/parts/category/category.part';
import { CategoryPartService } from '../../../../services/parts/category/category.part.service';
import { StorageService } from '../../../../services/storage/storage.service';
import { AdditionDiscount } from '../../../../models/parts/enums/addition.discount';
import { PartService } from '../../../../services/parts/part.service';
import { HttpResponse } from '@angular/common/http';
import { MessageResponse } from '../../../../models/message/message-response';
import { SuccessError } from '../../../../models/enum/success-error';
import { IPartListAll } from '../../../../interfaces/part/ipart.list.all';

interface IAdditionDiscount {
  discount: AdditionDiscount;
}


@Component({
  selector: 'app-parts',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, TabViewModule, TableModule, RadioButtonModule, DividerModule, InputGroupModule, InputGroupAddonModule,
    ReactiveFormsModule, IconFieldModule, DropdownModule, InputIconModule, InputNumberModule, DialogModule, ToastModule],
  templateUrl: './parts.component.html',
  styleUrl: './parts.component.scss',
  providers: [MessageService]
})
export default class PartsComponent implements OnInit {
  tabViewIndex: number | undefined = 0;
  visibleDialog: boolean = false;
  private isNewPart: boolean = false;
  isLoadingGroup: boolean = false;
  private part!: Part;
  parts: IPartListAll[] = [];
  partBrands: Brand[] = [];
  partGroups: GroupPart[] = [];
  partCategories: CategoryPart[] = [];
  partUnits: UnitMeasure[] = [];
  siglaUnit: string = '';
  listAdditionDiscount: IAdditionDiscount[] = [];

  yes = YesNot.yes;
  not = YesNot.not;

  enabled = StatusEnum.ENABLED;
  disabled = StatusEnum.DISABLED;

  formPart = new FormGroup({
    status: new FormControl<StatusEnum>(this.enabled),
    priceNow: new FormControl<number>(0, Validators.required),
    priceOld: new FormControl<number>(0, Validators.required),
    priceWarranty: new FormControl<number>(0, Validators.required),
    additionDiscount: new FormControl<IAdditionDiscount | null>(null, Validators.required),//Acrécimo, Desconto, Ambos, Nenhum
    id: new FormControl<number | null>({ value: null, disabled: true }),
    code: new FormControl<string>('', [Validators.required, Validators.maxLength(50)]),
    unit: new FormControl<UnitMeasure | null>(null, Validators.required),
    description: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    brand: new FormControl<Brand | null>(null, Validators.required),
    group: new FormControl<GroupPart | null>(null, Validators.required),
    category: new FormControl<CategoryPart | null>(null, Validators.required),

    locationPriArea: new FormControl<string>(''),
    locationPriStreet: new FormControl<string>(''),
    locationPriBookcase: new FormControl<string>(''),
    locationPriShelf: new FormControl<string>(''),
    locationPriPosition: new FormControl<string>(''),
    locationSecArea: new FormControl<string>(''),
    locationSecStreet: new FormControl<string>(''),
    locationSecBookcase: new FormControl<string>(''),
    locationSecShelf: new FormControl<string>(''),
    locationSecPosition: new FormControl<string>(''),
  });

  constructor(
    private partService: PartService,
    private storageService: StorageService,
    private groupService: GroupPartService,
    private categoryService: CategoryPartService,
    private brandService: BrandService,
    private unitService: UnitMeasureService,
    private messageService: MessageService,
    private busyService: BusyService) { }

  ngOnInit(): void {
    this.init();
  }

  private async init() {
    this.busyService.busy();
    this.parts = await this.listAll();
    this.partUnits = await this.unitListAllEnabled();
    this.partBrands = await this.brandListAllEnabled();
    this.partCategories = await this.categoriesListAllEnabled();
    this.busyService.idle();

    this.listAdditionDiscount = [
      { discount: AdditionDiscount.ACRESCIMO },
      { discount: AdditionDiscount.DESCONTO },
      { discount: AdditionDiscount.AMBOS },
      { discount: AdditionDiscount.NENHUM }];;
  }

  showNewPart() {
    this.isNewPart = true;
    this.part = new Part();
    this.cleanForm();
    this.showDialog();
  }

  private showDialog() {
    this.visibleDialog = true;
    //TabView index
    this.tabViewIndex = 0;
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
      category: null,

      locationPriArea: '',
      locationPriStreet: '',
      locationPriBookcase: '',
      locationPriShelf: '',
      locationPriPosition: '',
      locationSecArea: '',
      locationSecStreet: '',
      locationSecBookcase: '',
      locationSecShelf: '',
      locationSecPosition: ''
    });

    this.siglaUnit = '';
    this.isLoadingGroup = false;
  }
  onUnitSelected(event: any) {
    this.siglaUnit = event.value.unitMeasure;
  }
  async onBrandSelected(event: any) {
    this.isLoadingGroup = true;
    this.partGroups = [];
    this.formPart.get('group').setValue(null);
    this.partGroups = await this.filterGroupBrand(event.value.id);
    this.isLoadingGroup = false;
  }

  save() {
    if (this.isNewPart) {
      this.saveNewPart();
    } else {
      this.saveUpdatePart();
    }
  }

  private async saveNewPart() {
    const { value, valid } = this.formPart;
    if (!valid) {
      return;
    }
    this.part.companyId = this.storageService.companyId;
    this.part.resaleId = this.storageService.resaleId;
    //Tab dados
    this.part.status = value.status;
    this.part.priceNow = value.priceNow;
    this.part.priceOld = value.priceOld;
    this.part.priceWarranty = value.priceWarranty;
    this.part.additionDiscount = value.additionDiscount['discount'];
    this.part.code = value.code;
    this.part.description = value.description;
    this.part.unitMeasureId = value.unit.id;
    this.part.brandId = value.brand.id;
    this.part.groupId = value.group.id;
    this.part.categoryId = value.category.id;
    //tab location
    this.part.locationPriArea = value.locationPriArea;
    this.part.locationPriStreet = value.locationPriStreet;
    this.part.locationPriBookcase = value.locationPriBookcase;
    this.part.locationPriShelf = value.locationPriShelf;
    this.part.locationPriPosition = value.locationPriPosition;
    this.part.locationSecArea = value.locationSecArea;
    this.part.locationSecStreet = value.locationSecStreet;
    this.part.locationSecBookcase = value.locationSecBookcase;
    this.part.locationSecShelf = value.locationSecShelf;
    this.part.locationSecPosition = value.locationSecPosition;

    const result = await this.saveNewP(this.part);
    if (result.status == 201 && result.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
      this.part = result.body.data;
      this.formPart.get('id').setValue(this.part.id);
      this.isNewPart = false;
      this.parts = await this.listAll();
    }
    if (result.status == 201 && result.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
    }
  }
  private async saveUpdatePart() {
    const { value, valid } = this.formPart;
    if (!valid) {
      return;
    }
    //Tab dados
    this.part.status = value.status;
    this.part.priceNow = value.priceNow;
    this.part.priceOld = value.priceOld;
    this.part.priceWarranty = value.priceWarranty;
    this.part.additionDiscount = value.additionDiscount['discount'];
   // this.part.code = value.code;
    this.part.description = value.description;
    this.part.unitMeasureId = value.unit.id;
    this.part.brandId = value.brand.id;
    this.part.groupId = value.group.id;
    this.part.categoryId = value.category.id;
    //tab location
    this.part.locationPriArea = value.locationPriArea;
    this.part.locationPriStreet = value.locationPriStreet;
    this.part.locationPriBookcase = value.locationPriBookcase;
    this.part.locationPriShelf = value.locationPriShelf;
    this.part.locationPriPosition = value.locationPriPosition;
    this.part.locationSecArea = value.locationSecArea;
    this.part.locationSecStreet = value.locationSecStreet;
    this.part.locationSecBookcase = value.locationSecBookcase;
    this.part.locationSecShelf = value.locationSecShelf;
    this.part.locationSecPosition = value.locationSecPosition;

    const result = await this.saveUpdateP(this.part);
    if (result.status == 200 && result.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
      this.part = result.body.data;
      this.parts = await this.listAll();
    }
    if (result.status == 200 && result.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
    }
  }

  async edit(id: number) {
    this.busyService.busy();
    const result = await this.filterId(id);
    this.busyService.idle();
    if (result.status == 200 && result.body.status == SuccessError.succes) {
      this.part = result.body.data;
      this.isNewPart = false;
      this.cleanForm();
      //Grupos
      this.partGroups = await this.filterGroupBrand(this.part.brandId);
      //Unidade de Medida
      const unit = this.partUnits.find(u => u.id == this.part.unitMeasureId);
      this.siglaUnit = unit.unitMeasure;
      //Form
      this.formPart.patchValue({
        status: this.part.status,
        priceNow: this.part.priceNow,
        priceOld: this.part.priceOld,
        priceWarranty: this.part.priceWarranty,
        additionDiscount: this.listAdditionDiscount.find(a => a.discount == this.part.additionDiscount),
        id: this.part.id,
        code: this.part.code,
        description: this.part.description,
        unit: unit,
        brand: this.partBrands.find(b => b.id == this.part.brandId),
        group: this.partGroups.find(g => g.id == this.part.groupId),
        category: this.partCategories.find(c => c.id == this.part.categoryId),
      });
      //Tab Location
      this.formPart.patchValue({
        locationPriArea: this.part.locationPriArea,
        locationPriStreet: this.part.locationPriStreet,
        locationPriBookcase: this.part.locationPriBookcase,
        locationPriShelf: this.part.locationPriShelf,
        locationPriPosition: this.part.locationPriPosition,
        locationSecArea: this.part.locationSecArea,
        locationSecStreet: this.part.locationSecStreet,
        locationSecBookcase: this.part.locationSecBookcase,
        locationSecShelf: this.part.locationSecShelf,
        locationSecPosition: this.part.locationSecPosition,
      });
      this.showDialog();
    }
    if (result.status == 200 && result.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
    }
  }

  private async saveNewP(p: Part): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.partService.save(p));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async saveUpdateP(p: Part): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.partService.update(p));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async listAll(): Promise<IPartListAll[]> {
    try {
      return await lastValueFrom(this.partService.listAll());
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async filterId(id: number): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.partService.filterId(id));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
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
  private async categoriesListAllEnabled(): Promise<CategoryPart[]> {
    try {
      return await lastValueFrom(this.categoryService.listAllEnabled());
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return [];
    }
  }
}
