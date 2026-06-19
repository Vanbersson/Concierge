import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMap],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export default class MapComponent {
  center: google.maps.LatLngLiteral = {
    lat: -8.05428,
    lng: -34.8813
  };
  zoom = 12;


}
