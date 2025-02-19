import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';


@Injectable({
    providedIn: 'root',
})

export class TaskService {

    private intervalSubscription: Subscription;
   
    constructor() { }

    // Iniciar o intervalo
    startTask(listCallback: () => void, time: number): void {

        this.intervalSubscription = new Subscription();

        this.intervalSubscription = interval(time).subscribe(() => {
            listCallback();
        });

    }

    // Parar o intervalo
    stopTask(): void {
        if (this.intervalSubscription) {
            this.intervalSubscription.unsubscribe();
        }
        this.intervalSubscription = null;
    }

}