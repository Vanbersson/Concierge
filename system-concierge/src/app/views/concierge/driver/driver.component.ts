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
import { StatusEnabledDisabled } from '../../../models/enum/status-enabled-disabled';
import { BusyService } from '../../../components/loading/busy.service';
import { CEPService } from '../../../services/cep/cep.service';
//enum
import { MaleFemale } from '../../../models/enum/male-female';

interface sexo {
  type: string;
}

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule, FormsModule, ReactiveFormsModule, InputNumberModule, InputMaskModule,
    CalendarModule, ImageModule, DropdownModule,
    InputGroupModule, InputIconModule, IconFieldModule, InputTextModule, TableModule, DialogModule, RadioButtonModule],
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.scss',
  providers: [MessageService]
})
export default class DriverComponent implements OnInit {

  listDriver: Driver[] = [];
  driver!: Driver;

  enabled = StatusEnabledDisabled.enabled;
  disabled = StatusEnabledDisabled.disabled;

  //Dialog novo
  visibleDialogNew: boolean = false;
  driverPhoto!: string;
  driverPhotoDoc1!: string;
  driverPhotoDoc2!: string;
  sexos: sexo[] | undefined;

  formDriver = new FormGroup({
    status: new FormControl<string>(this.enabled, Validators.required),
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

  //Dialog filtro
  visibleDialogFilter: boolean = false;
  formFilter = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl<string>(""),
    cpf: new FormControl<string>(""),
    rg: new FormControl<string | null>(null),
    cnhRegister: new FormControl<string | null>(null),
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

  async listDrivers() {
    //Inicia load
    this.busyService.busy();
    this.listDriver = await this.listAll();
    //Fecha load
    this.busyService.idle();
  }
  maskCPF(cpf: string): string {
    if (cpf == "") return "";
    const CPF = cpf.substring(0, 3) + "." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-" + cpf.substring(9, 11);
    return CPF;
  }
  public newDriver() {
    this.driver = new Driver();
    this.cleanForm();
    this.showDialog();
  }
  public showDialog() {
    this.visibleDialogNew = true;
  }
  public hideDialog() {
    this.visibleDialogNew = false;
  }

  public showDialogFilter() {
    this.visibleDialogFilter = true;
    this.cleanFormFilter();
  }
  public hideDialogFilter() {
    this.visibleDialogFilter = false;
  }
  private cleanForm() {
    this.formDriver.patchValue({
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
      addressComplement: "",
      status: this.enabled
    });

    this.driverPhoto = "";
    this.driverPhotoDoc1 = "";
    this.driverPhotoDoc2 = "";
  }
  public cleanFormFilter() {
    this.formFilter.patchValue({
      id: null,
      name: "",
      cpf: "",
      rg: null,
      cnhRegister: null,
    });
  }
  public async selectPhoto() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {

      if (this.ngxImageCompressService.byteCount(image) > IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.driverPhoto = base64Data;

        });
      }
    });
  }
  public deletePhoto() {
    this.driverPhoto = "";
  }
  public async photoFile1Driver() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.driverPhotoDoc1 = base64Data;
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
          this.driverPhotoDoc2 = base64Data;
          // this.formDriver.patchValue({ driverEntryPhotoDoc2: this.driverEntryPhotoDoc2 });
        });
      }
    });
  }
  public deleteEntryFileDriver1() {
    this.driverPhotoDoc1 = "";
  }
  public deleteEntryFileDriver2() {
    this.driverPhotoDoc2 = "";
  }
  public async filterSearchDriver() {
    const { value } = this.formFilter;
    if (value.id != null) {
      const resultID = await this.filterDriverId(value.id);
      if (resultID.status == 200) {
        this.listDriver = [];
        this.listDriver.push(resultID.body);
        this.hideDialogFilter();
      }

    } else if (value.name != "") {



    } else if (value.cpf != "") {

    } else if (value.rg != "") {

    } else if (value.cnhRegister != "") {

    }

  }
  public async save() {
    const { value, valid } = this.formDriver;
    if (!valid) {
      return;
    }

    if (this.driver.id == 0) {
      //Inicia load
      this.busyService.busy();
      //Save
      this.driver.photoDriver = this.driverPhoto;
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
      this.driver.photoDoc1 = this.driverPhotoDoc1;
      this.driver.photoDoc2 = this.driverPhotoDoc2;
      this.driver.userId = this.storageService.id;
      this.driver.userName = this.storageService.name;

      const resultSave = await this.saveDriver(this.driver);
      if (resultSave.status == 201) {
        this.driver.id = resultSave.body.id;
        this.driver.dateRegister = resultSave.body.dateRegister;
        this.formDriver.get('id').setValue(resultSave.body.id);
        this.messageService.add({ severity: 'success', summary: 'Motorista', detail: 'Salvo com sucesso', icon: 'pi pi-check' });
        //Lista motoristas
        this.listDrivers();
      }
      //Fecha load
      this.busyService.idle();
    } else {
      //Inicia load
      this.busyService.busy();
      //Update
      this.driver.photoDriver = this.driverPhoto;
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
      this.driver.photoDoc1 = this.driverPhotoDoc1;
      this.driver.photoDoc2 = this.driverPhotoDoc2;

      const resultSave = await this.updateDriver(this.driver);
      if (resultSave.status == 200) {
        this.messageService.add({ severity: 'success', summary: 'Motorista', detail: 'Atualizado com sucesso', icon: 'pi pi-check' });
        //Lista motoristas
        this.listDrivers();
      }
      //Fecha load
      this.busyService.idle();
    }
  }
  async edit(id: number) {
    //Inicia load
    this.busyService.busy();
    const result = await this.filterDriverId(id);
    //Fecha load
    this.busyService.idle();
    if (result.status == 200) {
      this.showDialog();
      this.driver = result.body;
      this.formDriver.patchValue({
        id: this.driver.id,
        name: this.driver.name,
        dateBirth: new Date(this.driver.dateBirth),
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
        status: this.driver.status
      });

      this.driverPhoto = this.driver.photoDriver;
      this.driverPhotoDoc1 = this.driver.photoDoc1;
      this.driverPhotoDoc2 = this.driver.photoDoc2;
    }
  }
  private async saveDriver(driver: Driver): Promise<HttpResponse<Driver>> {
    try {
      return await lastValueFrom(this.driverService.save(driver));
    } catch (error) {
      if (error.error.message == "Driver already exists.") {
        this.messageService.add({ severity: 'error', summary: 'Motorista', detail: "Já cadastrado", icon: 'pi pi-times' });
      }
      return error;
    }
  }
  private async updateDriver(driver: Driver): Promise<HttpResponse<Driver>> {
    try {
      return await lastValueFrom(this.driverService.update(driver));
    } catch (error) {
      return error;
    }
  }
  private async filterDriverId(id: number): Promise<HttpResponse<Driver>> {
    try {
      return await lastValueFrom(this.driverService.filterId(id));
    } catch (error) {
      return error;
    }
  }
  private async filterDriverCPF(cpf: string): Promise<HttpResponse<Driver>> {
    try {
      return await lastValueFrom(this.driverService.filterCPF(cpf));
    } catch (error) {
      return error;
    }
  }
  private async filterDriverRG(rg: string): Promise<HttpResponse<Driver>> {
    try {
      return await lastValueFrom(this.driverService.filterRG(rg));
    } catch (error) {
      return error;
    }
  }
  private async filterDriverCNHRegister(cnh: string): Promise<HttpResponse<Driver>> {
    try {
      return await lastValueFrom(this.driverService.filterCNHRegister(cnh));
    } catch (error) {
      return error;
    }
  }
  private async filterDriverName(name: string): Promise<Driver[]> {
    try {
      return await lastValueFrom(this.driverService.filterName(name));
    } catch (error) {
      return [];
    }
  }
  private async listAll(): Promise<Driver[]> {
    try {
      return await lastValueFrom(this.driverService.listAll());
    } catch (error) {
      return [];
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
