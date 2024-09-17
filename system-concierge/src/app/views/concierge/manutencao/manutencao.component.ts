import { Component, OnInit } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

//Camera
import { Camera, CameraResultType, Photo } from '@capacitor/camera';

//PrimeNg
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';


import { InputMaskModule } from 'primeng/inputmask';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupModule } from 'primeng/inputgroup';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SpeedDialModule } from 'primeng/speeddial';

//Service
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { UserService } from '../../../services/user/user.service';
import { VehicleModelService } from '../../../services/vehicle-model/vehicle-model.service';
import { ClientecompanyService } from '../../../services/clientecompany/clientecompany.service';

//Interface
import { IBudgetNew } from '../../../interfaces/budget/ibudget-new';
import { IColor } from '../../../interfaces/icolor';

//Constants
import { STATUS_VEHICLE_ENTRY_NOTAUTH, STATUS_VEHICLE_ENTRY_FIRSTAUTH, STATUS_VEHICLE_ENTRY_AUTHORIZED } from '../../../util/constants';

//Class
import { User } from '../../../models/user/user';
import { ClientCompany } from '../../../models/clientcompany/client-company';
import { VehicleEntry } from '../../../models/vehicle/vehicle-entry';
import { ModelVehicle } from '../../../models/vehicle-model/model-vehicle';

//Service
import { StorageService } from '../../../services/storage/storage.service';
import { BudgetService } from '../../../services/budget/budget.service';
import { LayoutService } from '../../../layouts/layout/service/layout.service';


@Component({
  selector: 'app-manutencao',
  standalone: true,
  imports: [CommonModule, RouterModule, TabViewModule, FormsModule, IconFieldModule, SpeedDialModule, ConfirmDialogModule, InputIconModule, ImageModule, DialogModule, ToastModule, TableModule, ReactiveFormsModule, InputTextareaModule, InputNumberModule, InputTextModule, ButtonModule, InputMaskModule, MultiSelectModule, InputGroupModule, RadioButtonModule, CalendarModule],
  templateUrl: './manutencao.component.html',
  styleUrl: './manutencao.component.scss',
  providers: [ConfirmationService, MessageService]
})
export default class ManutencaoComponent implements OnInit {
  private user: User;
  private vehicleEntry: VehicleEntry;

  id: number = 0;


  //Vehicle
  formVehicle = new FormGroup({

    id: new FormControl<number>(0, Validators.required),

    placa: new FormControl<string>(''),
    frota: new FormControl<string>(''),

    color: new FormControl<IColor[]>([], Validators.required),
    kmEntry: new FormControl<string>(''),
    kmExit: new FormControl<string>(''),

    modelVehicle: new FormControl<ModelVehicle[]>([], Validators.required),

    dateEntry: new FormControl<Date | null>(null, Validators.required),

    datePrevisionExit: new FormControl<Date | null>(null),

    idUserExitAuth1: new FormControl<number>(0),
    nameUserExitAuth1: new FormControl<string>(''),
    dateExitAuth1: new FormControl<Date | null>(null),

    idUserExitAuth2: new FormControl<number>(0),
    nameUserExitAuth2: new FormControl<string>(''),
    dateExitAuth2: new FormControl<Date | null>(null),

    statusAuthExit: new FormControl<string>(''),

    quantityExtinguisher: new FormControl<number>(0, Validators.required),
    quantityTrafficCone: new FormControl<number>(0, Validators.required),
    quantityTire: new FormControl<number>(0, Validators.required),
    quantityTireComplete: new FormControl<number>(0, Validators.required),
    quantityToolBox: new FormControl<number>(0, Validators.required),

    photo1: new FormControl<string | null>(null),
    photo2: new FormControl<string | null>(null),
    photo3: new FormControl<string | null>(null),
    photo4: new FormControl<string | null>(null),

    userAttendant: new FormControl<User[] | null>([]),

    vehicleNew: new FormControl<string>('not', Validators.required),
    serviceOrder: new FormControl<string>('yes', Validators.required),

    numServiceOrder: new FormControl<string>(''),
    numNfe: new FormControl<string>(''),
    numNfse: new FormControl<string>(''),

    information: new FormControl<string>(''),

  });

  cores: IColor[] = []

  modelVehicles: ModelVehicle[] = [];
  private modelVehicle: ModelVehicle;

  attendantsUser: User[] = [];
  private attendantUser: User;

  photoVehicle1!: string;
  photoVehicle2!: string;
  photoVehicle3!: string;
  photoVehicle4!: string;

  nameUserExitAuth1!: string;
  dateExitAuth1!: string;
  nameUserExitAuth2!: string;
  dateExitAuth2!: string;

  //Porteiro

  proteiroId: number = 0;
  porteiroName: string = '';
  porteiroInfo: String = '';

  //ClientCompany
  formClientCompany = new FormGroup({
    clientCompanyId: new FormControl<number>(0, Validators.required),
    clientCompanyName: new FormControl<string>('', Validators.required),
    clientCompanyCnpj: new FormControl<string>(''),
    clientCompanyCpf: new FormControl<string>(''),
    clientCompanyRg: new FormControl<string>(''),
  });

  formClientCompanyFilter = new FormGroup({
    clientCompanyId: new FormControl<Number>(0),
    clientCompanyFantasia: new FormControl<string>(''),
    clientCompanyName: new FormControl<string>(''),
    clientCompanyCnpj: new FormControl<string>(''),
    clientCompanyCpf: new FormControl<string>(''),
    clientCompanyRg: new FormControl<string>(''),
    clientCompanyTipo: new FormControl<string>('j'),
  });

  dialogListClientCompany: ClientCompany[] = [];
  dialogSelectClientCompany!: ClientCompany;
  dialogVisibleClientCompany: boolean = false;
  dialogloadingClientCompany: boolean = false;

  //Driver

  formDriver = new FormGroup({
    driverEntryName: new FormControl<string>('', Validators.required),
    driverEntryCpf: new FormControl<string>(''),
    driverEntryRg: new FormControl<string>(''),
    driverEntryPhoto: new FormControl<string | null>(null),
    driverEntrySignature: new FormControl<string | null>(null),
    driverEntryPhotoDoc1: new FormControl<string | null>(null),
    driverEntryPhotoDoc2: new FormControl<string | null>(null),

    driverExitName: new FormControl<string>(''),
    driverExitCpf: new FormControl<string>(''),
    driverExitRg: new FormControl<string>(''),
    driverExitPhoto: new FormControl<string | null>(null),
    driverExitSignature: new FormControl<string | null>(null),
    driverExitPhotoDoc1: new FormControl<string | null>(null),
    driverExitPhotoDoc2: new FormControl<string | null>(null),
  });

  driverEntryPhoto!: string;
  driverEntryPhotoDoc1!: string;
  driverEntryPhotoDoc2!: string;

  driverExitPhoto!: string;
  driverExitPhotoDoc1!: string;
  driverExitPhotoDoc2!: string;

  //Budget
  dialogVisibleOrcamento: boolean = false;
  dialogNomeClientCompany!: string;
  dialogIdClientCompany!: number;

  itemsButtonMenu: MenuItem[] = [];

  formDeleteAuth = new FormGroup({
    companyId: new FormControl<Number>(0),
    resaleId: new FormControl<Number>(0),
    id: new FormControl<Number>(0),
    idUserExitAuth: new FormControl<Number>(0),
    nameUserExitAuth: new FormControl<string>(''),
  });

  //Orçamento

  private budget: IBudgetNew;

  constructor(
    private vehicleService: VehicleService,
    private activatedRoute: ActivatedRoute,
    private budgetService: BudgetService,
    private router: Router,
    public layoutService: LayoutService,
    private storageService: StorageService,
    private userService: UserService,
    private vehicleModelService: VehicleModelService,
    private serviceClienteCompany: ClientecompanyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,

  ) {
    //get User
    this.userService.getUser$().subscribe(data => {
      this.user = data;
    });

    //new vehicle
    this.vehicleEntry = new VehicleEntry();

    //Id vehicle entry
    this.id = this.activatedRoute.snapshot.params['id'];
  }

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

    //UserAttendant
    this.userService.getUserFilterRoleId$(2).subscribe((data) => {
      this.attendantsUser = data;
    });

    //models vehicle enabled
    this.vehicleModelService.getAllEnabled$().subscribe((data) => {
      this.modelVehicles = data;
    });

    this.vehicleService.entryFilterId$(this.id).subscribe((data) => {
      if (data.status == 200) {
        this.vehicleEntry = data.body;
        this.loadForms();
      }
    }, (error) => {

    });

    this.itemsButtonMenu = [
      {
        icon: 'pi pi-print',
        command: () => {
          this.messageService.add({ severity: 'info', summary: 'Print', detail: 'Data Print' });
        }
      },
      {
        icon: 'pi pi-file',
        command: () => {
          this.confirmGerarOrcamento();
        }
      },
      {
        icon: 'pi pi-cloud-upload',
        command: () => {
          this.saveVehicle();
        }
      }
    ];

  }

  private async openCamera(): Promise<Photo> {

    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });
    return image;
  }

  private loadForms() {
    //Form vehicle

    for (var model of this.modelVehicles) {
      if (model.id == this.vehicleEntry.modelId) {
        this.modelVehicle = model;
      }
    }
    for (var attendant of this.attendantsUser) {
      if (attendant.id == this.vehicleEntry.idUserAttendant) {
        this.attendantUser = attendant;
        this.formVehicle.patchValue({ userAttendant: [this.attendantUser] });
      }
    }
    this.formVehicle.patchValue({

      id: this.vehicleEntry.id,

      dateEntry: new Date(this.vehicleEntry.dateEntry),
      datePrevisionExit: this.vehicleEntry.datePrevisionExit != null ? new Date(this.vehicleEntry.datePrevisionExit) : null,
      color: [{ color: this.vehicleEntry.color }],
      placa: this.vehicleEntry.placa,
      frota: this.vehicleEntry.frota,

      modelVehicle: [this.modelVehicle],

      kmEntry: this.vehicleEntry.kmEntry,
      kmExit: this.vehicleEntry.kmExit,

      serviceOrder: this.vehicleEntry.serviceOrder,
      vehicleNew: this.vehicleEntry.vehicleNew,

      idUserExitAuth1: this.vehicleEntry.idUserExitAuth1,
      nameUserExitAuth1: this.vehicleEntry.nameUserExitAuth1,
      dateExitAuth1: this.vehicleEntry.dateExitAuth1,

      idUserExitAuth2: this.vehicleEntry.idUserExitAuth2,
      nameUserExitAuth2: this.vehicleEntry.nameUserExitAuth2,
      dateExitAuth2: this.vehicleEntry.dateExitAuth2,

      statusAuthExit: this.vehicleEntry.statusAuthExit,

      photo1: this.vehicleEntry.photo1,
      photo2: this.vehicleEntry.photo2,
      photo3: this.vehicleEntry.photo3,
      photo4: this.vehicleEntry.photo4,

      quantityExtinguisher: this.vehicleEntry.quantityExtinguisher,
      quantityTrafficCone: this.vehicleEntry.quantityTrafficCone,
      quantityTire: this.vehicleEntry.quantityTire,
      quantityTireComplete: this.vehicleEntry.quantityTireComplete,
      quantityToolBox: this.vehicleEntry.quantityToolBox,

      numServiceOrder: this.vehicleEntry.numServiceOrder,
      numNfe: this.vehicleEntry.numNfe,
      numNfse: this.vehicleEntry.numNfse,

      information: this.vehicleEntry.information,

    });

    //Validation placa
    if (this.vehicleEntry.vehicleNew == 'yes') {
      this.deleteValidationPlaca();
    } else {
      this.addValidationPlaca();
    }

    if (this.vehicleEntry.idUserExitAuth1 || this.vehicleEntry.idUserExitAuth2) {
      this.addValidationAttendant();
    }

    if (this.vehicleEntry.dateExitAuth1) {
      this.nameUserExitAuth1 = this.vehicleEntry.nameUserExitAuth1!;
      this.dateExitAuth1 = this.vehicleEntry.dateExitAuth1!.toString();
    }

    if (this.vehicleEntry.dateExitAuth2) {
      this.nameUserExitAuth2 = this.vehicleEntry.nameUserExitAuth2!;
      this.dateExitAuth2 = this.vehicleEntry.dateExitAuth2!.toString();
    }

    this.photoVehicle1 = this.vehicleEntry.photo1!;
    this.photoVehicle2 = this.vehicleEntry.photo2!;
    this.photoVehicle3 = this.vehicleEntry.photo3!;
    this.photoVehicle4 = this.vehicleEntry.photo4!;

    //Form Porteiro
    this.proteiroId = this.vehicleEntry.idUserEntry;
    this.porteiroName = this.vehicleEntry.nameUserEntry;
    this.porteiroInfo = this.vehicleEntry.informationConcierge!;

    //Form Proprietario
    this.formClientCompany.patchValue({
      clientCompanyId: this.vehicleEntry.clientCompanyId,
      clientCompanyName: this.vehicleEntry.clientCompanyName,
      clientCompanyCnpj: this.vehicleEntry.clientCompanyCnpj,
      clientCompanyCpf: this.vehicleEntry.clientCompanyCpf,
      clientCompanyRg: this.vehicleEntry.clientCompanyRg,
    });

    //Form Driver
    this.formDriver.patchValue({
      driverEntryName: this.vehicleEntry.driverEntryName,
      driverEntryCpf: this.vehicleEntry.driverEntryCpf,
      driverEntryRg: this.vehicleEntry.driverEntryRg,
      driverEntryPhoto: this.vehicleEntry.driverEntryPhoto,
      driverEntrySignature: this.vehicleEntry.driverEntrySignature,
      driverEntryPhotoDoc1: this.vehicleEntry.driverEntryPhotoDoc1,
      driverEntryPhotoDoc2: this.vehicleEntry.driverEntryPhotoDoc2,

      driverExitName: this.vehicleEntry.driverExitName,
      driverExitCpf: this.vehicleEntry.driverExitCpf,
      driverExitRg: this.vehicleEntry.driverExitRg,
      driverExitPhoto: this.vehicleEntry.driverExitPhoto,
      driverExitSignature: this.vehicleEntry.driverExitSignature,
      driverExitPhotoDoc1: this.vehicleEntry.driverExitPhotoDoc1,
      driverExitPhotoDoc2: this.vehicleEntry.driverExitPhotoDoc2,
    });

    this.driverEntryPhoto = this.vehicleEntry.driverEntryPhoto!;
    this.driverEntryPhotoDoc1 = this.vehicleEntry.driverEntryPhotoDoc1!;
    this.driverEntryPhotoDoc2 = this.vehicleEntry.driverEntryPhotoDoc2!;

    this.driverExitPhoto = this.vehicleEntry.driverExitPhoto;
    this.driverExitPhotoDoc1 = this.vehicleEntry.driverExitPhotoDoc1;
    this.driverExitPhotoDoc2 = this.vehicleEntry.driverExitPhotoDoc2;


  }

  //Vehicle



  placaRequiredAdd() {
    this.addValidationPlaca();
  }
  placaRequiredRemove() {

    if (this.formVehicle.value.placa.trim() != '' && this.formVehicle.value.vehicleNew == 'yes') {
      this.confirmationService.confirm({
        header: 'Confirmar',
        message: 'A placa será removida ',
        acceptIcon: 'pi pi-check mr-2',
        rejectIcon: 'pi pi-times mr-2',
        rejectButtonStyleClass: 'p-button-sm',
        rejectLabel: 'Não',
        acceptButtonStyleClass: 'p-button-outlined p-button-sm',
        acceptLabel: 'Sim',
        accept: () => {

          this.deleteValidationPlaca();
          this.cleanPlaca();
          this.messageService.add({ severity: 'success', summary: 'Placa', detail: 'Removida com sucesso', life: 2000 });
        },
        reject: () => {
          this.formVehicle.patchValue({ vehicleNew: 'not' });
        }
      });
    }

    if (this.formVehicle.value.placa.trim() == '' && this.formVehicle.value.vehicleNew == 'yes') {
      this.deleteValidationPlaca();
      this.cleanPlaca();
    }

  }
  private addValidationPlaca() {
    this.formVehicle.controls['placa'].addValidators(Validators.required);
    this.formVehicle.controls['placa'].updateValueAndValidity();
  }
  private deleteValidationPlaca() {
    this.formVehicle.controls['placa'].removeValidators(Validators.required);
    this.formVehicle.controls['placa'].updateValueAndValidity();
  }
  private cleanPlaca() {
    this.formVehicle.patchValue({ placa: '' });
    this.vehicleEntry.placa = '';
  }

  private addValidationAttendant() {
    this.formVehicle.controls['userAttendant'].addValidators(Validators.required);
    this.formVehicle.controls['userAttendant'].updateValueAndValidity();
  }
  private deleteValidationAttendant() {
    this.formVehicle.controls['userAttendant'].removeValidators(Validators.required);
    this.formVehicle.controls['userAttendant'].updateValueAndValidity();
  }

  async photoFile1Vehicle() {
    const image = this.openCamera();
    this.photoVehicle1 = (await image).base64String;
    this.formVehicle.patchValue({ photo1: this.photoVehicle1 });
  }
  async photoFile2Vehicle() {
    const image = this.openCamera();
    this.photoVehicle2 = (await image).base64String;
    this.formVehicle.patchValue({ photo2: this.photoVehicle2 });
  }
  async photoFile3Vehicle() {
    const image = this.openCamera();
    this.photoVehicle3 = (await image).base64String;
    this.formVehicle.patchValue({ photo3: this.photoVehicle3 });
  }
  async photoFile4Vehicle() {
    const image = this.openCamera();
    this.photoVehicle4 = (await image).base64String;
    this.formVehicle.patchValue({ photo4: this.photoVehicle4 });
  }
  deleteFileVehicle1() {
    this.photoVehicle1 = "";
    this.formVehicle.patchValue({ photo1: null });
  }
  deleteFileVehicle2() {
    this.photoVehicle2 = "";
    this.formVehicle.patchValue({ photo2: null });
  }
  deleteFileVehicle3() {
    this.photoVehicle3 = "";
    this.formVehicle.patchValue({ photo3: null });
  }
  deleteFileVehicle4() {
    this.photoVehicle4 = "";
    this.formVehicle.patchValue({ photo4: null });
  }

  //Porteiro

  //Proprietario

  selectClientCompany() {

    if (this.dialogSelectClientCompany) {
      this.dialogVisibleClientCompany = false;
    }

    if (this.dialogSelectClientCompany.fisjur == "j") {

      if (this.dialogSelectClientCompany.cnpj) {
        if (this.dialogSelectClientCompany.cnpj.length == 13) {
          this.dialogSelectClientCompany.cnpj = "0" + this.dialogSelectClientCompany.cnpj;
        }
        if (this.dialogSelectClientCompany.cnpj.length == 12) {
          this.dialogSelectClientCompany.cnpj = "00" + this.dialogSelectClientCompany.cnpj;
        }
        if (this.dialogSelectClientCompany.cnpj.length == 11) {
          this.dialogSelectClientCompany.cnpj = "000" + this.dialogSelectClientCompany.cnpj;
        }
      }
    } else {

      if (this.dialogSelectClientCompany.cpf) {
        if (this.dialogSelectClientCompany.cpf.length == 10) {
          this.dialogSelectClientCompany.cpf = "0" + this.dialogSelectClientCompany.cpf;
        }
        if (this.dialogSelectClientCompany.cpf.length == 9) {
          this.dialogSelectClientCompany.cpf = "00" + this.dialogSelectClientCompany.cpf;
        }
        if (this.dialogSelectClientCompany.cpf.length == 8) {
          this.dialogSelectClientCompany.cpf = "000" + this.dialogSelectClientCompany.cpf;
        }
        if (this.dialogSelectClientCompany.cpf.length == 7) {
          this.dialogSelectClientCompany.cpf = "0000" + this.dialogSelectClientCompany.cpf;
        }
        if (this.dialogSelectClientCompany.cpf.length == 6) {
          this.dialogSelectClientCompany.cpf = "00000" + this.dialogSelectClientCompany.cpf;
        }
        if (this.dialogSelectClientCompany.cpf.length == 5) {
          this.dialogSelectClientCompany.cpf = "000000" + this.dialogSelectClientCompany.cpf;
        }
      }

    }

    this.formClientCompany.patchValue({
      clientCompanyId: this.dialogSelectClientCompany.id,
      clientCompanyName: this.dialogSelectClientCompany.name,
      clientCompanyCnpj: this.dialogSelectClientCompany.cnpj,
      clientCompanyCpf: this.dialogSelectClientCompany.cpf,
      clientCompanyRg: this.dialogSelectClientCompany.rg
    });

    this.validFormClientCompany();

  }
  hideDialogFilterClientCompany() {
    this.dialogVisibleClientCompany = false;
  }


  //Driver
  async photoEntryDriver() {
    const image = this.openCamera();
    this.driverEntryPhoto = (await image).base64String;
    this.formDriver.patchValue({ driverEntryPhoto: this.driverEntryPhoto });
  }
  async photoEntryFile1Driver() {
    const image = this.openCamera();
    this.driverEntryPhotoDoc1 = (await image).base64String;
    this.formDriver.patchValue({ driverEntryPhotoDoc1: this.driverEntryPhotoDoc1 });
  }
  async photoEntryFile2Driver() {
    const image = this.openCamera();
    this.driverEntryPhotoDoc2 = (await image).base64String;
    this.formDriver.patchValue({ driverEntryPhotoDoc2: this.driverEntryPhotoDoc2 });
  }
  async photoExitDriver() {
    const image = this.openCamera();
    this.driverExitPhoto = (await image).base64String;
    this.formDriver.patchValue({ driverExitPhoto: this.driverExitPhoto });
  }
  async photoExitFile1Driver() {
    const image = this.openCamera();
    this.driverExitPhotoDoc1 = (await image).base64String;
    this.formDriver.patchValue({ driverExitPhotoDoc1: this.driverExitPhotoDoc1 });
  }
  async photoExitFile2Driver() {
    const image = this.openCamera();
    this.driverExitPhotoDoc2 = (await image).base64String;
    this.formDriver.patchValue({ driverExitPhotoDoc2: this.driverExitPhotoDoc2 });
  }
  //Remover fotos motorista entrada
  deleteEntryPhotoDriver() {
    this.driverEntryPhoto = "";
    this.formDriver.patchValue({ driverEntryPhoto: null });
  }
  deleteEntryFileDriver1() {
    this.driverEntryPhotoDoc1 = "";
    this.formDriver.patchValue({ driverEntryPhotoDoc1: null });
  }
  deleteEntryFileDriver2() {
    this.driverEntryPhotoDoc2 = "";
    this.formDriver.patchValue({ driverEntryPhotoDoc2: null });
  }
  //Remover fotos motorista saída
  deleteExitPhotoDriver() {
    this.driverExitPhoto = "";
    this.formDriver.patchValue({ driverExitPhoto: null });
  }
  deleteExitFileDriver1() {
    this.driverExitPhotoDoc1 = "";
    this.formDriver.patchValue({ driverExitPhotoDoc1: null });
  }
  deleteExitFileDriver2() {
    this.driverExitPhotoDoc2 = "";
    this.formDriver.patchValue({ driverExitPhotoDoc2: null });
  }










  showDialogClientCompany() {
    this.dialogVisibleClientCompany = true;
  }

  filterClientCompany() {

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

  validFormClientCompany() {

    if (this.dialogSelectClientCompany.fisjur == "J") {
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

  dataVehicle() {

    /* this.formAtendimento.patchValue({
 
      id: this.formVehicle.value.id,
 
      dateEntry: this.formVehicle.value.dateEntry,
 
      idUserAttendant: this.formVehicle.value.userAttendant?.at(0)?.id,
      nameUserAttendant: this.formVehicle.value.userAttendant?.at(0)?.name,
 
      idUserExitAuth1: this.formVehicle.value.idUserExitAuth1,
      nameUserExitAuth1: this.nameUserExitAuth1,
      dateExitAuth1: this.formVehicle.value.dateExitAuth1,
 
      idUserExitAuth2: this.formVehicle.value.idUserExitAuth2,
      nameUserExitAuth2: this.nameUserExitAuth2,
      dateExitAuth2: this.formVehicle.value.dateExitAuth2,
 
      statusAuthExit: this.formVehicle.value.statusAuthExit,
 
      modelId: this.formVehicle.value.modelVehicle?.at(0)?.id,
      modelDescription: this.formVehicle.value.modelVehicle?.at(0)?.description,
 
      clientCompanyId: this.formClientCompany.value.clientCompanyId,
      clientCompanyName: this.formClientCompany.value.clientCompanyName,
      clientCompanyCnpj: this.formClientCompany.value.clientCompanyCnpj,
      clientCompanyCpf: this.formClientCompany.value.clientCompanyCpf,
      clientCompanyRg: this.formClientCompany.value.clientCompanyRg,
 
      driverEntryName: this.formMotorista.value.driverEntryName,
      driverEntryCpf: this.formMotorista.value.driverEntryCpf,
      driverEntryRg: this.formMotorista.value.driverEntryRg ?? "",
      driverEntryPhoto: this.formMotorista.value.driverEntryPhoto,
      driverEntrySignature: this.formMotorista.value.driverEntrySignature,
      driverEntryPhotoDoc1: this.formMotorista.value.driverEntryPhotoDoc1,
      driverEntryPhotoDoc2: this.formMotorista.value.driverEntryPhotoDoc2,
 
      driverExitName: this.formMotorista.value.driverExitName,
      driverExitCpf: this.formMotorista.value.driverExitCpf,
      driverExitRg: this.formMotorista.value.driverExitRg ?? "",
      driverExitPhoto: this.formMotorista.value.driverExitPhoto,
      driverExitSignature: this.formMotorista.value.driverExitSignature,
      driverExitPhotoDoc1: this.formMotorista.value.driverExitPhotoDoc1,
      driverExitPhotoDoc2: this.formMotorista.value.driverExitPhotoDoc2,
 
      color: this.formVehicle.value.color?.at(0)?.color,
      placa: this.formVehicle.value.placa,
      frota: this.formVehicle.value.frota,
 
      vehicleNew: this.formVehicle.value.vehicleNew,
      kmEntry: this.formVehicle.value.kmEntry ?? "",
      kmExit: this.formVehicle.value.kmExit ?? "",
 
      photo1: this.formVehicle.value.photo1,
      photo2: this.formVehicle.value.photo2,
      photo3: this.formVehicle.value.photo3,
      photo4: this.formVehicle.value.photo4,
 
      quantityExtinguisher: this.formVehicle.value.quantityExtinguisher,
      quantityTrafficCone: this.formVehicle.value.quantityTrafficCone,
      quantityTire: this.formVehicle.value.quantityTire,
      quantityTireComplete: this.formVehicle.value.quantityTireComplete,
      quantityToolBox: this.formVehicle.value.quantityToolBox,
 
      serviceOrder: this.formVehicle.value.serviceOrder,
      numServiceOrder: this.formVehicle.value.numServiceOrder ?? "",
      numNfe: this.formVehicle.value.numNfe ?? "",
      numNfse: this.formVehicle.value.numNfse ?? "",
 
      information: this.formVehicle.value.information,
 
    }); */


  }

  deleteAuth1() {
    this.formDeleteAuth.patchValue({
      companyId: Number.parseInt(sessionStorage.getItem('companyId')!),
      resaleId: Number.parseInt(sessionStorage.getItem('resaleId')!),
      id: this.id,
      idUserExitAuth: Number.parseInt(sessionStorage.getItem('id')!),
      nameUserExitAuth: sessionStorage.getItem('name'),
    });

    this.vehicleService.entryDeleteAuth1(this.formDeleteAuth.value).subscribe((data) => {
      if (data.body == "Success.") {

        this.formVehicle.patchValue({
          idUserExitAuth1: null,
          nameUserExitAuth1: '',
          dateExitAuth1: null
        });

        this.dateExitAuth1 = "";

        this.validAuthExit();

      }

      if (data.body == "Not delete.") {

      }
    });

  }

  deleteAuth2() {
    this.formDeleteAuth.patchValue({
      companyId: Number.parseInt(sessionStorage.getItem('companyId')!),
      resaleId: Number.parseInt(sessionStorage.getItem('resaleId')!),
      id: this.id,
      idUserExitAuth: Number.parseInt(sessionStorage.getItem('id')!),
      nameUserExitAuth: sessionStorage.getItem('name'),
    });

    this.vehicleService.entryDeleteAuth2(this.formDeleteAuth.value).subscribe((data) => {
      if (data.body == "Success.") {

        this.formVehicle.patchValue({
          idUserExitAuth2: null,
          nameUserExitAuth2: '',
          dateExitAuth2: null
        });

        this.dateExitAuth2 = "";

        this.validAuthExit();

      }

      if (data.body == "Not delete.") {

      }
    });

  }

  validAuthExit() {

    var status = "";
    const { value } = this.formVehicle;

    if (value.idUserExitAuth1 == null && value.idUserExitAuth2 != null) {
      status = STATUS_VEHICLE_ENTRY_FIRSTAUTH;
    }
    if (value.idUserExitAuth1 != null && value.idUserExitAuth2 == null) {
      status = STATUS_VEHICLE_ENTRY_FIRSTAUTH;
    }
    if (value.idUserExitAuth1 != null && value.idUserExitAuth2 != null) {
      status = STATUS_VEHICLE_ENTRY_AUTHORIZED;
    }
    if (value.idUserExitAuth1 == null && value.idUserExitAuth2 == null) {
      status = STATUS_VEHICLE_ENTRY_NOTAUTH;
    }

    this.formVehicle.patchValue({ statusAuthExit: status });



  }

  showSaveSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Veículo atualizado', detail: 'Veículo atualizado com sucesso', icon: 'pi pi-car' });
  }
  showPlacaExist(placa: string) {
    const uppercase = new UpperCasePipe();
    this.messageService.add({ severity: 'error', summary: 'Placa ' + uppercase.transform(placa), detail: "Vaículo já se encontra na empresa", icon: 'pi pi-car', life: 10000 });
  }

  //Orçamento
  confirmGerarOrcamento() {

    if (this.vehicleEntry.budgetId != null) {
      this.router.navigateByUrl('/oficina/orcamento/' + this.vehicleEntry.budgetId);
    } else {
      this.confirmationService.confirm({
        header: 'Confirmar',
        message: 'Gerar um orçamento.',
        acceptIcon: 'pi pi-check mr-2',
        rejectIcon: 'pi pi-times mr-2',
        rejectButtonStyleClass: 'p-button-sm',
        rejectLabel: 'Não',
        acceptButtonStyleClass: 'p-button-outlined p-button-sm',
        acceptLabel: 'Sim',
        accept: () => {

          this.budget = { vehicleEntryId: this.formVehicle.value.id };

          this.budgetService.addBudget$(this.budget).subscribe((data) => {
            if (data.status == 201) {

              this.vehicleEntry.budgetId = data.body.id;
              this.vehicleEntry.budgetStatus = data.body.status;
              this.messageService.add({ severity: 'info', summary: 'Orçamento', detail: 'Gerado com sucesso' });
              setTimeout(() => {
                this.router.navigateByUrl('/oficina/orcamento/' + this.vehicleEntry.budgetId);
              }, 2000);




            }

          });

        }/* ,
        reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        } */
      });
    }
  }

  //Save Vehicle Entry
  private validForms(): boolean {


    const vehicleValid = this.formVehicle.valid;

    if (!vehicleValid) {
      return false;
    }

    //Loading data
    this.loadingVehicle();

    return true;
  }
  private loadingVehicle() {
    const vehicleValue = this.formVehicle.value;
    const clientCompanyValue = this.formClientCompany.value;
    const driverValue = this.formDriver.value;

    this.vehicleEntry.dateEntry = vehicleValue.dateEntry;
    this.vehicleEntry.datePrevisionExit = vehicleValue.datePrevisionExit;
    this.vehicleEntry.placa = vehicleValue.placa;
    this.vehicleEntry.frota = vehicleValue.frota;
    this.vehicleEntry.modelId = vehicleValue.modelVehicle.at(0).id;
    this.vehicleEntry.modelDescription = vehicleValue.modelVehicle.at(0).description;
    this.vehicleEntry.color = vehicleValue.color.at(0).color;

    this.vehicleEntry.idUserAttendant = vehicleValue.userAttendant.at(0)?.id ?? null;
    this.vehicleEntry.nameUserAttendant = vehicleValue.userAttendant.at(0)?.name ?? null ;

    this.vehicleEntry.kmEntry = vehicleValue.kmEntry;
    this.vehicleEntry.kmExit = vehicleValue.kmExit;

    this.vehicleEntry.idUserExitAuth1 = vehicleValue.idUserExitAuth1;
    this.vehicleEntry.nameUserExitAuth1 = vehicleValue.nameUserExitAuth1;
    this.vehicleEntry.dateExitAuth1 = vehicleValue.dateExitAuth1;

    this.vehicleEntry.idUserExitAuth2 = vehicleValue.idUserExitAuth2;
    this.vehicleEntry.nameUserExitAuth2 = vehicleValue.nameUserExitAuth2;
    this.vehicleEntry.dateExitAuth2 = vehicleValue.dateExitAuth2;

    this.vehicleEntry.quantityTrafficCone = vehicleValue.quantityTrafficCone;
    this.vehicleEntry.quantityExtinguisher = vehicleValue.quantityExtinguisher;
    this.vehicleEntry.quantityTire = vehicleValue.quantityTire;
    this.vehicleEntry.quantityTireComplete = vehicleValue.quantityTireComplete;
    this.vehicleEntry.quantityToolBox = vehicleValue.quantityToolBox;
    this.vehicleEntry.numServiceOrder = vehicleValue.numServiceOrder;
    this.vehicleEntry.numNfe = vehicleValue.numNfe;
    this.vehicleEntry.numNfse = vehicleValue.numNfse;
    this.vehicleEntry.photo1 = vehicleValue.photo1;
    this.vehicleEntry.photo2 = vehicleValue.photo2;
    this.vehicleEntry.photo3 = vehicleValue.photo3;
    this.vehicleEntry.photo4 = vehicleValue.photo4;
    this.vehicleEntry.vehicleNew = vehicleValue.vehicleNew;
    this.vehicleEntry.serviceOrder = vehicleValue.serviceOrder;
    this.vehicleEntry.information = vehicleValue.information;

    this.vehicleEntry.clientCompanyId = clientCompanyValue.clientCompanyId;
    this.vehicleEntry.clientCompanyName = clientCompanyValue.clientCompanyName;
    this.vehicleEntry.clientCompanyCnpj = clientCompanyValue.clientCompanyCnpj;
    this.vehicleEntry.clientCompanyCpf = clientCompanyValue.clientCompanyCpf;
    this.vehicleEntry.clientCompanyRg = clientCompanyValue.clientCompanyRg;

    this.vehicleEntry.driverEntryName = driverValue.driverEntryName;
    this.vehicleEntry.driverEntryCpf = driverValue.driverEntryCpf;
    this.vehicleEntry.driverEntryRg = driverValue.driverEntryRg;
    this.vehicleEntry.driverEntryPhoto = driverValue.driverEntryPhoto;
    this.vehicleEntry.driverEntrySignature = driverValue.driverEntrySignature;
    this.vehicleEntry.driverEntryPhotoDoc1 = driverValue.driverEntryPhotoDoc1;
    this.vehicleEntry.driverEntryPhotoDoc2 = driverValue.driverEntryPhotoDoc2;

    this.vehicleEntry.driverExitName = driverValue.driverExitName;
    this.vehicleEntry.driverExitCpf = driverValue.driverExitCpf;
    this.vehicleEntry.driverExitRg = driverValue.driverExitRg;
    this.vehicleEntry.driverExitPhoto = driverValue.driverExitPhoto;
    this.vehicleEntry.driverExitSignature = driverValue.driverExitSignature;
    this.vehicleEntry.driverExitPhotoDoc1 = driverValue.driverExitPhotoDoc1;
    this.vehicleEntry.driverExitPhotoDoc2 = driverValue.driverExitPhotoDoc2;


  }
  saveVehicle() {

    if (this.validForms()) {

      this.vehicleService.entryUpdate$(this.vehicleEntry).subscribe((data) => {
        if (data.status == 200) {
          this.showSaveSuccess();
        }
      }, (error) => {
        if (error.status == 409) {
          //this.showPlacaExist(value.placa!);
        }

      });

    }

  }


}
