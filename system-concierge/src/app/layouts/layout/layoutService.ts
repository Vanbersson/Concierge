import { signal } from '@angular/core';

export class LayoutService {

    titlePage = signal('Dashboard');

    public setTitlePage(val: string) {
        this.titlePage.set(val);
    }

    public getTitlePage() {
        return this.titlePage();
    }

    public isLogin() {

        try {
            if (sessionStorage.length > 0) {
                return true;
            }
        } catch (error) {

        }
        return false;
    }








}