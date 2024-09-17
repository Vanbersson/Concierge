import { Injectable, Signal, signal } from '@angular/core';
import { IUser } from '../../interfaces/user/iuser';
import { IAuthResponse } from '../../interfaces/auth/iauthresponse';

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  constructor() { }

  set photo(photo: string) {
    sessionStorage.setItem('photo', photo);
  }
  get photo(): string {
    return sessionStorage.getItem("photo");
  }

  set name(name: string) {
    sessionStorage.setItem('name', name);
  }
  get name(): string {
    return sessionStorage.getItem("name");
  }

  set roleDesc(roleDesc: string) {
    sessionStorage.setItem('roleDesc', roleDesc);
  }
  get roleDesc(): string {
    return sessionStorage.getItem("roleDesc");
  }

  set token(token: string) {
    sessionStorage.setItem('token', token);
  }
  get token(): string {
    return sessionStorage.getItem("token");
  }

  public deleteStorage() {
    sessionStorage.clear();
  }

}
