import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

//Class
import { PurchaseOrder } from '../../models/purchase.order/puchase.order';
import { PurchaseOrderItem } from '../../models/purchase.order/purchase.order.item';

//Print
import printJS from 'print-js';

//Service
import { PurchaseOrderItemService } from '../../services/purchase/purchase-order-item.service';
import { PurchaseOrderService } from '../../services/purchase/purchase-order.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-printPurchase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print.purchase.component.html',
  styleUrl: './print.purchase.component.scss'
})
export class PrintPurchaseComponent {

  printPurchaseOrder = signal<PurchaseOrder>(new PurchaseOrder());
  printPurchaseOrderItems: PurchaseOrderItem[] = [];
  totalItemsDiscount = signal<number>(0);
  totalItemsPrice = signal<number>(0);
  purchaseOrderItems: PurchaseOrderItem[] = [];

  constructor(
    private storageService: StorageService,
    private purchaseOrderService: PurchaseOrderService,
    private purchaseOrderItemService: PurchaseOrderItemService) { }

  public async print(id: number) {

    const resultPu = await this.PurchaseOrderFilterId(id);
    if (resultPu.status == 200) {
      //Dados 
      this.printPurchaseOrder.set(resultPu.body);

      this.printPurchaseOrderItems = Array(30).fill(new PurchaseOrderItem());

      //List items
      this.purchaseOrderItems = await this.listPurchaseOrderItem(this.storageService.companyId, this.storageService.resaleId, id);
      this.somaItem();

      for (let index = 0; index < this.purchaseOrderItems.length; index++) {
        this.printPurchaseOrderItems[index] = this.purchaseOrderItems.at(index);
      }

      setTimeout(() => {
        const print = document.getElementById('print-sectionId');
        print.style.display = 'block';
        printJS({
          printable: 'print-sectionId',
          type: 'html',
          targetStyles: ['*'], // garante que os estilos globais sejam aplicados
          scanStyles: true, // use true se quiser escanear estilos inline também
          documentTitle: 'Pedido de compra',
          font_size:'10pt'
        });
        print.style.display = 'none';
      }, 200);

    }

  }
  abreviaDesc(desc: string) {
    if (desc == '') return desc;
    if (desc.length <= 20) return desc;
    return desc.substring(0, 20);
  }
  private async PurchaseOrderFilterId(id: number): Promise<HttpResponse<PurchaseOrder>> {
    try {
      return await lastValueFrom(this.purchaseOrderService.filterId(this.storageService.companyId, this.storageService.resaleId, id));
    } catch (error) {
      return error;
    }
  }
  private async listPurchaseOrderItem(companyId: number, resaleId: number, purchaseId: number): Promise<PurchaseOrderItem[]> {
    try {
      return await lastValueFrom(this.purchaseOrderItemService.filterId(companyId, resaleId, purchaseId));
    } catch (error) {
      return [];
    }
  }
  somaItem() {
    var tempDiscount: number = 0;
    var tempPrice: number = 0;

    for (var item of this.purchaseOrderItems) {
      tempDiscount += item.discount;
      tempPrice += item.price * item.quantity;
    }
    this.totalItemsDiscount.set(tempDiscount);
    this.totalItemsPrice.set(tempPrice);
  }

}
