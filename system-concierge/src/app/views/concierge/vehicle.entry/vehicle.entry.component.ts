import { Component, DoCheck, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

//PrimeNg
import { StepperModule } from 'primeng/stepper';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputMaskModule } from 'primeng/inputmask';

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
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';

//Service
import { VehicleModelService } from '../../../services/vehicle-model/vehicle-model.service';
import { UserService } from '../../../services/user/user.service';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { PhotoService } from '../../../services/photo/photo.service';
//Interface
import { StorageService } from '../../../services/storage/storage.service';
//Class
import { User } from '../../../models/user/user';
import { ClientCompany } from '../../../models/clientcompany/client-company';
import { VehicleEntry } from '../../../models/vehicle/vehicle-entry';
import { IColor } from '../../../interfaces/icolor';
import { IMAGE_MAX_SIZE_LABEL } from '../../../util/constants';
//Components
import { MessageResponse } from '../../../models/message/message-response';
//Enum
import { Driver } from '../../../models/driver/driver';
//Filters
import { FilterClientComponent } from '../../../components/filter.client/filter.client.component';
import { FilterDriverComponent } from '../../../components/filter.driver/filter.driver.component';
import { PhotoResult } from '../../../interfaces/photo-result';
import { PhotoResultStatus } from '../../../models/enum/photo-result-status';
import { SuccessError } from '../../../models/enum/success-error';
import { BusyService } from '../../../components/loading/busy.service';
import { ModelVehicle } from '../../../models/vehicle-model/model-vehicle';
import { YesNot } from '../../../models/enum/yes-not';


@Component({
  selector: 'app-vehicle.entry',
  standalone: true,
  imports: [
    CommonModule, FilterClientComponent, FilterDriverComponent, FormsModule, ReactiveFormsModule, DividerModule,
    StepperModule, ImageModule, ToastModule,
    CheckboxModule, TagModule, DialogModule, DropdownModule,
    BadgeModule, TabViewModule, TableModule,
    IconFieldModule, InputIconModule, CardModule,
    InputNumberModule, ButtonModule, InputTextModule,
    InputTextareaModule, CalendarModule, RadioButtonModule,
    InputGroupModule, InputMaskModule],
  providers: [MessageService],
  templateUrl: './vehicle.entry.component.html',
  styleUrl: './vehicle.entry.component.scss'
})
export default class VehicleEntryComponent implements OnInit, DoCheck {

  private vehicleEntry: VehicleEntry;
  private vehiclePlateFisrt!: number;

  activeStepper: number | undefined = 0;
  private upperCasePipe = new UpperCasePipe();

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
  driverEntryPhoto!: string;
  driverEntryPhotoDoc1!: string;
  driverEntryPhotoDoc2!: string;
  driver!: Driver;
  selectDriver = signal<Driver>(new Driver());
  formDriver = new FormGroup({
    driverEntryId: new FormControl<number | null>({ value: null, disabled: true }),
    driverEntryName: new FormControl<string>({ value: '', disabled: true }),
    driverEntryCpf: new FormControl<string>({ value: '', disabled: true }),
    driverEntryRg: new FormControl<string | null>({ value: null, disabled: true })
  });

  //Vehicle
  colors: IColor[] = []
  photoVehicle1!: string;
  photoVehicle2!: string;
  photoVehicle3!: string;
  photoVehicle4!: string;
  vehicleModels$ = this.vehicleModelService.getAllEnabled();
  yes = YesNot.yes;
  not = YesNot.not;
  formVehicle = new FormGroup({
    vehiclePlate: new FormControl<string>(''),
    vehicleFleet: new FormControl<string>(''),
    vehicleKmEntry: new FormControl<number | null>(null),
    modelVehicle: new FormControl<ModelVehicle | null>(null, Validators.required),
    entryDate: new FormControl<Date | null>(new Date(), Validators.required),
    exitDatePrevision: new FormControl<Date | null>(null),
    vehicleColor: new FormControl<IColor | null>(null),
    checkItem1: new FormControl<number | null>(null),
    checkItem2: new FormControl<number | null>(null),
    checkItem3: new FormControl<number | null>(null),
    checkItem4: new FormControl<number | null>(null),
    checkItem5: new FormControl<number | null>(null),

    attendant: new FormControl<User | null>(null),
    vehicleNew: new FormControl<YesNot>(YesNot.not),
    vehicleServiceOrder: new FormControl<YesNot>(YesNot.yes),
    entryInformation: new FormControl<string>(''),
  });
  attendants: User[] = [];
  formCompanyIsEditable = false;

  //Dialog Vehicle entry
  dialogVehicleVisible: boolean = false;
  listVehicleEntry: VehicleEntry[] = [];
  constructor(
    private busyService: BusyService,
    private storageService: StorageService,
    private vehicleModelService: VehicleModelService,
    private vehicleService: VehicleService,
    private userService: UserService,
    private messageService: MessageService,
    private photoService: PhotoService) { }

  ngOnInit(): void {
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
    this.addRequirePlaca();
  }

  ngDoCheck(): void {
    //Client
    if (this.selectClientCompany().id != 0) {
      this.clientCompany = this.selectClientCompany();
      this.formClientCompany.patchValue({
        clientCompanyNot: [],
        clientCompanyId: this.selectClientCompany().id,
        clientCompanyName: this.selectClientCompany().name,
        clientCompanyCnpj: this.selectClientCompany().cnpj,
        clientCompanyCpf: this.selectClientCompany().cpf,
        clientCompanyRg: this.selectClientCompany().rg == "" ? null : this.selectClientCompany().rg
      });
      this.selectClientCompany.set(new ClientCompany());
    }
    //Driver
    if (this.selectDriver().id != 0) {
      this.formDriver.patchValue({
        driverEntryId: this.selectDriver().id,
        driverEntryName: this.selectDriver().name,
        driverEntryCpf: this.selectDriver().cpf,
        driverEntryRg: this.selectDriver().rg
      });
      this.driver = this.selectDriver();
      this.driverEntryPhoto = this.selectDriver().photoDriverUrl;
      this.driverEntryPhotoDoc1 = this.selectDriver().photoDoc1Url;
      this.driverEntryPhotoDoc2 = this.selectDriver().photoDoc2Url;
      this.selectDriver.set(new Driver());
    }
  }


  //ClientCompany
  public validationClientCompany() {
    if (this.formClientCompany.get('clientCompanyNot').value.length == 0) {
      this.cleanFormClientCompany();
      this.clientCompany = new ClientCompany();
    } else {
      this.clientCompany = null;
    }
  }
  private cleanFormClientCompany() {
    this.formClientCompany.patchValue({
      clientCompanyNot: [],
      clientCompanyId: null,
      clientCompanyName: '',
      clientCompanyCnpj: '',
      clientCompanyCpf: '',
      clientCompanyRg: null
    });
  }
  public async nextStepperClientCompany() {
    if (this.clientCompany != null) {
      //Aba motorista
      this.activeStepper = 1;
    } else {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Empresa não selecionada', icon: 'pi pi-info-circle' });
    }
  }
  public stepperClientCompany() {
    //Aba empresa
    this.activeStepper = 0;
  }

  //Driver
  public nextSterpperDriver() {
    if (this.driver != null) {
      //Aba veículo
      this.activeStepper = 2;
      //Consulta os Attendants
      this.getAttendants();
    } else {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Motorista não informado', icon: 'pi pi-info-circle' });
    }
  }
  public stepperDriver() {
    if (this.clientCompany != null) {
      //Aba motorista
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

  public stepperVehicle() {
    if (this.clientCompany != null) {
      if (this.driver != null) {
        //Aba veículo
        this.activeStepper = 2;
        //Consulta os Attendants
        this.getAttendants();
      } else {
        this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Motorista não informado', icon: 'pi pi-info-circle' });
      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Empresa não selecionada', icon: 'pi pi-info-circle' });
    }
  }

  public async photoFile1Vehicle() {
    const photo: PhotoResult = await this.photoService.takePicture();
    if (photo.status == PhotoResultStatus.SUCCESS) {
      this.photoVehicle1 = photo.base64;
      this.vehicleEntry.entryPhoto1Url = this.photoVehicle1;
    }
    if (photo.status == PhotoResultStatus.LIMIT) {
      this.messageService.add({ severity: 'info', summary: 'Imagem', detail: IMAGE_MAX_SIZE_LABEL, icon: 'pi pi-info-circle', life: 3000 });
    }
    if (photo.status == PhotoResultStatus.ERROR) {
      // this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um problema.", icon: 'pi pi-times', life: 3000 });
    }
  }
  public async photoFile2Vehicle() {
    const photo = await this.photoService.takePicture();
    if (photo.status == PhotoResultStatus.SUCCESS) {
      this.photoVehicle2 = photo.base64;
      this.vehicleEntry.entryPhoto2Url = this.photoVehicle2;
    }
    if (photo.status == PhotoResultStatus.LIMIT) {
      this.messageService.add({ severity: 'info', summary: 'Imagem', detail: IMAGE_MAX_SIZE_LABEL, icon: 'pi pi-info-circle', life: 3000 });
    }
    if (photo.status == PhotoResultStatus.ERROR) {
      //this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um problema.", icon: 'pi pi-times', life: 3000 });
    }
  }
  public async photoFile3Vehicle() {
    const photo = await this.photoService.takePicture();
    if (photo.status == PhotoResultStatus.SUCCESS) {
      this.photoVehicle3 = photo.base64;
      this.vehicleEntry.entryPhoto3Url = this.photoVehicle3;
    }
    if (photo.status == PhotoResultStatus.LIMIT) {
      this.messageService.add({ severity: 'info', summary: 'Imagem', detail: IMAGE_MAX_SIZE_LABEL, icon: 'pi pi-info-circle', life: 3000 });
    }
    if (photo.status == PhotoResultStatus.ERROR) {
      //this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um problema.", icon: 'pi pi-times', life: 3000 });
    }
  }
  public async photoFile4Vehicle() {
    const photo = await this.photoService.takePicture();
    if (photo.status == PhotoResultStatus.SUCCESS) {
      this.photoVehicle4 = photo.base64;
      this.vehicleEntry.entryPhoto4Url = this.photoVehicle4;
    }
    if (photo.status == PhotoResultStatus.LIMIT) {
      this.messageService.add({ severity: 'info', summary: 'Imagem', detail: IMAGE_MAX_SIZE_LABEL, icon: 'pi pi-info-circle', life: 3000 });
    }
    if (photo.status == PhotoResultStatus.ERROR) {
      //this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Ocorreu um problema.", icon: 'pi pi-times', life: 3000 });
    }
  }
  public deleteFileVehicle1() {
    this.photoVehicle1 = "";
    this.vehicleEntry.entryPhoto1Url = "";
  }
  public deleteFileVehicle2() {
    this.photoVehicle2 = "";
    this.vehicleEntry.entryPhoto2Url = "";
  }
  public deleteFileVehicle3() {
    this.photoVehicle3 = "";
    this.vehicleEntry.entryPhoto3Url = "";
  }
  public deleteFileVehicle4() {
    this.photoVehicle4 = "";
    this.vehicleEntry.entryPhoto4Url = "";
  }
  public addRequirePlaca() {
    this.formVehicle.controls['vehiclePlate'].addValidators(Validators.required);
    this.formVehicle.controls['vehiclePlate'].updateValueAndValidity();
  }
  public deleteRequirePlaca() {
    this.formVehicle.controls['vehiclePlate'].removeValidators(Validators.required);
    this.formVehicle.controls['vehiclePlate'].updateValueAndValidity();
    this.cleanPlaca();
  }
  private cleanPlaca() {
    this.formVehicle.get("vehiclePlate").setValue("");
  }
  private cleanFormVehicle() {
    this.formVehicle.patchValue({
      vehiclePlate: "",
      vehicleFleet: null,
      modelVehicle: null,
      entryDate: new Date(),
      exitDatePrevision: null,
      vehicleColor: null,
      vehicleNew: YesNot.not,
      vehicleServiceOrder: YesNot.yes,
      attendant: null,
      entryInformation: ""
    });
    this.photoVehicle1 = "";
    this.photoVehicle2 = "";
    this.photoVehicle3 = "";
    this.photoVehicle4 = "";

    this.addRequirePlaca();
  }
  //Dialog Vehicle entry
  public showDialogVehicle() {
    this.dialogVehicleVisible = true;
  }
  //Valid
  /*  private validVehicleEntry(): boolean {
 
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
 
   } */


  //adicionar o veículo a lista de entrada
  public async addVehicleEntry() {
    const { valid } = this.formVehicle;
    if (valid) {
      if (this.formVehicle.get('vehicleNew').value == YesNot.not) {
        //verifica se o veículo ja se encontra na empresa
        const plate = this.formVehicle.get('vehiclePlate').value;
        const result = await this.filterPlate(plate);
        if (result.status == 200 && result.body.status == SuccessError.succes) {
          this.messageService.add({ severity: 'error', summary: 'Veículo ' + this.upperCasePipe.transform(plate), detail: "Já se encontra na empresa", icon: 'pi pi-truck', life: 10000 });
        } else {
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
    const vehicleValue = this.formVehicle.value;
    this.vehicleEntry = new VehicleEntry();
    this.vehicleEntry.companyId = this.storageService.companyId;
    this.vehicleEntry.resaleId = this.storageService.resaleId;

    this.vehicleEntry.entryUserId = this.storageService.id;
    this.vehicleEntry.entryUserName = this.storageService.name;
    this.vehicleEntry.entryDate = this.formatDateTime(vehicleValue.entryDate)
    this.vehicleEntry.exitDatePrevision = vehicleValue.exitDatePrevision == null ? "" : this.formatDateTime(vehicleValue.exitDatePrevision);
    this.vehicleEntry.entryInformation = vehicleValue?.entryInformation ?? "";

    if (this.formClientCompany.get('clientCompanyNot').value.length == 0) {
      this.vehicleEntry.clientCompanyId = this.clientCompany.id;
      this.vehicleEntry.clientCompanyName = this.clientCompany.name;
    }

    this.vehicleEntry.driverEntryId = this.driver.id;
    this.vehicleEntry.driverEntryName = this.driver.name;

    this.vehicleEntry.attendantUserId = vehicleValue.attendant?.id ?? null;
    this.vehicleEntry.attendantUserName = vehicleValue.attendant?.name ?? "";

    this.vehicleEntry.modelId = vehicleValue.modelVehicle.id;
    this.vehicleEntry.modelDescription = vehicleValue.modelVehicle.description;

    this.vehicleEntry.vehiclePlate = vehicleValue?.vehiclePlate ?? "";
    this.vehicleEntry.vehicleFleet = vehicleValue.vehicleFleet != null ? vehicleValue.vehicleFleet : "";
    this.vehicleEntry.vehicleNew = vehicleValue.vehicleNew;
    this.vehicleEntry.vehicleServiceOrder = vehicleValue.vehicleServiceOrder;
    this.vehicleEntry.vehicleColor = vehicleValue.vehicleColor?.color ?? null;
    this.vehicleEntry.vehicleKmEntry = vehicleValue.vehicleKmEntry != null ? vehicleValue.vehicleKmEntry.toString() : "";

    /* 
    this.vehicleEntry.quantityTrafficCone = vehicleValue?.quantityTrafficCone ?? 0;
    this.vehicleEntry.quantityExtinguisher = vehicleValue?.quantityExtinguisher ?? 0;
    this.vehicleEntry.quantityTire = vehicleValue?.quantityTire ?? 0;
    this.vehicleEntry.quantityTireComplete = vehicleValue?.quantityTireComplete ?? 0;
    this.vehicleEntry.quantityToolBox = vehicleValue?.quantityToolBox ?? 0;
    */

    //Add list of vehicle
    this.listVehicleEntry.push(this.vehicleEntry);
    this.messageService.add({ severity: 'success', summary: 'Veículo adicionado', detail: this.vehicleEntry.modelDescription, icon: 'pi pi-car' });
    this.cleanFormVehicle();
    this.scrollTop();
  }
  scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  firstSecondaryName(name: string): string {
    var nameArr = name.split(' ');
    if (nameArr.length == 1) {
      name = nameArr[0];
    }
    if (nameArr.length >= 2) {
      name = nameArr[0] + " " + nameArr[1];
    }
    return name;
  }
  public async save() {
    this.busyService.busy();
    //Save vehicles
    for (let index = 0; index < this.listVehicleEntry.length; index++) {
      const vehicle = this.listVehicleEntry[index];

      //veículos que entrou juntos
      if (index != 0) {
        vehicle.vehiclePlateTogether = this.vehiclePlateFisrt;
      }
      const img1Temp = vehicle.entryPhoto1Url;
      const img2Temp = vehicle.entryPhoto2Url;
      const img3Temp = vehicle.entryPhoto3Url;
      const img4Temp = vehicle.entryPhoto4Url;

      vehicle.entryPhoto1Url = "";
      vehicle.entryPhoto2Url = "";
      vehicle.entryPhoto3Url = "";
      vehicle.entryPhoto4Url = "";

      const result = await this.saveVehicle(vehicle);

      if (result.status == 201 && result.body.status == SuccessError.succes) {
        vehicle.id = result.body.data.id;
        //primeiro veículo
        if (index == 0) {
          this.vehiclePlateFisrt = vehicle.id;
        }

        let isUpdatePhoto: boolean = false;
        //Image save
        const img1 = await this.savePhoto(vehicle, img1Temp, 1);
        if (img1) {
          vehicle.entryPhoto1Url = img1;
          isUpdatePhoto = true;
        }
        const img2 = await this.savePhoto(vehicle, img2Temp, 2);
        if (img2) {
          vehicle.entryPhoto2Url = img2;
          isUpdatePhoto = true;
        }
        const img3 = await this.savePhoto(vehicle, img3Temp, 3);
        if (img3) {
          vehicle.entryPhoto3Url = img3;
          isUpdatePhoto = true;
        }
        const img4 = await this.savePhoto(vehicle, img4Temp, 4);
        if (img4) {
          vehicle.entryPhoto4Url = img4;
          isUpdatePhoto = true;
        }
        if (isUpdatePhoto) {
          const restulUpdate = await this.updateVehicle(vehicle);
        }
        this.messageService.add({ severity: 'success', summary: vehicle.modelDescription, detail: "Salvo com sucesso", icon: 'pi pi-check' });
        if (index == (this.listVehicleEntry.length - 1)) {
          this.dialogVehicleVisible = false;
          this.listVehicleEntry = [];

          this.cleanFormDriver();
          this.driver = null;
          this.cleanFormClientCompany();
          this.clientCompany = null;
          this.stepperClientCompany();
          this.addRequirePlaca();
        }
      } else if (result.status == 201 && result.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
      }

    }
    this.busyService.idle();
  }

  private async savePhoto(ve: VehicleEntry, img: string, order: number): Promise<string> {

    if (img == "") {
      return "";
    }
    try {
      let path =
        `${this.storageService.companyId}/` +
        `${this.storageService.resaleId}/concierge/vehicle/` +
        `${ve.id}/entry/`;

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

  private async saveVehicle(vehicle: VehicleEntry): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleService.entrySave(vehicle));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async updateVehicle(vehicle: VehicleEntry): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleService.entryUpdate(vehicle));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async saveImage(data: FormData): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleService.saveImage(data))
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async filterPlate(plate: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleService.filterPlate(plate));
    } catch (error) {
      //this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
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

}
