import { Component } from '@angular/core';
import { PicoPlacaModule } from "./pico-placa/pico-placa.module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PicoPlacaModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'pico-placa-predictor';
}
