import { Component } from '@angular/core';
import { PicoPlacaService } from './service/pico-placa.service';

@Component({
  selector: 'app-pico-placa',
  templateUrl: './pico-placa.component.html',
  styleUrl: './pico-placa.component.css'
})
export class PicoPlacaComponent {
  plate = '';
  date  = '';
  time  = '';
  result: string | null = null;

  constructor(private picoSvc: PicoPlacaService) {}

  predict() {
    try {
      const ok = this.picoSvc.canDrive(this.plate, this.date, this.time);
      this.result = ok ? 'Allowed to drive' : 'Not allowed to drive';
    } catch (err) {
      this.result = (err as Error).message;
    }
  }
}
