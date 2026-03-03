import { Component, DoCheck, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { environment } from '../../../../environments/environment';
//PrimeNg
import { PrimeNGConfig } from 'primeng/api';
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
import { CheckboxModule } from 'primeng/checkbox';
import { StepsModule } from 'primeng/steps';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';
import { DropdownModule } from 'primeng/dropdown';

//Service
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { UserService } from '../../../services/user/user.service';
import { VehicleModelService } from '../../../services/vehicle-model/vehicle-model.service';
//Interface
import { IBudgetNew } from '../../../interfaces/budget/ibudget-new';
import { IColor } from '../../../interfaces/icolor';
//Constants
import { IMAGE_MAX_SIZE_LABEL } from '../../../util/constants';
//Class
import { User } from '../../../models/user/user';
import { ClientCompany } from '../../../models/clientcompany/client-company';
import { VehicleEntry } from '../../../models/vehicle/vehicle-entry';
import { ModelVehicle } from '../../../models/vehicle-model/model-vehicle';
import { Driver } from '../../../models/driver/driver';
//Service
import { StorageService } from '../../../services/storage/storage.service';
import { BudgetService } from '../../../services/budget/budget.service';
import { LayoutService } from '../../../layouts/layout/service/layout.service';
import { VehicleEntryAuth } from '../../../models/vehicle/vehicle-entry-auth';
import { BusyService } from '../../../components/loading/busy.service';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IBudget } from '../../../interfaces/budget/ibudget';
//Components
import { FilterClientComponent } from '../../../components/filter.client/filter.client.component';
import { StatusVehicle } from '../../../models/enum/status-vehicle';
import { FilterDriverComponent } from '../../../components/filter.driver/filter.driver.component';
import { DriverService } from '../../../services/driver/driver.service';
import { MessageResponse } from '../../../models/message/message-response';
import { SuccessError } from '../../../models/enum/success-error';
import { PermissionService } from '../../../services/permission/permission.service';
import { ShareWhatsAppService } from '../../../services/share/share-whatsapp.service';
import { YesNot } from '../../../models/enum/yes-not';
import { StatusAuthExit } from '../../../models/enum/status-auth-exit';
import { PhotoResult } from '../../../interfaces/photo-result';
import { PhotoService } from '../../../services/photo/photo.service';
import { PhotoResultStatus } from '../../../models/enum/photo-result-status';
import { ClientCompanyService } from '../../../services/clientecompany/client-company.service';
import { ModuleConciergeVehicleChecklist } from '../../../models/vehicle/module-concierge-vehicle-checklist';
import { VehicleEntryChecklist } from '../../../models/vehicle/vehicle-entry-checklist';

@Component({
  selector: 'app-manutencao',
  standalone: true,
  imports: [CommonModule, FilterClientComponent, FilterDriverComponent, RouterModule, MessagesModule,
    TabViewModule, FormsModule, IconFieldModule, DividerModule, DropdownModule,
    CheckboxModule, StepsModule, ConfirmDialogModule, InputIconModule, ImageModule,
    DialogModule, ToastModule, TableModule, ReactiveFormsModule,
    InputTextareaModule, InputNumberModule, InputTextModule,
    ButtonModule, InputMaskModule, MultiSelectModule,
    InputGroupModule, RadioButtonModule, CalendarModule],
  templateUrl: './manutencao.component.html',
  styleUrl: './manutencao.component.scss',
  providers: [ConfirmationService, MessageService]
})
export default class ManutencaoComponent implements OnInit, DoCheck {
  itemsStatus: MenuItem[] | undefined;
  labelStatusVehicle: string = "";
  activeIndexStatus: number = 0;
  vehicleEntry: VehicleEntry;
  private id: number = 0;
  //Vehicle
  public colors: IColor[] = []

  modelVehicles: ModelVehicle[] = [];
  attendants: User[] = [];
  photoVehicle1!: string;
  isPhotoNew1: boolean = false;
  isPhotoDelete1: boolean = false;

  photoVehicle2!: string;
  isPhotoNew2: boolean = false;
  isPhotoDelete2: boolean = false;

  photoVehicle3!: string;
  isPhotoNew3: boolean = false;
  isPhotoDelete3: boolean = false;

  photoVehicle4!: string;
  isPhotoNew4: boolean = false;
  isPhotoDelete4: boolean = false;

  public dateExitAuth1 = signal<string>('');
  public dateExitAuth2 = signal<string>('');
  vehicleExit: boolean = false;

  yes = YesNot.yes;
  not = YesNot.not;

  formVehicle = new FormGroup({
    id: new FormControl<number>({ value: 0, disabled: true }),
    vehiclePlate: new FormControl<string>(''),
    vehicleFleet: new FormControl<string | null>(null),
    vehicleColor: new FormControl<IColor | null>(null),
    kmEntry: new FormControl<string | null>(''),
    kmExit: new FormControl<string | null>(''),
    modelVehicle: new FormControl<ModelVehicle | null>(null, Validators.required),
    entryDate: new FormControl<Date | null>(null, Validators.required),
    exitDate: new FormControl<Date | null>({ value: null, disabled: true }),
    exitDatePrevision: new FormControl<Date | null>(null),
    nameUserExitAuth1: new FormControl<string>({ value: "", disabled: true }),
    nameUserExitAuth2: new FormControl<string>({ value: "", disabled: true }),
    quantityExtinguisher: new FormControl<number | null>(null),
    quantityTrafficCone: new FormControl<number | null>(null),
    quantityTire: new FormControl<number | null>(null),
    quantityTireComplete: new FormControl<number | null>(null),
    quantityToolBox: new FormControl<number | null>(null),
    attendant: new FormControl<User | null>(null),
    vehicleNew: new FormControl<string>(YesNot.not, Validators.required),
    vehicleServiceOrder: new FormControl<string>(YesNot.yes, Validators.required),
    numServiceOrder: new FormControl<string | null>(null),
    numNfe: new FormControl<string | null>(null),
    numNfse: new FormControl<string | null>(null),
    information: new FormControl<string>(''),

    checklist1Desc: new FormControl<string>(''),
    checklist2Desc: new FormControl<string>(''),
    checklist3Desc: new FormControl<string>(''),
    checklist4Desc: new FormControl<string>(''),
    checklist5Desc: new FormControl<string>(''),
    checklist6Desc: new FormControl<string>(''),
    checklist7Desc: new FormControl<string>(''),
    checklist8Desc: new FormControl<string>(''),
    checklist9Desc: new FormControl<string>(''),
    checklist10Desc: new FormControl<string>(''),
    checklist11Desc: new FormControl<string>(''),
    checklist12Desc: new FormControl<string>(''),
    checklist13Desc: new FormControl<string>(''),
    checklist14Desc: new FormControl<string>(''),
    checklist15Desc: new FormControl<string>(''),
    checklist16Desc: new FormControl<string>(''),
    checklist17Desc: new FormControl<string>(''),
    checklist18Desc: new FormControl<string>(''),
    checklist19Desc: new FormControl<string>(''),
    checklist20Desc: new FormControl<string>('')
  });

  modChecklist: VehicleEntryChecklist = new VehicleEntryChecklist();
  //Porteiro
  entryPhoto1!: string;
  entryPhoto2!: string;
  entryPhoto3!: string;
  entryPhoto4!: string;

  exitPhoto1!: string;
  exitPhoto2!: string;
  exitPhoto3!: string;
  exitPhoto4!: string;

  formConcierge = new FormGroup({
    entryId: new FormControl<number | null>({ value: null, disabled: true }),
    entryName: new FormControl<string>({ value: '', disabled: true }),
    entryInf: new FormControl<string>({ value: '', disabled: true }),
    exitId: new FormControl<number | null>({ value: null, disabled: true }),
    exitName: new FormControl<string>({ value: '', disabled: true }),
    exitInformation: new FormControl<string>({ value: '', disabled: true }),
  });
  //ClientCompany
  selectClientCompany = signal<ClientCompany>(new ClientCompany());
  clientCompany!: ClientCompany;
  formClientCompany = new FormGroup({
    clientCompanyNot: new FormControl<string[]>([]),
    clientCompanyId: new FormControl<number | null>({ value: null, disabled: true }),
    clientCompanyName: new FormControl<string>({ value: '', disabled: true }),
    clientCompanyCnpj: new FormControl<string>({ value: '', disabled: true }),
    clientCompanyCpf: new FormControl<string>({ value: '', disabled: true }),
    clientCompanyRg: new FormControl<string | null>({ value: null, disabled: true }),
  });
  //Driver
  selectDriverEntry = signal<Driver>(new Driver());
  selectDriverExit = signal<Driver>(new Driver());
  driverEntry!: Driver;
  driverExit!: Driver;
  formDriver = new FormGroup({
    driverEntryId: new FormControl<number | null>({ value: null, disabled: true }),
    driverEntryName: new FormControl<string>({ value: '', disabled: true }),
    driverEntryCpf: new FormControl<string>({ value: '', disabled: true }),
    driverEntryRg: new FormControl<string | null>({ value: null, disabled: true }),

    driverExitId: new FormControl<number | null>({ value: null, disabled: true }),
    driverExitName: new FormControl<string>({ value: '', disabled: true }),
    driverExitCpf: new FormControl<string>({ value: '', disabled: true }),
    driverExitRg: new FormControl<string | null>({ value: null, disabled: true }),
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
  //exibi só os detalhe dos veículos
  detailsVehicle: boolean = false;

  //dialog visibleVehiclePlateTogether
  visibleVehiclePlateTogether: boolean = false;
  vehiclesTogether: VehicleEntry[] = [];
  isVehicleTogether: boolean = false;

  constructor(
    private shareWhatsAppService: ShareWhatsAppService,
    private permissionService: PermissionService,
    private primeNGConfig: PrimeNGConfig,
    private vehicleService: VehicleService,
    private activatedRoute: ActivatedRoute,
    private budgetService: BudgetService,
    private router: Router,
    public layoutService: LayoutService,
    private storageService: StorageService,
    private userService: UserService,
    private vehicleModelService: VehicleModelService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private busyService: BusyService,
    private driverService: DriverService,
    private photoService: PhotoService,
    private clientService: ClientCompanyService
  ) {
  }
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
    this.itemsStatus = [
      {
        label: 'Atendimento',
      },
      {
        label: 'Orçamento',
      },
      {
        label: 'Serviço em execução',
      },
      {
        label: 'Serviço concluído',
      },
      {
        label: 'Saída concluída'
      }
    ];
    this.colors = [
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

    if (this.activatedRoute.snapshot.params['id']) {
      this.activatedRoute.params.subscribe(params => {
        this.id = params['id'];
        this.init();
      });
    }
  }
  //Details Vehicle
  //mostra os detalhes da entrada do veículos chamar dentro de um dialog 
  showDetailsVehicle(id: number) {
    this.id = id;
    this.detailsVehicle = true;
    this.init();
  }
  ngDoCheck(): void {
    //proprietário
    if (this.selectClientCompany().id != 0) {
      this.formClientCompany.patchValue({
        clientCompanyNot: [],
        clientCompanyId: this.selectClientCompany().id,
        clientCompanyName: this.selectClientCompany().name,
        clientCompanyCnpj: this.selectClientCompany().cnpj,
        clientCompanyCpf: this.selectClientCompany().cpf,
        clientCompanyRg: this.selectClientCompany().rg == "" ? null : this.selectClientCompany().rg
      });
      this.clientCompany = this.selectClientCompany();
      this.selectClientCompany.set(new ClientCompany());
    }
    //Motorista entrada
    if (this.selectDriverEntry().id != 0) {
      this.driverEntry = this.selectDriverEntry();
      this.formDriver.patchValue({
        driverEntryId: this.driverEntry.id,
        driverEntryName: this.driverEntry.name,
        driverEntryCpf: this.driverEntry.cpf,
        driverEntryRg: this.driverEntry.rg == "" ? null : this.driverEntry.rg
      });
      this.driverEntryPhoto = this.driverEntry.photoDriverUrl;
      this.driverEntryPhotoDoc1 = this.driverEntry.photoDoc1Url;
      this.driverEntryPhotoDoc2 = this.driverEntry.photoDoc2Url;
      this.selectDriverEntry.set(new Driver());
    }
    //Motorista saída
    if (this.selectDriverExit().id != 0) {
      this.driverExit = this.selectDriverExit();
      this.formDriver.patchValue({
        driverExitId: this.driverExit.id == 0 ? null : this.driverExit.id,
        driverExitName: this.driverExit.name,
        driverExitCpf: this.driverExit.cpf,
        driverExitRg: this.driverExit.rg == "" ? null : this.driverExit.rg
      });
      this.driverExitPhoto = this.driverExit.photoDriverUrl;
      this.driverExitPhotoDoc1 = this.driverExit.photoDoc1Url;
      this.driverExitPhotoDoc2 = this.driverExit.photoDoc2Url;
      this.selectDriverExit.set(new Driver());
    }
  }
  private async init() {
    //Show load
    this.busyService.busy();
    //Attendant
    this.getAttendants();
    //Model
    this.modelVehicles = await this.getVehicleModel();
    //Vehicle
    const vehicleResult = await this.getVehicleEntry();
    //Close load
    this.busyService.idle();

    if (vehicleResult.status == 200 && vehicleResult.body.status == SuccessError.succes) {
      //Passa as informações para o objeto veículo de entrada
      this.vehicleEntry = vehicleResult.body.data;
      //Checklist vehicle
      if (this.vehicleEntry.checklistId) {
        const resultChecklist = await this.filterChecklist(this.vehicleEntry.checklistId);
        if (resultChecklist.status == 200 && resultChecklist.body.status == SuccessError.succes) {
          this.modChecklist = resultChecklist.body.data;
        }
      }
      //Buscar o cliente
      if (this.vehicleEntry.clientCompanyId != null) {
        const resultClient = await this.filterIdClient(this.vehicleEntry.clientCompanyId);
        if (resultClient.status == 200 && resultClient.body.status == SuccessError.succes) {
          this.clientCompany = resultClient.body.data;
        }
        if (resultClient.status == 200 && resultClient.body.status == SuccessError.error) {
          this.messageService.add({ severity: 'info', summary: resultClient.body.header, detail: resultClient.body.message, icon: 'pi pi-info-circle' });
        }
      }
      //Buscar o motorista de entrada
      if (this.vehicleEntry.driverEntryId != null) {
        const resultDriverEntry = await this.filterDriverId(this.vehicleEntry.driverEntryId);
        if (resultDriverEntry.status == 200) {
          this.driverEntry = resultDriverEntry.body.data;
        }
      }
      //Buscar o motorista de saída
      if (this.vehicleEntry.driverExitId != null) {
        const resultDriverExit = await this.filterDriverId(this.vehicleEntry.driverExitId);
        if (resultDriverExit.status == 200) {
          this.driverExit = resultDriverExit.body.data;
        }
      }

      //Show only details
      if (this.detailsVehicle) {
        this.vehicleExit = true;
        this.formVehicle.get('vehicleNew').disable();
        this.formVehicle.get('vehicleServiceOrder').disable();
      } else {
        //Vehicle has already left
        if (this.vehicleEntry.status == StatusVehicle.EXITED) {
          this.vehicleExit = true;
          this.formVehicle.get('vehicleNew').disable();
          this.formVehicle.get('vehicleServiceOrder').disable();
        } else {
          this.vehicleExit = false;
          this.formVehicle.get('vehicleNew').enable();
          this.formVehicle.get('vehicleServiceOrder').enable();
        }
      }
      this.loadForms();
    }
  }
  private loadForms() {
    //Status do atendimento
    this.stepStatus(this.vehicleEntry.stepEntry);

    //mostrar veículos justos
    if (this.vehicleEntry.vehiclePlateTogether) {
      this.isVehicleTogether = true;
    }

    //Vehicle
    this.formVehicle.patchValue({
      id: this.vehicleEntry.id,
      entryDate: new Date(this.vehicleEntry.entryDate),
      exitDate: this.vehicleEntry.exitDate != null ? new Date(this.vehicleEntry.exitDate) : null,
      exitDatePrevision: this.vehicleEntry.exitDatePrevision != null ? new Date(this.vehicleEntry.exitDatePrevision) : null,
      vehicleColor: this.vehicleEntry.vehicleColor != null ? { color: this.vehicleEntry.vehicleColor } : null,
      vehiclePlate: this.vehicleEntry.vehiclePlate,
      vehicleFleet: this.vehicleEntry.vehicleFleet == "" ? null : this.vehicleEntry.vehicleFleet,
      modelVehicle: this.modelVehicles.find(m => m.id == this.vehicleEntry.modelId),
      kmEntry: this.vehicleEntry.vehicleKmEntry == "" ? null : this.vehicleEntry.vehicleKmEntry,
      kmExit: this.vehicleEntry.vehicleKmExit == "" ? null : this.vehicleEntry.vehicleKmExit,
      attendant: this.attendants.find(a => a.id == this.vehicleEntry.attendantUserId),
      vehicleServiceOrder: this.vehicleEntry.vehicleServiceOrder,
      vehicleNew: this.vehicleEntry.vehicleNew,
      nameUserExitAuth1: this.vehicleEntry.auth1ExitUserName,
      nameUserExitAuth2: this.vehicleEntry.auth2ExitUserName,
      numServiceOrder: this.vehicleEntry.numServiceOrder == "" ? null : this.vehicleEntry.numServiceOrder,
      numNfe: this.vehicleEntry.numNfe == "" ? null : this.vehicleEntry.numNfe,
      numNfse: this.vehicleEntry.numNfse == "" ? null : this.vehicleEntry.numNfse,
      information: this.vehicleEntry.attendantInformation,

      checklist1Desc: this.modChecklist.checklist1Desc,
      checklist2Desc: this.modChecklist.checklist2Desc,
      checklist3Desc: this.modChecklist.checklist3Desc,
      checklist4Desc: this.modChecklist.checklist4Desc,
      checklist5Desc: this.modChecklist.checklist5Desc,
      checklist6Desc: this.modChecklist.checklist6Desc,
      checklist7Desc: this.modChecklist.checklist7Desc,
      checklist8Desc: this.modChecklist.checklist8Desc,
      checklist9Desc: this.modChecklist.checklist9Desc,
      checklist10Desc: this.modChecklist.checklist10Desc,
      checklist11Desc: this.modChecklist.checklist11Desc,
      checklist12Desc: this.modChecklist.checklist12Desc,
      checklist13Desc: this.modChecklist.checklist13Desc,
      checklist14Desc: this.modChecklist.checklist14Desc,
      checklist15Desc: this.modChecklist.checklist15Desc,
      checklist16Desc: this.modChecklist.checklist16Desc,
      checklist17Desc: this.modChecklist.checklist17Desc,
      checklist18Desc: this.modChecklist.checklist18Desc,
      checklist19Desc: this.modChecklist.checklist19Desc,
      checklist20Desc: this.modChecklist.checklist20Desc,
    });
    //Imagem consultor
    this.photoVehicle1 = this.vehicleEntry.attendantPhoto1Url;
    this.photoVehicle2 = this.vehicleEntry.attendantPhoto2Url;
    this.photoVehicle3 = this.vehicleEntry.attendantPhoto3Url;
    this.photoVehicle4 = this.vehicleEntry.attendantPhoto4Url;
    //Validation placa
    if (this.vehicleEntry.vehicleNew == YesNot.yes) {
      this.deleteRequirePlaca();
    } else {
      this.addRequirePlaca();
    }

    //Autorização de saída
    if (this.vehicleEntry.auth1ExitDate) {
      this.dateExitAuth1.set(this.vehicleEntry.auth1ExitDate!.toString());
    }
    if (this.vehicleEntry.auth2ExitDate) {
      this.dateExitAuth2.set(this.vehicleEntry.auth2ExitDate!.toString());
    }

    //Checklist


    //porteiro entrada
    this.formConcierge.patchValue({
      entryId: this.vehicleEntry.entryUserId,
      entryName: this.vehicleEntry.entryUserName,
      entryInf: this.vehicleEntry.entryInformation
    });
    this.entryPhoto1 = this.vehicleEntry.entryPhoto1Url;
    this.entryPhoto2 = this.vehicleEntry.entryPhoto2Url;
    this.entryPhoto3 = this.vehicleEntry.entryPhoto3Url;
    this.entryPhoto4 = this.vehicleEntry.entryPhoto4Url;
    //porteiro saída
    this.formConcierge.patchValue({
      exitId: this.vehicleEntry.exitUserId == null ? null : this.vehicleEntry.exitUserId,
      exitName: this.vehicleEntry.exitUserName,
      exitInformation: this.vehicleEntry.exitInformation
    });
    this.exitPhoto1 = this.vehicleEntry.exitPhoto1Url;
    this.exitPhoto2 = this.vehicleEntry.exitPhoto2Url;
    this.exitPhoto3 = this.vehicleEntry.exitPhoto3Url;
    this.exitPhoto4 = this.vehicleEntry.exitPhoto4Url;

    //Form Proprietario
    if (this.vehicleEntry.clientCompanyId != null) {
      this.formClientCompany.patchValue({
        clientCompanyNot: [],
        clientCompanyId: this.clientCompany.id,
        clientCompanyName: this.clientCompany.name,
        clientCompanyCnpj: this.clientCompany.cnpj,
        clientCompanyCpf: this.clientCompany.cpf,
        clientCompanyRg: this.clientCompany.rg == "" ? null : this.clientCompany.rg,
      });
    } else {
      this.formClientCompany.get("clientCompanyNot").setValue(["not"])
    }
    //tab driver
    this.loadDriver();
    //Verificar essa função
    if (this.vehicleEntry.authExitStatus != StatusAuthExit.NOT) {
      if (this.vehicleEntry.vehicleServiceOrder == YesNot.yes) {
        this.addRequireAttendant();
      }
    }
  }

  private loadDriver() {
    this.formDriver.patchValue({
      driverEntryId: this.driverEntry?.id ?? null,
      driverEntryName: this.driverEntry.name,
      driverEntryCpf: this.driverEntry.cpf,
      driverEntryRg: this.driverEntry.rg == "" ? null : this.driverEntry.rg
    });
    this.driverEntryPhoto = this.driverEntry.photoDriverUrl;
    this.driverEntryPhotoDoc1 = this.driverEntry.photoDoc1Url;
    this.driverEntryPhotoDoc2 = this.driverEntry.photoDoc2Url;

    if (this.driverExit != null) {
      this.formDriver.patchValue({
        driverExitId: this.driverExit.id == 0 ? null : this.driverExit.id,
        driverExitName: this.driverExit.name,
        driverExitCpf: this.driverExit.cpf,
        driverExitRg: this.driverExit.rg == "" ? null : this.driverExit.rg
      });
      this.driverExitPhoto = this.driverExit.photoDriverUrl;
      this.driverExitPhotoDoc1 = this.driverExit.photoDoc1Url;
      this.driverExitPhotoDoc2 = this.driverExit.photoDoc2Url;
    }
  }

  private async getAttendants() {
    const result = await this.filterUserRoleId();
    if (result.status == 200 && result.body.status == SuccessError.succes) {
      //this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
      this.attendants = result.body.data;
    }
    if (result.status == 200 && result.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
    }
  }

  private async filterUserRoleId(): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.userService.filterRoleId(2));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }

  private async getVehicleModel(): Promise<ModelVehicle[]> {
    try {
      return await lastValueFrom(this.vehicleModelService.getAllEnabled());
    } catch (error) {
      return [];
    }
  }

  private async getVehicleEntry(): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleService.entryFilterId(this.id));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Vaículo não encontrado", icon: 'pi pi-times' });
      return error;
    }
  }

  private stepStatus(status: string) {
    switch (status) {
      case 'Attendant':
        this.activeIndexStatus = 0;
        this.labelStatusVehicle = this.itemsStatus[0].label;
        break;
      case 'Budget':
        this.activeIndexStatus = 1;
        this.labelStatusVehicle = this.itemsStatus[1].label;
        break;
      case 'Running_Service':
        this.activeIndexStatus = 2;
        this.labelStatusVehicle = this.itemsStatus[2].label;
        break;
      case 'Full_Service':
        this.activeIndexStatus = 3;
        this.labelStatusVehicle = this.itemsStatus[3].label;
        break;
      case 'Exit':
        this.activeIndexStatus = 4;
        this.labelStatusVehicle = this.itemsStatus[4].label;
        break;
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
  //Vehicle
  private preList(vehicle: VehicleEntry): VehicleEntry {
    //Format Date
    const datePipe = new DatePipe('pt-BR');
    vehicle.entryDate = datePipe.transform(this.formatDateTime(new Date(vehicle.entryDate)), 'dd/MM/yyyy HH:mm');

    if (vehicle.status == StatusVehicle.EXITED) {
      vehicle.exitDate = datePipe.transform(this.formatDateTime(new Date(vehicle.exitDate)), 'dd/MM/yyyy HH:mm');
    }
    if (vehicle.vehicleNew == YesNot.yes) {
      vehicle.vehiclePlate = "NOVO";
    }
    if (vehicle.attendantUserName == "") {
      vehicle.attendantUserName = "FALTA";
    }
    if (vehicle.clientCompanyName == "") {
      vehicle.clientCompanyName = "FALTA";
    } else {
      var nome = vehicle.clientCompanyName.split(' ');
      vehicle.clientCompanyName = nome[0] + " " + nome[1];
    }
    return vehicle;
  }
  async showVehicleTogether() {
    if (this.vehicleEntry.vehiclePlateTogether) {
      this.busyService.busy();
      const result = await this.filterVehicleTogether(this.vehicleEntry.vehiclePlateTogether);
      this.busyService.idle();
      if (result.status == 200 && result.body.status == SuccessError.succes) {
        this.visibleVehiclePlateTogether = true;
        for (let index = 0; index < result.body.data.length; index++) {

          result.body.data[index] = this.preList(result.body.data[index]);
        }
        this.vehiclesTogether = result.body.data
      }
    }
  }
  changerVehicle(id: number) {
    this.router.navigateByUrl("/portaria/manutencao-entrada-veiculo/" + id);
  }

  public placaRequiredAdd() {
    this.addRequirePlaca();
  }
  public placaRequiredRemove() {
    if (this.formVehicle.get("vehiclePlate").value.trim() != '' && this.formVehicle.value.vehicleNew == YesNot.yes) {
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

    if (this.formVehicle.get("vehiclePlate").value.trim() == '' && this.formVehicle.value.vehicleNew == YesNot.yes) {
      this.deleteRequirePlaca();
      this.cleanPlaca();
    }

  }
  private addRequirePlaca() {
    this.formVehicle.controls['vehiclePlate'].addValidators(Validators.required);
    this.formVehicle.controls['vehiclePlate'].updateValueAndValidity();
  }
  private deleteRequirePlaca() {
    this.formVehicle.controls['vehiclePlate'].removeValidators(Validators.required);
    this.formVehicle.controls['vehiclePlate'].updateValueAndValidity();
  }
  private cleanPlaca() {
    this.formVehicle.get("vehiclePlate").setValue("");
    this.vehicleEntry.vehiclePlate = "";
  }
  private addRequireAttendant() {
    this.formVehicle.controls['attendant'].addValidators(Validators.required);
    this.formVehicle.controls['attendant'].updateValueAndValidity();
  }
  private deleteRequireAttendant() {
    this.formVehicle.controls['attendant'].removeValidators(Validators.required);
    this.formVehicle.controls['attendant'].updateValueAndValidity();
  }
  /* Save imgage */
  async onFileSelected1() {
    const photo: PhotoResult = await this.photoService.takePicture();
    if (photo.status == PhotoResultStatus.SUCCESS) {
      this.photoVehicle1 = photo.base64;
      this.vehicleEntry.attendantPhoto1Url = this.photoVehicle1;
      //informa que foi selecionado uma imagem nova
      this.isPhotoNew1 = true;
      //informa que não exclua a imagem
      this.isPhotoDelete1 = false;
    }
    if (photo.status == PhotoResultStatus.LIMIT) {
      this.messageService.add({ severity: 'info', summary: 'Imagem', detail: IMAGE_MAX_SIZE_LABEL, icon: 'pi pi-info-circle', life: 3000 });
    }
    if (photo.status == PhotoResultStatus.ERROR) {
      // this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um problema.", icon: 'pi pi-times', life: 3000 });
    }
  }
  async onFileSelected2() {
    const photo: PhotoResult = await this.photoService.takePicture();
    if (photo.status == PhotoResultStatus.SUCCESS) {
      this.photoVehicle2 = photo.base64;
      this.vehicleEntry.attendantPhoto2Url = this.photoVehicle2;
      //informa que foi selecionado uma imagem nova
      this.isPhotoNew2 = true;
      //informa que não exclua a imagem
      this.isPhotoDelete2 = false;
    }
    if (photo.status == PhotoResultStatus.LIMIT) {
      this.messageService.add({ severity: 'info', summary: 'Imagem', detail: IMAGE_MAX_SIZE_LABEL, icon: 'pi pi-info-circle', life: 3000 });
    }
    if (photo.status == PhotoResultStatus.ERROR) {
      // this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um problema.", icon: 'pi pi-times', life: 3000 });
    }
  }
  async onFileSelected3() {
    const photo: PhotoResult = await this.photoService.takePicture();
    if (photo.status == PhotoResultStatus.SUCCESS) {
      this.photoVehicle3 = photo.base64;
      this.vehicleEntry.attendantPhoto3Url = this.photoVehicle3;
      //informa que foi selecionado uma imagem nova
      this.isPhotoNew3 = true;
      //informa que não exclua a imagem
      this.isPhotoDelete3 = false;
    }
    if (photo.status == PhotoResultStatus.LIMIT) {
      this.messageService.add({ severity: 'info', summary: 'Imagem', detail: IMAGE_MAX_SIZE_LABEL, icon: 'pi pi-info-circle', life: 3000 });
    }
    if (photo.status == PhotoResultStatus.ERROR) {
      // this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um problema.", icon: 'pi pi-times', life: 3000 });
    }
  }
  async onFileSelected4() {
    const photo: PhotoResult = await this.photoService.takePicture();
    if (photo.status == PhotoResultStatus.SUCCESS) {
      this.photoVehicle4 = photo.base64;
      this.vehicleEntry.attendantPhoto4Url = this.photoVehicle4;
      //informa que foi selecionado uma imagem nova
      this.isPhotoNew4 = true;
      //informa que não exclua a imagem
      this.isPhotoDelete4 = false;
    }
    if (photo.status == PhotoResultStatus.LIMIT) {
      this.messageService.add({ severity: 'info', summary: 'Imagem', detail: IMAGE_MAX_SIZE_LABEL, icon: 'pi pi-info-circle', life: 3000 });
    }
    if (photo.status == PhotoResultStatus.ERROR) {
      // this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um problema.", icon: 'pi pi-times', life: 3000 });
    }
  }
  /* Delete image */
  public async deleteFileVehicle1() {
    this.photoVehicle1 = "";
    this.vehicleEntry.entryPhoto1Url = "";
    //informa que a imagem não é nova
    this.isPhotoNew1 = false;
    //informa que exclua a imagem
    this.isPhotoDelete1 = true;
  }
  public async deleteFileVehicle2() {
    this.photoVehicle2 = "";
    this.vehicleEntry.entryPhoto2Url = "";
    //informa que a imagem não é nova
    this.isPhotoNew2 = false;
    //informa que exclua a imagem
    this.isPhotoDelete2 = true;
  }
  public async deleteFileVehicle3() {
    this.photoVehicle3 = "";
    this.vehicleEntry.entryPhoto3Url = "";
    //informa que a imagem não é nova
    this.isPhotoNew3 = false;
    //informa que exclua a imagem
    this.isPhotoDelete3 = true;
  }
  public async deleteFileVehicle4() {
    this.photoVehicle4 = "";
    this.vehicleEntry.entryPhoto4Url = "";
    //informa que a imagem não é nova
    this.isPhotoNew4 = false;
    //informa que exclua a imagem
    this.isPhotoDelete4 = true;
  }
  private async savePhoto(ve: VehicleEntry, img: string, order: number): Promise<string> {
    if (img == "") {
      return "";
    }
    try {
      let path =
        `${ve.companyId}/` +
        `${ve.resaleId}/concierge/vehicle/` +
        `${ve.id}/attendant/`;

      const { base64, mime } = this.cleanBase64(img);
      const file = this.base64ToFile(base64, mime);

      const formData = new FormData();
      formData.append('file', file);

      switch (order) {
        case 1:
          path += "image1.jpg";
          formData.append('local', path);
          break;
        case 2:
          path += "image2.jpg";
          formData.append('local', path);
          break;
        case 3:
          path += "image3.jpg";
          formData.append('local', path);
          break;
        case 4:
          path += "image4.jpg";
          formData.append('local', path);
          break;
      }
      const resultSave = await this.saveImage(formData);
      if (resultSave.status == 200 && resultSave.body.status == SuccessError.succes) {
        return `${environment.apiuUrl}${resultSave.body.data["url"]}`;
      }
    } catch (error) {
      return "";
    }
    return "";

  }
  private cleanBase64(base64: string): { base64: string; mime: string } {
    if (!base64.includes(',')) {
      return { base64, mime: 'image/jpeg' };
    }

    const [header, data] = base64.split(',');
    const mime = header.match(/data:(.*);base64/)?.[1] || 'image/jpeg';

    return { base64: data, mime };
  }
  private base64ToFile(base64: string, mime: string): File {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new File([ia], 'image.jpg', { type: mime });
  }

  private deleteRequireForms() {
    this.deleteRequireAttendant();
  }
  private addRequireForms() {
    this.addRequireAttendant();
  }
  public async authExit() {
    const uppercase = new UpperCasePipe();
    if (this.vehicleEntry.authExitStatus != StatusAuthExit.AUTH) {
      let auth = new VehicleEntryAuth();
      auth.companyId = this.storageService.companyId;
      auth.resaleId = this.storageService.resaleId;
      auth.vehicleId = this.vehicleEntry.id;
      auth.userId = this.storageService.id;
      auth.userName = this.storageService.name;
      auth.dateAuth = this.formatDateTime(new Date());
      //Inicia loading
      this.busyService.busy();
      const permissionResult = await this.addAuthExit(auth);
      //Fecha loading
      this.busyService.idle();
      if (permissionResult.status == 200 && permissionResult.body.status == SuccessError.succes) {
        //Status auth exit
        if (this.vehicleEntry.authExitStatus == StatusAuthExit.NOT) {
          this.vehicleEntry.authExitStatus = StatusAuthExit.FIST;
          this.messageService.add({ severity: 'success', summary: permissionResult.body.header, detail: permissionResult.body.message, icon: 'pi pi-check-circle' });
        } else if (this.vehicleEntry.authExitStatus == StatusAuthExit.FIST) {
          this.vehicleEntry.authExitStatus = StatusAuthExit.AUTH;
          this.messageService.add({ severity: 'success', summary: permissionResult.body.header, detail: permissionResult.body.message, icon: 'pi pi-thumbs-up-fill' });
        }

        if (this.vehicleEntry.auth1ExitUserId == null) {
          this.formVehicle.get('nameUserExitAuth1').setValue(auth.userName);
          this.vehicleEntry.auth1ExitUserId = auth.userId;
          this.vehicleEntry.auth1ExitUserName = auth.userName;
          this.vehicleEntry.auth1ExitDate = auth.dateAuth;
          this.dateExitAuth1.set(auth.dateAuth);

        } else if (this.vehicleEntry.auth2ExitUserId == null) {
          this.formVehicle.get('nameUserExitAuth2').setValue(auth.userName);
          this.vehicleEntry.auth2ExitUserId = auth.userId;
          this.vehicleEntry.auth2ExitUserName = auth.userName;
          this.vehicleEntry.auth2ExitDate = auth.dateAuth;
          this.dateExitAuth2.set(auth.dateAuth);
        }
        //Valid
        this.addRequireForms();
      } else if (permissionResult.status == 200 && permissionResult.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: permissionResult.body.header, detail: permissionResult.body.message, icon: 'pi pi-info-circle' });
      }

    } else {
      this.messageService.add({ severity: 'info', summary: 'Veículo Liberado', detail: "Placa " + uppercase.transform(this.formVehicle.value.vehiclePlate), icon: 'pi pi-thumbs-up-fill' });
    }
  }

  private updateAuthExitStatus() {
    if (this.vehicleEntry.authExitStatus == StatusAuthExit.FIST) {
      this.vehicleEntry.authExitStatus = StatusAuthExit.NOT;
      this.deleteRequireForms();
    } else if (this.vehicleEntry.authExitStatus == StatusAuthExit.AUTH) {
      this.vehicleEntry.authExitStatus = StatusAuthExit.FIST;
    }
  }

  public async deleteAuth1() {
    if (this.vehicleEntry.auth1ExitUserId != null) {
      let auth = new VehicleEntryAuth();
      auth.companyId = this.storageService.companyId;
      auth.resaleId = this.storageService.resaleId;
      auth.vehicleId = this.id;
      auth.userId = this.storageService.id;
      auth.userName = this.storageService.name;

      const authResult = await this.delAuth1(auth);
      if (authResult.status == 200 && authResult.body.status == SuccessError.succes) {
        this.messageService.add({ severity: 'success', summary: authResult.body.header, detail: authResult.body.message, icon: 'pi pi-check' });
        this.formVehicle.get('nameUserExitAuth1').setValue('');
        this.vehicleEntry.auth1ExitUserId = null;
        this.vehicleEntry.auth1ExitUserName = '';
        this.vehicleEntry.auth1ExitDate = '';
        this.dateExitAuth1.set('');
        this.updateAuthExitStatus();
      } else if (authResult.status == 200 && authResult.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: authResult.body.header, detail: authResult.body.message, icon: 'pi pi-info-circle' });
      }
    }
  }
  private async delAuth1(auth: VehicleEntryAuth): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleService.entryDeleteAuth1(auth));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Não catalogado.", icon: 'pi pi-times' });
      return error;
    }
  }
  public async deleteAuth2() {
    if (this.vehicleEntry.auth2ExitUserId != null) {
      let auth = new VehicleEntryAuth();
      auth.companyId = this.storageService.companyId;
      auth.resaleId = this.storageService.resaleId;
      auth.vehicleId = this.id;
      auth.userId = this.storageService.id;
      auth.userName = this.storageService.name;
      const authResult = await this.delAuth2(auth);
      if (authResult.status == 200 && authResult.body.status == SuccessError.succes) {
        this.messageService.add({ severity: 'success', summary: authResult.body.header, detail: authResult.body.message, icon: 'pi pi-check' });
        this.formVehicle.get('nameUserExitAuth2').setValue('');
        this.vehicleEntry.auth2ExitUserId = null;
        this.vehicleEntry.auth2ExitUserName = '';
        this.vehicleEntry.auth2ExitDate = '';
        this.dateExitAuth2.set('');
        this.updateAuthExitStatus();
      } else if (authResult.status == 200 && authResult.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: authResult.body.header, detail: authResult.body.message, icon: 'pi pi-info-circle' });
      }
    }
  }
  private async delAuth2(auth: VehicleEntryAuth): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleService.entryDeleteAuth2(auth));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Não catalogado.", icon: 'pi pi-times' });
      return error;
    }
  }
  //Porteiro
  public validationClientCompany() {
    if (this.formClientCompany.value.clientCompanyNot.length == 0 && this.clientCompany != null) {
      this.cleanFormClientCompany();
      this.clientCompany = null;
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
  //Driver
  private async filterDriverId(id: number): Promise<HttpResponse<MessageResponse>> {
    try {
      return lastValueFrom(this.driverService.filterId(id));
    } catch (error) {
      return error;
    }
  }
  cleanDriverExit() {
    this.driverExit = null;
    this.vehicleEntry.driverExitId = null,
      this.vehicleEntry.driverExitName = "";
    this.formDriver.patchValue({
      driverExitId: null,
      driverExitName: '',
      driverExitCpf: '',
      driverExitRg: null
    });
    this.driverExitPhoto = '';
    this.driverExitPhotoDoc1 = '';
    this.driverExitPhotoDoc2 = '';
  }
  //Budget
  public async confirmGerarOrcamento() {
    if (this.formVehicle.value.numServiceOrder == "" || this.formVehicle.value.numServiceOrder == null) {
      this.messageService.add({ severity: 'info', summary: 'Número O.S.', detail: 'Não informado', icon: 'pi pi-info-circle' });
      return;
    }

    if (this.vehicleEntry.budgetId != 0) {
      /* PERMISSION - 152 */
      /* VISUALIZAR ORÇAMENTO */
      const permission = await this.searchPermission(152);
      if (!permission) { return; }
      this.router.navigateByUrl("/oficina/manutencao-orcamento/" + this.vehicleEntry.id);
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
        accept: async () => {
          /* PERMISSION - 150 */
          /* GERAR ORÇAMENTO */
          const permission = await this.searchPermission(150);
          if (!permission) { return; }
          this.budget = { companyId: this.storageService.companyId, resaleId: this.storageService.resaleId, vehicleEntryId: this.vehicleEntry.id };
          const budgetResult = await this.saveBudget(this.budget);
          if (budgetResult.status == 201) {
            //this.vehicleEntry.budgetId = budgetResult.body.status;
            this.messageService.add({ severity: 'info', summary: 'Orçamento - ' + budgetResult.body.id, detail: 'Gerado com sucesso', life: 2000 });

            setTimeout(async () => {
              /* PERMISSION - 152 */
              /* VISUALIZAR ORÇAMENTO */
              const permission = await this.searchPermission(152);
              if (!permission) { return; }
              this.router.navigateByUrl('/oficina/manutencao-orcamento/' + this.vehicleEntry.id);
            }, 2000);
          }
        }
      });
    }
  }
  private async saveBudget(budget: IBudgetNew): Promise<HttpResponse<IBudget>> {
    try {
      return await lastValueFrom(this.budgetService.addBudget$(this.budget));
    } catch (error) {
      return error;
    }
  }
  //Atualizar informações do veículo
  private validInformation(): boolean {
    const vehicleValue = this.formVehicle.value;
    const clientCompanyValue = this.formClientCompany.value;
    const driverValue = this.formDriver.value;

    if (vehicleValue.entryDate == null) {
      this.messageService.add({ severity: 'error', summary: 'Data Entrada', detail: "Não informada", icon: 'pi pi-times' });
      return false;
    }
    if (vehicleValue.entryDate > new Date()) {
      this.messageService.add({ severity: 'error', summary: 'Data Entrada', detail: "Maior que data atual", icon: 'pi pi-times' });
      return false;
    }
    if (vehicleValue.exitDatePrevision != null && vehicleValue.exitDatePrevision < vehicleValue.entryDate) {
      this.messageService.add({ severity: 'error', summary: 'Data Previsão Saída', detail: "Menor que data entrada", icon: 'pi pi-times' });
      return false;
    }
    /* if (vehicleValue.vehicleNew == YesNot.not) {
      if (vehicleValue.vehiclePlate == "") {
        this.messageService.add({ severity: 'error', summary: 'Placa', detail: "Não informada", icon: 'pi pi-times' });
        return false;
      }
    } */
    if (vehicleValue.modelVehicle == null) {
      this.messageService.add({ severity: 'error', summary: 'Modelo', detail: "Não selecionado", icon: 'pi pi-times' });
      return false;
    }

    if (vehicleValue.vehicleServiceOrder == YesNot.yes) {
      if (this.vehicleEntry.authExitStatus != StatusAuthExit.NOT) {
        if (vehicleValue.attendant == null) {
          this.messageService.add({ severity: 'error', summary: 'Consultor', detail: "Não informado", icon: 'pi pi-times' });
          return false;
        }
      }
    }
    //Proprietário
    if (clientCompanyValue.clientCompanyNot.length == 0 && this.clientCompany == null) {
      this.messageService.add({ severity: 'error', summary: 'Proprietário', detail: "Não informado", icon: 'pi pi-times' });
      return false;
    }
    //Motorista Entrada
    if (this.driverEntry == null) {
      this.messageService.add({ severity: 'error', summary: 'Motorista Entrada', detail: "Não informado", icon: 'pi pi-times' });
      return false;
    }
    if (this.vehicleEntry.authExitStatus != StatusAuthExit.NOT) {
      //Motorista saída
      if (this.driverExit == null) {
        this.messageService.add({ severity: 'error', summary: 'Motorista Saída', detail: "Não informado", icon: 'pi pi-times' });
        return false;
      }
    }
    return true;
  }
  applyDateTimeMask(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    }

    if (value.length > 5) {
      value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }

    if (value.length > 10) {
      value = value.replace(/^(\d{2})\/(\d{2})\/(\d{4})(\d)/, '$1/$2/$3 $4');
    }

    if (value.length > 12) {
      value = value.replace(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2})(\d)/, '$1/$2/$3 $4:$5');
    }
    event.target.value = value;
  }
  private loadingVehicle() {
    const vehicleValue = this.formVehicle.value;

    this.vehicleEntry.entryDate = this.formatDateTime(vehicleValue.entryDate);
    this.vehicleEntry.exitDatePrevision = vehicleValue?.exitDatePrevision == null ? null : this.formatDateTime(vehicleValue.exitDatePrevision);
    this.vehicleEntry.vehiclePlate = vehicleValue.vehiclePlate;

    this.vehicleEntry.vehicleFleet = vehicleValue.vehicleFleet;
    this.vehicleEntry.modelId = vehicleValue.modelVehicle.id;
    this.vehicleEntry.modelDescription = vehicleValue.modelVehicle.description;
    this.vehicleEntry.vehicleColor = vehicleValue.vehicleColor?.color ?? null;
    this.vehicleEntry.attendantUserId = vehicleValue.attendant?.id ?? null;
    this.vehicleEntry.attendantUserName = vehicleValue.attendant?.name ?? "";
    this.vehicleEntry.vehicleKmEntry = vehicleValue?.kmEntry ?? "";
    this.vehicleEntry.vehicleKmExit = vehicleValue?.kmExit ?? "";
    /* this.vehicleEntry.quantityTrafficCone = vehicleValue?.quantityTrafficCone ?? 0;
    this.vehicleEntry.quantityExtinguisher = vehicleValue?.quantityExtinguisher ?? 0;
    this.vehicleEntry.quantityTire = vehicleValue?.quantityTire ?? 0;
    this.vehicleEntry.quantityTireComplete = vehicleValue?.quantityTireComplete ?? 0;
    this.vehicleEntry.quantityToolBox = vehicleValue?.quantityToolBox ?? 0; */
    this.vehicleEntry.numServiceOrder = vehicleValue?.numServiceOrder ?? "";
    this.vehicleEntry.numNfe = vehicleValue?.numNfe ?? "";
    this.vehicleEntry.numNfse = vehicleValue?.numNfse ?? "";

    this.vehicleEntry.vehicleNew = vehicleValue.vehicleNew;
    this.vehicleEntry.vehicleServiceOrder = vehicleValue.vehicleServiceOrder;
    this.vehicleEntry.attendantInformation = vehicleValue.information;

    if (this.clientCompany != null) {
      this.vehicleEntry.clientCompanyId = this.clientCompany.id;
      this.vehicleEntry.clientCompanyName = this.clientCompany.name;
    } else {
      this.vehicleEntry.clientCompanyId = null;
      this.vehicleEntry.clientCompanyName = "";
    }

    this.vehicleEntry.driverEntryId = this.driverEntry.id;
    this.vehicleEntry.driverEntryName = this.driverEntry.name;

    if (this.driverExit != null) {
      this.vehicleEntry.driverExitId = this.driverExit.id;
      this.vehicleEntry.driverExitName = this.driverExit.name;
    }



  }
  public async save() {
    /* PERMISSION - 100 */
    /* EDITAR ENTRADA DO VEÍCULO */
    const permission = await this.searchPermission(100);
    if (!permission) { return; }

    if (this.validInformation()) {

      //Loading data
      this.loadingVehicle();

      //Atualizar as imagens
      if (this.isPhotoNew1) {
        this.isPhotoNew1 = false;
        const img1 = await this.savePhoto(this.vehicleEntry, this.photoVehicle1, 1);
        this.vehicleEntry.attendantPhoto1Url = img1;
      }
      if (this.isPhotoNew2) {
        this.isPhotoNew2 = false;
        const img2 = await this.savePhoto(this.vehicleEntry, this.photoVehicle2, 2);
        this.vehicleEntry.attendantPhoto2Url = img2;
      }
      if (this.isPhotoNew3) {
        this.isPhotoNew3 = false;
        const img3 = await this.savePhoto(this.vehicleEntry, this.photoVehicle3, 3);
        this.vehicleEntry.attendantPhoto3Url = img3;
      }
      if (this.isPhotoNew4) {
        this.isPhotoNew4 = false;
        const img4 = await this.savePhoto(this.vehicleEntry, this.photoVehicle4, 4);
        this.vehicleEntry.attendantPhoto4Url = img4;
      }

      let path =
        `${this.vehicleEntry.companyId}/` +
        `${this.vehicleEntry.resaleId}/concierge/vehicle/` +
        `${this.vehicleEntry.id}/attendant/`;

      if (this.isPhotoDelete1) {
        this.isPhotoDelete1 = false;
        const formData = new FormData();
        formData.append("local", path + "image1.jpg");
        const del = await this.deleteImage(formData);
        this.vehicleEntry.attendantPhoto1Url = "";
      }
      if (this.isPhotoDelete2) {
        this.isPhotoDelete2 = false;
        const formData = new FormData();
        formData.append("local", path + "image2.jpg");
        const del = await this.deleteImage(formData);
        this.vehicleEntry.attendantPhoto2Url = "";
      }
      if (this.isPhotoDelete3) {
        this.isPhotoDelete3 = false;
        const formData = new FormData();
        formData.append("local", path + "image3.jpg");
        const del = await this.deleteImage(formData);
        this.vehicleEntry.attendantPhoto3Url = "";
      }
      if (this.isPhotoDelete4) {
        this.isPhotoDelete4 = false;
        const formData = new FormData();
        formData.append("local", path + "image4.jpg");
        const del = await this.deleteImage(formData);
        this.vehicleEntry.attendantPhoto4Url = "";
      }

      //Inicia loading
      this.busyService.busy();
      const resultVehicle = await this.updateVehicle(this.vehicleEntry);
      //Fecha loading
      this.busyService.idle();

      if (resultVehicle.status == 200 && resultVehicle.body.status == SuccessError.succes) {
        this.messageService.add({ severity: 'success', summary: resultVehicle.body.header, detail: resultVehicle.body.message, icon: 'pi pi-check' });
        this.loadDriver();
      } else if (resultVehicle.status == 200 && resultVehicle.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: resultVehicle.body.header, detail: resultVehicle.body.message, icon: 'pi pi-info-circle' });
      }

    }
  }
  private async updateVehicle(vehicle: VehicleEntry): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleService.entryUpdate(vehicle));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Não catalogado.", icon: 'pi pi-times' });
      return error;
    }

  }
  private async searchPermission(permission: number): Promise<boolean> {
    try {
      var result = await lastValueFrom(this.permissionService.filterUserPermission(this.storageService.companyId, this.storageService.resaleId, this.storageService.id, permission));
      if (result.status == 200 && result.body.status == SuccessError.succes) {
        return true;
      } else if (result.status == 200 && result.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
      }
      return false;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return false;
    }
  }
  /* Share vehicle data via WhatsApp */
  shareVehicle() {
    this.shareWhatsAppService.shareVehicle(this.vehicleEntry);
  }
  private async filterIdClient(id: number): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.clientService.filterId(id));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async filterVehicleTogether(together: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleService.filterTogether(together));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async saveImage(data: FormData): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleService.saveImage(data));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async deleteImage(data: FormData): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleService.deleteImage(data))
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async addAuthExit(auth: VehicleEntryAuth): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleService.entryAddAuth(auth));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Não catalogado.", icon: 'pi pi-times' });
      return error;
    }
  }
  private async filterChecklist(id: number): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleService.filterChecklist(id));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
}
