import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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


//Service
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { UserService } from '../../../services/users/user.service';
import { VehicleModelService } from '../../../services/concierge/vehicle-model/vehicle-model.service';
import { ClientecompanyService } from '../../../services/clientecompany/clientecompany.service';

//Interface
import { IUser } from '../../../interfaces/iuser';
import { IVehicleModel } from '../../../interfaces/vehicle/iVehicleModel';
import { IClientCompany } from '../../../interfaces/iclient-company';
import { IColor } from '../../../interfaces/icolor';

//Constants
import { STATUS_VEHICLE_ENTRY_NOTAUTH, STATUS_VEHICLE_ENTRY_FIRSTAUTH, STATUS_VEHICLE_ENTRY_AUTHORIZED } from '../../../util/constants';

@Component({
  selector: 'app-manutencao',
  standalone: true,
  imports: [CommonModule, TabViewModule, FormsModule, ImageModule, DialogModule, TableModule, ReactiveFormsModule, InputTextareaModule, InputNumberModule, InputTextModule, ButtonModule, InputMaskModule, MultiSelectModule, InputGroupModule, ScrollPanelModule, RadioButtonModule, CalendarModule],
  templateUrl: './manutencao.component.html',
  styleUrl: './manutencao.component.scss'
})
export default class ManutencaoComponent implements OnInit {

  private id: number = 0;

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

  dateExitAuth1!: string;
  dateExitAuth2!: string;

  formAtendimento = new FormGroup({

    companyId: new FormControl<Number>(0, Validators.required),
    resaleId: new FormControl<Number>(0, Validators.required),

    id: new FormControl(),

    status: new FormControl<String>('entradaAutorizada'),
    stepEntry: new FormControl<String>('atendimento'),

    budgetId: new FormControl(null),
    budgetStatus: new FormControl<String>('semOrcamento'),

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

    driverEntryName: new FormControl<String>(''),
    driverEntryCpf: new FormControl<String>(''),
    driverEntryRg: new FormControl<String>(''),
    driverEntryPhoto: new FormControl<String | null>(null),
    driverEntrySignature: new FormControl<String | null>(null),
    driverEntryPhotoDoc1: new FormControl<String | null>(null),
    driverEntryPhotoDoc2: new FormControl<String | null>(null),

    driverExitName: new FormControl<String>(''),
    driverExitCpf: new FormControl<String>(''),
    driverExitRg: new FormControl<String>(''),
    driverExitPhoto: new FormControl<String | null>(null),
    driverExitSignature: new FormControl<String | null>(null),
    driverExitPhotoDoc1: new FormControl<String | null>(null),
    driverExitPhotoDoc2: new FormControl<String | null>(null),

    color: new FormControl<String>('', Validators.required),
    placa: new FormControl<String>(''),
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
    companyId: new FormControl<Number>(0, Validators.required),
    resaleId: new FormControl<Number>(0, Validators.required),

    id: new FormControl<Number>({ value: 0, disabled: true }, Validators.required),

    placa: new FormControl<String>('', Validators.required),
    frota: new FormControl<String>(''),

    color: new FormControl<IColor[]>([], Validators.required),
    kmEntry: new FormControl<string>(''),
    kmExit: new FormControl<String>(''),

    modelVehicle: new FormControl<IVehicleModel[]>([], Validators.required),

    dateEntry: new FormControl<Date | null>(null, Validators.required),

    datePrevisionExit: new FormControl<Date | null>(null),

    idUserExitAuth1: new FormControl<Number>(0),
    nameUserExitAuth1: new FormControl<String>({ value: '', disabled: true }),
    dateExitAuth1: new FormControl<Date | null>(null),

    idUserExitAuth2: new FormControl<Number>(0),
    nameUserExitAuth2: new FormControl<String>({ value: '', disabled: true }),
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

  formPorteiro = new FormGroup({
    idUserEntry: new FormControl<Number>({ value: 0, disabled: true }),
    nameUserEntry: new FormControl<String>({ value: '', disabled: true }),
    informationConcierge: new FormControl<String>({ value: '', disabled: true }),
  });

  formClientCompany = new FormGroup({
    clientCompanyId: new FormControl<Number>({ value: 0, disabled: true }, Validators.required),
    clientCompanyName: new FormControl<String>({ value: '', disabled: true }, Validators.required),
    clientCompanyCnpj: new FormControl<String>({ value: '', disabled: true }),
    clientCompanyCpf: new FormControl<String>({ value: '', disabled: true }),
    clientCompanyRg: new FormControl<String>({ value: '', disabled: true }),
  });

  formFilterClientCompany = new FormGroup({
    clientCompanyId: new FormControl<Number>(0),
    clientCompanyName: new FormControl<string>(''),
    clientCompanyCnpj: new FormControl<string>(''),
    clientCompanyCpf: new FormControl<string>(''),
    clientCompanyRg: new FormControl<string>('')
  });

  formMotorista = new FormGroup({
    driverEntryName: new FormControl('', Validators.required),
    driverEntryCpf: new FormControl(''),
    driverEntryRg: new FormControl(''),
    driverEntryPhoto: new FormControl<string | null>(null),
    driverEntrySignature: new FormControl<string | null>(null),
    driverEntryPhotoDoc1: new FormControl<string | null>(null),
    driverEntryPhotoDoc2: new FormControl<string | null>(null),

    driverExitName: new FormControl(''),
    driverExitCpf: new FormControl(''),
    driverExitRg: new FormControl(''),
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

  constructor(private vehicleService: VehicleService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private vehicleModelService: VehicleModelService,
    private serviceClienteCompany: ClientecompanyService,
    private router: Router) { }

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
        companyId: data.companyId,
        resaleId: data.resaleId,
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
        this.dateExitAuth1 = data.dateExitAuth1!.toString();
      }

      if (data.dateExitAuth2) {
        this.dateExitAuth2 = data.dateExitAuth2!.toString();
      }

      if (data.idUserAttendant) {
        this.formVehicle.patchValue({ userAttendant: [{ id: data.idUserAttendant, name: data.nameUserAttendant }] });
      }

      this.photoVehicle1 = data.photo1!;
      this.photoVehicle2 = data.photo2!;
      this.photoVehicle3 = data.photo3!;
      this.photoVehicle4 = data.photo4!;

      //Form Porteiro
      this.formPorteiro.patchValue({
        idUserEntry: data.idUserEntry,
        nameUserEntry: data.nameUserEntry,
        informationConcierge: data.informationConcierge,
      });

      //Form Proprietario
      this.formClientCompany.patchValue({
        clientCompanyId: data.clientCompanyId,
        clientCompanyName: data.clientCompanyName,
        clientCompanyCnpj: data.clientCompanyCnpj,
        clientCompanyCpf: data.clientCompanyCpf,
        clientCompanyRg: data.clientCompanyRg,
      });

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

    }, (error) => {

    })

  }

  showDialogClientCompany() {
    this.dialogVisibleClientCompany = true;
  }

  hideDialogClientCompany() {
    this.dialogVisibleClientCompany = false;
  }

  selectDialogClientCompany() {

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

    //this.validFormClientCompany();


  }

  filterClientCompany() {

    const { value } = this.formFilterClientCompany;

    if (value.clientCompanyId) {
      this.serviceClienteCompany.getId$(value.clientCompanyId).subscribe((data) => {
        this.dialogListClientCompany = data;
      });
    } else if (value.clientCompanyName) {
      this.serviceClienteCompany.getName$(value.clientCompanyName).subscribe((data) => {
        this.dialogListClientCompany = data;
      });
    } else if (value.clientCompanyCnpj) {
      this.serviceClienteCompany.getCnpj$(value.clientCompanyCnpj).subscribe((data) => {
        this.dialogListClientCompany = data;
      });
    }
    else if (value.clientCompanyCpf) {
      this.serviceClienteCompany.getCpf$(value.clientCompanyCpf).subscribe((data) => {
        this.dialogListClientCompany = data;
      });
    }
    else if (value.clientCompanyRg) {
      this.serviceClienteCompany.getRg$(value.clientCompanyRg).subscribe((data) => {
        this.dialogListClientCompany = data;
      });
    } else {
      this.serviceClienteCompany.getAll$().subscribe((data) => {
        this.dialogListClientCompany = data;
      });
    }

  }

  validFormClientCompany() {

    if (this.dialogSelectClientCompany.type == "PJ") {
      this.formClientCompany.controls['clientCompanyCpf'].removeValidators(Validators.required);
      this.formClientCompany.controls['clientCompanyCpf'].updateValueAndValidity();

      this.formClientCompany.controls['clientCompanyRg'].removeValidators(Validators.required);
      this.formClientCompany.controls['clientCompanyRg'].updateValueAndValidity();

      this.formClientCompany.controls['clientCompanyCnpj'].addValidators(Validators.required);
      this.formClientCompany.controls['clientCompanyCnpj'].updateValueAndValidity();

    } else {

      this.formClientCompany.controls['clientCompanyCnpj'].removeValidators(Validators.required);
      this.formClientCompany.controls['clientCompanyCnpj'].updateValueAndValidity();

      this.formClientCompany.controls['clientCompanyCpf'].addValidators(Validators.required);
      this.formClientCompany.controls['clientCompanyCpf'].updateValueAndValidity();

      this.formClientCompany.controls['clientCompanyRg'].addValidators(Validators.required);
      this.formClientCompany.controls['clientCompanyRg'].updateValueAndValidity();

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
      companyId: this.formVehicle.value.companyId,
      resaleId: this.formVehicle.value.resaleId,
      id: this.formVehicle.value.id,

      idUserEntry: this.formPorteiro.value.idUserEntry,
      nameUserEntry: this.formPorteiro.value.nameUserEntry,
      dateEntry: this.formVehicle.value.dateEntry,

      idUserAttendant: this.formVehicle.value.userAttendant?.at(0)?.id,
      nameUserAttendant: this.formVehicle.value.userAttendant?.at(0)?.name,

      idUserExitAuth1: this.formVehicle.value.idUserExitAuth1,
      nameUserExitAuth1: this.formVehicle.value.nameUserExitAuth1,
      dateExitAuth1: this.formVehicle.value.dateExitAuth1,

      idUserExitAuth2: this.formVehicle.value.idUserExitAuth2,
      nameUserExitAuth2: this.formVehicle.value.nameUserExitAuth2,
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
      driverEntryRg: this.formMotorista.value.driverEntryRg,
      driverEntryPhoto: this.formMotorista.value.driverEntryPhoto,
      driverEntrySignature: this.formMotorista.value.driverEntrySignature,
      driverEntryPhotoDoc1: this.formMotorista.value.driverEntryPhotoDoc1,
      driverEntryPhotoDoc2: this.formMotorista.value.driverEntryPhotoDoc2,

      driverExitName: this.formMotorista.value.driverExitName,
      driverExitCpf: this.formMotorista.value.driverExitCpf,
      driverExitRg: this.formMotorista.value.driverExitRg,
      driverExitPhoto: this.formMotorista.value.driverExitPhoto,
      driverExitSignature: this.formMotorista.value.driverExitSignature,
      driverExitPhotoDoc1: this.formMotorista.value.driverExitPhotoDoc1,
      driverExitPhotoDoc2: this.formMotorista.value.driverExitPhotoDoc2,

      color: this.formVehicle.value.color?.at(0)?.color,
      placa: this.formVehicle.value.placa,
      frota: this.formVehicle.value.frota,

      vehicleNew: this.formVehicle.value.vehicleNew,
      kmEntry: this.formVehicle.value.kmEntry,
      kmExit: this.formVehicle.value.kmExit,

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
      numServiceOrder: this.formVehicle.value.numServiceOrder,
      numNfe: this.formVehicle.value.numNfe,
      numNfse: this.formVehicle.value.numNfse,

      information: this.formVehicle.value.information,
      informationConcierge: this.formPorteiro.value.informationConcierge,

    });


    console.log(this.formAtendimento.value);
  }

  validCampos(): Boolean {



    return true;
  }

  saveVehicle() {


    this.dataVehicle();

    /* this.vehicleService.entryAdd$(this.formAtendimento.value).subscribe((data) => {

      if (data.status == 201) {

      }

    }, (error) => {

      console.log(error);

    }); */
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

  btnBack() {
    this.router.navigateByUrl('v1/portaria/veiculos');
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



}
