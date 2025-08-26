import { Component, DoCheck, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';

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

//Service
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { UserService } from '../../../services/user/user.service';
import { VehicleModelService } from '../../../services/vehicle-model/vehicle-model.service';

//Interface
import { IBudgetNew } from '../../../interfaces/budget/ibudget-new';
import { IColor } from '../../../interfaces/icolor';

//Constants
import {
  STATUS_VEHICLE_ENTRY_NOTAUTH, STATUS_VEHICLE_ENTRY_FIRSTAUTH,
  STATUS_VEHICLE_ENTRY_AUTHORIZED, MESSAGE_RESPONSE_NOT_CLIENT,
  MESSAGE_RESPONSE_NOT_ATTENDANT, MESSAGE_RESPONSE_NOT_DRIVEREXIT, MESSAGE_RESPONSE_ERROR_AUTH_EXIT
} from '../../../util/constants';
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
import { BusyService } from '../../../components/loading/busy.service';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IBudget } from '../../../interfaces/budget/ibudget';
//Components
import { FilterClientComponent } from '../../../components/filter.client/filter.client.component';
import { StatusBudgetEnum } from '../../../models/budget/status-budget-enum';
import { StatusVehicle } from '../../../models/enum/status-vehicle';
import { ClientFisJurEnum } from '../../../models/clientcompany/client-fisjur-enum';

@Component({
  selector: 'app-manutencao',
  standalone: true,
  imports: [CommonModule, FilterClientComponent, RouterModule,
    TabViewModule, FormsModule, IconFieldModule, DividerModule,
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

  RESPONSE_SUCCESS: string = "Success.";
  IMAGE_MAX_SIZE: number = 4243795;

  itemsStatus: MenuItem[] | undefined;
  activeIndexStatus: number = 0;

  private vehicleEntry: VehicleEntry;
  public id: number = 0;

  //Vehicle
  private notAuth = STATUS_VEHICLE_ENTRY_NOTAUTH;
  private firstAuth = STATUS_VEHICLE_ENTRY_FIRSTAUTH;
  private authorized = STATUS_VEHICLE_ENTRY_AUTHORIZED;
  formVehicle = new FormGroup({
    id: new FormControl<number>(0, Validators.required),
    placa: new FormControl<string>(''),
    frota: new FormControl<string | null>(null),
    color: new FormControl<IColor[]>([], Validators.required),
    kmEntry: new FormControl<string | null>(''),
    kmExit: new FormControl<string | null>(''),
    modelVehicle: new FormControl<ModelVehicle[] | null>([], Validators.required),
    dateEntry: new FormControl<Date | null>(null, Validators.required),
    datePrevisionExit: new FormControl<Date | null>(null),

    idUserExitAuth1: new FormControl<number>(0),
    nameUserExitAuth1: new FormControl<string>(''),
    dateExitAuth1: new FormControl<Date | null>(null),

    idUserExitAuth2: new FormControl<number>(0),
    nameUserExitAuth2: new FormControl<string>(''),
    dateExitAuth2: new FormControl<Date | null>(null),

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

  public attendantsUser: User[] = [];
  private attendantUser: User;
  photoVehicle1!: string;
  photoVehicle2!: string;
  photoVehicle3!: string;
  photoVehicle4!: string;
  public dateExitAuth1 = signal<string>('');
  public dateExitAuth2 = signal<string>('');
  vehicleExit = false;
  //Porteiro
  proteiroId: number = 0;
  porteiroName: string = '';
  porteiroInfo: String = '';
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

  //Details Vehicle
  detailsVehicle: boolean = false;

  constructor(
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
    private ngxImageCompressService: NgxImageCompressService
  ) {
  }
  ngOnInit(): void {
     //Id vehicle entry
    this.id = this.activatedRoute.snapshot.params['id'];

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

    this.init();

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

    this.disableInput();

    //Prorietário
    this.disableClientId();
    this.disableClientName();
    this.disableClientCnpj();
    this.disableClientCpf();
    this.disableClientRg();
  }
  //Details Vehicle
  //mostra os detalhes da entrada do veículos chamar dentro de um dialog 
  showDetailsVehicle(id: number) {
    this.id = id;

    this.detailsVehicle = true;

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

    this.init();

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
   
    this.disableInput();

    //Prorietário
    this.disableClientId();
    this.disableClientName();
    this.disableClientCnpj();
    this.disableClientCpf();
    this.disableClientRg();
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

      if (this.selectClientCompany().fisjur == ClientFisJurEnum.juridica) {
        this.deleteRequireClientCompanyCpf();
        this.addRequireClientCompanyCnpj();
      } else {
        this.deleteRequireClientCompanyCnpj();
        this.addRequireClientCompanyCpf();
      }
    }
  }
  private async init() {
    //Show load
    this.busyService.busy();
    //Attendant
    this.attendantsUser = await this.getUserRole();
    //Model
    this.modelVehicles = await this.getVehicleModel();
    //Vehicle
    const vehicleResult = await this.getVehicleEntry();
    //Close load
    this.busyService.idle();

    if (vehicleResult.status == 200) {
      this.vehicleEntry = vehicleResult.body;
      //Vehicle has already left
      if (this.vehicleEntry.status == StatusVehicle.exit) {
        this.vehicleExit = true;
      }
      this.loadForms();
    } else {
      setTimeout(() => {
        // this.router.navigateByUrl("/portaria/lista-entrada-veiculo");
      }, 2000)
    }

  }
  private async getUserRole(): Promise<User[]> {
    try {
      return await lastValueFrom(this.userService.getUserFilterRoleId$(2));
    } catch (error) {
      return [];
    }
  }
  private async getVehicleModel(): Promise<ModelVehicle[]> {
    try {
      return await lastValueFrom(this.vehicleModelService.getAllEnabled());
    } catch (error) {
      return [];
    }
  }
  private async getVehicleEntry(): Promise<HttpResponse<VehicleEntry>> {
    try {
      return await lastValueFrom(this.vehicleService.entryFilterId$(this.id));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Vaículo não encontrado", icon: 'pi pi-times' });
      return error;
    }
  }
  private disableInput() {
    this.formVehicle.get('nameUserExitAuth1').disable();
    this.formVehicle.get('nameUserExitAuth2').disable();
  }
  private enableInput() {
    this.formVehicle.get('nameUserExitAuth1').enable();
    this.formVehicle.get('nameUserExitAuth2').enable();

  }
  private stepStatus(status: string) {

    switch (status) {
      case 'Attendant':
        this.activeIndexStatus = 0;
        break;
      case 'Budget':
        this.activeIndexStatus = 1;
        break;
      case 'Running_Service':
        this.activeIndexStatus = 2;
        break;
      case 'Full_Service':
        this.activeIndexStatus = 3;
        break;
      case 'Exit':
        this.activeIndexStatus = 4;
        break;
    }

  }
  private loadForms() {

    this.stepStatus(this.vehicleEntry.stepEntry);

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
      frota: this.vehicleEntry.frota == "" ? null : this.vehicleEntry.frota,
      modelVehicle: [this.modelVehicles.find(m => m.id == this.vehicleEntry.modelId)],
      kmEntry: this.vehicleEntry.kmEntry == "" ? null : this.vehicleEntry.kmEntry,
      kmExit: this.vehicleEntry.kmExit == "" ? null : this.vehicleEntry.kmExit,
      serviceOrder: this.vehicleEntry.serviceOrder,
      vehicleNew: this.vehicleEntry.vehicleNew,
      idUserExitAuth1: this.vehicleEntry.idUserExitAuth1,
      nameUserExitAuth1: this.vehicleEntry.nameUserExitAuth1,
      dateExitAuth1: this.vehicleEntry.dateExitAuth1 == "" ? null : new Date(this.vehicleEntry.dateExitAuth1),
      idUserExitAuth2: this.vehicleEntry.idUserExitAuth2,
      nameUserExitAuth2: this.vehicleEntry.nameUserExitAuth2,
      dateExitAuth2: this.vehicleEntry.dateExitAuth2 == "" ? null : new Date(this.vehicleEntry.dateExitAuth2),
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
      numServiceOrder: this.vehicleEntry.numServiceOrder == "" ? null : this.vehicleEntry.numServiceOrder,
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
      this.dateExitAuth1.set(this.vehicleEntry.dateExitAuth1!.toString());
    }
    if (this.vehicleEntry.dateExitAuth2) {
      this.dateExitAuth2.set(this.vehicleEntry.dateExitAuth2!.toString());
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
      if (this.vehicleEntry.serviceOrder == "yes") {
        this.addRequireAttendant();
      }

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
          this.photoVehicle2 = base64Data
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
          this.photoVehicle3 = base64Data
          this.formVehicle.patchValue({ photo3: this.photoVehicle3 });
        });
      }
    });
  }
  public async photoFile4Vehicle() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > this.IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.photoVehicle4 = base64Data
          this.formVehicle.patchValue({ photo4: this.photoVehicle4 });
        });
      }
    });
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
  public async authExit() {
    const uppercase = new UpperCasePipe();
    if (this.formVehicle.value.statusAuthExit != this.authorized) {

      this.busyService.busy();

      var auth = new VehicleEntryAuth();
      auth.companyId = this.storageService.companyId;
      auth.resaleId = this.storageService.resaleId;
      auth.idVehicle = this.vehicleEntry.id;
      auth.idUserExitAuth = this.storageService.id;
      auth.nameUserExitAuth = this.storageService.name;
      auth.dateExitAuth = this.formatDateTime(new Date());

      const permissionResult = await this.addAuthExit(auth);
      if (permissionResult.status == 200) {

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
            idUserExitAuth1: permissionResult.body.idUserExitAuth,
            nameUserExitAuth1: permissionResult.body.nameUserExitAuth,
            dateExitAuth1: new Date(permissionResult.body.dateExitAuth)
          });

          this.dateExitAuth1.set(permissionResult.body.dateExitAuth.toString());
        } else {
          this.formVehicle.patchValue({
            idUserExitAuth2: permissionResult.body.idUserExitAuth,
            nameUserExitAuth2: permissionResult.body.nameUserExitAuth,
            dateExitAuth2: new Date(permissionResult.body.dateExitAuth)
          });
          this.dateExitAuth2.set(permissionResult.body.dateExitAuth.toString());
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

    } else {
      this.messageService.add({ severity: 'info', summary: 'Veículo Liberado', detail: "Placa " + uppercase.transform(this.formVehicle.value.placa), icon: 'pi pi-thumbs-up-fill' });
    }

    this.busyService.idle();

  }
  private async addAuthExit(auth: VehicleEntryAuth): Promise<HttpResponse<VehicleEntryAuth>> {
    try {
      return await lastValueFrom(this.vehicleService.entryAddAuth(auth));
    } catch (error) {

      if (error.error.message == MESSAGE_RESPONSE_NOT_CLIENT) {
        this.showClientCompany();
      } else if (error.error.message == MESSAGE_RESPONSE_NOT_ATTENDANT) {
        this.showUserAttendant();
      } else if (error.error.message == MESSAGE_RESPONSE_NOT_DRIVEREXIT) {
        this.messageService.add({ severity: 'error', summary: 'Motorista Saída', detail: "Não informado", icon: 'pi pi-times' });
      } else if (error.error.message == "Permission not informed.") {
        this.permissionNot();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Não autorizado", icon: 'pi pi-times' });
      }
      return error;
    }
  }
  public async deleteAuth1() {
    if (this.formVehicle.value.idUserExitAuth1 != 0) {
      var auth = new VehicleEntryAuth();
      auth.companyId = this.storageService.companyId;
      auth.resaleId = this.storageService.resaleId;
      auth.idVehicle = this.id;
      auth.idUserExitAuth = this.storageService.id;
      auth.nameUserExitAuth = this.storageService.name;

      const authResult = await this.delAuth1(auth);

      if (authResult.status == 200) {
        this.messageService.add({ severity: 'success', summary: 'Autorização', detail: 'Removida com sucesso', icon: 'pi pi-check' });
        this.formVehicle.patchValue({
          idUserExitAuth1: 0,
          nameUserExitAuth1: '',
          dateExitAuth1: null
        });

        this.dateExitAuth1.set('');
        this.updateAuthExitStatus();
      }

    }
  }
  private async delAuth1(auth: VehicleEntryAuth): Promise<HttpResponse<VehicleEntryAuth>> {
    try {

      return await lastValueFrom(this.vehicleService.entryDeleteAuth1(auth));
    } catch (error) {
      if (error.error.message == "Permission not informed.") {
        this.permissionNot();
      } else if (error.error.message == "Authorization of another user.") {
        this.messageService.add({ severity: 'error', summary: 'Permissão', detail: "Autorização de outro usuário", icon: 'pi pi-times' });
      }
      return error;
    }
  }
  public async deleteAuth2() {
    if (this.formVehicle.value.idUserExitAuth2 != 0) {
      var auth = new VehicleEntryAuth();
      auth.companyId = this.storageService.companyId;
      auth.resaleId = this.storageService.resaleId;
      auth.idVehicle = this.id;
      auth.idUserExitAuth = this.storageService.id;
      auth.nameUserExitAuth = this.storageService.name;

      const authResult = await this.delAuth2(auth);
      if (authResult.status == 200) {
        this.messageService.add({ severity: 'success', summary: 'Autorização', detail: 'Removida com sucesso', icon: 'pi pi-check' });
        this.formVehicle.patchValue({
          idUserExitAuth2: 0,
          nameUserExitAuth2: '',
          dateExitAuth2: null
        });

        this.dateExitAuth2.set('');
        this.updateAuthExitStatus();
      }

    }
  }
  private async delAuth2(auth: VehicleEntryAuth): Promise<HttpResponse<VehicleEntryAuth>> {
    try {

      return await lastValueFrom(this.vehicleService.entryDeleteAuth2(auth));
    } catch (error) {
      if (error.error.message == "Permission not informed.") {
        this.permissionNot();
      } else if (error.error.message == "Authorization of another user.") {
        this.messageService.add({ severity: 'error', summary: 'Permissão', detail: "Autorização de outro usuário", icon: 'pi pi-times' });
      }
      return error;
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
    this.selectClientCompany.set(new ClientCompany());
    this.formClientCompany.patchValue({
      clientCompanyId: null,
      clientCompanyName: '',
      clientCompanyCnpj: '',
      clientCompanyCpf: '',
      clientCompanyRg: null
    });

  }
  disableClientId() {
    this.formClientCompany.get('clientCompanyId').disable();
  }
  enabledClientId() {
    this.formClientCompany.get('clientCompanyId').enable();
  }

  disableClientName() {
    this.formClientCompany.get('clientCompanyName').disable();
  }
  enabledClientName() {
    this.formClientCompany.get('clientCompanyName').enable();
  }
  disableClientCnpj() {
    this.formClientCompany.get('clientCompanyCnpj').disable();
  }
  enabledClientCnpj() {
    this.formClientCompany.get('clientCompanyCnpj').enable();
  }

  disableClientCpf() {
    this.formClientCompany.get('clientCompanyCpf').disable();
  }
  enabledClientCpf() {
    this.formClientCompany.get('clientCompanyCpf').enable();
  }

  disableClientRg() {
    this.formClientCompany.get('clientCompanyRg').disable();
  }
  enabledClientRg() {
    this.formClientCompany.get('clientCompanyRg').enable();
  }

  //Driver
  public async photoEntryDriver() {
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
  public async photoEntryFile1Driver() {
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
  public async photoEntryFile2Driver() {
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
  public async photoExitDriver() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > this.IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.driverExitPhoto = base64Data;
          this.formDriver.patchValue({ driverExitPhoto: this.driverExitPhoto });
        });
      }
    });
  }
  public async photoExitFile1Driver() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > this.IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.driverExitPhotoDoc1 = base64Data;
          this.formDriver.patchValue({ driverExitPhotoDoc1: this.driverExitPhotoDoc1 });
        });
      }
    });
  }
  public async photoExitFile2Driver() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > this.IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.driverExitPhotoDoc2 = base64Data;
          this.formDriver.patchValue({ driverExitPhotoDoc2: this.driverExitPhotoDoc2 });
        });
      }
    });
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
  //Budget
  public confirmGerarOrcamento() {
    if (this.formVehicle.value.numServiceOrder == "" || this.formVehicle.value.numServiceOrder == null) {
      this.messageService.add({ severity: 'info', summary: 'Número O.S.', detail: 'Não informado', icon: 'pi pi-info-circle' });
      return;
    }

    if (this.vehicleEntry.budgetStatus != StatusBudgetEnum.NotBudget) {
      this.router.navigateByUrl("/oficina/manutencao-orcamento/" + this.formVehicle.value.id);
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

          this.budget = { companyId: this.storageService.companyId, resaleId: this.storageService.resaleId, vehicleEntryId: this.formVehicle.value.id };

          const budgetResult = await this.saveBudget(this.budget);
          if (budgetResult.status == 201) {
            this.vehicleEntry.budgetStatus = budgetResult.body.status;
            this.messageService.add({ severity: 'info', summary: 'Orçamento - ' + budgetResult.body.id, detail: 'Gerado com sucesso', life: 2000 });
            setTimeout(() => {
              this.router.navigateByUrl('/oficina/manutencao-orcamento/' + this.formVehicle.value.id);
            }, 2000);
          }

        }/* ,
        reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        } */
      });
    }
  }
  private async saveBudget(budget: IBudgetNew): Promise<HttpResponse<IBudget>> {
    try {
      return await lastValueFrom(this.budgetService.addBudget$(this.budget));
    } catch (error) {
      const SERVICEORDER = "Equal service order not.";
      const SERVICEORDER_NUMBER = "Number Service order not informed.";
      if (error.error.message == MESSAGE_RESPONSE_NOT_CLIENT) {
        this.messageService.add({ severity: 'error', summary: 'Empresa', detail: "Não informada", icon: 'pi pi-times' });
      } else if (error.error.message == MESSAGE_RESPONSE_NOT_ATTENDANT) {
        this.messageService.add({ severity: 'error', summary: 'Consultor', detail: "Não informado", icon: 'pi pi-times' });
      } else if (error.error.message == SERVICEORDER) {
        this.messageService.add({ severity: 'error', summary: 'Ordem Serviço', detail: "Informado não", icon: 'pi pi-times' });
      } else if (error.error.message == SERVICEORDER_NUMBER) {
        this.messageService.add({ severity: 'error', summary: 'Número O.S.', detail: "Não informado", icon: 'pi pi-times' });
      } else if (error.error.message == "Permission not informed.") {
        this.permissionNot();
      }

      return error;
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

    if (vehicleValue.serviceOrder == "yes") {
      if (vehicleValue.statusAuthExit != this.notAuth) {
        if (vehicleValue.userAttendant.length == 0) {
          this.messageService.add({ severity: 'error', summary: 'Consultor', detail: "Não informado", icon: 'pi pi-times' });
          return false;
        }
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

  private loadingVehicle() {
    const vehicleValue = this.formVehicle.value;
    const clientCompanyValue = this.formClientCompany.value;
    const driverValue = this.formDriver.value;

    this.vehicleEntry.dateEntry = this.formatDateTime(vehicleValue.dateEntry);
    this.vehicleEntry.datePrevisionExit = vehicleValue?.datePrevisionExit == null ? "" : this.formatDateTime(vehicleValue.datePrevisionExit);
    this.vehicleEntry.placa = vehicleValue.placa;
    this.vehicleEntry.placasJunto = "";
    this.vehicleEntry.frota = vehicleValue.frota == null ? "" : vehicleValue.frota.toString();
    this.vehicleEntry.modelId = vehicleValue.modelVehicle.at(0).id;
    this.vehicleEntry.modelDescription = vehicleValue.modelVehicle.at(0).description;
    this.vehicleEntry.color = vehicleValue.color.at(0).color;

    this.vehicleEntry.idUserAttendant = vehicleValue.userAttendant.at(0)?.id ?? 0;
    this.vehicleEntry.nameUserAttendant = vehicleValue.userAttendant.at(0)?.name ?? "";

    this.vehicleEntry.kmEntry = vehicleValue?.kmEntry ?? "";
    this.vehicleEntry.kmExit = vehicleValue?.kmExit ?? "";

    this.vehicleEntry.idUserExitAuth1 = vehicleValue?.idUserExitAuth1 ?? 0;
    this.vehicleEntry.nameUserExitAuth1 = vehicleValue?.nameUserExitAuth1 ?? "";
    this.vehicleEntry.dateExitAuth1 = vehicleValue?.dateExitAuth1 == null ? "" : this.formatDateTime(vehicleValue.dateExitAuth1);
    this.vehicleEntry.idUserExitAuth2 = vehicleValue?.idUserExitAuth2 ?? 0;
    this.vehicleEntry.nameUserExitAuth2 = vehicleValue?.nameUserExitAuth2 ?? "";
    this.vehicleEntry.dateExitAuth2 = vehicleValue?.dateExitAuth2 == null ? "" : this.formatDateTime(vehicleValue.dateExitAuth2);
    this.vehicleEntry.statusAuthExit = vehicleValue.statusAuthExit;

    this.vehicleEntry.quantityTrafficCone = vehicleValue?.quantityTrafficCone ?? 0;
    this.vehicleEntry.quantityExtinguisher = vehicleValue?.quantityExtinguisher ?? 0;
    this.vehicleEntry.quantityTire = vehicleValue?.quantityTire ?? 0;
    this.vehicleEntry.quantityTireComplete = vehicleValue?.quantityTireComplete ?? 0;
    this.vehicleEntry.quantityToolBox = vehicleValue?.quantityToolBox ?? 0;
    this.vehicleEntry.numServiceOrder = vehicleValue?.numServiceOrder ?? "";
    this.vehicleEntry.numNfe = vehicleValue?.numNfe ?? "";
    this.vehicleEntry.numNfse = vehicleValue?.numNfse ?? "";
    this.vehicleEntry.photo1 = vehicleValue.photo1 ?? "";
    this.vehicleEntry.photo2 = vehicleValue.photo2 ?? "";
    this.vehicleEntry.photo3 = vehicleValue.photo3 ?? "";
    this.vehicleEntry.photo4 = vehicleValue.photo4 ?? "";
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
    this.vehicleEntry.driverEntryPhoto = driverValue.driverEntryPhoto ?? "";
    this.vehicleEntry.driverEntrySignature = driverValue.driverEntrySignature ?? "";
    this.vehicleEntry.driverEntryPhotoDoc1 = driverValue.driverEntryPhotoDoc1 ?? "";
    this.vehicleEntry.driverEntryPhotoDoc2 = driverValue.driverEntryPhotoDoc2 ?? "";

    this.vehicleEntry.driverExitName = driverValue.driverExitName;
    this.vehicleEntry.driverExitCpf = driverValue.driverExitCpf;
    this.vehicleEntry.driverExitRg = driverValue?.driverExitRg ?? "";
    this.vehicleEntry.driverExitPhoto = driverValue.driverExitPhoto ?? "";
    this.vehicleEntry.driverExitSignature = driverValue.driverExitSignature ?? "";
    this.vehicleEntry.driverExitPhotoDoc1 = driverValue.driverExitPhotoDoc1 ?? "";
    this.vehicleEntry.driverExitPhotoDoc2 = driverValue.driverExitPhotoDoc2 ?? "";

  }
  public async save() {
    this.busyService.busy();

    //Prorietário
    this.enabledClientId();
    this.enabledClientName();
    this.enabledClientCnpj();
    this.enabledClientCpf();
    this.enabledClientRg();

    if (this.validForms()) {

      //Loading data
      this.loadingVehicle();

      const resultVehicle = await this.updateVehicle(this.vehicleEntry);

      if (resultVehicle.status == 200) {
        this.messageService.add({ severity: 'success', summary: 'Veículo', detail: 'Atualizado com sucesso', icon: 'pi pi-check' });
        this.disableInput();
        this.selectClientCompany.set(new ClientCompany());
      }
    }

    //Prorietário
    this.disableClientId();
    this.disableClientName();
    this.disableClientCnpj();
    this.disableClientCpf();
    this.disableClientRg();

    this.busyService.idle();
  }
  private async updateVehicle(vehicle: VehicleEntry): Promise<HttpResponse<VehicleEntry>> {
    try {
      return await lastValueFrom(this.vehicleService.entryUpdate(vehicle));
    } catch (error) {
      const BUDGET_ATTENDANT = "BUDGET-Attendant not informed.";
      const BUDGET_CLIENTCOMPANY = "BUDGET-ClientCompany not informed.";
      const SERVICEORDER = "Equal service order not.";
      const SERVICEORDER_NUMBER = "Number Service order not informed.";
      if (error.error.message == MESSAGE_RESPONSE_NOT_ATTENDANT) {
        this.showUserAttendant();
      }
      if (error.error.message == MESSAGE_RESPONSE_NOT_CLIENT) {
        this.showClientCompany();
      }
      if (error.error.message == BUDGET_ATTENDANT) {
        this.messageService.add({ severity: 'info', summary: 'Informação', detail: "Véiculo possui orçamento" });
        this.showUserAttendant();
      }
      if (error.error.message == BUDGET_CLIENTCOMPANY) {
        this.messageService.add({ severity: 'info', summary: 'Informação', detail: "Véiculo possui orçamento" });
        this.showClientCompany();
      }
      if (error.error.message == MESSAGE_RESPONSE_ERROR_AUTH_EXIT) {
        this.messageService.add({ severity: 'info', summary: 'Informação', detail: "Remova autorização de saída" });
      }

      if (error.error.message == SERVICEORDER) {
        this.messageService.add({ severity: 'error', summary: 'Ordem Serviço', detail: "Informado não", icon: 'pi pi-times' });
      }

      if (error.error.message == SERVICEORDER_NUMBER) {
        this.messageService.add({ severity: 'error', summary: 'Número O.S.', detail: "Não informado", icon: 'pi pi-times' });
      }
      return error;
    }

  }

  //Permission Not
  private permissionNot() {
    this.messageService.add({ severity: 'error', summary: 'Permissão', detail: "Você não tem permissão", icon: 'pi pi-times' });
  }

}
