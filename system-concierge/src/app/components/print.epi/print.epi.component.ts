import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
//Print
import printJS from 'print-js';
import { ToolControlRequest } from '../../models/workshop/toolcontrol/tool-control-request';
import { ToolControlMatMec } from '../../models/workshop/toolcontrol/tool-control-matmec';
@Component({
  selector: 'app-printepi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print.epi.component.html',
  styleUrl: './print.epi.component.scss'
})
export class PrintEpiComponent {

  listEPI: ToolControlMatMec[] = [];

  constructor() { }

  async print(req: ToolControlRequest, listMat: ToolControlMatMec[]) {

    this.listEPI = listMat;
    setTimeout(() => {
      const print = document.getElementById('print-EPI');
      print.style.display = 'block';
      printJS({
        printable: 'print-EPI',
        type: 'html',
        targetStyles: ['*'], // Inclui todos os estilos aplicáveis
        scanStyles: true,
        documentTitle: 'Ficha EPI',
        font_size: '10pt'
      });
      print.style.display = 'none';
    }, 200);
  }
}


