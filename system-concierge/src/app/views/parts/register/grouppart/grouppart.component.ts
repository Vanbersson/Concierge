import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { MessageResponse } from '../../../../models/message/message-response';
import { HttpResponse } from '@angular/common/http';

import { MessageService, PrimeNGConfig } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { StatusEnum } from '../../../../models/enum/status-enum';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BusyService } from '../../../../components/loading/busy.service';
import { SuccessError } from '../../../../models/enum/success-error';
import { UnitMeasureService } from '../../../../services/parts/unit/unit.measure.service';
import { GroupPart } from '../../../../models/parts/group/group.part';
import { GroupPartService } from '../../../../services/parts/group/group.part.service';
import { TypeGroupPart } from '../../../../models/parts/enums/type.group.part';
import { Brand } from '../../../../models/brand/brand';
import { DropdownModule } from 'primeng/dropdown';
import { BrandService } from '../../../../services/brand/brand.service';
import { StorageService } from '../../../../services/storage/storage.service';

@Component({
  selector: 'app-grouppart',
  standalone: true,
  imports: [CommonModule, InputTextModule, IconFieldModule, DropdownModule, RadioButtonModule, InputIconModule,
    ButtonModule, InputNumberModule, ReactiveFormsModule, TableModule, ToastModule, DialogModule],
  templateUrl: './grouppart.component.html',
  styleUrl: './grouppart.component.scss',
  providers: [MessageService]
})
export default class GrouppartComponent implements OnInit {
  private isNewGroup: boolean = true;
  private group!: GroupPart;

  pecas = TypeGroupPart.PECAS;
  acessorio = TypeGroupPart.ACESSORIO;
  lubrificates = TypeGroupPart.LUBRIFICANTE;
  combustiveis = TypeGroupPart.COMBUSTIVEIS;
  outros = TypeGroupPart.OUTROS;

  enabled = StatusEnum.ENABLED;
  disabled = StatusEnum.DISABLED;

  formGroup = new FormGroup({
    status: new FormControl<StatusEnum>(this.enabled),
    type: new FormControl<TypeGroupPart>(TypeGroupPart.OUTROS),
    description: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    brand: new FormControl<Brand | null>(null)
  });

  brands: Brand[] = [];
  listGroups: GroupPart[] = [];
  dialogVisible: boolean = false;

  constructor(
    private storageService: StorageService,
    private brandService: BrandService,
    private groupService: GroupPartService,
    private messageService: MessageService,
    private busyService: BusyService) { }

  ngOnInit(): void {
    this.init();
  }
  private async init() {
    this.busyService.busy();
    this.listGroups = await this.listAll();
    this.brands = await this.brandListAllEnabled();
    this.busyService.idle();
  }
  showNewGroup() {
    this.isNewGroup = true;
    this.group = new GroupPart();
    this.cleanForm();
    this.showDialog();
  }
  showDialog() {
    this.dialogVisible = true;
  }
  hideDialog() {
    this.dialogVisible = false;
  }
  searchBrand(id: number): string {
    const b = this.brands.find(b => b.id == id);
    return b.name;
  }
  private cleanForm() {
    this.formGroup.patchValue({
      type: TypeGroupPart.OUTROS,
      description: '',
      status: this.enabled,
      brand: null
    });
  }
  edit(g: GroupPart) {
    this.isNewGroup = false;
    this.group = g;
    this.cleanForm();
    this.showDialog();

    this.formGroup.patchValue({
      brand: this.brands.find(b => b.id == g.brandId),
      description: this.group.description,
      type: this.group.type,
      status: this.group.status,
    });
  }
  save() {
    if (this.isNewGroup) {
      this.saveNewGroup();
    } else {
      this.saveUpdateGroup();
    }
  }

  private async saveNewGroup() {
    const { value, valid } = this.formGroup;
    if (!valid) {
      return;
    }

    this.group.companyId = this.storageService.companyId;
    this.group.resaleId = this.storageService.resaleId;
    this.group.type = value.type;
    this.group.brandId = value.brand.id;
    this.group.description = value.description;
    this.group.status = value.status;

    this.busyService.busy();
    const result = await this.saveNew(this.group);
    this.busyService.idle();
    if (result.status == 201 && result.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
      this.hideDialog();
      this.init();
    }
    if (result.status == 201 && result.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
    }
  }
  private async saveUpdateGroup() {
    const { value, valid } = this.formGroup;
    if (!valid) {
      return;
    }

    this.group.type = value.type;
    this.group.brandId = value.brand.id;
    this.group.description = value.description;
    this.group.status = value.status;

    this.busyService.busy();
    const result = await this.saveUpdate(this.group);
    this.busyService.idle();
    if (result.status == 200 && result.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
      this.hideDialog();
    }
    if (result.status == 200 && result.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
    }
     this.init();
  }

  private async saveNew(group: GroupPart): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.groupService.save(group));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async saveUpdate(group: GroupPart): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.groupService.update(group));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async listAll(): Promise<GroupPart[]> {
    try {
      return await lastValueFrom(this.groupService.listAll());
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return [];
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

}
