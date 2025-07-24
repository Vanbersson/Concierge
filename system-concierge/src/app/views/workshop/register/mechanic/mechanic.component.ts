import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
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
import { MessageService } from 'primeng/api';
//Class
import { Mechanic } from '../../../../models/workshop/mechanic/Mechanic';
//Enum
import { StatusEnabledDisabled } from '../../../../models/enum/status-enabled-disabled';
//Services
import { MechanicService } from '../../../../services/workshop/mechanic/mechanic.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { StorageService } from '../../../../services/storage/storage.service';
import { IMAGE_MAX_SIZE } from '../../../../util/constants';
import { BusyService } from '../../../../components/loading/busy.service';

@Component({
  selector: 'app-mechanic',
  standalone: true,
  imports: [CommonModule, InputTextModule, InputNumberModule, DialogModule, ToastModule,
    InputMaskModule, RadioButtonModule,
    ReactiveFormsModule, InputGroupModule, InputIconModule, ButtonModule, TableModule, IconFieldModule],
  templateUrl: './mechanic.component.html',
  styleUrl: './mechanic.component.scss',
  providers: [MessageService]
})
export default class MecanicoComponent implements OnInit {

  mechanics: Mechanic[] = [];
  mechanic: Mechanic;

  enabled = StatusEnabledDisabled.enabled;
  disabled = StatusEnabledDisabled.disabled;

  //Dialog
  visibleDialog: boolean = false;
  photoMec: string = "";

  formMec = new FormGroup({
    status: new FormControl<string>(this.enabled, Validators.required),
    name: new FormControl<string>("", Validators.required),
    photo: new FormControl<string | null>(null),
    codePassword: new FormControl<number | null>(null, Validators.required)
  });

  constructor(
    private busyService: BusyService,
    private mechanicService: MechanicService,
    private messageService: MessageService,
    private storageService: StorageService,
    private ngxImageCompressService: NgxImageCompressService) { }

  ngOnInit(): void {
    //Inicia o loading
    this.busyService.busy();
    this.listMechanics();
  }
  private listMechanics() {
    this.mechanicService.listAll().subscribe((data) => {
      this.mechanics = data;
      //Fecha o loading
      this.busyService.idle();
    });
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
          this.photoMec = base64Data;
          this.formMec.patchValue({ photo: this.photoMec });
        });
      }
    });
  }
  deleteFile() {
    this.formMec.patchValue({ photo: "" });
    this.photoMec = "";
  }
  cleanForm() {
    this.formMec.patchValue({
      name: "",
      status: this.enabled,
      codePassword: null,
      photo: "",
    });
    this.photoMec = "";
    this.mechanic = null;
  }
  editMecchanic(mec: Mechanic) {
    this.showDialog();

    this.mechanic = mec;
    this.photoMec = mec.photo;
    this.formMec.patchValue({
      name: mec.name,
      codePassword: mec.codePassword,
      status: mec.status,
      photo: mec.photo
    });
  }
  async saveMechanic() {
    const { value, valid } = this.formMec;

    if (!valid) {
      return;
    }

    if (this.mechanic == null) {
      //Save
      this.mechanic = new Mechanic();
      this.mechanic.companyId = this.storageService.companyId;
      this.mechanic.resaleId = this.storageService.resaleId;
      this.mechanic.name = value.name;
      this.mechanic.status = value.status;
      this.mechanic.codePassword = value.codePassword;
      this.mechanic.photo = value.photo;

      const resultMec = await this.saveMec(this.mechanic);
      if (resultMec.status == 201) {
        this.mechanic.id = resultMec.body.id;
        this.messageService.add({ severity: 'success', summary: 'Mecânico', detail: 'Salvo com sucesso', icon: 'pi pi-check' });
        this.listMechanics();
      }
    } else {
      //Update
      this.mechanic.name = value.name;
      this.mechanic.status = value.status;
      this.mechanic.codePassword = value.codePassword;
      this.mechanic.photo = value.photo;

      const resultMec = await this.updateMec(this.mechanic);
      if (resultMec.status == 200) {
        this.messageService.add({ severity: 'success', summary: 'Mecânico', detail: 'Atualizado com sucesso', icon: 'pi pi-check' });
        this.listMechanics();
      }

    }

  }
  private async saveMec(mec: Mechanic): Promise<HttpResponse<Mechanic>> {
    try {
      return await lastValueFrom(this.mechanicService.saveMec(mec));
    } catch (error) {
      return error;
    }
  }
  private async updateMec(mec: Mechanic): Promise<HttpResponse<Mechanic>> {
    try {
      return await lastValueFrom(this.mechanicService.updateMec(mec));
    } catch (error) {
      return error;
    }
  }

}
