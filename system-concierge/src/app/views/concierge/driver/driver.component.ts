import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';

//PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';

//Constante
import { IMAGE_MAX_SIZE } from '../../../util/constants';
//Class
import { Driver } from '../../../models/driver/driver';
//Service
import { DriverService } from '../../../services/driver/driver.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { StorageService } from '../../../services/storage/storage.service';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { BusyService } from '../../../components/loading/busy.service';
import { CEPService } from '../../../services/cep/cep.service';
//enum
import { MaleFemale } from '../../../models/enum/male-female';
import { MessageResponse } from '../../../models/message/message-response';
import { SuccessError } from '../../../models/enum/success-error';
import { StatusEnum } from '../../../models/enum/status-enum';

interface sexo {
  type: string;
}

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule, FormsModule, ReactiveFormsModule, InputNumberModule, InputMaskModule, DividerModule,
    CalendarModule, ImageModule, DropdownModule,
    InputGroupModule, InputIconModule, IconFieldModule, InputTextModule, TableModule, DialogModule, RadioButtonModule],
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.scss',
  providers: [MessageService]
})
export default class DriverComponent implements OnInit {

  listDriver: Driver[] = [];
  private driver!: Driver;
  private isNewDriver: boolean = true;

  enabled = StatusEnum.ENABLED;
  disabled = StatusEnum.DISABLED;

  //Dialog novo
  visibleDialogNew: boolean = false;
  driverPhotoUrl!: string;
  driverPhotoDoc1Url!: string;
  driverPhotoDoc2Url!: string;
  sexos: sexo[] | undefined;

  formDriver = new FormGroup({
    status: new FormControl<StatusEnum>(this.enabled, Validators.required),
    id: new FormControl<number | null>({ value: null, disabled: true }),
    name: new FormControl<string>("", [Validators.required, Validators.maxLength(100)]),
    dateBirth: new FormControl<string | Date>("", Validators.required),
    cpf: new FormControl<string>("", Validators.required),
    rg: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(11)]),
    maleFemale: new FormControl<sexo | null>(null, Validators.required),
    email: new FormControl<string>(""),
    cnhRegister: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(11)]),
    cnhCategory: new FormControl<string>("", [Validators.required, Validators.maxLength(10)]),
    cnhValidation: new FormControl<string | Date>("", Validators.required),
    dddPhone: new FormControl<string>(""),
    phone: new FormControl<string>(""),
    dddCellphone: new FormControl<string>(""),
    cellphone: new FormControl<string>(""),
    zipCode: new FormControl<string>("", Validators.required),
    address: new FormControl<string>("", [Validators.required, Validators.maxLength(100)]),
    addressNumber: new FormControl<string | null>(null),
    state: new FormControl<string>("", Validators.required),
    city: new FormControl<string>("", [Validators.required, Validators.maxLength(100)]),
    neighborhood: new FormControl<string>("", [Validators.required, Validators.maxLength(100)]),
    addressComplement: new FormControl<string>(""),
  });

  constructor(private primeNGConfig: PrimeNGConfig,
    private ngxImageCompressService: NgxImageCompressService,
    private storageService: StorageService,
    private messageService: MessageService,
    private driverService: DriverService,
    private busyService: BusyService,
    private cepService: CEPService) { }

  ngOnInit(): void {
    this.primeNGConfig.setTranslation({
      accept: 'Accept',
      reject: 'Cancel',
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
      dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
      monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      monthNamesShort: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sm'
    });

    this.sexos = [{ type: MaleFemale.male }, { type: MaleFemale.female }]
    //Lista motoristas
    this.listDrivers();
  }

  applyDateMask(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (value.length > 5) {
      value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }

    event.target.value = value;
  }

  async listDrivers() {
    //Inicia load
    this.busyService.busy();
    const result = await this.listAll();
    this.listDriver = result.body.data;
    //Fecha load
    this.busyService.idle();
  }

  maskCPF(cpf: string): string {
    if (cpf == "") return "";
    const CPF = cpf.substring(0, 3) + "." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-" + cpf.substring(9, 11);
    return CPF;
  }

  public showDialog() {
    this.cleanForm();
    this.visibleDialogNew = true;
  }

  public hideDialog() {
    this.visibleDialogNew = false;
  }

  private cleanForm() {
    this.formDriver.patchValue({
      status: StatusEnum.ENABLED,
      id: null,
      name: "",
      dateBirth: null,
      cpf: "",
      rg: null,
      email: "",
      cnhRegister: null,
      cnhCategory: "",
      cnhValidation: null,
      maleFemale: null,
      dddPhone: "",
      phone: "",
      dddCellphone: "",
      cellphone: "",
      zipCode: null,
      address: "",
      addressNumber: null,
      state: "",
      city: "",
      neighborhood: "",
      addressComplement: ""
    });

    this.driverPhotoUrl = "";
    this.driverPhotoDoc1Url = "";
    this.driverPhotoDoc2Url = "";
  }

  public async selectPhoto() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {

      if (this.ngxImageCompressService.byteCount(image) > IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.driverPhotoUrl = base64Data;

        });
      }
    });
  }
  public deletePhoto() {
    this.driverPhotoUrl = "";
  }
  public async photoFile1Driver() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.driverPhotoDoc1Url = base64Data;
          // this.formDriver.patchValue({ driverEntryPhotoDoc2: this.driverEntryPhotoDoc2 });
        });
      }
    });
  }
  public async photoFile2Driver() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.driverPhotoDoc2Url = base64Data;
          // this.formDriver.patchValue({ driverEntryPhotoDoc2: this.driverEntryPhotoDoc2 });
        });
      }
    });
  }
  public deleteEntryFileDriver1() {
    this.driverPhotoDoc1Url = "";
  }
  public deleteEntryFileDriver2() {
    this.driverPhotoDoc2Url = "";
  }
  public newDriver() {
    this.isNewDriver = true;
    this.showDialog();
  }
  public async save() {
    if (this.isNewDriver) {
      this.driver = new Driver();
      this.saveNewDriver();
    } else {
      this.updateSaveDriver();
    }
  }
  private async saveNewDriver() {
    const { value, valid } = this.formDriver;
    if (!valid) {
      return;
    }

    //Save
    this.driver.photoDriverUrl = this.driverPhotoUrl;
    this.driver.companyId = this.storageService.companyId;
    this.driver.resaleId = this.storageService.resaleId;
    this.driver.status = value.status;
    this.driver.name = value.name;
    this.driver.dateBirth = value.dateBirth;
    this.driver.cpf = value.cpf;
    this.driver.rg = value.rg.toString();
    this.driver.maleFemale = value.maleFemale['type'] == MaleFemale.male ? MaleFemale.male : MaleFemale.female;
    this.driver.cnhRegister = value.cnhRegister.toString();
    this.driver.cnhCategory = value.cnhCategory;
    this.driver.cnhValidation = value.cnhValidation;
    this.driver.email = value.email;
    this.driver.dddPhone = value.dddPhone;
    this.driver.phone = value.phone;
    this.driver.dddCellphone = value.dddCellphone;
    this.driver.cellphone = value.cellphone;
    this.driver.zipCode = value.zipCode;
    this.driver.address = value.address;
    this.driver.addressNumber = value.addressNumber == null ? "" : value.addressNumber.toString();
    this.driver.state = value.state;
    this.driver.city = value.city;
    this.driver.neighborhood = value.neighborhood;
    this.driver.addressComplement = value.addressComplement;
    this.driver.photoDoc1Url = this.driverPhotoDoc1Url;
    this.driver.photoDoc2Url = this.driverPhotoDoc2Url;
    //Inicia load
    this.busyService.busy();
    const resultSave = await this.saveDriver(this.driver);
    //Fecha load
    this.busyService.idle();
    if (resultSave.status == 201 && resultSave.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: resultSave.body.header, detail: resultSave.body.message, icon: 'pi pi-check' });
      this.driver = resultSave.body.data;
      this.formDriver.get('id').setValue(this.driver.id);
      this.isNewDriver = false;
      //Lista motoristas
      this.listDrivers();
    } else if (resultSave.status == 201 && resultSave.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: resultSave.body.header, detail: resultSave.body.message, icon: 'pi pi-info-circle' });
    }

  }
  async edit(id: number) {
    //Inicia load
    this.busyService.busy();
    const result = await this.filterDriverId(id);
    //Fecha load
    this.busyService.idle();
    if (result.status == 200 && result.body.status == SuccessError.succes) {

      this.isNewDriver = false;
      this.showDialog();
      this.driver = result.body.data;

      this.formDriver.patchValue({
        status: this.driver.status,
        id: this.driver.id,
        name: this.driver.name,
        dateBirth: this.driver.dateBirth != null ? new Date(this.driver.dateBirth) : "",
        cpf: this.driver.cpf,
        rg: this.driver.rg,
        maleFemale: { type: this.driver.maleFemale },
        email: this.driver.email,
        cnhRegister: this.driver.cnhRegister,
        cnhCategory: this.driver.cnhCategory,
        cnhValidation: new Date(this.driver.cnhValidation),
        dddPhone: this.driver.dddPhone,
        phone: this.driver.phone,
        dddCellphone: this.driver.dddCellphone,
        cellphone: this.driver.cellphone,
        zipCode: this.driver.zipCode,
        address: this.driver.address,
        addressNumber: this.driver.addressNumber,
        state: this.driver.state,
        city: this.driver.city,
        neighborhood: this.driver.neighborhood,
        addressComplement: this.driver.addressComplement,

      });

      this.driverPhotoUrl = this.driver.photoDriverUrl;
      this.driverPhotoDoc1Url = this.driver.photoDoc1Url;
      this.driverPhotoDoc2Url = this.driver.photoDoc2Url;
    }
  }
  private async updateSaveDriver() {
    const { value, valid } = this.formDriver;
    if (!valid) {
      return;
    }

    //Update
    this.driver.photoDriverUrl = this.driverPhotoUrl;
    this.driver.status = value.status;
    this.driver.name = value.name;
    this.driver.dateBirth = value.dateBirth;
    this.driver.cpf = value.cpf;
    this.driver.rg = value.rg.toString();
    this.driver.maleFemale = value.maleFemale['type'] == MaleFemale.male ? MaleFemale.male : MaleFemale.female;
    this.driver.cnhRegister = value.cnhRegister.toString();
    this.driver.cnhCategory = value.cnhCategory;
    this.driver.cnhValidation = value.cnhValidation;
    this.driver.email = value.email;
    this.driver.dddPhone = value.dddPhone;
    this.driver.phone = value.phone;
    this.driver.dddCellphone = value.dddCellphone;
    this.driver.cellphone = value.cellphone;
    this.driver.zipCode = value.zipCode;
    this.driver.address = value.address;
    this.driver.addressNumber = value.addressNumber == null ? "" : value.addressNumber.toString();
    this.driver.state = value.state;
    this.driver.city = value.city;
    this.driver.neighborhood = value.neighborhood;
    this.driver.addressComplement = value.addressComplement;
    this.driver.photoDoc1Url = this.driverPhotoDoc1Url;
    this.driver.photoDoc2Url = this.driverPhotoDoc2Url;
    //Inicia load
    this.busyService.busy();
    const resultSave = await this.updateDriver(this.driver);
    //Fecha load
    this.busyService.idle();
    if (resultSave.status == 200 && resultSave.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: resultSave.body.header, detail: resultSave.body.message, icon: 'pi pi-check' });
      //Lista motoristas
      this.listDrivers();
    } else if (resultSave.status == 200 && resultSave.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: resultSave.body.header, detail: resultSave.body.message, icon: 'pi pi-info-circle' });
    }
  }
  private async saveDriver(driver: Driver): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.driverService.save(driver));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async updateDriver(driver: Driver): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.driverService.update(driver));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async filterDriverId(id: number): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.driverService.filterId(id));
    } catch (error) {
      return error;
    }
  }
  private async listAll(): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.driverService.listAll());
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  public async searchCEP() {
    if (!this.formDriver.get('zipCode').value) {
      return;
    }
    const result = await this.cep(this.formDriver.get('zipCode').value);

    if (result.status == 200) {
      this.formDriver.patchValue({
        address: result.body.logradouro,
        addressComplement: result.body.complemento,
        state: result.body.uf,
        city: result.body.localidade,
        neighborhood: result.body.bairro
      });
    }

  }
  private async cep(cep: string): Promise<HttpResponse<any>> {
    try {
      return await lastValueFrom(this.cepService.search(cep));
    } catch (error) {
      return error;
    }
  }
}
