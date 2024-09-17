import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';


//Interface
import { IUser } from '../../../interfaces/user/iuser';


//Service
import { LayoutService } from '../../../layouts/layout/service/layout.service';
import { StorageService } from '../../../services/storage/storage.service';
import { BudgetService } from '../../../services/budget/budget.service';
import { UserService } from '../../../services/user/user.service';

//class
import { BudgetRequisition } from '../../../models/budget/budget-requisition';
import { BudgetServiceItem } from '../../../models/budget/budget-item-service';
import { BudgetItem } from '../../../models/budget/budget-item';
import { error } from 'console';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, RouterModule, InputTextModule, ButtonModule, ReactiveFormsModule, InputMaskModule, ProgressBarModule, ToastModule, InputGroupModule, InputNumberModule, TabViewModule, TableModule, DividerModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
  providers: [MessageService]
})
export default class BudgetComponent implements OnInit {
  private user: IUser = null;
  private budgetId: number = 0;

  requisition: BudgetRequisition;
  budgetServiceItem: BudgetServiceItem;
  budgetItem: BudgetItem;

  listBudgetRequisition: BudgetRequisition[] = [];
  listBudgetService: BudgetServiceItem[] = [];

  listBudgetItem: BudgetItem[] = [];

  totalBudgetService = signal<number>(0);
  totalBudgetItem = signal<number>(0);
  totalBudgetDiscountService = signal<number>(0);
  totalBudgetDiscountItem = signal<number>(0);

  visibleDiscount = false;
  progressDiscount: number = 0;
  progressTotal: number = 0;
  intervalDiscount = null;

  formBudgetRequisition = new FormGroup({
    id: new FormControl<string>(''),
    budgetId: new FormControl<number>(0),
    ordem: new FormControl<number>(0),
    description: new FormControl<string>('', Validators.required),
  });

  formBudgetService = new FormGroup<any>({
    description: new FormControl<string>('', Validators.required),
    hourService: new FormControl<number>(0.0, Validators.required),
    price: new FormControl<number>(275.0, Validators.required),
    discount: new FormControl<number>(0.0, Validators.required),
  });

  formDiscount = new FormGroup({
    servPer: new FormControl(0),
    servVal: new FormControl(0),
    itemPer: new FormControl(0),
    itemVal: new FormControl(0),
  });

  constructor(private userService: UserService,
    private router: Router,
    private layoutService: LayoutService,
    private storageService: StorageService,
    private messageService: MessageService,
    private budgetService: BudgetService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef) {

    this.userService.getUser$().subscribe(data => {
      this.user = data;
    });

    this.budgetServiceItem = new BudgetServiceItem();
    this.budgetId = Number.parseInt(this.activatedRoute.snapshot.params['id']);

  }

  ngOnInit(): void {
    this.getListBudgetRequisition();
    this.getListBudgetSetvice();
  }

  getListBudgetRequisition() {
    this.budgetService.getBudgetRequisition$(this.budgetId!).subscribe((data) => {
      this.listBudgetRequisition = data;
    });
  }

  saveBudgetRequisition() {

    const { value, valid } = this.formBudgetRequisition;

    if (valid && value.description!.toString().trim() != "") {
      this.requisition = new BudgetRequisition();
      this.requisition.companyId = this.user.companyId;
      this.requisition.resaleId = this.user.resaleId;
      this.requisition.budgetId = this.budgetId;
      this.requisition.ordem = this.getSizeListBudgetRequisition() + 1;
      this.requisition.description = value.description;

      this.budgetService.saveBudgetRequisition$(this.requisition).subscribe((data) => {
        if (data.status == 201) {
          this.cleanBudgetRequisition();
          this.getListBudgetRequisition();
          this.alertShowRequisition0();
        }
      }, (error) => {

      });
    } else {
      this.alertShowRequisition1();
    }

  }

  updateBudgetRequisition() {
    const { value, valid } = this.formBudgetRequisition;
    if (valid && value.description!.toString().trim() != "") {
      this.requisition = new BudgetRequisition();
      this.requisition.companyId = this.user.companyId;
      this.requisition.resaleId = this.user.resaleId;
      this.requisition.id = value.id;
      this.requisition.budgetId = this.budgetId;
      this.requisition.ordem = value.ordem;
      this.requisition.description = value.description;

      this.budgetService.updateBudgetRequisition$(this.requisition).subscribe((data) => {
        if (data.status == 200) {
          this.cleanBudgetRequisition();
          this.getListBudgetRequisition();
          this.alertShowRequisition2();
        }
      }, (error) => {

      });
    } else {
      this.alertShowRequisition1();
    }
  }

  editarBudgetRequisition(req: BudgetRequisition) {

    this.formBudgetRequisition.patchValue({
      id: req.id,
      budgetId: req.budgetId,
      ordem: req.ordem,
      description: req.description
    });

  }

  removerBudgetRequisition(ordem: number) {

    if (this.listBudgetRequisition.length > 1) {
      var listTemp: BudgetRequisition[] = [];
      for (let index = 0; index < this.listBudgetRequisition.length; index++) {
        const item = this.listBudgetRequisition[index];

        if (ordem == item.ordem) {

          this.requisition = new BudgetRequisition();
          this.requisition.companyId = item.companyId;
          this.requisition.resaleId = item.resaleId;
          this.requisition.id = item.id;
          this.requisition.budgetId = item.budgetId;
          this.requisition.ordem = item.ordem;
          this.requisition.description = item.description;

          this.budgetService.deleteBudgetRequisition$(this.requisition).subscribe();
          this.cleanBudgetRequisition();

        } else {
          listTemp.push(item);
        }

      }
      this.listBudgetRequisition = [];

      for (let index = 0; index < listTemp.length; index++) {
        const item = listTemp[index];
        item.ordem = index + 1;
        this.budgetService.updateBudgetRequisition$(item).subscribe((data) => {
          if (data.status == 200 && (index == (listTemp.length - 1))) {
            this.getListBudgetRequisition();
          }
        });
      }
    } else {
      this.alertShowRequisition3();
    }

  }

  private getSizeListBudgetRequisition(): number {
    return this.listBudgetRequisition.length;
  }

  cleanBudgetRequisition() {
    this.formBudgetRequisition.patchValue({
      id: '',
      budgetId: 0,
      ordem: 0,
      description: ''
    });
  }

  //Service

  getListBudgetSetvice() {

    this.budgetService.getBudgetService$(this.budgetId).subscribe((data) => {
      this.listBudgetService = data;
      this.somaService();
    }, (error) => {

    });

  }

  saveBudgetService() {
    if (this.validSaveBudgetService()) {
      const { value } = this.formBudgetService;

      this.budgetServiceItem.companyId = this.user.companyId;
      this.budgetServiceItem.resaleId = this.user.resaleId;
      this.budgetServiceItem.budgetId = this.budgetId;
      this.budgetServiceItem.status = "NaoAprovado";

      this.budgetServiceItem.ordem = this.getSizeListBudgetService() + 1;
      this.budgetServiceItem.description = value.description;
      this.budgetServiceItem.hourService = value.hourService;
      this.budgetServiceItem.price = value.price;
      this.budgetServiceItem.discount = value.discount;

      this.budgetService.saveBudgetService$(this.budgetServiceItem).subscribe((data) => {
        if (data.status == 201) {
          this.alertShowService0();
          this.getListBudgetSetvice();
          this.cleanBudgetService();
        }
      });

    }

  }

  updateBudgetService(service: BudgetServiceItem) {

    if (this.validUpdateBudgetService()) {
      this.budgetServiceItem.description = service.description;
      this.budgetServiceItem.hourService = service.hourService;
      this.budgetServiceItem.price = service.price;
      this.budgetServiceItem.discount = service.discount;

      this.budgetService.updateBudgetService$(this.budgetServiceItem).subscribe((data) => {
        if (data.status == 200) {
          this.alertShowService1();
          this.getListBudgetSetvice();
          this.cleanBudgetService();
        }
      });
    }

  }

  private validSaveBudgetService() {
    const { value, valid } = this.formBudgetService;

    if (this.listBudgetRequisition.length == 0) {
      this.alertShowRequisition1();
      return false;
    } else if (!valid) {
      this.alertShowService3();
      return false;
    } else if (value.hourService < 0) {

      return false;
    } else if (value.discount < 0) {
      this.alertShowDiscount4();
      return false;
    } if (value.hourService! <= 0 || value.price! <= 0) {
      this.alertShowService3();
      return false;
    } else if (value.discount > (value.price * value.hourService)) {
      this.alertShowDiscount0();
      return false;
    } else if (value.discount > 0) {

      const newDiscount = this.totalBudgetDiscountService() + value.discount;
      const newTotal = this.totalBudgetService() + (value.price * value.hourService);

      const percent = (newTotal * this.user.limitDiscount) / 100;

      if (newDiscount > percent) {
        this.alertShowDiscount1();
        return false;
      }

      this.progressTotal = (newDiscount * 100) / percent;

      if (this.progressTotal > 50) {
        this.infoPercenDiscount();
      }

    }

    return true;
  }

  private validUpdateBudgetService(): boolean {
    const { value, valid } = this.formBudgetService;

    if (this.listBudgetRequisition.length == 0) {
      this.alertShowRequisition1();
      return false;
    } else if (!valid) {
      this.alertShowService3();
      return false;
    } else if (value.hourService! <= 0 || value.price! <= 0) {
      this.alertShowService3();
      return false;
    } else if (value.discount < 0) {
      this.alertShowDiscount4();
      return false;
    } else if (value.discount > (value.price * value.hourService)) {
      this.alertShowDiscount0();
      return false;
    } else if (value.discount > 0) {
      const newDiscount = value.discount;
      const newTotal = (value.price * value.hourService);

      var tempTotal = 0;
      var tempDiscount = 0;
      for (let index = 0; index < this.listBudgetService.length; index++) {
        const item = this.listBudgetService[index];

        if (item.id != this.budgetServiceItem.id) {
          tempTotal += item.price * item.hourService;
          tempDiscount += item.discount;
        }

      }

      tempTotal += newTotal;
      tempDiscount += newDiscount;

      const percent = (tempTotal * this.user.limitDiscount) / 100;

      if (tempDiscount > percent) {
        this.alertShowDiscount1();
        return false;
      }

      this.progressTotal = (tempDiscount * 100) / percent;

      if (this.progressTotal > 50) {
        this.infoPercenDiscount();
      }

    }

    return true;
  }

  editarBudgetService(service: BudgetServiceItem) {

    this.budgetServiceItem.companyId = service.companyId;
    this.budgetServiceItem.resaleId = service.resaleId;
    this.budgetServiceItem.budgetId = this.budgetId;
    this.budgetServiceItem.id = service.id;
    this.budgetServiceItem.status = service.status;
    this.budgetServiceItem.ordem = service.ordem;

    this.formBudgetService.patchValue({
      description: service.description,
      hourService: service.hourService,
      price: service.price,
      discount: service.discount
    });

  }

  getSizeListBudgetService(): number {
    return this.listBudgetService.length;
  }

  cleanBudgetService() {
    this.formBudgetService.patchValue({
      description: "",
      hourService: 0,
      price: 275,
      discount: 0

    });
    this.budgetServiceItem = new BudgetServiceItem();
  }

  private somaService() {
    this.totalBudgetService.set(0);
    this.totalBudgetDiscountService.set(0);

    var totalTemp = 0;
    var totalDescontoTemp = 0;

    for (let index = 0; index < this.listBudgetService.length; index++) {
      const element = this.listBudgetService[index];
      totalTemp += (element.hourService! * element.price!);
      totalDescontoTemp += element.discount;

    }

    this.totalBudgetService.set(totalTemp);
    this.totalBudgetDiscountService.set(totalDescontoTemp);

  }

  removerBudgetService(ordem: number) {

    var listTemp: BudgetServiceItem[] = [];

    for (let index = 0; index < this.listBudgetService.length; index++) {

      const item = this.listBudgetService.at(index);

      if (ordem == item.ordem) {

        this.budgetServiceItem.companyId = item.companyId;
        this.budgetServiceItem.resaleId = item.resaleId;
        this.budgetServiceItem.id = item.id;
        this.budgetServiceItem.budgetId = item.budgetId;
        this.budgetServiceItem.status = item.status;
        this.budgetServiceItem.ordem = item.ordem;
        this.budgetServiceItem.description = item.description;
        this.budgetServiceItem.hourService = item.hourService;
        this.budgetServiceItem.price = item.price;
        this.budgetServiceItem.discount = item.discount;

        this.budgetService.deleteBudgetService$(this.budgetServiceItem).subscribe();
        this.cleanBudgetService();

      } else {
        listTemp.push(item);
      }

    }
    this.listBudgetService = [];

    this.totalBudgetService.set(0);
    this.totalBudgetDiscountService.set(0);

    for (let index = 0; index < listTemp.length; index++) {
      const item = listTemp.at(index);

      item.ordem = index + 1;
      this.budgetService.updateBudgetService$(item).subscribe((data) => {
        if (data.status == 200) {
          this.getListBudgetSetvice();
        }
      });
    }

  }

  deleteAllDiscountService() {
    if (this.totalBudgetDiscountService() > 0) {
      this.budgetService.deleteDiscountAllService$(this.budgetId).subscribe((data) => {
        if (data.status == 200) {
          this.getListBudgetSetvice();
          this.alertShowDiscount2();
        }
      });
      this.cleanFormDiscount();
    }
  }

  private validDiscountService(): boolean {

    const { value } = this.formDiscount;
    if (value.servVal <= 0 && value.servPer <= 0) { return false; }

    const limit = this.user.limitDiscount;
    const valueLimitDisc = (this.totalBudgetService() * limit) / 100;
    const newValueDiscountPerc = ((this.totalBudgetService() * value.servPer) / 100) + this.totalBudgetDiscountService();
    const newValueDiscount = this.totalBudgetDiscountService() + value.servVal;

    if (this.totalBudgetDiscountService() == valueLimitDisc) {
      this.progressTotal = 100;
      this.infoPercenDiscount();
      return false;
    }

    if (newValueDiscount > valueLimitDisc) {
      this.alertShowDiscount1();
      return false;
    }

    if (newValueDiscountPerc > valueLimitDisc) {
      this.alertShowDiscount1();
      return false;
    }

    return true;

  }

  addDiscountAllService() {

    if (this.validDiscountService()) {

      const { value } = this.formDiscount;

      var discount = 0;
      var discountResto = 0;

      //Desconto serviço percentual
      if (value.servPer > 0) {
        const newDiscount = ((this.totalBudgetService() * value.servPer) / 100) + this.totalBudgetDiscountService();
        discountResto = newDiscount % this.listBudgetService.length;
        discount = (newDiscount - discountResto) / this.listBudgetService.length;
      }

      //Desconto serviço valor
      if (value.servVal > 0) {
        const newDiscount = this.totalBudgetDiscountService() + value.servVal;
        discountResto = newDiscount % this.listBudgetService.length;
        discount = (newDiscount - discountResto) / this.listBudgetService.length;
      }

      for (let index = 0; index < this.listBudgetService.length; index++) {
        var element = this.listBudgetService[index];

        //Last
        if (index == this.listBudgetService.length - 1) {

          element.discount = discount + discountResto;
          this.budgetService.updateBudgetService$(element).subscribe((data) => {
            if (data.status == 200) {
              this.getListBudgetSetvice();
            };
          });

        } else {

          element.discount = discount;
          this.budgetService.updateBudgetService$(element).subscribe();
        }

      }

      this.cleanFormDiscount();
      this.alertShowDiscount3();
    }

  }

  private cleanFormDiscount() {

    this.formDiscount.patchValue({ servPer: 0, servVal: 0, itemPer: 0, itemVal: 0 });
  }

  onCloseAlertDiscount() {
    this.visibleDiscount = false;
  }

  infoPercenDiscount() {
    if (!this.visibleDiscount) {
      this.messageService.add({ key: 'toastInfoDiscount', sticky: true, severity: 'custom', summary: 'Você atingiu.' });
      this.visibleDiscount = true;
      this.progressDiscount = 0;

      if (this.intervalDiscount) {
        clearInterval(this.intervalDiscount);
      }

      this.intervalDiscount = setInterval(() => {
        if (this.progressDiscount < this.progressTotal) {
          this.progressDiscount = this.progressDiscount + 2;
        }

        if (this.progressDiscount >= 100) {
          this.progressDiscount = 100;
          clearInterval(this.intervalDiscount);
        }

        this.cdr.markForCheck();
      }, 10);
    }
  }

  alertShowDiscount0() {
    this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o valor calculado', icon: 'pi pi-times' });
  }

  alertShowDiscount1() {
    this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o permitido', icon: 'pi pi-times' });
  }

  alertShowDiscount2() {
    this.messageService.add({ severity: 'success', summary: 'Desconto', detail: 'Removido com sucesso', icon: 'pi pi-check' });
  }

  alertShowDiscount3() {
    this.messageService.add({ severity: 'success', summary: 'Desconto', detail: 'Aplicado com sucesso', icon: 'pi pi-check' });
  }
  alertShowDiscount4() {
    this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Valor não permitido', icon: 'pi pi-times' });
  }

  alertShowRequisition0() {
    this.messageService.add({ severity: 'success', summary: 'Solicitação', detail: 'Adicionada com sucesso', icon: 'pi pi-plus' });
  }

  alertShowRequisition1() {
    this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Não a solicitação', icon: 'pi pi-exclamation-triangle' });
  }

  alertShowRequisition2() {
    this.messageService.add({ severity: 'success', summary: 'Solicitação', detail: 'Atualizada com sucesso', icon: 'pi pi-check' });
  }

  alertShowRequisition3() {
    this.messageService.add({ severity: 'info', summary: 'Solicitação', detail: 'Não pode ser removida', icon: 'pi pi-exclamation-triangle' });
  }

  alertShowService0() {
    this.messageService.add({ severity: 'success', summary: 'Serviço', detail: 'Adicionado com sucesso', icon: 'pi pi-plus' });
  }

  alertShowService1() {
    this.messageService.add({ severity: 'success', summary: 'Serviço', detail: 'Atualizado com sucesso', icon: 'pi pi-check' });
  }

  alertShowService3() {
    this.messageService.add({ severity: 'error', summary: 'Serviço', detail: 'Não foi possivel adicionar', icon: 'pi pi-exclamation-triangle' });
  }

}
