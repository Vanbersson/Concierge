import { Component, DoCheck, OnDestroy, OnInit, signal, ɵgenerateStandaloneInDeclarationsError } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

//PrimeNg
import { StepperModule } from 'primeng/stepper';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputMaskModule } from 'primeng/inputmask';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { CheckboxModule } from 'primeng/checkbox';
import { NgxImageCompressService } from 'ngx-image-compress';

//Service
import { VehicleModelService } from '../../../services/vehicle-model/vehicle-model.service';
import { ClientecompanyService } from '../../../services/clientecompany/clientecompany.service';
import { UserService } from '../../../services/user/user.service';
import { VehicleService } from '../../../services/vehicle/vehicle.service';

//Interface
import { StorageService } from '../../../services/storage/storage.service';
import { IModelVehicle } from '../../../interfaces/vehicle-model/imodel-vehicle';

//Class
import { User } from '../../../models/user/user';
import { ClientCompany } from '../../../models/clientcompany/client-company';
import { VehicleEntry } from '../../../models/vehicle/vehicle-entry';
import { IColor } from '../../../interfaces/icolor';
import { MESSAGE_RESPONSE_NOT_COLOR, MESSAGE_RESPONSE_NOT_MODEL, MESSAGE_RESPONSE_NOT_PLACA, MESSAGE_RESPONSE_PLACAEXISTS } from '../../../util/constants';


//Components
import { FilterClientComponent } from '../../../components/filter.client/filter.client.component';
import { MessageResponse } from '../../../models/message/message-response';
import { ExistsPlaca } from '../../../models/vehicle/exists-placa';


@Component({
  selector: 'app-vehicle.entry',
  standalone: true,
  imports: [
    CommonModule, FilterClientComponent, FormsModule, ReactiveFormsModule,
    StepperModule, ImageModule, ToastModule,
    CheckboxModule, TagModule, DialogModule,
    BadgeModule, TabViewModule, TableModule,
    IconFieldModule, InputIconModule, CardModule,
    InputNumberModule, ButtonModule, InputTextModule,
    InputTextareaModule, CalendarModule, RadioButtonModule,
    InputGroupModule, InputMaskModule, MultiSelectModule],
  providers: [MessageService],
  templateUrl: './vehicle.entry.component.html',
  styleUrl: './vehicle.entry.component.scss'
})
export default class VehicleEntryComponent implements OnInit, OnDestroy, DoCheck {
  IMAGE_MAX_SIZE: number = 4243795;
  private vehicleEntry: VehicleEntry;

  activeStepper: number | undefined = 0;
  private upperCasePipe = new UpperCasePipe();

  //ClientCompany
  selectClientCompany = signal<ClientCompany>(new ClientCompany());

  formClientCompany = new FormGroup({
    clientCompanyNot: new FormControl<string[]>([]),
    clientCompanyId: new FormControl<number | null>(null),
    clientCompanyName: new FormControl<string>(''),
    clientCompanyCnpj: new FormControl<string>(''),
    clientCompanyCpf: new FormControl<string>(''),
    clientCompanyRg: new FormControl<string | null>(null),
  });

  //Driver
  driverEntryPhoto!: string;
  driverEntryPhotoDoc1!: string;
  driverEntryPhotoDoc2!: string;
  formDriver = new FormGroup({
    driverEntryName: new FormControl<string>('', Validators.required),
    driverEntryCpf: new FormControl<string>(''),
    driverEntryRg: new FormControl<string | null>(null),
    driverEntryPhoto: new FormControl(null),
    driverEntrySignature: new FormControl(null),
    driverEntryPhotoDoc1: new FormControl(null),
    driverEntryPhotoDoc2: new FormControl(null),
  });

  //Vehicle
  cores: IColor[] = []
  photoVehicle1!: string;
  photoVehicle2!: string;
  photoVehicle3!: string;
  photoVehicle4!: string;
  vehicleModels$ = this.vehicleModelService.getAllEnabled$();

  formVehicle = new FormGroup({
    placa: new FormControl<string>(''),
    frota: new FormControl<string>(''),
    kmEntry: new FormControl<string | null>(null),
    modelVehicle: new FormControl<IModelVehicle[]>([], Validators.required),
    dateEntry: new FormControl<Date | null>(new Date(), Validators.required),
    datePrevisionExit: new FormControl<Date | null>(null),
    color: new FormControl<IColor[]>([], Validators.required),
    quantityExtinguisher: new FormControl<number | null>(null),
    quantityTrafficCone: new FormControl<number | null>(null),
    quantityTire: new FormControl<number | null>(null),
    quantityTireComplete: new FormControl<number | null>(null),
    quantityToolBox: new FormControl<number | null>(null),
    UserAttendant: new FormControl<User[]>([]),
    vehicleNew: new FormControl<string>('not', Validators.required),
    serviceOrder: new FormControl<string>('yes', Validators.required),
    photo1: new FormControl<string | null>(null),
    photo2: new FormControl<string | null>(null),
    photo3: new FormControl<string | null>(null),
    photo4: new FormControl<string | null>(null),
    informationConcierge: new FormControl<string>(''),
  });

  consultores$ = this.userService.getUserFilterRoleId$(2);

  formCompanyIsEditable = false;

  //Dialog Vehicle entry
  dialogVehicleVisible: boolean = false;
  listVehicleEntry: VehicleEntry[] = [];
  constructor(
    private storageService: StorageService,
    private vehicleModelService: VehicleModelService,
    private vehicleService: VehicleService,
    private userService: UserService,
    private messageService: MessageService,
    private serviceClienteCompany: ClientecompanyService,
    private ngxImageCompressService: NgxImageCompressService) { }


  ngOnInit(): void {
    this.cores = [
      { color: 'Branco' },
      { color: 'Preto' },
      { color: 'Azul' },
      { color: 'Verde' },
      { color: 'Cinza' },
      { color: 'Vermelho' },
      { color: 'Amarelo' },
      { color: 'Rosa' },
      { color: 'Roxo' },
      { color: 'Outro' }
    ];

    this.addRequireInit();
  }
  ngOnDestroy(): void {

  }
  ngDoCheck(): void {
    if (this.selectClientCompany().id != 0) {
      this.formClientCompany.patchValue({
        clientCompanyNot: [],
        clientCompanyId: this.selectClientCompany().id,
        clientCompanyName: this.selectClientCompany().name,
        clientCompanyCnpj: this.selectClientCompany().cnpj,
        clientCompanyCpf: this.selectClientCompany().cpf,
        clientCompanyRg: this.selectClientCompany().rg
      });

      if (this.selectClientCompany().fisjur == "Juridica") {
        this.removeValidClientCompanyCpf();

        this.addValidClientCompanyCnpj();
      } else {
        this.removeValidClientCompanyCnpj();
        this.addValidClientCompanyCpf();
      }
    }

  }
  private addRequireInit() {
    this.addValidClientCompanyId();
    this.addValidClientCompanyName();
    this.addValidClientCompanyCnpj();
    this.addValidClientCompanyCpf();

    this.addRequireDriverCpf();
    this.addRequireDriverRg();

    this.addRequirePlaca();
  }
  //ClientCompany
  //Valid Id
  private addValidClientCompanyId() {
    this.formClientCompany.controls['clientCompanyId'].addValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyId'].updateValueAndValidity();
  }
  private removeValidClientCompanyId() {
    this.formClientCompany.controls['clientCompanyId'].removeValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyId'].updateValueAndValidity();
  }
  //Valid Name
  private addValidClientCompanyName() {
    this.formClientCompany.controls['clientCompanyName'].addValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyName'].updateValueAndValidity();
  }
  private removeValidClientCompanyName() {
    this.formClientCompany.controls['clientCompanyName'].removeValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyName'].updateValueAndValidity();
  }
  //Valid CNPJ
  private addValidClientCompanyCnpj() {
    this.formClientCompany.controls['clientCompanyCnpj'].addValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyCnpj'].updateValueAndValidity();
  }
  private removeValidClientCompanyCnpj() {
    this.formClientCompany.controls['clientCompanyCnpj'].removeValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyCnpj'].updateValueAndValidity();
  }
  //Valid CPF
  private addValidClientCompanyCpf() {
    this.formClientCompany.controls['clientCompanyCpf'].addValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyCpf'].updateValueAndValidity();
  }
  private removeValidClientCompanyCpf() {
    this.formClientCompany.controls['clientCompanyCpf'].removeValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyCpf'].updateValueAndValidity();
  }
  public validationClientCompany() {
    if (this.formClientCompany.value.clientCompanyNot.length == 0) {
      this.removeValidClientCompanyId();
      this.removeValidClientCompanyName();
      this.removeValidClientCompanyCnpj();
      this.removeValidClientCompanyCpf();

      this.cleanFormClientCompany();
    } else {
      this.addValidClientCompanyId();
      this.addValidClientCompanyName();
      this.addValidClientCompanyCnpj();
      this.addValidClientCompanyCpf();
    }
  }
  public nextStepperClientCompany() {

    if (this.formClientCompany.valid) {
      this.activeStepper = 1;
    } else {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Empresa não selecionada', icon: 'pi pi-info-circle' });
    }
  }
  public stepperClientCompany() {
    this.activeStepper = 0;
  }
  private cleanFormClientCompany() {
    this.selectClientCompany.set(new ClientCompany());
    this.formClientCompany.patchValue({
      clientCompanyNot: [],
      clientCompanyId: null,
      clientCompanyName: '',
      clientCompanyCnpj: '',
      clientCompanyCpf: '',
      clientCompanyRg: null
    });
  }

  //Driver
  public async photoPersonDriver() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > this.IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.driverEntryPhoto = base64Data;
          this.formDriver.patchValue({ driverEntryPhoto: this.driverEntryPhoto });
        });
      }
    });
  }
  public async photoFile1Driver() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > this.IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.driverEntryPhotoDoc1 = base64Data;
          this.formDriver.patchValue({ driverEntryPhotoDoc1: this.driverEntryPhotoDoc1 });
        });
      }
    });

  }
  public async photoFile2Driver() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > this.IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.driverEntryPhotoDoc2 = base64Data;
          this.formDriver.patchValue({ driverEntryPhotoDoc2: this.driverEntryPhotoDoc2 });
        });
      }
    });
  }
  public deleteEntryPhotoDriver() {
    this.driverEntryPhoto = "";
    this.formDriver.patchValue({ driverEntryPhoto: null });
  }
  public deleteEntryFileDriver1() {
    this.driverEntryPhotoDoc1 = "";
    this.formDriver.patchValue({ driverEntryPhotoDoc1: null });
  }
  public deleteEntryFileDriver2() {
    this.driverEntryPhotoDoc2 = "";
    this.formDriver.patchValue({ driverEntryPhotoDoc2: null });
  }
  private addRequireDriverCpf() {
    this.formDriver.controls['driverEntryCpf'].addValidators(Validators.required);
    this.formDriver.controls['driverEntryCpf'].updateValueAndValidity();
  }
  private deleteRequireCpf() {
    this.formDriver.controls['driverEntryCpf'].removeValidators(Validators.required);
    this.formDriver.controls['driverEntryCpf'].updateValueAndValidity();
  }
  private addRequireDriverRg() {
    this.formDriver.controls['driverEntryRg'].addValidators([Validators.required, Validators.maxLength(11)]);
    this.formDriver.controls['driverEntryRg'].updateValueAndValidity();
  }
  private deleteRequireRg() {
    this.formDriver.controls['driverEntryRg'].removeValidators([Validators.required, Validators.maxLength(11)]);
    this.formDriver.controls['driverEntryRg'].updateValueAndValidity();
  }
  private addFormValidatorsDriver(): boolean {
    this.addRequireDriverCpf();
    this.addRequireDriverRg();

    const driver = this.formDriver.value;

    if (driver.driverEntryName == "" && driver.driverEntryCpf != "" && driver.driverEntryRg == null) {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Motorista não informado', icon: 'pi pi-info-circle' });
      return false;
    }
    if (driver.driverEntryName == "" && driver.driverEntryCpf == "" && driver.driverEntryRg != null) {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Motorista não informado', icon: 'pi pi-info-circle' });
      return false;
    }
    if (driver.driverEntryName == "" && driver.driverEntryCpf == "" && driver.driverEntryRg == null) {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Motorista não informado', icon: 'pi pi-info-circle' });
      return false;
    }
    if (driver.driverEntryName != "" && driver.driverEntryCpf == "" && driver.driverEntryRg == null) {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Motorista não informado', icon: 'pi pi-info-circle' });
      return false;
    }

    if (driver.driverEntryCpf != "" && driver.driverEntryRg == null) {
      this.deleteRequireRg();
      return true;
    }
    if (driver.driverEntryCpf == "" && driver.driverEntryRg != null && driver.driverEntryRg.toString().length <= 11) {
      this.deleteRequireCpf();
      return true;
    }

    if (driver.driverEntryRg.toString().length > 11) {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'RG inválido', icon: 'pi pi-info-circle' });
      return false;
    }
    return true;
  }
  public nextSterpperDriver() {
    if (this.addFormValidatorsDriver()) {
      this.activeStepper = 2;
    }
  }
  public stepperDriver() {
    if (this.formClientCompany.valid) {
      this.activeStepper = 1;
    } else {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Empresa não selecionada', icon: 'pi pi-info-circle' });
    }
  }
  private cleanFormDriver() {
    this.formDriver.reset();
    this.formDriver.patchValue({
      driverEntryName: "",
      driverEntryCpf: "",
      driverEntryRg: null
    })
    this.driverEntryPhoto = '';
    this.driverEntryPhotoDoc1 = '';
    this.driverEntryPhotoDoc2 = '';
  }
  //Vehicle
  public stepperVehicle() {
    if (this.formClientCompany.valid) {
      if (this.addFormValidatorsDriver()) {
        this.activeStepper = 2;
      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Empresa não selecionada', icon: 'pi pi-info-circle' });
    }
  }
  public async photoFile1Vehicle() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > this.IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.photoVehicle1 = base64Data;
          this.formVehicle.patchValue({ photo1: this.photoVehicle1 });
        });
      }
    });


  }
  public async photoFile2Vehicle() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > this.IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.photoVehicle2 = base64Data;
          this.formVehicle.patchValue({ photo2: this.photoVehicle2 });
        });
      }
    });
  }
  public async photoFile3Vehicle() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > this.IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.photoVehicle3 = base64Data;
          this.formVehicle.patchValue({ photo3: this.photoVehicle3 });
        });
      }
    })
  }
  public async photoFile4Vehicle() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > this.IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.photoVehicle4 = base64Data;
          this.formVehicle.patchValue({ photo4: this.photoVehicle4 });
        });
      }
    })
  }
  public deleteFileVehicle1() {
    this.photoVehicle1 = "";
    this.formVehicle.patchValue({ photo1: null });
  }
  public deleteFileVehicle2() {
    this.photoVehicle2 = "";
    this.formVehicle.patchValue({ photo2: null });
  }
  public deleteFileVehicle3() {
    this.photoVehicle3 = "";
    this.formVehicle.patchValue({ photo3: null });
  }
  public deleteFileVehicle4() {
    this.photoVehicle4 = "";
    this.formVehicle.patchValue({ photo4: null });
  }
  public addRequirePlaca() {
    this.formVehicle.controls['placa'].addValidators(Validators.required);
    this.formVehicle.controls['placa'].updateValueAndValidity();
  }
  public deleteRequirePlaca() {
    this.formVehicle.controls['placa'].removeValidators(Validators.required);
    this.formVehicle.controls['placa'].updateValueAndValidity();
    this.cleanPlaca();
  }
  private cleanPlaca() {
    this.formVehicle.patchValue({ placa: '' });
  }
  private cleanFormVehicle() {
    this.formVehicle.reset();

    this.formVehicle.patchValue({
      placa: '',
      frota: '',
      modelVehicle: [],
      dateEntry: new Date(),
      datePrevisionExit: null,
      color: [],
      vehicleNew: 'not',
      serviceOrder: 'yes',
      photo1: null,
      photo2: null,
      photo3: null,
      photo4: null,
      UserAttendant: []
    });
    this.photoVehicle1 = '';
    this.photoVehicle2 = '';
    this.photoVehicle3 = '';
    this.photoVehicle4 = '';

    this.addRequirePlaca();
  }
  //Dialog Vehicle entry
  public showDialogVehicle() {
    this.dialogVehicleVisible = true;
  }
  //Valid
  private validVehicleEntry(): boolean {

    const { value, valid } = this.formVehicle;

    if ((value.placa == "" && value.vehicleNew == "not")) {
      this.messageService.add({ severity: 'error', summary: 'Placa', detail: "Não informada", icon: 'pi pi-times' });
      return false;
    }
    if ((value.placa != "" && value.vehicleNew == "not") && this.listVehicleEntry.length > 0) {
      for (let item of this.listVehicleEntry) {
        if (item.placa == value.placa) {
          this.messageService.add({ severity: 'error', summary: 'Placa', detail: "Já adicionada", icon: 'pi pi-times' });
          return false;
        }
      }
    }
    if (value.modelVehicle.length == 0) {
      this.messageService.add({ severity: 'error', summary: 'Modelo', detail: "Não selecionado", icon: 'pi pi-times' });
      return false;
    }
    if (value.dateEntry == null) {
      this.messageService.add({ severity: 'error', summary: 'Data Entrada', detail: "Não informada", icon: 'pi pi-times' });
      return false;
    }
    if (value.dateEntry > new Date()) {
      this.messageService.add({ severity: 'error', summary: 'Data Entrada', detail: "Maior que data atual", icon: 'pi pi-times' });
      return false;
    }
    if (value.datePrevisionExit != null && value.datePrevisionExit < new Date()) {
      this.messageService.add({ severity: 'error', summary: 'Data Previsão Saída', detail: "Menor que data atual", icon: 'pi pi-times' });
      return false;
    }
    if (value.color.length == 0) {
      this.messageService.add({ severity: 'error', summary: 'Cor', detail: "Não seleciona", icon: 'pi pi-times' });
      return false;
    }

    if (valid) {
      return true;
    } else {
      return false;
    }

  }
  private async existsPlaca(): Promise<HttpResponse<MessageResponse>> {

    try {
      const existsPlaca: ExistsPlaca = {
        companyId: this.storageService.companyId,
        resaleId: this.storageService.resaleId,
        placa: this.formVehicle.value.placa
      };

      return await lastValueFrom(this.vehicleService.existsPlaca(existsPlaca));
    } catch (error) {
      return error;
    }
    
  }


  //Add or Delete Vehicle entry
  public async addVehicleEntry() {

    if (this.validVehicleEntry()) {

      if (this.formVehicle.value.vehicleNew == "not") {

        const resultPlaca = await this.existsPlaca();
        if(resultPlaca.body.message == "yes"){
          this.messageService.add({ severity: 'error', summary: 'Veículo ' + this.upperCasePipe.transform(this.formVehicle.value.placa), detail: "Já se encontra na empresa", icon: 'pi pi-truck', life: 10000 });
        }else{
          this.loadVehicleEntry();
        }

      } else {
        this.loadVehicleEntry();
      }
    }
  }
  public deleteVehicleEntry(index: number) {

    var listTemp: any[] = [];

    for (let i = 0; i < this.listVehicleEntry.length; i++) {
      const element = this.listVehicleEntry[i];
      if (i != index) {
        listTemp.push(element);
      }

    }

    this.listVehicleEntry = [];

    for (let vehicle of listTemp) {
      this.listVehicleEntry.push(vehicle);
    }

    if (this.listVehicleEntry.length == 0) {
      this.dialogVehicleVisible = false;
    }

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
  //save
  private loadVehicleEntry() {
    const clientValue = this.formClientCompany.value;
    const driverValue = this.formDriver.value;
    const vehicleValue = this.formVehicle.value;

    this.vehicleEntry = new VehicleEntry();
    this.vehicleEntry.companyId = this.storageService.companyId;
    this.vehicleEntry.resaleId = this.storageService.resaleId;
    this.vehicleEntry.idUserEntry = this.storageService.id;
    this.vehicleEntry.nameUserEntry = this.storageService.name;

    if (clientValue.clientCompanyNot.length == 0) {
      this.vehicleEntry.clientCompanyId = clientValue.clientCompanyId;
      this.vehicleEntry.clientCompanyName = clientValue.clientCompanyName;
      this.vehicleEntry.clientCompanyCnpj = clientValue?.clientCompanyCnpj ?? "";
      this.vehicleEntry.clientCompanyCpf = clientValue?.clientCompanyCpf ?? "";
      this.vehicleEntry.clientCompanyRg = clientValue?.clientCompanyRg ?? "";
    } else {
      this.vehicleEntry.clientCompanyId = 0;
    }

    this.vehicleEntry.driverEntryName = driverValue.driverEntryName;
    this.vehicleEntry.driverEntryCpf = driverValue?.driverEntryCpf ?? "";
    this.vehicleEntry.driverEntryRg = driverValue?.driverEntryRg ?? "";
    this.vehicleEntry.driverEntryPhoto = driverValue?.driverEntryPhoto ?? "";
    this.vehicleEntry.driverEntryPhotoDoc1 = driverValue?.driverEntryPhotoDoc1 ?? "";
    this.vehicleEntry.driverEntryPhotoDoc2 = driverValue?.driverEntryPhotoDoc2 ?? "";

    this.vehicleEntry.placa = vehicleValue?.placa ?? "";
    this.vehicleEntry.placasJunto = "";
    this.vehicleEntry.frota = vehicleValue?.frota ?? "";
    this.vehicleEntry.modelId = vehicleValue.modelVehicle.at(0).id;
    this.vehicleEntry.modelDescription = vehicleValue.modelVehicle.at(0).description;
    this.vehicleEntry.dateEntry = this.formatDateTime(vehicleValue.dateEntry);
    this.vehicleEntry.datePrevisionExit = vehicleValue.datePrevisionExit == null ? "" : this.formatDateTime(vehicleValue.datePrevisionExit);
    this.vehicleEntry.color = vehicleValue.color.at(0).color;
    this.vehicleEntry.kmEntry = vehicleValue?.kmEntry ?? "";
    this.vehicleEntry.quantityTrafficCone = vehicleValue?.quantityTrafficCone ?? 0;
    this.vehicleEntry.quantityExtinguisher = vehicleValue?.quantityExtinguisher ?? 0;
    this.vehicleEntry.quantityTire = vehicleValue?.quantityTire ?? 0;
    this.vehicleEntry.quantityTireComplete = vehicleValue?.quantityTireComplete ?? 0;
    this.vehicleEntry.quantityToolBox = vehicleValue?.quantityToolBox ?? 0;

    this.vehicleEntry.idUserAttendant = vehicleValue.UserAttendant.at(0)?.id ?? 0;
    this.vehicleEntry.nameUserAttendant = vehicleValue.UserAttendant.at(0)?.name ?? "";
    this.vehicleEntry.photo1 = vehicleValue?.photo1 ?? "";
    this.vehicleEntry.photo2 = vehicleValue?.photo2 ?? "";
    this.vehicleEntry.photo3 = vehicleValue?.photo3 ?? "";
    this.vehicleEntry.photo4 = vehicleValue?.photo4 ?? "";
    this.vehicleEntry.vehicleNew = vehicleValue?.vehicleNew ?? "";
    this.vehicleEntry.serviceOrder = vehicleValue?.serviceOrder ?? "";
    this.vehicleEntry.informationConcierge = vehicleValue?.informationConcierge ?? "";

    //Add list of vehicle
    this.listVehicleEntry.push(this.vehicleEntry);
    this.messageService.add({ severity: 'success', summary: 'Veículo adicionado', detail: this.vehicleEntry.modelDescription, icon: 'pi pi-car' });

    this.cleanFormVehicle();
  }
  public async saveVehicleEntry() {
    //Save Client
    const clientResult = await this.saveClient(this.selectClientCompany());

    //Save vehicles
    for (let index = 0; index < this.listVehicleEntry.length; index++) {
      const vehicle = this.listVehicleEntry[index];

      var result = await this.saveVehicle(vehicle);

      if (result.status == 201) {
        if (vehicle.vehicleNew == 'not') {
          const uppercase = new UpperCasePipe();
          this.messageService.add({ severity: 'success', summary: 'Veículo Salvo', detail: "Placa " + uppercase.transform(vehicle.placa), icon: 'pi pi-check' });
        }
        if (index == (this.listVehicleEntry.length - 1)) {
          this.messageService.add({ severity: 'success', summary: 'Veículos', detail: "Salvo com sucesso", icon: 'pi pi-check' });

          this.dialogVehicleVisible = false;
          this.listVehicleEntry = [];

          this.cleanFormDriver();
          this.cleanFormClientCompany();

          this.stepperClientCompany();

          this.addRequireInit();

        }
      }

    }
  }
  private async saveVehicle(vehicle: VehicleEntry): Promise<HttpResponse<VehicleEntry>> {

    const RG: string = "Invalid RG.";

    try {
      return await lastValueFrom(this.vehicleService.entrySave$(vehicle));
    } catch (error) {

      if (error.status == 401) {
        if (error.error.message == MESSAGE_RESPONSE_NOT_PLACA) {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Placa não informada", icon: 'pi pi-times' });
        } else if (error.error.message == MESSAGE_RESPONSE_PLACAEXISTS) {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Já se encontra na empresa", icon: 'pi pi-times' });
        } else if (error.error.message == MESSAGE_RESPONSE_NOT_MODEL) {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Modelo não informado", icon: 'pi pi-times' });
        } else if (error.error.message == MESSAGE_RESPONSE_NOT_COLOR) {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Cor não informada", icon: 'pi pi-times' });
        } else if (error.error.message == RG) {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Rg inválido", icon: 'pi pi-times' });
        }
      }
      return error;
    }

  }
  private async saveClient(client: ClientCompany): Promise<HttpResponse<ClientCompany>> {
    try {
      return await lastValueFrom(this.serviceClienteCompany.save(client));
    } catch (error) {
      return error;
    }
  }

}
