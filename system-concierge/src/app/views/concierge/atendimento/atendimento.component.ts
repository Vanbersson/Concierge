import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage, UpperCasePipe } from '@angular/common';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';

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

//Service
import { VehicleModelService } from '../../../services/vehicle-model/vehicle-model.service';
import { ClientecompanyService } from '../../../services/clientecompany/clientecompany.service';
import { UserService } from '../../../services/user/user.service';
import { VehicleService } from '../../../services/vehicle/vehicle.service';

//Interface
import { LayoutService } from '../../../layouts/layout/service/layout.service';
import { StorageService } from '../../../services/storage/storage.service';
import { IModelVehicle } from '../../../interfaces/vehicle-model/imodel-vehicle';

//Class
import { User } from '../../../models/user/user';
import { ClientCompany } from '../../../models/clientcompany/client-company';
import { VehicleEntry } from '../../../models/vehicle/vehicle-entry';
import { IColor } from '../../../interfaces/icolor';



@Component({
  selector: 'app-atendimento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, StepperModule, NgOptimizedImage, ImageModule, ToastModule, CheckboxModule, TagModule, DialogModule, BadgeModule, TabViewModule, TableModule, IconFieldModule, InputIconModule, CardModule, InputNumberModule, ButtonModule, InputTextModule, InputTextareaModule, CalendarModule, RadioButtonModule, InputGroupModule, InputMaskModule, MultiSelectModule],
  providers: [MessageService],
  templateUrl: './atendimento.component.html',
  styleUrl: './atendimento.component.scss'
})
export default class AtendimentoComponent {
  private user: User = null;
  private vehicleEntry: VehicleEntry;

  activeStepper: number | undefined = 0;

  //ClientCompany

  clientCompany: ClientCompany = null;
  dialogVisibleClientCompany: boolean = false;
  dialogListClientCompany: ClientCompany[] = [];
  dialogSelectClientCompany!: ClientCompany;
  dialogloadingClientCompany: boolean = false;

  formClientCompanyFilter = new FormGroup({
    clientCompanyId: new FormControl<Number | null>(null),
    clientCompanyFantasia: new FormControl<string>(''),
    clientCompanyName: new FormControl<string>(''),
    clientCompanyCnpj: new FormControl<string>(''),
    clientCompanyCpf: new FormControl<string>(''),
    clientCompanyRg: new FormControl<string | null>(null),
    clientCompanyTipo: new FormControl<string>('j'),
  });

  formClientCompany = new FormGroup({
    ClientCompanyNot: new FormControl<string | null>(null),
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
    placa: new FormControl<string>('', Validators.required),
    frota: new FormControl<string>(''),
    kmEntry: new FormControl<string | null>(null),
    modelVehicle: new FormControl<IModelVehicle[]>([], Validators.required),
    dateEntry: new FormControl<Date | null>(null, Validators.required),
    datePrevisionExit: new FormControl<Date | null>(null),
    color: new FormControl<IColor[]>([], Validators.required),
    quantityExtinguisher: new FormControl<number | null>(null, Validators.required),
    quantityTrafficCone: new FormControl<number | null>(null, Validators.required),
    quantityTire: new FormControl<number | null>(null, Validators.required),
    quantityTireComplete: new FormControl<number | null>(null, Validators.required),
    quantityToolBox: new FormControl<number | null>(null, Validators.required),
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
    private router: Router,
    private layoutService: LayoutService,
    private storageService: StorageService,
    private vehicleModelService: VehicleModelService,
    private vehicleService: VehicleService,
    private userService: UserService,
    private messageService: MessageService,
    private serviceClienteCompany: ClientecompanyService) {
    this.userService.getUser$().subscribe(data => {
      this.user = data;
    });

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

    this.addValidationClientCompany();
  }

  private async openCamera(): Promise<Photo> {

    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });
    return image;
  }

  //ClientCompany
  public showDialogFilterClientCompany() {
    this.dialogVisibleClientCompany = true;
  }
  public hideDialogFilterClientCompany() {
    this.dialogVisibleClientCompany = false;
  }
  public selectClientCompany() {

    if (this.dialogSelectClientCompany) {
      this.dialogVisibleClientCompany = false;

      this.clientCompany = new ClientCompany();
      this.clientCompany = this.dialogSelectClientCompany;

      this.formClientCompany.patchValue({
        clientCompanyId: this.dialogSelectClientCompany.id,
        clientCompanyName: this.dialogSelectClientCompany.name,
        clientCompanyCnpj: this.dialogSelectClientCompany.cnpj,
        clientCompanyCpf: this.dialogSelectClientCompany.cpf,
        clientCompanyRg: this.dialogSelectClientCompany.rg
      });

      this.addFormValidatorsClientCompany();
    }

  }
  public filterClientCompany() {

    this.dialogloadingClientCompany = true;

    const { value } = this.formClientCompanyFilter;

    if (value.clientCompanyTipo == "j") {

      if (value.clientCompanyId) {
        this.serviceClienteCompany.getId$(value.clientCompanyId).subscribe((data) => {
          if (data.status == 200) {
            this.dialogListClientCompany.push(data.body);
          }
          this.dialogloadingClientCompany = false;
        }, (error) => {
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyFantasia) {
        this.serviceClienteCompany.getFantasiaJ$(value.clientCompanyFantasia).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyName) {
        this.serviceClienteCompany.getNameJ$(value.clientCompanyName).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyCnpj) {
        this.serviceClienteCompany.getCnpj$(value.clientCompanyCnpj).subscribe((data) => {
          if (data.status == 200) {
            this.dialogListClientCompany.push(data.body);
          }
          this.dialogloadingClientCompany = false;
        }, (error) => {
          this.dialogloadingClientCompany = false;
        });
      }
      else if (value.clientCompanyCpf || value.clientCompanyRg) {
        this.dialogloadingClientCompany = false;
      } else if (value.clientCompanyTipo) {
        this.serviceClienteCompany.getTipo$(value.clientCompanyTipo).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        });
      }


    } else {
      // P/Física

      if (value.clientCompanyId) {
        this.serviceClienteCompany.getId$(value.clientCompanyId).subscribe((data) => {
          if (data.status == 200) {
            this.dialogListClientCompany.push(data.body);
            this.dialogloadingClientCompany = false;
          }
        }, (error) => {
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyFantasia) {
        this.serviceClienteCompany.getFantasiaF$(value.clientCompanyFantasia).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyName) {
        this.serviceClienteCompany.getNameF$(value.clientCompanyName).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyCnpj) {
        this.dialogloadingClientCompany = false;
      } else if (value.clientCompanyCpf) {
        this.serviceClienteCompany.getCpf$(value.clientCompanyCpf).subscribe((data) => {
          if (data.status == 200) {
            this.dialogListClientCompany.push(data.body);
          }
          this.dialogloadingClientCompany = false;
        }, (error) => {
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyRg) {
        this.serviceClienteCompany.getRg$(value.clientCompanyRg).subscribe((data) => {
          if (data.status == 200) {
            this.dialogListClientCompany.push(data.body);
          }
          this.dialogloadingClientCompany = false;
        }, (error) => {
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyTipo) {
        this.serviceClienteCompany.getTipo$(value.clientCompanyTipo).subscribe((data) => {
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        });
      }

    }

  }
  private addFormValidatorsClientCompany() {
    if (this.clientCompany.fisjur == "Juridica") {
      this.formClientCompany.controls['clientCompanyCpf'].removeValidators(Validators.required);
      this.formClientCompany.controls['clientCompanyCpf'].updateValueAndValidity();
      this.formClientCompany.controls['clientCompanyCnpj'].addValidators(Validators.required);
      this.formClientCompany.controls['clientCompanyCnpj'].updateValueAndValidity();
    } else {
      this.formClientCompany.controls['clientCompanyCnpj'].removeValidators(Validators.required);
      this.formClientCompany.controls['clientCompanyCnpj'].updateValueAndValidity();
      this.formClientCompany.controls['clientCompanyCpf'].addValidators(Validators.required);
      this.formClientCompany.controls['clientCompanyCpf'].updateValueAndValidity();
    }
  }
  private validationClientCompany() {
    if (this.formClientCompany.value.ClientCompanyNot != 'not' || this.formClientCompany.value.ClientCompanyNot == null) {
      this.formClientCompany.controls['clientCompanyId'].removeValidators(Validators.required);
      this.formClientCompany.controls['clientCompanyId'].updateValueAndValidity();
      this.formClientCompany.controls['clientCompanyName'].removeValidators(Validators.required);
      this.formClientCompany.controls['clientCompanyName'].updateValueAndValidity();
    } else {
      this.formClientCompany.controls['clientCompanyId'].addValidators(Validators.required);
      this.formClientCompany.controls['clientCompanyId'].updateValueAndValidity();
      this.formClientCompany.controls['clientCompanyName'].addValidators(Validators.required);
      this.formClientCompany.controls['clientCompanyName'].updateValueAndValidity();
    }
  }
  private addValidationClientCompany() {
    this.formClientCompany.controls['clientCompanyId'].addValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyId'].updateValueAndValidity();
    this.formClientCompany.controls['clientCompanyName'].addValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyName'].updateValueAndValidity();
  }
  public nextStepperClientCompany() {
    if (this.formClientCompany.valid) {
      this.activeStepper = 1;
    } else {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Empresa não selecionada', icon: 'pi pi-exclamation-triangle' });
    }
  }
  public stepperClientCompany() {
    this.activeStepper = 0;
  }
  private cleanFormClientCompany() {
    this.formClientCompany.reset();
  }

  //Driver
  public async photoPersonDriver() {
    const image = this.openCamera();
    this.driverEntryPhoto = (await image).base64String;
    this.formDriver.patchValue({ driverEntryPhoto: this.driverEntryPhoto });
  }
  public async photoFile1Driver() {
    const image = this.openCamera();
    this.driverEntryPhotoDoc1 = (await image).base64String;
    this.formDriver.patchValue({ driverEntryPhotoDoc1: this.driverEntryPhotoDoc1 });
  }
  public async photoFile2Driver() {
    const image = this.openCamera();
    this.driverEntryPhotoDoc2 = (await image).base64String;
    this.formDriver.patchValue({ driverEntryPhotoDoc2: this.driverEntryPhotoDoc2 });
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
  private addFormValidatorsDriver() {

    if (this.formDriver.value.driverEntryCpf == '' && this.formDriver.value.driverEntryRg == '' ||
      this.formDriver.value.driverEntryRg == null && this.formDriver.value.driverEntryCpf == '') {

      this.formDriver.controls['driverEntryCpf'].addValidators(Validators.required);
      this.formDriver.controls['driverEntryCpf'].updateValueAndValidity();

      this.formDriver.controls['driverEntryRg'].addValidators([Validators.required, Validators.minLength(7)]);
      this.formDriver.controls['driverEntryRg'].updateValueAndValidity();

    }

    if (this.formDriver.value.driverEntryCpf != '') {
      this.formDriver.controls['driverEntryRg'].removeValidators([Validators.required, Validators.minLength(7)]);
      this.formDriver.controls['driverEntryRg'].updateValueAndValidity();
    }

    if (this.formDriver.value.driverEntryRg != null && this.formDriver.value.driverEntryRg != '') {
      this.formDriver.controls['driverEntryCpf'].removeValidators(Validators.required);
      this.formDriver.controls['driverEntryCpf'].updateValueAndValidity();
    }
  }
  public nextSterpperDriver() {

    this.addFormValidatorsDriver();

    if (this.formDriver.valid) {
      this.activeStepper = 2;
    } else {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Motorista não informado', icon: 'pi pi-exclamation-triangle' });
    }

  }
  public stepperDriver() {
    if (this.formClientCompany.valid) {
      this.activeStepper = 1;
    } else {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Empresa não selecionada', icon: 'pi pi-exclamation-triangle' });
    }
  }
  private cleanFormDriver() {
    this.formDriver.reset();
    this.driverEntryPhoto = '';
    this.driverEntryPhotoDoc1 = '';
    this.driverEntryPhotoDoc2 = '';

  }
  //Vehicle
  public stepperVehicle() {
    this.addFormValidatorsDriver();

    if (this.formClientCompany.valid) {

      if (this.formDriver.valid) {
        this.activeStepper = 2;
      } else {
        this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Motorista não informado', icon: 'pi pi-exclamation-triangle' });
      }

    } else {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Empresa não selecionada', icon: 'pi pi-exclamation-triangle' });
    }
  }
  public async photoFile1Vehicle() {
    const image = this.openCamera();
    this.photoVehicle1 = (await image).base64String;
    this.formVehicle.patchValue({ photo1: this.photoVehicle1 });
  }
  public async photoFile2Vehicle() {
    const image = this.openCamera();
    this.photoVehicle2 = (await image).base64String;
    this.formVehicle.patchValue({ photo2: this.photoVehicle2 });
  }
  public async photoFile3Vehicle() {
    const image = this.openCamera();
    this.photoVehicle3 = (await image).base64String;
    this.formVehicle.patchValue({ photo3: this.photoVehicle3 });
  }
  public async photoFile4Vehicle() {
    const image = this.openCamera();
    this.photoVehicle4 = (await image).base64String;
    this.formVehicle.patchValue({ photo4: this.photoVehicle4 });
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
  public placaRequiredAdd() {
    this.formVehicle.controls['placa'].addValidators(Validators.required);
    this.formVehicle.controls['placa'].updateValueAndValidity();
  }
  public placaRequiredRemove() {
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
      modelVehicle: [],
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

  }
  //Dialog Vehicle entry
  public showDialogVehicle() {
    this.dialogVehicleVisible = true;
  }
  //Valid
  private validVehicleEntry(): boolean {

    const { value } = this.formVehicle;

    if ((value.placa == "" && value.vehicleNew == "not")) {
      this.messageService.add({ severity: 'error', summary: 'Placa', detail: "Não informada", icon: 'pi pi-times' });
      return false;
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
    return true;
  }
  //Add or Delete Vehicle entry
  public addVehicleEntry() {

    if (this.validVehicleEntry()) {
      this.vehicleService.entryFilterPlaca$(this.formVehicle.value.placa).subscribe(data => {
        if (data.status == 200) {
          const uppercase = new UpperCasePipe();
          this.messageService.add({ severity: 'error', summary: 'Placa ' + uppercase.transform(this.formVehicle.value.placa), detail: "Veículo já se encontra na empresa", icon: 'pi pi-car', life: 10000 });
        }
      }, error => {
        this.loadVehicleEntry();
      });

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
  //save
  private loadVehicleEntry() {
    const clientValue = this.formClientCompany.value;
    const driverValue = this.formDriver.value;
    const vehicleValue = this.formVehicle.value;

    this.vehicleEntry = new VehicleEntry();

    this.vehicleEntry.companyId = this.user.companyId;
    this.vehicleEntry.resaleId = this.user.resaleId;
    this.vehicleEntry.idUserEntry = this.user.id;
    this.vehicleEntry.nameUserEntry = this.user.name;
    this.vehicleEntry.status = 'entradaAutorizada';
    this.vehicleEntry.stepEntry = 'atendimento';
    this.vehicleEntry.budgetStatus = 'semOrcamento';
    this.vehicleEntry.statusAuthExit = 'NotAuth';

    if (this.formClientCompany.value.ClientCompanyNot != 'not' || this.formClientCompany.value.ClientCompanyNot == null) {
      this.vehicleEntry.clientCompanyId = clientValue.clientCompanyId;
      this.vehicleEntry.clientCompanyName = clientValue.clientCompanyName;
      this.vehicleEntry.clientCompanyCnpj = clientValue.clientCompanyCnpj;
      this.vehicleEntry.clientCompanyCpf = clientValue.clientCompanyCpf;
      this.vehicleEntry.clientCompanyRg = clientValue.clientCompanyRg;
    } else {
      this.vehicleEntry.clientCompanyId = 1;
      this.vehicleEntry.clientCompanyName = 'not';
    }

    this.vehicleEntry.driverEntryName = driverValue.driverEntryName;
    this.vehicleEntry.driverEntryCpf = driverValue.driverEntryCpf;
    this.vehicleEntry.driverEntryRg = driverValue.driverEntryRg;
    this.vehicleEntry.driverEntryPhoto = driverValue.driverEntryPhoto;
    this.vehicleEntry.driverEntryPhotoDoc1 = driverValue.driverEntryPhotoDoc1;
    this.vehicleEntry.driverEntryPhotoDoc2 = driverValue.driverEntryPhotoDoc2;

    this.vehicleEntry.placa = vehicleValue.placa;
    this.vehicleEntry.frota = vehicleValue.frota;
    this.vehicleEntry.modelId = vehicleValue.modelVehicle.at(0).id;
    this.vehicleEntry.modelDescription = vehicleValue.modelVehicle.at(0).description;
    this.vehicleEntry.dateEntry = vehicleValue.dateEntry;
    this.vehicleEntry.datePrevisionExit = vehicleValue.datePrevisionExit;
    this.vehicleEntry.color = vehicleValue.color.at(0).color;
    this.vehicleEntry.kmEntry = vehicleValue.kmEntry ?? null;
    this.vehicleEntry.quantityTrafficCone = vehicleValue.quantityTrafficCone;
    this.vehicleEntry.quantityExtinguisher = vehicleValue.quantityExtinguisher;
    this.vehicleEntry.quantityTire = vehicleValue.quantityTire;
    this.vehicleEntry.quantityTireComplete = vehicleValue.quantityTireComplete;
    this.vehicleEntry.quantityToolBox = vehicleValue.quantityToolBox;

    this.vehicleEntry.idUserAttendant = vehicleValue.UserAttendant.at(0)?.id ?? null;
    this.vehicleEntry.nameUserAttendant = vehicleValue.UserAttendant.at(0)?.name ?? null;
    this.vehicleEntry.photo1 = vehicleValue.photo1;
    this.vehicleEntry.photo2 = vehicleValue.photo2;
    this.vehicleEntry.photo3 = vehicleValue.photo3;
    this.vehicleEntry.photo4 = vehicleValue.photo4
    this.vehicleEntry.vehicleNew = vehicleValue.vehicleNew;
    this.vehicleEntry.serviceOrder = vehicleValue.serviceOrder;
    this.vehicleEntry.informationConcierge = vehicleValue.informationConcierge;

    //Add list of vehicle
    this.listVehicleEntry.push(this.vehicleEntry);
    this.messageService.add({ severity: 'success', summary: 'Veículo adicionado', detail: this.vehicleEntry.modelDescription, icon: 'pi pi-truck' });

    this.cleanFormVehicle();
  }
  public saveVehicleEntry() {

    for (let index = 0; index < this.listVehicleEntry.length; index++) {
      const vehicle = this.listVehicleEntry[index];
      this.vehicleService.entrySave$(vehicle).subscribe(data => {

        if (data.status == 201) {
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
          }
        }
      }, error => {

      });
    }


  }

}
