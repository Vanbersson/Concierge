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
import { MessagesModule } from 'primeng/messages';
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
  MESSAGE_RESPONSE_NOT_ATTENDANT, MESSAGE_RESPONSE_NOT_DRIVEREXIT, MESSAGE_RESPONSE_ERROR_AUTH_EXIT,
  IMAGE_MAX_SIZE,
  MESSAGE_RESPONSE_NOT_DRIVERENTRY
} from '../../../util/constants';
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
import { StatusBudgetEnum } from '../../../models/budget/status-budget-enum';
import { StatusVehicle } from '../../../models/enum/status-vehicle';
import { FilterDriverComponent } from '../../../components/filter.driver/filter.driver.component';
import { DriverService } from '../../../services/driver/driver.service';
import { MessageResponse } from '../../../models/message/message-response';
import { SuccessError } from '../../../models/enum/success-error';
import { PermissionService } from '../../../services/permission/permission.service';

@Component({
  selector: 'app-manutencao',
  standalone: true,
  imports: [CommonModule, FilterClientComponent, FilterDriverComponent, RouterModule, MessagesModule,
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
  itemsStatus: MenuItem[] | undefined;
  activeIndexStatus: number = 0;
  private vehicleEntry: VehicleEntry;
  private id: number = 0;
  //Vehicle
  private notAuth = STATUS_VEHICLE_ENTRY_NOTAUTH;
  private firstAuth = STATUS_VEHICLE_ENTRY_FIRSTAUTH;
  private authorized = STATUS_VEHICLE_ENTRY_AUTHORIZED;

  formVehicle = new FormGroup({
    id: new FormControl<number>({ value: 0, disabled: true }),
    placa: new FormControl<string>(''),
    frota: new FormControl<string | null>(null),
    color: new FormControl<IColor[]>([], Validators.required),
    kmEntry: new FormControl<string | null>(''),
    kmExit: new FormControl<string | null>(''),
    modelVehicle: new FormControl<ModelVehicle[] | null>([], Validators.required),
    dateEntry: new FormControl<Date | null>(null, Validators.required),
    datePrevisionExit: new FormControl<Date | null>(null),
    nameUserExitAuth1: new FormControl<string>({ value: "", disabled: true }),
    nameUserExitAuth2: new FormControl<string>({ value: "", disabled: true }),
    quantityExtinguisher: new FormControl<number | null>(null),
    quantityTrafficCone: new FormControl<number | null>(null),
    quantityTire: new FormControl<number | null>(null),
    quantityTireComplete: new FormControl<number | null>(null),
    quantityToolBox: new FormControl<number | null>(null),
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

  constructor(
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
    private ngxImageCompressService: NgxImageCompressService,
    private driverService: DriverService
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
    if (this.activatedRoute.snapshot.params['id']) {
      //Id vehicle entry
      this.id = this.activatedRoute.snapshot.params['id'];
      this.init();
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
      this.driverEntryPhoto = this.driverEntry.photoDriver;
      this.driverEntryPhotoDoc1 = this.driverEntry.photoDoc1;
      this.driverEntryPhotoDoc2 = this.driverEntry.photoDoc2;
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
      this.driverExitPhoto = this.driverExit.photoDriver;
      this.driverExitPhotoDoc1 = this.driverExit.photoDoc1;
      this.driverExitPhotoDoc2 = this.driverExit.photoDoc2;
      this.selectDriverExit.set(new Driver());
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
      //Passa as informações para o objeto veículo de entrada
      this.vehicleEntry = vehicleResult.body;
      //Buscar o motorista de entrada
      if (this.vehicleEntry.driverEntryId != 0 && this.vehicleEntry.driverEntryName != "") {
        const resultDriverEntry = await this.filterDriverId(this.vehicleEntry.driverEntryId);
        if (resultDriverEntry.status == 200) {
          this.driverEntry = resultDriverEntry.body;
        }
      }
      //Buscar o motorista de saída
      if (this.vehicleEntry.driverExitId != 0 && this.vehicleEntry.driverExitName != "") {
        const resultDriverExit = await this.filterDriverId(this.vehicleEntry.driverExitId);
        if (resultDriverExit.status == 200) {
          this.driverExit = resultDriverExit.body;
        }
      }
      //Vehicle has already left
      if (this.vehicleEntry.status == StatusVehicle.exit) {
        this.vehicleExit = true;
      }
      this.loadForms();
    }
  }
  private loadForms() {
    //Status do atendimento
    this.stepStatus(this.vehicleEntry.stepEntry);
    //Consultor
    for (var attendant of this.attendantsUser) {
      if (attendant.id == this.vehicleEntry.idUserAttendant) {
        this.attendantUser = attendant;
        this.formVehicle.patchValue({ userAttendant: [this.attendantUser] });
      }
    }
    //Vehicle
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
      nameUserExitAuth1: this.vehicleEntry.nameUserExitAuth1,
      nameUserExitAuth2: this.vehicleEntry.nameUserExitAuth2,
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
    this.photoVehicle1 = this.vehicleEntry.photo1;
    this.photoVehicle2 = this.vehicleEntry.photo2;
    this.photoVehicle3 = this.vehicleEntry.photo3;
    this.photoVehicle4 = this.vehicleEntry.photo4;
    //Validation placa
    if (this.vehicleEntry.vehicleNew == 'yes') {
      this.deleteRequirePlaca();
    } else {
      this.addRequirePlaca();
    }
    //Autorização de saída
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
    if (this.vehicleEntry.clientCompanyId != 0) {
      this.formClientCompany.patchValue({
        clientCompanyId: this.vehicleEntry.clientCompanyId,
        clientCompanyName: this.vehicleEntry.clientCompanyName,
        clientCompanyCnpj: this.vehicleEntry.clientCompanyCnpj,
        clientCompanyCpf: this.vehicleEntry.clientCompanyCpf,
        clientCompanyRg: this.vehicleEntry.clientCompanyRg == "" ? null : this.vehicleEntry.clientCompanyRg,
      });
      this.clientCompany = new ClientCompany();
      this.clientCompany.id = this.vehicleEntry.clientCompanyId;
      this.clientCompany.name = this.vehicleEntry.clientCompanyName;
      this.clientCompany.cnpj = this.vehicleEntry.clientCompanyCnpj;
      this.clientCompany.cpf = this.vehicleEntry.clientCompanyCpf;
      this.clientCompany.rg = this.vehicleEntry.clientCompanyRg;
    } else {
      this.formClientCompany.patchValue({
        clientCompanyNot: ['not'],
        clientCompanyId: null,
        clientCompanyRg: null
      });
    }
    //Form Driver entrada
    //Menssagem de motorista sem cadastro
    if (this.vehicleEntry.driverEntryId == 0 && this.vehicleEntry.driverEntryName != "") {
      this.messageService.add({ key: 'messageDriverEntry', severity: 'warn', detail: 'MOTORISTA SEM CADASTRO - NOME:' + this.vehicleEntry.driverEntryName + '-CPF:' + this.vehicleEntry.driverEntryCpf + '-RG:' + this.vehicleEntry.driverEntryRg });
    } else {
      this.formDriver.patchValue({
        driverEntryId: this.driverEntry.id == 0 ? null : this.driverEntry.id,
        driverEntryName: this.driverEntry.name,
        driverEntryCpf: this.driverEntry.cpf,
        driverEntryRg: this.driverEntry.rg == "" ? null : this.driverEntry.rg
      });
      this.driverEntryPhoto = this.driverEntry.photoDriver;
      this.driverEntryPhotoDoc1 = this.driverEntry.photoDoc1;
      this.driverEntryPhotoDoc2 = this.driverEntry.photoDoc2;
    }
    //Form Driver saída
    //Menssagem de motorista sem cadastro
    if (this.vehicleEntry.driverExitId == 0 && this.vehicleEntry.driverExitName != "") {
      this.messageService.add({ key: 'messageDriverExit', severity: 'warn', detail: 'MOTORISTA SEM CADASTRO - NOME:' + this.vehicleEntry.driverExitName + '-CPF:' + this.vehicleEntry.driverExitCpf + '-RG:' + this.vehicleEntry.driverExitRg });
    } else if (this.driverExit != null) {
      this.formDriver.patchValue({
        driverExitId: this.driverExit.id == 0 ? null : this.driverExit.id,
        driverExitName: this.driverExit.name,
        driverExitCpf: this.driverExit.cpf,
        driverExitRg: this.driverExit.rg == "" ? null : this.driverExit.rg
      });
      this.driverExitPhoto = this.driverExit.photoDriver;
      this.driverExitPhotoDoc1 = this.driverExit.photoDoc1;
      this.driverExitPhotoDoc2 = this.driverExit.photoDoc2;
    }
    //Verificar essa função
    if (this.vehicleEntry.statusAuthExit != this.notAuth) {
      if (this.vehicleEntry.serviceOrder == "yes") {
        this.addRequireAttendant();
      }
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
      if (this.ngxImageCompressService.byteCount(image) > IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {
          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.photoVehicle1 = base64Data;
        });
      }
    });

  }
  public async photoFile2Vehicle() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {
          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.photoVehicle2 = base64Data
        });
      }
    });
  }
  public async photoFile3Vehicle() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {
          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.photoVehicle3 = base64Data
        });
      }
    });
  }
  public async photoFile4Vehicle() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {
          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.photoVehicle4 = base64Data
        });
      }
    });
  }
  public deleteFileVehicle1() {
    this.photoVehicle1 = "";
  }
  public deleteFileVehicle2() {
    this.photoVehicle2 = "";
  }
  public deleteFileVehicle3() {
    this.photoVehicle3 = "";
  }
  public deleteFileVehicle4() {
    this.photoVehicle4 = "";
  }
  private updateAuthExitStatus() {
    if (this.vehicleEntry.statusAuthExit == this.firstAuth) {
      this.vehicleEntry.statusAuthExit = this.notAuth;
      this.deleteRequireForms();
    } else if (this.vehicleEntry.statusAuthExit == this.authorized) {
      this.vehicleEntry.statusAuthExit = this.firstAuth;
    }
  }
  private deleteRequireForms() {
    this.deleteRequireAttendant();
  }
  private addRequireForms() {
    this.addRequireAttendant();
  }
  public async authExit() {
    const uppercase = new UpperCasePipe();
    if (this.vehicleEntry.statusAuthExit != this.authorized) {
      //Inicia loading
      this.busyService.busy();
      var auth = new VehicleEntryAuth();
      auth.companyId = this.storageService.companyId;
      auth.resaleId = this.storageService.resaleId;
      auth.vehicleId = this.vehicleEntry.id;
      auth.userId = this.storageService.id;
      auth.userName = this.storageService.name;
      auth.dateAuth = this.formatDateTime(new Date());

      const permissionResult = await this.addAuthExit(auth);
      if (permissionResult.status == 200 && permissionResult.body.status == SuccessError.succes) {
        //Status auth exit
        if (this.vehicleEntry.statusAuthExit == this.notAuth) {
          this.vehicleEntry.statusAuthExit = this.firstAuth;
        } else if (this.vehicleEntry.statusAuthExit == this.firstAuth) {
          this.vehicleEntry.statusAuthExit = this.authorized;
        }
        if (this.vehicleEntry.idUserExitAuth1 == 0) {
          this.formVehicle.patchValue({
            nameUserExitAuth1: permissionResult.body.data.userName,
          });
          this.vehicleEntry.idUserExitAuth1 = permissionResult.body.data.userId;
          this.vehicleEntry.nameUserExitAuth1 = permissionResult.body.data.userName;
          this.vehicleEntry.dateExitAuth1 = permissionResult.body.data.dateAuth;
          this.dateExitAuth1.set(permissionResult.body.data.dateAuth.toString());
        } else {
          this.formVehicle.patchValue({
            nameUserExitAuth2: permissionResult.body.data.userName,
          });
          this.vehicleEntry.idUserExitAuth2 = permissionResult.body.data.userId;
          this.vehicleEntry.nameUserExitAuth2 = permissionResult.body.data.userName;
          this.vehicleEntry.dateExitAuth2 = permissionResult.body.data.dateAuth;
          this.dateExitAuth2.set(permissionResult.body.data.dateAuth.toString());
        }
        //Autorização de saída
        if (this.vehicleEntry.statusAuthExit == this.firstAuth) {
          this.messageService.add({ severity: 'success', summary: permissionResult.body.header, detail: permissionResult.body.message, icon: 'pi pi-check-circle' });
        }
        //Saída liberada
        if (this.vehicleEntry.statusAuthExit == this.authorized) {
          this.messageService.add({ severity: 'success', summary: permissionResult.body.header, detail: permissionResult.body.message, icon: 'pi pi-thumbs-up-fill' });
        }
        //Valid
        this.addRequireForms();
      } else if (permissionResult.status == 200 && permissionResult.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: permissionResult.body.header, detail: permissionResult.body.message, icon: 'pi pi-info-circle' });
      }
      //Fecha loading
      this.busyService.idle();
    } else {
      this.messageService.add({ severity: 'info', summary: 'Veículo Liberado', detail: "Placa " + uppercase.transform(this.formVehicle.value.placa), icon: 'pi pi-thumbs-up-fill' });
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
  public async deleteAuth1() {
    if (this.vehicleEntry.idUserExitAuth1 != 0) {
      var auth = new VehicleEntryAuth();
      auth.companyId = this.storageService.companyId;
      auth.resaleId = this.storageService.resaleId;
      auth.vehicleId = this.id;
      auth.userId = this.storageService.id;
      auth.userName = this.storageService.name;

      const authResult = await this.delAuth1(auth);
      if (authResult.status == 200 && authResult.body.status == SuccessError.succes) {
        this.messageService.add({ severity: 'success', summary: authResult.body.header, detail: authResult.body.message, icon: 'pi pi-check' });
        this.formVehicle.patchValue({
          nameUserExitAuth1: '',
        });
        this.vehicleEntry.idUserExitAuth1 = 0;
        this.vehicleEntry.nameUserExitAuth1 = '';
        this.vehicleEntry.dateExitAuth1 = '';
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

    if (this.vehicleEntry.idUserExitAuth2 != 0) {
      var auth = new VehicleEntryAuth();
      auth.companyId = this.storageService.companyId;
      auth.resaleId = this.storageService.resaleId;
      auth.vehicleId = this.id;
      auth.userId = this.storageService.id;
      auth.userName = this.storageService.name;

      const authResult = await this.delAuth2(auth);
      if (authResult.status == 200 && authResult.body.status == SuccessError.succes) {
        this.messageService.add({ severity: 'success', summary: authResult.body.header, detail: authResult.body.message, icon: 'pi pi-check' });
        this.formVehicle.patchValue({
          nameUserExitAuth2: '',
        });
        this.vehicleEntry.idUserExitAuth2 = 0;
        this.vehicleEntry.nameUserExitAuth2 = '';
        this.vehicleEntry.dateExitAuth2 = '';
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
    if (this.formClientCompany.value.clientCompanyNot.length == 0) {
      this.cleanFormClientCompany();
    }
    this.clientCompany = null;
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
  private async filterDriverId(id: number): Promise<HttpResponse<Driver>> {
    try {
      return lastValueFrom(this.driverService.filterId(id));
    } catch (error) {
      return error;
    }
  }
  cleanDriverExit() {
    this.driverExit = new Driver();
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
  showPlacaExist(placa: string) {
    const uppercase = new UpperCasePipe();
    this.messageService.add({ severity: 'error', summary: 'Placa ' + uppercase.transform(placa), detail: "Vaículo já se encontra na empresa", icon: 'pi pi-truck' });
  }
  //Budget
  public async confirmGerarOrcamento() {
    if (this.formVehicle.value.numServiceOrder == "" || this.formVehicle.value.numServiceOrder == null) {
      this.messageService.add({ severity: 'info', summary: 'Número O.S.', detail: 'Não informado', icon: 'pi pi-info-circle' });
      return;
    }

    if (this.vehicleEntry.budgetStatus != StatusBudgetEnum.NotBudget) {
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
            this.vehicleEntry.budgetStatus = budgetResult.body.status;
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
  //Permission Not
  private permissionNot() {
    this.messageService.add({ severity: 'error', summary: 'Permissão', detail: "Você não tem permissão", icon: 'pi pi-times' });
  }
  //Atualizar informações do veículo
  private validInformation(): boolean {
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
      if (this.vehicleEntry.statusAuthExit != this.notAuth) {
        if (vehicleValue.userAttendant.length == 0) {
          this.messageService.add({ severity: 'error', summary: 'Consultor', detail: "Não informado", icon: 'pi pi-times' });
          return false;
        }
      }
    }
    //Proprietário
    if (clientCompanyValue.clientCompanyNot.length == 0) {
      if (this.clientCompany == null) {
        this.messageService.add({ severity: 'error', summary: 'Proprietário', detail: "Não informado", icon: 'pi pi-times' });
        return false;
      }
    }
    //Motorista Entrada
    if (this.driverEntry == null) {
      this.messageService.add({ severity: 'error', summary: 'Motorista Entrada', detail: "Não informado", icon: 'pi pi-times' });
      return false;
    }
    if (this.vehicleEntry.statusAuthExit != this.notAuth) {
      //Motorista saída
      if (driverValue.driverExitName == "") {
        this.messageService.add({ severity: 'error', summary: 'Motorista Saída', detail: "Não informado", icon: 'pi pi-times' });
        return false;
      }
      if (driverValue.driverExitCpf == "" && driverValue.driverExitRg == null) {
        this.messageService.add({ severity: 'error', summary: 'Motorista Saída', detail: "Não informado", icon: 'pi pi-times' });
        return false;
      }
    }
    return true;
  }
  private loadingVehicle() {
    const vehicleValue = this.formVehicle.value;
    const clientCompanyValue = this.formClientCompany.value;

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
    this.vehicleEntry.quantityTrafficCone = vehicleValue?.quantityTrafficCone ?? 0;
    this.vehicleEntry.quantityExtinguisher = vehicleValue?.quantityExtinguisher ?? 0;
    this.vehicleEntry.quantityTire = vehicleValue?.quantityTire ?? 0;
    this.vehicleEntry.quantityTireComplete = vehicleValue?.quantityTireComplete ?? 0;
    this.vehicleEntry.quantityToolBox = vehicleValue?.quantityToolBox ?? 0;
    this.vehicleEntry.numServiceOrder = vehicleValue?.numServiceOrder ?? "";
    this.vehicleEntry.numNfe = vehicleValue?.numNfe ?? "";
    this.vehicleEntry.numNfse = vehicleValue?.numNfse ?? "";
    this.vehicleEntry.photo1 = this.photoVehicle1 ?? "";
    this.vehicleEntry.photo2 = this.photoVehicle2 ?? "";
    this.vehicleEntry.photo3 = this.photoVehicle3 ?? "";
    this.vehicleEntry.photo4 = this.photoVehicle4 ?? "";
    this.vehicleEntry.vehicleNew = vehicleValue.vehicleNew;
    this.vehicleEntry.serviceOrder = vehicleValue.serviceOrder;
    this.vehicleEntry.information = vehicleValue.information;
    if (clientCompanyValue.clientCompanyNot.length == 1) {
      this.vehicleEntry.clientCompanyId = 0;
      this.vehicleEntry.clientCompanyName = "";
      this.vehicleEntry.clientCompanyCnpj = "";
      this.vehicleEntry.clientCompanyCpf = "";
      this.vehicleEntry.clientCompanyRg = "";
    } else {
      this.vehicleEntry.clientCompanyId = this.clientCompany.id;
      this.vehicleEntry.clientCompanyName = this.clientCompany.name;
      this.vehicleEntry.clientCompanyCnpj = this.clientCompany.cnpj;
      this.vehicleEntry.clientCompanyCpf = this.clientCompany.cpf;
      this.vehicleEntry.clientCompanyRg = this.clientCompany?.rg ?? "";
    }
    this.vehicleEntry.driverEntryId = this.driverEntry.id;
    this.vehicleEntry.driverEntryName = this.driverEntry.name;
    this.vehicleEntry.driverEntryCpf = this.driverEntry.cpf;
    this.vehicleEntry.driverEntryRg = this.driverEntry.rg ?? "";
    if (this.driverExit != null) {
      this.vehicleEntry.driverExitId = this.driverExit.id;
      this.vehicleEntry.driverExitName = this.driverExit.name;
      this.vehicleEntry.driverExitCpf = this.driverExit.cpf;
      this.vehicleEntry.driverExitRg = this.driverExit?.rg ?? "";
    }
  }
  public async save() {
    /* PERMISSION - 100 */
    /* EDITAR ENTRADA DO VEÍCULO */
    const permission = await this.searchPermission(100);
    if (!permission) { return; }

    if (this.validInformation()) {
      //Inicia loading
      this.busyService.busy();
      //Loading data
      this.loadingVehicle();

      const resultVehicle = await this.updateVehicle(this.vehicleEntry);
      if (resultVehicle.status == 200 && resultVehicle.body.status == SuccessError.succes) {
        this.messageService.add({ severity: 'success', summary: resultVehicle.body.header, detail: resultVehicle.body.message, icon: 'pi pi-check' });
      } else if (resultVehicle.status == 200 && resultVehicle.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: resultVehicle.body.header, detail: resultVehicle.body.message, icon: 'pi pi-info-circle' });
      }
      //Fecha loading
      this.busyService.idle();
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
}
