import { CommonModule } from '@angular/common';
import { Component, InputSignal, input } from '@angular/core';

@Component({
  selector: 'mcd-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  imports: [CommonModule],
})
export default class LoadingComponent {
  big: InputSignal<boolean> = input<boolean>(false);
}
