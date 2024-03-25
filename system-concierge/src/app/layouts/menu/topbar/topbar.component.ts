import { Component, signal, computed, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//PrimeNg
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';



@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, FormsModule, CalendarModule, DialogModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  providers: []
})
export class TopbarComponent {

  date: Date | undefined;

  visible: boolean = false;

  @ViewChild('menuButton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  visibleSideBar = signal(false);

  @Output() sideBar = new EventEmitter<boolean>();

  setSideBar(val:boolean){
    this.sideBar.emit(val);
    this.visibleSideBar.set(!val);
  }

  constructor() { }

  showDialog() {
    this.visible = true;
  }



}
