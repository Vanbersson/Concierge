import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyCount = 0;

  constructor(private spinnerService: NgxSpinnerService) { }

  busy() {
    this.busyCount++;
    this.spinnerService.show(undefined,
      {
        type: "ball-clip-rotate",
        size: "medium",
        bdColor: "rgba(0, 0, 0, 0.4)",
        color: "#fff",
        fullScreen: true
      }
    );

  }

  idle() {
    this.busyCount--;
    if (this.busyCount <= 0) {
      this.busyCount = 0;
      this.spinnerService.hide();
    }
  }

}
