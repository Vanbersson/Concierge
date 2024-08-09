import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage, UpperCasePipe } from '@angular/common';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

//Angular Material
import { MatStepper, MatStepperModule } from '@angular/material/stepper';

//PrimeNg
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
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';



//Service
import { VehicleModelService } from '../../../services/concierge/vehicle-model/vehicle-model.service';
import { ClientecompanyService } from '../../../services/clientecompany/clientecompany.service';
import { UserService } from '../../../services/user/user.service';
import { VehicleService } from '../../../services/vehicle/vehicle.service';

//Interface
import { IClientCompany } from '../../../interfaces/iclient-company';
import { IVehicleModel } from '../../../interfaces/vehicle/iVehicleModel';
import { IUser } from '../../../interfaces/iuser';
import { LayoutService } from '../../../layouts/layout/service/layout.service';



@Component({
  selector: 'app-atendimento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgOptimizedImage, ImageModule, MatStepperModule, ToastModule, TagModule, DialogModule, BadgeModule, TabViewModule, ScrollPanelModule, TableModule, IconFieldModule, InputIconModule, CardModule, InputNumberModule, ButtonModule, InputTextModule, InputTextareaModule, CalendarModule, RadioButtonModule, InputGroupModule, InputMaskModule, MultiSelectModule],
  providers: [MessageService],
  templateUrl: './atendimento.component.html',
  styleUrl: './atendimento.component.scss'
})
export default class AtendimentoComponent implements OnInit {

  @ViewChild(MatStepper) stepper!: MatStepper;

  dialogVehicleVisible: boolean = false;

  dialogListClientCompany!: IClientCompany[];
  dialogSelectClientCompany!: IClientCompany;
  dialogVisible: boolean = false;
  dialogloadingClientCompany: boolean = false;

  driverEntryPhoto!: string;
  driverEntryPhotoDoc1!: string;
  driverEntryPhotoDoc2!: string;

  photoVehicle1!: string;
  photoVehicle2!: string;
  photoVehicle3!: string;
  photoVehicle4!: string;

  vehicleModels$ = this.vehicleModelService.getAllEnabled$();

  consultores$ = this.userService.getConsultores$();

  formCompanyIsEditable = false;

  arrayFormAtendimento: any[] = [];

  formAtendimento = new FormGroup({

    companyId: new FormControl<Number>(0, Validators.required),
    resaleId: new FormControl<Number>(0, Validators.required),

    status: new FormControl<string>('entradaAutorizada'),
    stepEntry: new FormControl<string>('atendimento'),

    budgetId: new FormControl<Number | null>(null),
    budgetStatus: new FormControl<string>('semOrcamento'),

    idUserEntry: new FormControl<Number>(0, Validators.required),
    nameUserEntry: new FormControl('', Validators.required),
    dateEntry: new FormControl<Date | null>(null),
    datePrevisionExit: new FormControl<Date | null>(null),

    idUserAttendant: new FormControl<Number>(0),
    nameUserAttendant: new FormControl<string>(''),

    idUserExitAuth1: new FormControl<Number | null>(null),
    nameUserExitAuth1: new FormControl<string>(''),
    dateExitAuth1: new FormControl<Date | null>(null),

    idUserExitAuth2: new FormControl<Number | null>(null),
    nameUserExitAuth2: new FormControl<string>(''),
    dateExitAuth2: new FormControl<Date | null>(null),

    statusAuthExit: new FormControl('NotAuth', Validators.required),

    modelId: new FormControl<Number>(0),
    modelDescription: new FormControl<string>(''),

    clientCompanyId: new FormControl<Number>(0),
    clientCompanyName: new FormControl<string>(''),
    clientCompanyCnpj: new FormControl<string>(''),
    clientCompanyCpf: new FormControl<string>(''),
    clientCompanyRg: new FormControl<string>(''),

    driverEntryName: new FormControl<string>(''),
    driverEntryCpf: new FormControl<string>(''),
    driverEntryRg: new FormControl<string>(''),
    driverEntryPhoto: new FormControl(null),
    driverEntrySignature: new FormControl(null),
    driverEntryPhotoDoc1: new FormControl(null),
    driverEntryPhotoDoc2: new FormControl(null),

    driverExitName: new FormControl<string>(''),
    driverExitCpf: new FormControl<string>(''),
    driverExitRg: new FormControl<string>(''),
    driverExitPhoto: new FormControl(null),
    driverExitSignature: new FormControl(null),
    driverExitPhotoDoc1: new FormControl(null),
    driverExitPhotoDoc2: new FormControl(null),

    color: new FormControl<string>('Branco'),
    placa: new FormControl<string>(''),
    frota: new FormControl<string>(''),

    vehicleNew: new FormControl<string>(''),

    kmEntry: new FormControl<string>(''),
    kmExit: new FormControl<string>(''),

    photo1: new FormControl(null),
    photo2: new FormControl(null),
    photo3: new FormControl(null),
    photo4: new FormControl(null),

    quantityExtinguisher: new FormControl<Number>(0),
    quantityTrafficCone: new FormControl<Number>(0),
    quantityTire: new FormControl<Number>(0),
    quantityTireComplete: new FormControl<Number>(0),
    quantityToolBox: new FormControl<Number>(0),

    serviceOrder: new FormControl<string>(''),

    information: new FormControl<string>(''),
    informationConcierge: new FormControl<string>(''),

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

  formClientCompany = new FormGroup({
    clientCompanyId: new FormControl<Number>(0, Validators.required),
    clientCompanyName: new FormControl<string>('', Validators.required),
    clientCompanyCnpj: new FormControl<string>(''),
    clientCompanyCpf: new FormControl<string>(''),
    clientCompanyRg: new FormControl<string>(''),
  });

  formDriver = new FormGroup({
    driverEntryName: new FormControl<string>('', Validators.required),
    driverEntryCpf: new FormControl<string>(''),
    driverEntryRg: new FormControl<string>(''),
    driverEntryPhoto: new FormControl(null),
    driverEntrySignature: new FormControl(null),
    driverEntryPhotoDoc1: new FormControl(null),
    driverEntryPhotoDoc2: new FormControl(null),
  });

  formVehicle = new FormGroup({

    placa: new FormControl<string>('', Validators.required),
    frota: new FormControl<string>(''),

    kmEntry: new FormControl<string>(''),

    modelVehicle: new FormControl<IVehicleModel[]>([], Validators.required),

    dateEntry: new FormControl<Date | null>(null, Validators.required),

    datePrevisionExit: new FormControl<Date | null>(null),

    quantityExtinguisher: new FormControl<Number>(0, Validators.required),
    quantityTrafficCone: new FormControl<Number>(0, Validators.required),
    quantityTire: new FormControl<Number>(0, Validators.required),
    quantityTireComplete: new FormControl<Number>(0, Validators.required),
    quantityToolBox: new FormControl<Number>(0, Validators.required),

    UserAttendant: new FormControl<IUser[]>([]),

    vehicleNew: new FormControl<string>('not', Validators.required),
    serviceOrder: new FormControl<string>('yes', Validators.required),

    photo1: new FormControl(null),
    photo2: new FormControl(null),
    photo3: new FormControl(null),
    photo4: new FormControl(null),

    informationConcierge: new FormControl<string>(''),
  });

  constructor(
    private layoutService: LayoutService,
    private vehicleModelService: VehicleModelService,
    private vehicleService: VehicleService,
    private userService: UserService,
    private messageService: MessageService,
    private serviceClienteCompany: ClientecompanyService) { 
      this.layoutService.isLogin();
    }

  ngOnInit(): void {
    
  }

  showDialog() {
    this.dialogVisible = true;
  }

  hideDialog() {
    this.dialogVisible = false;
  }

  selectClientCompany() {

    if (this.dialogSelectClientCompany) {
      this.dialogVisible = false;
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

  //Motorista foto

  selectEntryPhotoDriver(event: any) {
    var file = event.target.files[0];

    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event2: any) => {

        //image byte
        const byteImg = event2.target.result.split('base64,')[1];

        this.driverEntryPhoto = byteImg;

        this.formDriver.patchValue({ driverEntryPhoto: byteImg });
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

        this.formDriver.patchValue({ driverEntryPhotoDoc1: byteImg });

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

        this.formDriver.patchValue({ driverEntryPhotoDoc2: byteImg });

      };
    }
  }

  //Veículo foto

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

  nextStepperClientCompany() {

    if (this.formClientCompany.valid) {
      this.stepper.next();
    }

  }

  validFormDriver() {

    if (this.formDriver.value.driverEntryCpf == '' && this.formDriver.value.driverEntryRg == '' ||
      this.formDriver.value.driverEntryRg == null && this.formDriver.value.driverEntryCpf == '') {

      this.formDriver.controls['driverEntryCpf'].addValidators(Validators.required);
      this.formDriver.controls['driverEntryCpf'].updateValueAndValidity();

      this.formDriver.controls['driverEntryRg'].addValidators(Validators.required);
      this.formDriver.controls['driverEntryRg'].updateValueAndValidity();

    }

    if (this.formDriver.value.driverEntryCpf != '') {
      this.formDriver.controls['driverEntryRg'].removeValidators(Validators.required);
      this.formDriver.controls['driverEntryRg'].updateValueAndValidity();
    }

    if (this.formDriver.value.driverEntryRg != null && this.formDriver.value.driverEntryRg != '') {
      this.formDriver.controls['driverEntryCpf'].removeValidators(Validators.required);
      this.formDriver.controls['driverEntryCpf'].updateValueAndValidity();
    }


  }

  nextSterpperDriver() {

    this.validFormDriver();

    if (this.formDriver.valid) {
      this.stepper.next();
    }

  }

  placaRequiredAdd() {
    this.formVehicle.controls['placa'].addValidators(Validators.required);
    this.formVehicle.controls['placa'].updateValueAndValidity();
  }

  placaRequiredRemove() {
    this.formVehicle.controls['placa'].removeValidators(Validators.required);
    this.formVehicle.controls['placa'].updateValueAndValidity();

  }


  removerVehiclePlaca(placa: string) {

    var myArray: any[] = [];

    for (let i = 0; i < this.arrayFormAtendimento.length; i++) {
      const element = this.arrayFormAtendimento[i];

      if (placa != element.placa) {
        myArray.push(element);
      }

    }

    this.arrayFormAtendimento = [];

    for (let i = 0; i < myArray.length; i++) {
      const element = myArray[i];

      this.arrayFormAtendimento.push(element);

    }

    if (this.arrayFormAtendimento.length == 0) {
      this.dialogVehicleVisible = false;
    }

  }

  removerVehicle(index: number) {

    var myArray: any[] = [];


    for (let i = 0; i < this.arrayFormAtendimento.length; i++) {
      const element = this.arrayFormAtendimento[i];

      if (i != index) {
        myArray.push(element);
      }

    }

    this.arrayFormAtendimento = [];

    for (let i = 0; i < myArray.length; i++) {
      const element = myArray[i];

      this.arrayFormAtendimento.push(element);

    }

    if (this.arrayFormAtendimento.length == 0) {
      this.dialogVehicleVisible = false;
    }

  }

  resetFormAtendimento() {

    this.formAtendimento.reset();

    this.formAtendimento.patchValue({

      status: 'entradaAutorizada',
      stepEntry: 'atendimento',
      budgetStatus: 'semOrcamento',
      statusAuthExit: 'FirstAuth',
    });
  }

  resetFormVehicle() {

    //Limpa o form
    this.formVehicle.reset();

    this.formVehicle.patchValue({

      modelVehicle: [],

      quantityExtinguisher: 0,
      quantityTrafficCone: 0,
      quantityTire: 0,
      quantityTireComplete: 0,
      quantityToolBox: 0,
      vehicleNew: 'not',
      serviceOrder: 'yes',

      photo1: null,
      photo2: null,
      photo3: null,
      photo4: null,

      UserAttendant: [],

    });


    this.photoVehicle1 = '';
    this.photoVehicle2 = '';
    this.photoVehicle3 = '';
    this.photoVehicle4 = '';

  }

  addVehicle() {

    const { valid } = this.formVehicle;

    if (valid) {
      this.formAtendimento.patchValue({
        companyId: this.layoutService.loginUser.companyId,
        resaleId: this.layoutService.loginUser.resaleId,

        idUserEntry: this.layoutService.loginUser.id,
        nameUserEntry: this.layoutService.loginUser.name,
        dateEntry: this.formVehicle.value.dateEntry,
        datePrevisionExit: this.formVehicle.value.datePrevisionExit,

        clientCompanyId: this.formClientCompany.value.clientCompanyId,
        clientCompanyName: this.formClientCompany.value.clientCompanyName,
        clientCompanyCnpj: this.formClientCompany.value.clientCompanyCnpj,
        clientCompanyCpf: this.formClientCompany.value.clientCompanyCpf,
        clientCompanyRg: this.formClientCompany.value.clientCompanyRg ?? "",

        driverEntryName: this.formDriver.value.driverEntryName,
        driverEntryCpf: this.formDriver.value.driverEntryCpf,
        driverEntryRg: this.formDriver.value.driverEntryRg ?? "",
        driverEntryPhoto: this.formDriver.value.driverEntryPhoto,
        driverEntryPhotoDoc1: this.formDriver.value.driverEntryPhotoDoc1,
        driverEntryPhotoDoc2: this.formDriver.value.driverEntryPhotoDoc2,

        placa: this.formVehicle.value.vehicleNew == "not" ? this.formVehicle.value.placa : '',
        frota: this.formVehicle.value.frota,
        kmEntry: this.formVehicle.value.kmEntry ?? "",

        photo1: this.formVehicle.value.photo1,
        photo2: this.formVehicle.value.photo2,
        photo3: this.formVehicle.value.photo3,
        photo4: this.formVehicle.value.photo4,

        modelId: this.formVehicle.value.modelVehicle?.at(0)?.id,
        modelDescription: this.formVehicle.value.modelVehicle?.at(0)?.description,

        idUserAttendant: this.formVehicle.value.UserAttendant?.at(0)?.id,
        nameUserAttendant: this.formVehicle.value.UserAttendant?.at(0)?.name,

        quantityTrafficCone: this.formVehicle.value.quantityTrafficCone,
        quantityExtinguisher: this.formVehicle.value.quantityExtinguisher,
        quantityTire: this.formVehicle.value.quantityTire,
        quantityTireComplete: this.formVehicle.value.quantityTireComplete,
        quantityToolBox: this.formVehicle.value.quantityToolBox,

        serviceOrder: this.formVehicle.value.serviceOrder,
        vehicleNew: this.formVehicle.value.vehicleNew,

        informationConcierge: this.formVehicle.value.informationConcierge,

      });

      this.arrayFormAtendimento.push(this.formAtendimento.value);

      //Toast Info
      this.showAddSuccess();

      //Reset Form
      this.resetFormVehicle();

    }

  }


  saveVehicle() {

    const vehicles = this.arrayFormAtendimento;

    for (let index = 0; index < vehicles.length; index++) {
      const element = vehicles.at(index);

      this.vehicleService.entrySave$(element).subscribe((data) => {

        if (data.status == 201) {

          this.showVehicleSaveSuccess(element.placa);

          //remove os veículo já salvo
          this.removerVehiclePlaca(element.placa);

          if (this.arrayFormAtendimento.length == 0) {
            this.showVehicleSaveAllSuccess();

            this.dialogVehicleVisible = false;

            this.stepper.selectedIndex = 0;

            //Reset Forms
            this.resetFormAtendimento();

            this.formClientCompany.reset();

            this.formDriver.reset();

            this.resetFormVehicle();


          }

        }

      }, (error) => {
        if (error.status == 409) {
          this.showPlacaExist(index);
        }

      });

    }

  }

  showPlacaExist(index: number) {

    const uppercase = new UpperCasePipe();
    this.messageService.add({ severity: 'error', summary: 'Placa ' + uppercase.transform(this.arrayFormAtendimento.at(index).placa), detail: "Vaículo já se encontra na empresa", icon: 'pi pi-car', life: 10000 });
  }

  showAddSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Veículo adicionado', detail: this.formVehicle.value.modelVehicle?.at(0)?.description, icon: 'pi pi-car' });
  }

  showVehicleSaveSuccess(placa: string) {
    const uppercase = new UpperCasePipe();
    this.messageService.add({ severity: 'success', summary: 'Veículo Salvo', detail: "Placa " + uppercase.transform(placa), icon: 'pi pi-check' });
  }

  showVehicleSaveAllSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Salvo', detail: "Veículos salvo com sucesso", icon: 'pi pi-check' });
  }

  showDialogVehicle() {

    if (this.arrayFormAtendimento.length > 0) {
      this.dialogVehicleVisible = true;
    }

  }

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

}
