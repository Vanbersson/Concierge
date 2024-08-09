import { Component, OnInit } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';


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
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputGroupModule } from 'primeng/inputgroup';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { SpeedDialModule } from 'primeng/speeddial';



//Service
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { UserService } from '../../../services/user/user.service';
import { VehicleModelService } from '../../../services/concierge/vehicle-model/vehicle-model.service';
import { ClientecompanyService } from '../../../services/clientecompany/clientecompany.service';

//Interface
import { IUser } from '../../../interfaces/iuser';
import { IVehicleModel } from '../../../interfaces/vehicle/iVehicleModel';
import { IClientCompany } from '../../../interfaces/iclient-company';
import { IColor } from '../../../interfaces/icolor';

//Constants
import { STATUS_VEHICLE_ENTRY_NOTAUTH, STATUS_VEHICLE_ENTRY_FIRSTAUTH, STATUS_VEHICLE_ENTRY_AUTHORIZED } from '../../../util/constants';
import { Nullable } from 'primeng/ts-helpers';
import { BudgetService } from '../../../services/budget/budget.service';
import { LayoutService } from '../../../layouts/layout/service/layout.service';
import { IBudgetRequisition } from '../../../interfaces/budget/ibudget-requisition';

export interface IBudgetService {
  ordem: number;
  description: string;
  tempService: number;
  valueHour: number;
}

@Component({
  selector: 'app-manutencao',
  standalone: true,
  imports: [CommonModule, TabViewModule, FormsModule, IconFieldModule, TooltipModule, SpeedDialModule, ConfirmDialogModule, InputIconModule, ImageModule, DialogModule, ToastModule, TableModule, ReactiveFormsModule, InputTextareaModule, InputNumberModule, InputTextModule, ButtonModule, InputMaskModule, MultiSelectModule, InputGroupModule, ScrollPanelModule, RadioButtonModule, CalendarModule],
  templateUrl: './manutencao.component.html',
  styleUrl: './manutencao.component.scss',
  providers: [ConfirmationService, MessageService]
})
export default class ManutencaoComponent implements OnInit {

  id: number = 0;

  proteiroId: number = 0;
  porteiroName: string = '';
  porteiroInfo: String = '';

  cores: IColor[] = []

  photoVehicle1!: String;
  photoVehicle2!: String;
  photoVehicle3!: String;
  photoVehicle4!: String;

  driverEntryPhoto!: String;
  driverEntryPhotoDoc1!: String;
  driverEntryPhotoDoc2!: String;

  driverExitPhoto!: String;
  driverExitPhotoDoc1!: String;
  driverExitPhotoDoc2!: String;

  modeloVeiculos: IVehicleModel[] = [];
  consutores: IUser[] = [];

  dialogListClientCompany!: IClientCompany[];
  dialogSelectClientCompany!: IClientCompany;
  dialogVisibleClientCompany: boolean = false;
  dialogloadingClientCompany: boolean = false;

  nameUserExitAuth1!: string;
  dateExitAuth1!: string;
  nameUserExitAuth2!: string;
  dateExitAuth2!: string;

  dialogVisibleOrcamento: boolean = false;
  dialogNomeClientCompany!: string;
  dialogIdClientCompany!: number;

  itemsButtonMenu: MenuItem[] = [];

  formAtendimento = new FormGroup({

    companyId: new FormControl<number>(0, Validators.required),
    resaleId: new FormControl<number>(0, Validators.required),

    id: new FormControl(),

    status: new FormControl<String>(''),
    stepEntry: new FormControl<String>(''),

    budgetId: new FormControl<number | null>(null),
    budgetStatus: new FormControl<String>(''),

    idUserEntry: new FormControl<Number>(0, Validators.required),
    nameUserEntry: new FormControl<String>('', Validators.required),
    dateEntry: new FormControl<Date | null>(null),
    datePrevisionExit: new FormControl<Date | null>(null),

    idUserAttendant: new FormControl<Number | null>(null),
    nameUserAttendant: new FormControl<String>(''),

    idUserExitAuth1: new FormControl<Number | null>(null),
    nameUserExitAuth1: new FormControl<String>(''),
    dateExitAuth1: new FormControl<Date | null>(null),

    idUserExitAuth2: new FormControl<Number | null>(null),
    nameUserExitAuth2: new FormControl<String>(''),
    dateExitAuth2: new FormControl<Date | null>(null),

    statusAuthExit: new FormControl<String>('', Validators.required),

    modelId: new FormControl<Number>(0),
    modelDescription: new FormControl<String>(''),

    clientCompanyId: new FormControl<Number>(0, Validators.required),
    clientCompanyName: new FormControl<String>(''),
    clientCompanyCnpj: new FormControl<String>(''),
    clientCompanyCpf: new FormControl<String>(''),
    clientCompanyRg: new FormControl<String>(''),

    driverEntryName: new FormControl<string>(''),
    driverEntryCpf: new FormControl<string>(''),
    driverEntryRg: new FormControl<string>(''),
    driverEntryPhoto: new FormControl<String | null>(null),
    driverEntrySignature: new FormControl<String | null>(null),
    driverEntryPhotoDoc1: new FormControl<String | null>(null),
    driverEntryPhotoDoc2: new FormControl<String | null>(null),

    driverExitName: new FormControl<string>(''),
    driverExitCpf: new FormControl<string>(''),
    driverExitRg: new FormControl<string>(''),
    driverExitPhoto: new FormControl<String | null>(null),
    driverExitSignature: new FormControl<String | null>(null),
    driverExitPhotoDoc1: new FormControl<String | null>(null),
    driverExitPhotoDoc2: new FormControl<String | null>(null),

    color: new FormControl<String>('', Validators.required),
    placa: new FormControl<string>(''),
    frota: new FormControl<String>(''),

    vehicleNew: new FormControl<String>(''),

    kmEntry: new FormControl<String>(''),
    kmExit: new FormControl<String>(''),

    photo1: new FormControl<String | null>(null),
    photo2: new FormControl<String | null>(null),
    photo3: new FormControl<String | null>(null),
    photo4: new FormControl<String | null>(null),

    quantityExtinguisher: new FormControl<Number>(0),
    quantityTrafficCone: new FormControl<Number>(0),
    quantityTire: new FormControl<Number>(0),
    quantityTireComplete: new FormControl<Number>(0),
    quantityToolBox: new FormControl<Number>(0),

    serviceOrder: new FormControl<String>(''),

    numServiceOrder: new FormControl<String>(''),
    numNfe: new FormControl<String>(''),
    numNfse: new FormControl<String>(''),

    information: new FormControl<String>(''),
    informationConcierge: new FormControl<String>(''),

  });

  formVehicle = new FormGroup({

    id: new FormControl<number>(0, Validators.required),

    placa: new FormControl<string>('', Validators.required),
    frota: new FormControl<String>(''),

    color: new FormControl<IColor[]>([], Validators.required),
    kmEntry: new FormControl<String>(''),
    kmExit: new FormControl<String>(''),

    modelVehicle: new FormControl<IVehicleModel[]>([], Validators.required),

    dateEntry: new FormControl<Date | null>(null, Validators.required),

    datePrevisionExit: new FormControl<Date | null>(null),

    idUserExitAuth1: new FormControl<Number>(0),
    nameUserExitAuth1: new FormControl<String>(''),
    dateExitAuth1: new FormControl<Date | null>(null),

    idUserExitAuth2: new FormControl<Number>(0),
    nameUserExitAuth2: new FormControl<String>(''),
    dateExitAuth2: new FormControl<Date | null>(null),

    statusAuthExit: new FormControl<String>(''),

    quantityExtinguisher: new FormControl<Number>(0, Validators.required),
    quantityTrafficCone: new FormControl<Number>(0, Validators.required),
    quantityTire: new FormControl<Number>(0, Validators.required),
    quantityTireComplete: new FormControl<Number>(0, Validators.required),
    quantityToolBox: new FormControl<Number>(0, Validators.required),

    photo1: new FormControl<String | null>(null),
    photo2: new FormControl<String | null>(null),
    photo3: new FormControl<String | null>(null),
    photo4: new FormControl<String | null>(null),

    userAttendant: new FormControl<IUser[] | null>([]),

    vehicleNew: new FormControl<String>('not', Validators.required),
    serviceOrder: new FormControl<String>('yes', Validators.required),

    numServiceOrder: new FormControl<String>(''),
    numNfe: new FormControl<String>(''),
    numNfse: new FormControl<String>(''),

    information: new FormControl<String>(''),

  });

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

  formMotorista = new FormGroup({
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

  formDeleteAuth = new FormGroup({
    companyId: new FormControl<Number>(0),
    resaleId: new FormControl<Number>(0),
    id: new FormControl<Number>(0),
    idUserExitAuth: new FormControl<Number>(0),
    nameUserExitAuth: new FormControl<string>(''),
  });


  //Orçamento

  formNewBudget = new FormGroup({
    companyId: new FormControl<number>(0, Validators.required),
    resaleId: new FormControl<number>(0, Validators.required),
    vehicleEntryId: new FormControl<number>(0, Validators.required),
  });

  listBudgetRequisition: IBudgetRequisition[] = [];
  listBudgetService: IBudgetService[] = [];
  totalService: number = 0;

  formBudgetRequisition = new FormGroup({
    companyId: new FormControl<number>(0),
    resaleId: new FormControl<number>(0),
    id: new FormControl<string>(''),
    budgetId: new FormControl<number>(0),
    ordem: new FormControl<number>(0),
    description: new FormControl<string>('', Validators.required),
  });

  formBudgetService = new FormGroup({
    ordem: new FormControl<number>(0),
    description: new FormControl<string>('', Validators.required),
    tempService: new FormControl<number>(0, Validators.required),
    valueHour: new FormControl<number>(0, Validators.required),
  });


  constructor(private vehicleService: VehicleService,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private userService: UserService,
    private vehicleModelService: VehicleModelService,
    private budgetService: BudgetService,
    private serviceClienteCompany: ClientecompanyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    ) { 
      this.layoutService.isLogin();
    }

  ngOnInit(): void {

    //Id
    this.id = this.activatedRoute.snapshot.params['id'];

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

    //Consultores
    this.userService.getConsultores$().subscribe((data) => {

      for (let index = 0; index < data.length; index++) {
        this.consutores.push({ id: data[index].id, name: data[index].name });
      }

    });

    //Modelos veículo
    this.vehicleModelService.getAllEnabled$().subscribe((data) => {
      for (let index = 0; index < data.length; index++) {
        this.modeloVeiculos.push({ id: data[index].id, description: data[index].description });
      }
    });

    this.vehicleService.entryFilterId(this.id).subscribe((data) => {

      //Form Veículo
      this.formVehicle.patchValue({

        id: data.id,

        dateEntry: new Date(data.dateEntry),
        datePrevisionExit: data.datePrevisionExit != null ? new Date(data.datePrevisionExit) : null,

        color: [{ color: data.color }],
        placa: data.placa,
        frota: data.frota,

        modelVehicle: [{ id: data.modelId, description: data.modelDescription }],

        kmEntry: data.kmEntry,
        kmExit: data.kmExit,

        serviceOrder: data.serviceOrder,
        vehicleNew: data.vehicleNew,

        idUserExitAuth1: data.idUserExitAuth1,
        nameUserExitAuth1: data.nameUserExitAuth1,
        dateExitAuth1: data.dateExitAuth1,

        idUserExitAuth2: data.idUserExitAuth2,
        nameUserExitAuth2: data.nameUserExitAuth2,
        dateExitAuth2: data.dateExitAuth2,

        statusAuthExit: data.statusAuthExit,

        photo1: data.photo1,
        photo2: data.photo2,
        photo3: data.photo3,
        photo4: data.photo4,

        quantityExtinguisher: data.quantityExtinguisher,
        quantityTrafficCone: data.quantityTrafficCone,
        quantityTire: data.quantityTire,
        quantityTireComplete: data.quantityTireComplete,
        quantityToolBox: data.quantityToolBox,

        numServiceOrder: data.numServiceOrder,
        numNfe: data.numNfe,
        numNfse: data.numNfse,

        information: data.information,

      });

      if (data.dateExitAuth1) {
        this.nameUserExitAuth1 = data.nameUserExitAuth1!;
        this.dateExitAuth1 = data.dateExitAuth1!.toString();
      }

      if (data.dateExitAuth2) {
        this.nameUserExitAuth2 = data.nameUserExitAuth2!;
        this.dateExitAuth2 = data.dateExitAuth2!.toString();
      }

      if (data.idUserAttendant) {
        this.formVehicle.patchValue({ userAttendant: [{ id: data.idUserAttendant, name: data.nameUserAttendant }] });
      }

      this.photoVehicle1 = data.photo1!;
      this.photoVehicle2 = data.photo2!;
      this.photoVehicle3 = data.photo3!;
      this.photoVehicle4 = data.photo4!;

      this.formAtendimento.patchValue({
        companyId: data.companyId,
        resaleId: data.resaleId,

        status: data.status,
        stepEntry: data.stepEntry,


        budgetId: data.budgetId,
        budgetStatus: data.budgetStatus,

        idUserEntry: data.idUserEntry,
        nameUserEntry: data.nameUserEntry,

        informationConcierge: data.informationConcierge


      });

      //Form Porteiro
      this.proteiroId = data.idUserEntry;
      this.porteiroName = data.nameUserEntry;
      this.porteiroInfo = data.informationConcierge!;

      //Form Proprietario
      this.formClientCompany.patchValue({
        clientCompanyId: data.clientCompanyId,
        clientCompanyName: data.clientCompanyName,
        clientCompanyCnpj: data.clientCompanyCnpj,
        clientCompanyCpf: data.clientCompanyCpf,
        clientCompanyRg: data.clientCompanyRg,
      });

      this.dialogNomeClientCompany = this.formClientCompany.value.clientCompanyName!;
      this.dialogIdClientCompany = this.formClientCompany.value.clientCompanyId!;

      //Form Motorista
      this.formMotorista.patchValue({
        driverEntryName: data.driverEntryName,
        driverEntryCpf: data.driverEntryCpf,
        driverEntryRg: data.driverEntryRg,
        driverEntryPhoto: data.driverEntryPhoto,
        driverEntrySignature: data.driverEntrySignature,
        driverEntryPhotoDoc1: data.driverEntryPhotoDoc1,
        driverEntryPhotoDoc2: data.driverEntryPhotoDoc2,

        driverExitName: data.driverExitName,
        driverExitCpf: data.driverExitCpf,
        driverExitRg: data.driverExitRg,
        driverExitPhoto: data.driverExitPhoto,
        driverExitSignature: data.driverExitSignature,
        driverExitPhotoDoc1: data.driverExitPhotoDoc1,
        driverExitPhotoDoc2: data.driverExitPhotoDoc2,
      });

      this.driverEntryPhoto = data.driverEntryPhoto!;
      this.driverEntryPhotoDoc1 = data.driverEntryPhotoDoc1!;
      this.driverEntryPhotoDoc2 = data.driverEntryPhotoDoc2!;

      //Orçamento


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

  showDialogClientCompany() {
    this.dialogVisibleClientCompany = true;
  }

  hideDialogClientCompany() {
    this.dialogVisibleClientCompany = false;
  }

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
      clientCompanyId: this.dialogSelectClientCompany.cliente,
      clientCompanyName: this.dialogSelectClientCompany.nome,
      clientCompanyCnpj: this.dialogSelectClientCompany.cnpj,
      clientCompanyCpf: this.dialogSelectClientCompany.cpf,
      clientCompanyRg: this.dialogSelectClientCompany.identidade
    });

    this.validFormClientCompany();

  }

  filterClientCompany() {

    this.dialogloadingClientCompany = true;

    const { value } = this.formClientCompanyFilter;

    if (value.clientCompanyTipo == "j") {

      if (value.clientCompanyId) {
        this.serviceClienteCompany.getId$(value.clientCompanyId).subscribe((data) => {
          this.dialogListClientCompany = data;
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
          this.dialogListClientCompany = data;
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
          this.dialogListClientCompany = data;
          this.dialogloadingClientCompany = false;
        });
      } else if (value.clientCompanyRg) {
        this.serviceClienteCompany.getRg$(value.clientCompanyRg).subscribe((data) => {
          this.dialogListClientCompany = data;
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

  selectEntryPhotoDriver(event: any) {
    var file = event.target.files[0];

    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event2: any) => {

        //image byte
        const byteImg = event2.target.result.split('base64,')[1];

        this.driverEntryPhoto = byteImg;

        this.formMotorista.patchValue({ driverEntryPhoto: byteImg });
      };
    }
  }

  selectEntryFileDriver1(event: any) {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event2: any) => {
        //image byte
        const byteImg = event2.target.result.split('base64,')[1];

        this.driverEntryPhotoDoc1 = byteImg;

        this.formMotorista.patchValue({ driverEntryPhotoDoc1: byteImg });

      };
    }
  }

  selectEntryFileDriver2(event: any) {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event2: any) => {

        //image byte
        const byteImg = event2.target.result.split('base64,')[1];

        this.driverEntryPhotoDoc2 = byteImg;

        this.formMotorista.patchValue({ driverEntryPhotoDoc2: byteImg });

      };
    }
  }

  selectExitPhotoDriver(event: any) {
    var file = event.target.files[0];

    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event2: any) => {
        //image byte
        const byteImg = event2.target.result.split('base64,')[1];

        this.driverExitPhoto = byteImg;

        this.formMotorista.patchValue({ driverExitPhoto: byteImg });
      };
    }
  }

  selectExitFileDriver1(event: any) {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event2: any) => {

        //image byte
        const byteImg = event2.target.result.split('base64,')[1];

        this.driverExitPhotoDoc1 = byteImg;

        this.formMotorista.patchValue({ driverExitPhotoDoc1: byteImg });

      };
    }
  }

  selectExitFileDriver2(event: any) {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event2: any) => {

        //image byte
        const byteImg = event2.target.result.split('base64,')[1];

        this.driverExitPhotoDoc2 = byteImg;

        this.formMotorista.patchValue({ driverExitPhotoDoc2: byteImg });

      };
    }
  }

  selectFileVehicle1(event: any) {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event2: any) => {

        //image byte
        const byteImg = event2.target.result.split('base64,')[1];

        this.photoVehicle1 = byteImg;

        this.formVehicle.patchValue({ photo1: byteImg });

      };
    }
  }

  selectFileVehicle2(event: any) {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event2: any) => {

        //image byte
        const byteImg = event2.target.result.split('base64,')[1];

        this.photoVehicle2 = byteImg;

        this.formVehicle.patchValue({ photo2: byteImg });

      };
    }
  }

  selectFileVehicle3(event: any) {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event2: any) => {

        //image byte
        const byteImg = event2.target.result.split('base64,')[1];

        this.photoVehicle3 = byteImg;

        this.formVehicle.patchValue({ photo3: byteImg });

      };
    }
  }

  selectFileVehicle4(event: any) {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event2: any) => {

        //image byte
        const byteImg = event2.target.result.split('base64,')[1];

        this.photoVehicle4 = byteImg;

        this.formVehicle.patchValue({ photo4: byteImg });

      };
    }
  }

  dataVehicle() {

    this.formAtendimento.patchValue({

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

    });

    console.log(this.formAtendimento.value);

  }

  saveVehicle() {

    this.dataVehicle();

    const { value, valid } = this.formAtendimento;

    if (valid) {

      this.vehicleService.entryUpdate$(value).subscribe((data) => {

        if (data.status == 200) {
          this.showSaveSuccess();
        }

      }, (error) => {

        if (error.status == 409) {
          this.showPlacaExist(value.placa!);
        }

      });

    }


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

  //Remover fotos motorista entrada

  deleteEntryPhotoDriver() {
    this.driverEntryPhoto = "";
    this.formMotorista.patchValue({ driverEntryPhoto: null });
  }
  deleteEntryFileDriver1() {
    this.driverEntryPhotoDoc1 = "";
    this.formMotorista.patchValue({ driverEntryPhotoDoc1: null });
  }
  deleteEntryFileDriver2() {
    this.driverEntryPhotoDoc2 = "";
    this.formMotorista.patchValue({ driverEntryPhotoDoc2: null });
  }

  //Remover fotos motorista saída

  deleteExitPhotoDriver() {
    this.driverExitPhoto = "";
    this.formMotorista.patchValue({ driverExitPhoto: null });
  }
  deleteExitFileDriver1() {
    this.driverExitPhotoDoc1 = "";
    this.formMotorista.patchValue({ driverExitPhotoDoc1: null });
  }
  deleteExitFileDriver2() {
    this.driverExitPhotoDoc2 = "";
    this.formMotorista.patchValue({ driverExitPhotoDoc2: null });
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

    if (this.formAtendimento.value.budgetId != null) {
      this.showDialogOrcamento();
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

          this.formNewBudget.patchValue({
            companyId: this.formAtendimento.value.companyId,
            resaleId: this.formAtendimento.value.resaleId,
            vehicleEntryId: this.formVehicle.value.id
          });

          this.budgetService.addBudget$(this.formNewBudget.value).subscribe((data) => {

            if (data.status == 201) {

              this.formAtendimento.patchValue({
                budgetId: data.body.id,
                budgetStatus: data.body.status
              });

              this.messageService.add({ severity: 'info', summary: 'Gerado', detail: 'Orçamento gerado com sucesso', life: 3000 });
              this.showDialogOrcamento();
            }

          });

        }/* ,
        reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        } */
      });
    }






  }

  showDialogOrcamento() {
    this.dialogVisibleOrcamento = true;

    this.getListBudgetRequisition();

  }

  getListBudgetRequisition() {
    var code = this.formAtendimento.value.budgetId;
    this.budgetService.listBudgetRequisition$(code!).subscribe((data) => {

      this.listBudgetRequisition = data;

    });
  }

  getSizeListBudgetRequisition(): number {
    return this.listBudgetRequisition.length;
  }

  addBudgetRequisition() {

    if (this.formBudgetRequisition.valid && this.formBudgetRequisition.value.description!.toString().trim() != "") {

      this.formBudgetRequisition.patchValue({
        companyId: this.formAtendimento.value.companyId,
        resaleId: this.formAtendimento.value.resaleId,
        budgetId: this.formAtendimento.value.budgetId,
        ordem: this.getSizeListBudgetRequisition() + 1,
      });

      this.budgetService.addBudgetRequisition$(this.formBudgetRequisition.value).subscribe((data) => {

        if (data.status == 201) {

          this.getListBudgetRequisition();

          this.alertShowAddRequisition();
        }

      });

    } else {
      this.showErrorRequisition();
    }

    this.cleanBudgetRequisition();

  }

  updateBudgetRequisition() {

    for (let index = 0; index < this.listBudgetRequisition.length; index++) {
      const item = this.listBudgetRequisition[index];

      if (this.formBudgetRequisition.value.ordem == item.ordem) {
        this.listBudgetRequisition[index].description = this.formBudgetRequisition.value.description!;
      }

    }

    this.cleanBudgetRequisition();

  }

  cleanBudgetRequisition() {
    this.formBudgetRequisition.patchValue({
      companyId: 0,
      resaleId: 0,
      id: '',
      budgetId: 0,
      ordem: 0,
      description: ''
    });
  }

  editarBudgetRequisition(ordem: number) {

    for (let index = 0; index < this.listBudgetRequisition.length; index++) {
      const item = this.listBudgetRequisition[index];

      if (ordem == item.ordem) {
        this.formBudgetRequisition.patchValue({
          ordem: item.ordem,
          description: item.description
        });
      }

    }

  }

  removerBudgetRequisition(ordem: number) {


    var listTemp: IBudgetRequisition[] = [];


    for (let index = 0; index < this.listBudgetRequisition.length; index++) {

      const item = this.listBudgetRequisition[index];

      if (ordem == item.ordem) {

        this.formBudgetRequisition.patchValue({
          companyId: item.companyId,
          resaleId: item.resaleId,
          id: item.id,
          budgetId: item.budgetId,
          ordem: item.ordem,
          description: item.description,
        });

        this.budgetService.deleteBudgetRequisition$(this.formBudgetRequisition.value).subscribe();

        this.cleanBudgetRequisition();

      } else {
        listTemp.push(item);
      }

    }
    this.listBudgetRequisition = [];

    for (let index = 0; index < listTemp.length; index++) {
      const item = listTemp[index];

      item.ordem = index + 1;

      this.budgetService.addBudgetRequisition$(item).subscribe((data) => {

        if (data.status == 201) {

          this.getListBudgetRequisition();

        }

      });


    }
  }

  getSizeListBudgetService(): number {
    return this.listBudgetService.length;
  }

  addBudgetService() {

    this.formBudgetService.patchValue({
      ordem: this.getSizeListBudgetService() + 1
    });

    const { value, valid } = this.formBudgetService;

    if (this.listBudgetRequisition.length == 0) {
      this.showErrorRequisition();
    } else if (!valid) {
      this.showServiceError();
    } else if (value.tempService! <= 0 || value.valueHour! <= 0) {
      this.showServiceError();
    } else {

      this.listBudgetService.push({ ordem: value.ordem!, description: value.description!, tempService: value.tempService!, valueHour: value.valueHour! });
      this.showServiceAdd();

      this.somaService();
    }

    this.cleanBudgetService();

  }

  saveBudgetService() {

    const { value } = this.formBudgetService;

    for (let index = 0; index < this.listBudgetService.length; index++) {
      const item = this.listBudgetService[index];

      if (value.ordem == item.ordem) {

        this.listBudgetService[index].description = value.description!;
        this.listBudgetService[index].tempService = value.tempService!
        this.listBudgetService[index].valueHour = value.valueHour!;

      }

    }

    this.cleanBudgetService();

    this.somaService();

  }

  somaService() {
    this.totalService = 0;

    for (let index = 0; index < this.listBudgetService.length; index++) {
      const element = this.listBudgetService[index];

      this.totalService += (element.tempService! * element.valueHour!);
    }

  }

  cleanBudgetService() {
    this.formBudgetService.patchValue({
      ordem: 0,
      description: "",
      tempService: 0,
      valueHour: 0
    });
  }

  editarBudgetService(ordem: number) {

    for (let index = 0; index < this.listBudgetService.length; index++) {
      const item = this.listBudgetService[index];

      if (ordem == item.ordem) {
        this.formBudgetService.patchValue({
          ordem: item.ordem,
          description: item.description,
          tempService: item.tempService,
          valueHour: item.valueHour

        });
      }

    }
  }

  removerBudgetService(ordem: number) {

    var listTemp: IBudgetService[] = [];

    for (let index = 0; index < this.listBudgetService.length; index++) {

      const item = this.listBudgetService.at(index);

      if (ordem != this.listBudgetService.at(index)!.ordem) {
        listTemp.push({ ordem: item!.ordem, description: item!.description, tempService: item!.tempService, valueHour: item!.valueHour });
      }

    }
    this.listBudgetService = [];
    this.totalService = 0;

    for (let index = 0; index < listTemp.length; index++) {
      const item = listTemp.at(index);

      this.listBudgetService.push({ ordem: index + 1, description: item!.description, tempService: item!.tempService, valueHour: item!.valueHour });

      this.totalService += (item!.tempService * item!.valueHour);

    }
  }

  alertShowAddRequisition() {
    this.messageService.add({ severity: 'success', summary: 'Adicionado', detail: 'Solicitação adicionada com sucesso', icon: 'pi pi-plus' });
  }

  showErrorRequisition() {
    this.messageService.add({ severity: 'error', summary: 'Atenção', detail: 'Não a solicitação', icon: 'pi pi-exclamation-triangle' });
  }

  showServiceAdd() {
    this.messageService.add({ severity: 'success', summary: 'Adicionado', detail: 'Serviço adicionado com sucesso', icon: 'pi pi-plus' });
  }

  showServiceError() {
    this.messageService.add({ severity: 'error', summary: 'Atenção', detail: 'Não foi possivel adicionar', icon: 'pi pi-exclamation-triangle' });
  }



}
