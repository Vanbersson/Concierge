import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
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
import { CheckboxModule } from 'primeng/checkbox';
import { TimelineModule } from 'primeng/timeline';

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
import { VehicleEntryAuth } from '../../../models/vehicle/vehicle-entry-auth';
import { error } from 'console';
import { BusyService } from '../../../components/loading/busy.service';

interface EventItem {
  description?: string;
  icon?: string;
  color?: string;

}


@Component({
  selector: 'app-manutencao',
  standalone: true,
  imports: [CommonModule, RouterModule, TabViewModule, FormsModule, IconFieldModule, CheckboxModule, TimelineModule, SpeedDialModule, ConfirmDialogModule, InputIconModule, ImageModule, DialogModule, ToastModule, TableModule, ReactiveFormsModule, InputTextareaModule, InputNumberModule, InputTextModule, ButtonModule, InputMaskModule, MultiSelectModule, InputGroupModule, RadioButtonModule, CalendarModule],
  templateUrl: './manutencao.component.html',
  styleUrl: './manutencao.component.scss',
  providers: [ConfirmationService, MessageService]
})
export default class ManutencaoComponent implements OnInit {

  stepEntry: EventItem[];

  private user: User;
  private vehicleEntry: VehicleEntry;
  public id: number = 0;
  //Vehicle
  private notAuth = STATUS_VEHICLE_ENTRY_NOTAUTH;
  private firstAuth = STATUS_VEHICLE_ENTRY_FIRSTAUTH;
  private authorized = STATUS_VEHICLE_ENTRY_AUTHORIZED;

  formVehicle = new FormGroup({
    id: new FormControl<number>(0, Validators.required),
    placa: new FormControl<string>(''),
    frota: new FormControl<string>(''),
    color: new FormControl<IColor[]>([], Validators.required),
    kmEntry: new FormControl<string | null>(''),
    kmExit: new FormControl<string | null>(''),
    modelVehicle: new FormControl<ModelVehicle[]>([], Validators.required),
    dateEntry: new FormControl<Date | null>(null, Validators.required),
    datePrevisionExit: new FormControl<Date | null>(null),

    idUserExitAuth1: new FormControl<number>(0),
    nameUserExitAuth1: new FormControl<string>(''),
    dateExitAuth1: new FormControl<Date | string | null>(null),

    idUserExitAuth2: new FormControl<number>(0),
    nameUserExitAuth2: new FormControl<string>(''),
    dateExitAuth2: new FormControl<Date | string | null>(null),

    statusAuthExit: new FormControl<string>(''),
    quantityExtinguisher: new FormControl<number | null>(null),
    quantityTrafficCone: new FormControl<number | null>(null),
    quantityTire: new FormControl<number | null>(null),
    quantityTireComplete: new FormControl<number | null>(null),
    quantityToolBox: new FormControl<number | null>(null),

    photo1: new FormControl<string | null>(null),
    photo2: new FormControl<string | null>(null),
    photo3: new FormControl<string | null>(null),
    photo4: new FormControl<string | null>(null),
    userAttendant: new FormControl<User[] | null>([]),
    vehicleNew: new FormControl<string>('not', Validators.required),
    serviceOrder: new FormControl<string>('yes', Validators.required),
    numServiceOrder: new FormControl<string | null>(null),
    numNfe: new FormControl<string | null>(null),
    numNfse: new FormControl<string | null>(null),
    information: new FormControl<string>('')
  });
  public cores: IColor[] = []
  public modelVehicles: ModelVehicle[] = [];
  private modelVehicle: ModelVehicle;
  public attendantsUser: User[] = [];
  private attendantUser: User;
  photoVehicle1!: string;
  photoVehicle2!: string;
  photoVehicle3!: string;
  photoVehicle4!: string;
  public dateExitAuth1!: Date | string;
  public dateExitAuth2!: Date | string;

  //Porteiro
  proteiroId: number = 0;
  porteiroName: string = '';
  porteiroInfo: String = '';
  //ClientCompany
  formClientCompany = new FormGroup({
    clientCompanyNot: new FormControl<string[]>([]),
    clientCompanyId: new FormControl<number | null>(null),
    clientCompanyName: new FormControl<string>(''),
    clientCompanyCnpj: new FormControl<string>(''),
    clientCompanyCpf: new FormControl<string>(''),
    clientCompanyRg: new FormControl<string | null>(null),
  });
  formClientCompanyFilter = new FormGroup({
    clientCompanyId: new FormControl<number | null>(null),
    clientCompanyFantasia: new FormControl<string>(''),
    clientCompanyName: new FormControl<string>(''),
    clientCompanyCnpj: new FormControl<string>(''),
    clientCompanyCpf: new FormControl<string>(''),
    clientCompanyRg: new FormControl<string | null>(null),
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
    driverEntryRg: new FormControl<string | null>(null),
    driverEntryPhoto: new FormControl<string | null>(null),
    driverEntrySignature: new FormControl<string | null>(null),
    driverEntryPhotoDoc1: new FormControl<string | null>(null),
    driverEntryPhotoDoc2: new FormControl<string | null>(null),
    driverExitName: new FormControl<string>(''),
    driverExitCpf: new FormControl<string>(''),
    driverExitRg: new FormControl<string | null>(null),
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
  private budget: IBudgetNew;

  itemsButtonMenu: MenuItem[] = [];

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
    private busyService: BusyService

  ) { }

  ngOnInit(): void {
    this.busyService.busy();

    //Id vehicle entry
    this.id = this.activatedRoute.snapshot.params['id'];

    //get User
    this.userService.getUser$().subscribe(data => {
      this.user = data;
    });

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
        this.stepEvent(this.vehicleEntry.stepEntry);
        this.loadForms();
        this.busyService.idle();
      }
    }, error => {
      this.busyService.idle();
      if (error.status == 404) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Vaículo não encontrado", icon: 'pi pi-times' });
        setTimeout(() => {

          this.router.navigateByUrl("/portaria/veiculos");
        }, 2000)
      } else {
        this.router.navigateByUrl("/");
      }
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

    this.itemsButtonMenu = [
      {
        icon: 'pi pi-thumbs-up',
        tooltipOptions: { tooltipLabel: 'Autorizar Saída' },
        command: () => {
          this.addAuthorization();
        }
      },
      {
        icon: 'pi pi-print',
        tooltipOptions: { tooltipLabel: 'Imprimir' },
        command: () => {
          this.messageService.add({ severity: 'info', summary: 'Print', detail: 'Data Print' });
        }
      },
      {
        icon: 'pi pi-file',
        tooltipOptions: { tooltipLabel: 'Orçamento' },
        command: () => {
          this.confirmGerarOrcamento();
        }
      },
      {
        icon: 'pi pi-upload',
        tooltipOptions: { tooltipLabel: 'Salvar' },
        command: () => {
          this.saveVehicle();
        }
      }
    ];

    this.disableInput();

  }

  private stepEvent(event: string) {

    switch (event) {
      case "Attendant":
        this.stepEntry = [
          { description: 'Atendimento', icon: 'pi pi-spin pi-cog', color: '#673AB7' },
          { description: 'Orçamento', icon: 'pi pi-times', color: '#607D8B' },
          { description: 'Serviço em execução', icon: 'pi pi-times', color: '#607D8B' },
          { description: 'Serviço concluido', icon: 'pi pi-times', color: '#607D8B' },
          { description: 'Saída', icon: 'pi pi-times', color: '#607D8B' }
        ];
        break;
      case "Budget":
        this.stepEntry = [
          { description: 'Atendimento', icon: 'pi pi-check', color: '#22c55e' },
          { description: 'Orçamento', icon: 'pi pi-spin pi-cog', color: '#673AB7' },
          { description: 'Serviço em execução', icon: 'pi pi-times', color: '#607D8B' },
          { description: 'Serviço concluido', icon: 'pi pi-times', color: '#607D8B' },
          { description: 'Saída', icon: 'pi pi-times', color: '#607D8B' }
        ];
        break;
      case "Running_Service":
        this.stepEntry = [
          { description: 'Atendimento', icon: 'pi pi-check', color: '#22c55e' },
          { description: 'Orçamento', icon: 'pi pi-check', color: '#22c55e' },
          { description: 'Serviço em execução', icon: 'pi pi-spin pi-cog', color: '#673AB7' },
          { description: 'Serviço concluido', icon: 'pi pi-times', color: '#607D8B' },
          { description: 'Saída', icon: 'pi pi-times', color: '#607D8B' }
        ];
        break;
      case "Full_Service":
        this.stepEntry = [
          { description: 'Atendimento', icon: 'pi pi-check', color: '#22c55e' },
          { description: 'Orçamento', icon: 'pi pi-check', color: '#22c55e' },
          { description: 'Serviço em execução', icon: 'pi pi-check', color: '#22c55e' },
          { description: 'Serviço concluido', icon: 'pi pi-spin pi-cog', color: '#673AB7' },
          { description: 'Saída', icon: 'pi pi-times', color: '#607D8B' }
        ];
        break;
      case "Exit":
        this.stepEntry = [
          { description: 'Atendimento', icon: 'pi pi-check', color: '#22c55e' },
          { description: 'Orçamento', icon: 'pi pi-check', color: '#22c55e' },
          { description: 'Serviço em execução', icon: 'pi pi-check', color: '#22c55e' },
          { description: 'Serviço concluido', icon: 'pi pi-check', color: '#22c55e' },
          { description: 'Saída', icon: 'pi pi-check', color: '#22c55e' }
        ];
        break;
      default:
        this.stepEntry = [
          { description: 'Atendimento', icon: 'pi pi-times', color: '#607D8B' },
          { description: 'Orçamento', icon: 'pi pi-times', color: '#607D8B' },
          { description: 'Serviço em execução', icon: 'pi pi-times', color: '#607D8B' },
          { description: 'Serviço concluido', icon: 'pi pi-times', color: '#607D8B' },
          { description: 'Saída', icon: 'pi pi-times', color: '#607D8B' }
        ];
        break;
    }

  }
  private async openCamera(): Promise<Photo> {

    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });
    return image;
  }

  private disableInput() {
    this.formVehicle.get('nameUserExitAuth1').disable();
    this.formVehicle.get('nameUserExitAuth2').disable();
  }
  private enableInput() {
    this.formVehicle.get('nameUserExitAuth1').enable();
    this.formVehicle.get('nameUserExitAuth2').enable();
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
      datePrevisionExit: this.vehicleEntry.datePrevisionExit != "" ? new Date(this.vehicleEntry.datePrevisionExit) : null,
      color: [{ color: this.vehicleEntry.color }],
      placa: this.vehicleEntry.placa,
      frota: this.vehicleEntry.frota,
      modelVehicle: [this.modelVehicle],
      kmEntry: this.vehicleEntry.kmEntry == "" ? null : this.vehicleEntry.kmEntry,
      kmExit: this.vehicleEntry.kmExit == "" ? null : this.vehicleEntry.kmExit,
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
      quantityExtinguisher: this.vehicleEntry.quantityExtinguisher == 0 ? null : this.vehicleEntry.quantityExtinguisher,
      quantityTrafficCone: this.vehicleEntry.quantityTrafficCone == 0 ? null : this.vehicleEntry.quantityTrafficCone,
      quantityTire: this.vehicleEntry.quantityTire == 0 ? null : this.vehicleEntry.quantityTire,
      quantityTireComplete: this.vehicleEntry.quantityTireComplete == 0 ? null : this.vehicleEntry.quantityTireComplete,
      quantityToolBox: this.vehicleEntry.quantityToolBox == 0 ? null : this.vehicleEntry.quantityToolBox,
      numServiceOrder: this.vehicleEntry.numServiceOrder,
      numNfe: this.vehicleEntry.numNfe == "" ? null : this.vehicleEntry.numNfe,
      numNfse: this.vehicleEntry.numNfse == "" ? null : this.vehicleEntry.numNfse,
      information: this.vehicleEntry.information,
    });
    //Validation placa
    if (this.vehicleEntry.vehicleNew == 'yes') {
      this.deleteRequirePlaca();
    } else {
      this.addRequirePlaca();
    }
    if (this.vehicleEntry.dateExitAuth1) {
      this.dateExitAuth1 = this.vehicleEntry.dateExitAuth1!.toString();
    }
    if (this.vehicleEntry.dateExitAuth2) {
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
    if (this.vehicleEntry.clientCompanyName != '' || this.vehicleEntry.clientCompanyId != 0) {
      this.formClientCompany.patchValue({
        clientCompanyId: this.vehicleEntry.clientCompanyId,
        clientCompanyName: this.vehicleEntry.clientCompanyName,
        clientCompanyCnpj: this.vehicleEntry.clientCompanyCnpj,
        clientCompanyCpf: this.vehicleEntry.clientCompanyCpf,
        clientCompanyRg: this.vehicleEntry.clientCompanyRg == "" ? null : this.vehicleEntry.clientCompanyRg,
      });
      this.addRequireClientCompanyId();
      this.addRequireClientCompanyName();
      if (this.vehicleEntry.clientCompanyCnpj != "") {
        this.addRequireClientCompanyCnpj();
      } else {
        this.addRequireClientCompanyCpf();
      }
    } else {
      this.formClientCompany.patchValue({
        clientCompanyNot: ['not'],
        clientCompanyId: null,
        clientCompanyRg: null
      });

    }
    //Form Driver
    this.formDriver.patchValue({
      driverEntryName: this.vehicleEntry.driverEntryName,
      driverEntryCpf: this.vehicleEntry.driverEntryCpf,
      driverEntryRg: this.vehicleEntry.driverEntryRg == "" ? null : this.vehicleEntry.driverEntryRg,
      driverEntryPhoto: this.vehicleEntry.driverEntryPhoto,
      driverEntrySignature: this.vehicleEntry.driverEntrySignature,
      driverEntryPhotoDoc1: this.vehicleEntry.driverEntryPhotoDoc1,
      driverEntryPhotoDoc2: this.vehicleEntry.driverEntryPhotoDoc2,

      driverExitName: this.vehicleEntry.driverExitName,
      driverExitCpf: this.vehicleEntry.driverExitCpf,
      driverExitRg: this.vehicleEntry.driverExitRg == "" ? null : this.vehicleEntry.driverExitRg,
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

    //Add Require
    if (this.vehicleEntry.driverEntryCpf != "") {
      this.addRequireDriverEntryCpf();
    }
    if (this.vehicleEntry.driverEntryRg != "") {
      this.addRequireDriverEntryRg();
    }

    if (this.vehicleEntry.statusAuthExit != this.notAuth) {
      this.addRequireAttendant();
      this.addRequireDriverExitName();
      if (this.vehicleEntry.driverExitCpf != "") {
        this.addRequireDriverExitCpf();
      }
      if (this.vehicleEntry.driverExitRg != "") {
        this.addRequireDriverExitRg();
      }

    }

  }
  //Vehicle
  public placaRequiredAdd() {
    this.addRequirePlaca();
  }
  public placaRequiredRemove() {

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

          this.deleteRequirePlaca();
          this.cleanPlaca();
          this.messageService.add({ severity: 'success', summary: 'Placa', detail: 'Removida com sucesso', life: 2000 });
        },
        reject: () => {
          this.formVehicle.patchValue({ vehicleNew: 'not' });
        }
      });
    }

    if (this.formVehicle.value.placa.trim() == '' && this.formVehicle.value.vehicleNew == 'yes') {
      this.deleteRequirePlaca();
      this.cleanPlaca();
    }

  }
  private addRequirePlaca() {
    this.formVehicle.controls['placa'].addValidators(Validators.required);
    this.formVehicle.controls['placa'].updateValueAndValidity();
  }
  private deleteRequirePlaca() {
    this.formVehicle.controls['placa'].removeValidators(Validators.required);
    this.formVehicle.controls['placa'].updateValueAndValidity();
  }
  private cleanPlaca() {
    this.formVehicle.patchValue({ placa: '' });
    this.vehicleEntry.placa = '';
  }
  private addRequireAttendant() {
    this.formVehicle.controls['userAttendant'].addValidators(Validators.required);
    this.formVehicle.controls['userAttendant'].updateValueAndValidity();
  }
  private deleteRequireAttendant() {
    this.formVehicle.controls['userAttendant'].removeValidators(Validators.required);
    this.formVehicle.controls['userAttendant'].updateValueAndValidity();
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
  private updateAuthExitStatus() {
    if (this.formVehicle.value.statusAuthExit == this.firstAuth) {
      this.formVehicle.patchValue({
        statusAuthExit: this.notAuth,
      })
      this.deleteRequireForms();
    } else if (this.formVehicle.value.statusAuthExit == this.authorized) {
      this.formVehicle.patchValue({
        statusAuthExit: this.firstAuth,
      })
    }
  }
  private deleteRequireForms() {
    this.deleteRequireAttendant();
    this.deleteRequireDriverExitName();
    this.deleteRequireDriverExitCpf();
    this.deleteRequireDriverExitRg();
  }
  private addRequireForms() {
    this.addRequireAttendant();
    this.addRequireDriverEntryCpf();
    this.addRequireDriverEntryRg();
    this.addRequireDriverExitName();
    this.addRequireDriverExitCpf();
    this.addRequireDriverExitRg();
  }
  public deleteAuth1() {
    if (this.formVehicle.value.idUserExitAuth1 != 0) {
      var auth = new VehicleEntryAuth();
      auth.idVehicle = this.id;
      auth.idUserExitAuth = this.user.id;
      auth.nameUserExitAuth = this.user.name;
      this.vehicleService.entryDeleteAuth1(auth).subscribe((data) => {
        if (data.body == "success.") {
          this.messageService.add({ severity: 'success', summary: 'Autorização', detail: 'Removida com sucesso', icon: 'pi pi-check' });
          this.formVehicle.patchValue({
            idUserExitAuth1: 0,
            nameUserExitAuth1: '',
            dateExitAuth1: null
          });

          this.dateExitAuth1 = "";
          this.updateAuthExitStatus();
        }
      }, error => {

      });
    }
  }
  public deleteAuth2() {
    if (this.formVehicle.value.idUserExitAuth2 != 0) {
      var auth = new VehicleEntryAuth();
      auth.idVehicle = this.id;
      auth.idUserExitAuth = this.user.id;
      auth.nameUserExitAuth = this.user.name;
      this.vehicleService.entryDeleteAuth2(auth).subscribe((data) => {
        if (data.body == "success.") {
          this.messageService.add({ severity: 'success', summary: 'Autorização', detail: 'Removida com sucesso', icon: 'pi pi-check' });
          this.formVehicle.patchValue({
            idUserExitAuth2: 0,
            nameUserExitAuth2: '',
            dateExitAuth2: null
          });

          this.dateExitAuth2 = "";
          this.updateAuthExitStatus();
        }
      }, error => {

      });
    }
  }
  private showUserAttendant() {
    this.messageService.add({ severity: 'error', summary: 'Consultor', detail: "Não informado", icon: 'pi pi-times' });
  }
  private showClientCompany() {
    this.messageService.add({ severity: 'error', summary: 'Empresa', detail: "Não informada", icon: 'pi pi-times' });
  }

  //Porteiro

  //Proprietario
  //Valid Id
  private addRequireClientCompanyId() {
    this.formClientCompany.controls['clientCompanyId'].addValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyId'].updateValueAndValidity();
  }
  private deleteRequireClientCompanyId() {
    this.formClientCompany.controls['clientCompanyId'].removeValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyId'].updateValueAndValidity();
  }
  //Valid Name
  private addRequireClientCompanyName() {
    this.formClientCompany.controls['clientCompanyName'].addValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyName'].updateValueAndValidity();
  }
  private deleteRequireClientCompanyName() {
    this.formClientCompany.controls['clientCompanyName'].removeValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyName'].updateValueAndValidity();
  }
  //Valid CNPJ
  private addRequireClientCompanyCnpj() {
    this.formClientCompany.controls['clientCompanyCnpj'].addValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyCnpj'].updateValueAndValidity();
  }
  private deleteRequireClientCompanyCnpj() {
    this.formClientCompany.controls['clientCompanyCnpj'].removeValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyCnpj'].updateValueAndValidity();
  }
  //Valid CPF
  private addRequireClientCompanyCpf() {
    this.formClientCompany.controls['clientCompanyCpf'].addValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyCpf'].updateValueAndValidity();
  }
  private deleteRequireClientCompanyCpf() {
    this.formClientCompany.controls['clientCompanyCpf'].removeValidators(Validators.required);
    this.formClientCompany.controls['clientCompanyCpf'].updateValueAndValidity();
  }
  public validationClientCompany() {
    if (this.formClientCompany.value.clientCompanyNot.length == 0) {
      this.deleteRequireClientCompanyId();
      this.deleteRequireClientCompanyName();
      this.deleteRequireClientCompanyCnpj();
      this.deleteRequireClientCompanyCpf();

      this.cleanFormClientCompany();
    } else {
      this.addRequireClientCompanyId();
      this.addRequireClientCompanyName();
      this.addRequireClientCompanyCnpj();
      this.addRequireClientCompanyCpf();
    }
  }
  private cleanFormClientCompany() {
    this.formClientCompany.patchValue({
      clientCompanyId: null,
      clientCompanyName: '',
      clientCompanyCnpj: '',
      clientCompanyCpf: '',
      clientCompanyRg: null
    });

  }
  public selectClientCompany() {

    if (this.dialogSelectClientCompany) {
      this.dialogVisibleClientCompany = false;
    }
    this.formClientCompany.patchValue({
      clientCompanyId: this.dialogSelectClientCompany.id,
      clientCompanyName: this.dialogSelectClientCompany.name,
      clientCompanyCnpj: this.dialogSelectClientCompany.cnpj,
      clientCompanyCpf: this.dialogSelectClientCompany.cpf,
      clientCompanyRg: this.dialogSelectClientCompany.rg
    });

    this.formClientCompany.patchValue({
      clientCompanyNot: []
    })

    if (this.dialogSelectClientCompany.cnpj == "") {
      this.deleteRequireClientCompanyCnpj();
      this.addRequireClientCompanyCpf();
    } else {
      this.deleteRequireClientCompanyCpf();
      this.addRequireClientCompanyCnpj();
    }


  }
  public hideDialogFilterClientCompany() {
    this.dialogVisibleClientCompany = false;
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
  public showDialogClientCompany() {
    this.dialogVisibleClientCompany = true;
  }
  //Driver
  public async photoEntryDriver() {
    const image = this.openCamera();
    this.driverEntryPhoto = (await image).base64String;
    this.formDriver.patchValue({ driverEntryPhoto: this.driverEntryPhoto });
  }
  public async photoEntryFile1Driver() {
    const image = this.openCamera();
    this.driverEntryPhotoDoc1 = (await image).base64String;
    this.formDriver.patchValue({ driverEntryPhotoDoc1: this.driverEntryPhotoDoc1 });
  }
  public async photoEntryFile2Driver() {
    const image = this.openCamera();
    this.driverEntryPhotoDoc2 = (await image).base64String;
    this.formDriver.patchValue({ driverEntryPhotoDoc2: this.driverEntryPhotoDoc2 });
  }
  public async photoExitDriver() {
    const image = this.openCamera();
    this.driverExitPhoto = (await image).base64String;
    this.formDriver.patchValue({ driverExitPhoto: this.driverExitPhoto });
  }
  public async photoExitFile1Driver() {
    const image = this.openCamera();
    this.driverExitPhotoDoc1 = (await image).base64String;
    this.formDriver.patchValue({ driverExitPhotoDoc1: this.driverExitPhotoDoc1 });
  }
  public async photoExitFile2Driver() {
    const image = this.openCamera();
    this.driverExitPhotoDoc2 = (await image).base64String;
    this.formDriver.patchValue({ driverExitPhotoDoc2: this.driverExitPhotoDoc2 });
  }
  //Remover fotos motorista entrada
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
  //Remover fotos motorista saída
  public deleteExitPhotoDriver() {
    this.driverExitPhoto = "";
    this.formDriver.patchValue({ driverExitPhoto: null });
  }
  public deleteExitFileDriver1() {
    this.driverExitPhotoDoc1 = "";
    this.formDriver.patchValue({ driverExitPhotoDoc1: null });
  }
  public deleteExitFileDriver2() {
    this.driverExitPhotoDoc2 = "";
    this.formDriver.patchValue({ driverExitPhotoDoc2: null });
  }
  //CPF
  private addRequireDriverEntryCpf() {
    this.formDriver.controls['driverEntryCpf'].addValidators(Validators.required);
    this.formDriver.controls['driverEntryCpf'].updateValueAndValidity();
  }
  private deleteRequireDriverEntryCpf() {
    this.formDriver.controls['driverEntryCpf'].removeValidators(Validators.required);
    this.formDriver.controls['driverEntryCpf'].updateValueAndValidity();
  }
  //RG
  private addRequireDriverEntryRg() {
    this.formDriver.controls['driverEntryRg'].addValidators(Validators.required);
    this.formDriver.controls['driverEntryRg'].updateValueAndValidity();
  }
  private deleteRequireDriverEntryRg() {
    this.formDriver.controls['driverEntryRg'].removeValidators(Validators.required);
    this.formDriver.controls['driverEntryRg'].updateValueAndValidity();
  }
  //Name driver Exit
  private addRequireDriverExitName() {
    this.formDriver.controls['driverExitName'].addValidators(Validators.required);
    this.formDriver.controls['driverExitName'].updateValueAndValidity();
  }
  private deleteRequireDriverExitName() {
    this.formDriver.controls['driverExitName'].removeValidators(Validators.required);
    this.formDriver.controls['driverExitName'].updateValueAndValidity();
  }
  //CPF
  private addRequireDriverExitCpf() {
    this.formDriver.controls['driverExitCpf'].addValidators(Validators.required);
    this.formDriver.controls['driverExitCpf'].updateValueAndValidity();
  }
  private deleteRequireDriverExitCpf() {
    this.formDriver.controls['driverExitCpf'].removeValidators(Validators.required);
    this.formDriver.controls['driverExitCpf'].updateValueAndValidity();
  }
  //RG
  private addRequireDriverExitRg() {
    this.formDriver.controls['driverExitRg'].addValidators(Validators.required);
    this.formDriver.controls['driverExitRg'].updateValueAndValidity();
  }
  private deleteRequireDriverExitRg() {
    this.formDriver.controls['driverExitRg'].removeValidators(Validators.required);
    this.formDriver.controls['driverExitRg'].updateValueAndValidity();
  }

  showPlacaExist(placa: string) {
    const uppercase = new UpperCasePipe();
    this.messageService.add({ severity: 'error', summary: 'Placa ' + uppercase.transform(placa), detail: "Vaículo já se encontra na empresa", icon: 'pi pi-truck' });
  }
  //Orçamento
  public confirmGerarOrcamento() {

    if (this.vehicleEntry.budgetStatus != "semOrcamento") {
      this.router.navigateByUrl("/oficina/orcamento/" + this.formVehicle.value.id);
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
              this.vehicleEntry.budgetStatus = data.body.status;
              this.messageService.add({ severity: 'info', summary: 'Orçamento - ' + data.body.id, detail: 'Gerado com sucesso', life: 3000 });
              setTimeout(() => {
                this.router.navigateByUrl('/oficina/orcamento/' + this.formVehicle.value.id);
              }, 3000);
            }

          }, error => {
            const CLIENTCOMPANY = "ClientCompany not informed.";
            const ATTENDANT = "Attendant not informed.";
            if (error.status == 401) {
              if (error.error.messageError == CLIENTCOMPANY) {
                this.messageService.add({ severity: 'error', summary: 'Empresa', detail: "Não informada", icon: 'pi pi-times' });
              }
              if (error.error.messageError == ATTENDANT) {
                this.messageService.add({ severity: 'error', summary: 'Consultor', detail: "Não informado", icon: 'pi pi-times' });
              }
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
    const vehicleValue = this.formVehicle.value;
    const clientCompanyValue = this.formClientCompany.value;
    const driverValue = this.formDriver.value;

    if (vehicleValue.dateEntry == null) {
      this.messageService.add({ severity: 'error', summary: 'Data Entrada', detail: "Não informada", icon: 'pi pi-times' });
      return false;
    }
    if (vehicleValue.dateEntry > new Date()) {
      this.messageService.add({ severity: 'error', summary: 'Data Entrada', detail: "Maior que data atual", icon: 'pi pi-times' });
      return false;
    }
    if (vehicleValue.datePrevisionExit != null && vehicleValue.datePrevisionExit < vehicleValue.dateEntry) {
      this.messageService.add({ severity: 'error', summary: 'Data Previsão Saída', detail: "Menor que data entrada", icon: 'pi pi-times' });
      return false;
    }
    if (vehicleValue.vehicleNew == "not") {
      if (vehicleValue.placa == "") {
        this.messageService.add({ severity: 'error', summary: 'Placa', detail: "Não informada", icon: 'pi pi-times' });
        return false;
      }
    }
    if (vehicleValue.modelVehicle.length == 0) {
      this.messageService.add({ severity: 'error', summary: 'Modelo', detail: "Não selecionado", icon: 'pi pi-times' });
      return false;
    }
    if (vehicleValue.color.length == 0) {
      this.messageService.add({ severity: 'error', summary: 'Cor', detail: "Não informada", icon: 'pi pi-times' });
      return false;
    }
    if (vehicleValue.statusAuthExit != this.notAuth) {
      if (vehicleValue.userAttendant.length == 0) {
        this.messageService.add({ severity: 'error', summary: 'Consultor', detail: "Não informada", icon: 'pi pi-times' });
        return false;
      }
    }
    if (clientCompanyValue.clientCompanyNot.length == 0) {
      if (clientCompanyValue.clientCompanyId == null || clientCompanyValue.clientCompanyName == "") {
        this.messageService.add({ severity: 'error', summary: 'Proprietário', detail: "Não informado", icon: 'pi pi-times' });
        return false;
      }
    }
    if (driverValue.driverEntryName == "") {
      this.messageService.add({ severity: 'error', summary: 'Motorista Entrada', detail: "Não informado", icon: 'pi pi-times' });
      return false;
    }
    if (driverValue.driverEntryCpf == "" && driverValue.driverEntryRg == null) {
      this.messageService.add({ severity: 'error', summary: 'Motorista Entrada', detail: "Não informado", icon: 'pi pi-times' });
      return false;
    }
    if (vehicleValue.statusAuthExit != this.notAuth) {
      if (driverValue.driverExitName == "") {
        this.messageService.add({ severity: 'error', summary: 'Motorista Saída', detail: "Não informado", icon: 'pi pi-times' });
        return false;
      }
      if (driverValue.driverExitCpf == "" && driverValue.driverExitRg == null) {
        this.messageService.add({ severity: 'error', summary: 'Motorista Saída', detail: "Não informado", icon: 'pi pi-times' });
        return false;
      }
    }

    this.enableInput();

    return true;
  }
  private loadingVehicle() {
    const vehicleValue = this.formVehicle.value;
    const clientCompanyValue = this.formClientCompany.value;
    const driverValue = this.formDriver.value;

    this.vehicleEntry.dateEntry = vehicleValue.dateEntry;
    this.vehicleEntry.datePrevisionExit = vehicleValue?.datePrevisionExit ?? "";
    this.vehicleEntry.placa = vehicleValue.placa;
    this.vehicleEntry.frota = vehicleValue.frota;
    this.vehicleEntry.modelId = vehicleValue.modelVehicle.at(0).id;
    this.vehicleEntry.modelDescription = vehicleValue.modelVehicle.at(0).description;
    this.vehicleEntry.color = vehicleValue.color.at(0).color;

    this.vehicleEntry.idUserAttendant = vehicleValue.userAttendant.at(0)?.id ?? 0;
    this.vehicleEntry.nameUserAttendant = vehicleValue.userAttendant.at(0)?.name ?? "";

    this.vehicleEntry.kmEntry = vehicleValue?.kmEntry ?? "";
    this.vehicleEntry.kmExit = vehicleValue?.kmExit ?? "";

    this.vehicleEntry.idUserExitAuth1 = vehicleValue?.idUserExitAuth1 ?? 0;
    this.vehicleEntry.nameUserExitAuth1 = vehicleValue?.nameUserExitAuth1 ?? "";
    this.vehicleEntry.dateExitAuth1 = vehicleValue?.dateExitAuth1 ?? "";
    this.vehicleEntry.idUserExitAuth2 = vehicleValue?.idUserExitAuth2 ?? 0;
    this.vehicleEntry.nameUserExitAuth2 = vehicleValue?.nameUserExitAuth2 ?? "";
    this.vehicleEntry.dateExitAuth2 = vehicleValue?.dateExitAuth2 ?? "";
    this.vehicleEntry.statusAuthExit = vehicleValue.statusAuthExit;

    this.vehicleEntry.quantityTrafficCone = vehicleValue?.quantityTrafficCone ?? 0;
    this.vehicleEntry.quantityExtinguisher = vehicleValue?.quantityExtinguisher ?? 0;
    this.vehicleEntry.quantityTire = vehicleValue?.quantityTire ?? 0;
    this.vehicleEntry.quantityTireComplete = vehicleValue?.quantityTireComplete ?? 0;
    this.vehicleEntry.quantityToolBox = vehicleValue?.quantityToolBox ?? 0;
    this.vehicleEntry.numServiceOrder = vehicleValue?.numServiceOrder ?? "";
    this.vehicleEntry.numNfe = vehicleValue?.numNfe ?? "";
    this.vehicleEntry.numNfse = vehicleValue?.numNfse ?? "";
    this.vehicleEntry.photo1 = vehicleValue.photo1;
    this.vehicleEntry.photo2 = vehicleValue.photo2;
    this.vehicleEntry.photo3 = vehicleValue.photo3;
    this.vehicleEntry.photo4 = vehicleValue.photo4;
    this.vehicleEntry.vehicleNew = vehicleValue.vehicleNew;
    this.vehicleEntry.serviceOrder = vehicleValue.serviceOrder;
    this.vehicleEntry.information = vehicleValue.information;

    if (clientCompanyValue.clientCompanyNot.length == 1) {
      this.vehicleEntry.clientCompanyId = 0;
      this.vehicleEntry.clientCompanyName = "";
      this.vehicleEntry.clientCompanyCnpj = "";
      this.vehicleEntry.clientCompanyCpf = "";
      this.vehicleEntry.clientCompanyRg = ""
    } else {
      this.vehicleEntry.clientCompanyId = clientCompanyValue.clientCompanyId;
      this.vehicleEntry.clientCompanyName = clientCompanyValue.clientCompanyName;
      this.vehicleEntry.clientCompanyCnpj = clientCompanyValue.clientCompanyCnpj;
      this.vehicleEntry.clientCompanyCpf = clientCompanyValue.clientCompanyCpf;
      this.vehicleEntry.clientCompanyRg = clientCompanyValue?.clientCompanyRg ?? "";
    }

    this.vehicleEntry.driverEntryName = driverValue.driverEntryName;
    this.vehicleEntry.driverEntryCpf = driverValue.driverEntryCpf;
    this.vehicleEntry.driverEntryRg = driverValue?.driverEntryRg ?? "";
    this.vehicleEntry.driverEntryPhoto = driverValue.driverEntryPhoto;
    this.vehicleEntry.driverEntrySignature = driverValue.driverEntrySignature;
    this.vehicleEntry.driverEntryPhotoDoc1 = driverValue.driverEntryPhotoDoc1;
    this.vehicleEntry.driverEntryPhotoDoc2 = driverValue.driverEntryPhotoDoc2;

    this.vehicleEntry.driverExitName = driverValue.driverExitName;
    this.vehicleEntry.driverExitCpf = driverValue.driverExitCpf;
    this.vehicleEntry.driverExitRg = driverValue?.driverExitRg ?? "";
    this.vehicleEntry.driverExitPhoto = driverValue.driverExitPhoto;
    this.vehicleEntry.driverExitSignature = driverValue.driverExitSignature;
    this.vehicleEntry.driverExitPhotoDoc1 = driverValue.driverExitPhotoDoc1;
    this.vehicleEntry.driverExitPhotoDoc2 = driverValue.driverExitPhotoDoc2;

  }
  public saveVehicle() {
    if (this.validForms()) {
      //Loading data
      this.loadingVehicle();

      this.vehicleService.entryUpdate$(this.vehicleEntry).subscribe((data) => {
        if (data.status == 200) {
          this.messageService.add({ severity: 'success', summary: 'Veículo', detail: 'Atualizado com sucesso', icon: 'pi pi-check' });
          this.disableInput();
        }
      }, (error) => {
        const CLIENTCOMPANY = "ClientCompany not informed.";
        const ATTENDANT = "Attendant not informed.";
        const BUDGET_ATTENDANT = "BUDGET-Attendant not informed.";
        const BUDGET_CLIENTCOMPANY = "BUDGET-ClientCompany not informed.";
        if (error.status == 401) {
          if (error.error.messageError == ATTENDANT) {
            this.showUserAttendant();
          }
          if (error.error.messageError == CLIENTCOMPANY) {
            this.showClientCompany();
          }
          if (error.error.messageError == BUDGET_ATTENDANT) {
            this.messageService.add({ severity: 'info', summary: 'Informação', detail: "Véiculo possui orçamento" });
            this.showUserAttendant();
          }
          if (error.error.messageError == BUDGET_CLIENTCOMPANY) {
            this.messageService.add({ severity: 'info', summary: 'Informação', detail: "Véiculo possui orçamento" });
            this.showClientCompany();

          }
        }

      });

    }

  }
  //Add Auth
  public addAuthorization() {
    const uppercase = new UpperCasePipe();
    if (this.formVehicle.value.statusAuthExit != this.authorized) {
      var auth = new VehicleEntryAuth();
      auth.idVehicle = this.vehicleEntry.id;
      auth.idUserExitAuth = this.user.id;
      auth.nameUserExitAuth = this.user.name;
      auth.dateExitAuth = "";

      this.vehicleService.entryAddAuth(auth).subscribe((data) => {
        if (data.status == 200) {
          if (this.formVehicle.value.statusAuthExit == this.notAuth) {
            this.formVehicle.patchValue({
              statusAuthExit: this.firstAuth,
            })
          } else if (this.formVehicle.value.statusAuthExit == this.firstAuth) {
            this.formVehicle.patchValue({
              statusAuthExit: this.authorized,
            })
          }

          if (this.formVehicle.value.idUserExitAuth1 == 0) {
            this.formVehicle.patchValue({
              idUserExitAuth1: data.body.idUserExitAuth,
              nameUserExitAuth1: data.body.nameUserExitAuth,
              dateExitAuth1: data.body.dateExitAuth
            });

            this.dateExitAuth1 = data.body.dateExitAuth;
          } else {
            this.formVehicle.patchValue({
              idUserExitAuth2: data.body.idUserExitAuth,
              nameUserExitAuth2: data.body.nameUserExitAuth,
              dateExitAuth2: data.body.dateExitAuth
            });
            this.dateExitAuth2 = data.body.dateExitAuth;
          }
          //Valid
          this.addRequireForms();

          if (this.formVehicle.value.vehicleNew == 'yes') {
            //Autorização de saída
            if (this.formVehicle.value.statusAuthExit == this.firstAuth) {
              this.messageService.add({ severity: 'success', summary: 'Veículo Autorizado', detail: 'Veículo NOVO', icon: 'pi pi-check-circle' });
            }
            //Saída liberada
            if (this.formVehicle.value.statusAuthExit == this.authorized) {
              this.messageService.add({ severity: 'success', summary: 'Veículo Liberado', detail: 'Veículo NOVO', icon: 'pi pi-thumbs-up-fill' });
            }
          } else {
            //Autorização de saída
            if (this.formVehicle.value.statusAuthExit == this.firstAuth) {
              this.messageService.add({ severity: 'success', summary: 'Veículo Autorizado', detail: 'Placa ' + uppercase.transform(this.formVehicle.value.placa), icon: 'pi pi-check-circle' });
            }

            //Saída liberada
            if (this.formVehicle.value.statusAuthExit == this.authorized) {
              this.messageService.add({ severity: 'success', summary: 'Veículo Liberado', detail: 'Placa ' + uppercase.transform(this.formVehicle.value.placa), icon: 'pi pi-thumbs-up-fill' });
            }
          }

        }

      }, error => {
        if (error.status == 401) {
          const CLIENTCOMPANY = "ClientCompany not informed.";
          const ATTENDANT = "Attendant not informed.";
          const DRIVEREXIT = "DriverExit not informed.";
          if (error.status == 401) {
            if (error.error.messageError == CLIENTCOMPANY) {
              this.showClientCompany();
            } else if (error.error.messageError == ATTENDANT) {
              this.showUserAttendant();
            } else if (error.error.messageError == DRIVEREXIT) {
              this.messageService.add({ severity: 'error', summary: 'Motorista Saída', detail: "Não informado", icon: 'pi pi-times' });
            }
          }
        }

      });

    } else {
      this.messageService.add({ severity: 'info', summary: 'Veículo Liberado', detail: "Placa " + uppercase.transform(this.formVehicle.value.placa), icon: 'pi pi-thumbs-up-fill' });
    }
  }


}
