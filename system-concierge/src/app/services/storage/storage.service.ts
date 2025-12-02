import { Injectable, Signal, signal } from '@angular/core';
import { IUser } from '../../interfaces/user/iuser';
import { IAuthResponse } from '../../interfaces/auth/iauthresponse';

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  constructor() { }

  set companyId(companyId: string) {
    sessionStorage.setItem('companyId', companyId);
  }
  get companyId(): number {
    return Number.parseInt(sessionStorage.getItem("companyId"));
  }

  set resaleId(resaleId: string) {
    sessionStorage.setItem('resaleId', resaleId);
  }
  get resaleId(): number {
    return Number.parseInt(sessionStorage.getItem("resaleId"));
  }

  set id(id: string) {
    sessionStorage.setItem('id', id);
  }
  get id(): number {
    return Number.parseInt(sessionStorage.getItem("id"));
  }

  set name(name: string) {
    sessionStorage.setItem('name', name);
  }
  get name(): string {
    return sessionStorage.getItem("name");
  }

  set email(email: string) {
    sessionStorage.setItem('email', email);
  }
  get email(): string {
    return sessionStorage.getItem("email");
  }

  set cellphone(cellphone: string) {
    sessionStorage.setItem('cellphone', cellphone);
  }
  get cellphone(): string {
    return sessionStorage.getItem("cellphone");
  }

  set limitDiscount(limitDiscount: string) {
    sessionStorage.setItem('limitDiscount', limitDiscount);
  }
  get limitDiscount(): number {
    return Number.parseInt(sessionStorage.getItem("limitDiscount"));
  }

  set photo(photo: string) {
    sessionStorage.setItem('photo', photo);
  }
  get photo(): string {
    return sessionStorage.getItem("photo");
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

  set menus(menus: string) {
    sessionStorage.setItem('menus', menus);
  }
  get menus(): string {
    return sessionStorage.getItem("menus");
  }

  set permissions(per: string) {
    sessionStorage.setItem('permission', per);
  }
  get permissions(): string {
    return sessionStorage.getItem("permission");
  }

  isLogged() {
    return this.companyId &&
      this.resaleId &&
      this.id &&
      this.name &&
      this.email &&
      this.token &&
      this.roleDesc;
  }

  public deleteStorage() {
    sessionStorage.clear();
  }

}
