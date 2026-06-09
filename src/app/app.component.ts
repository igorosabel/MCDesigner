import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'mcd-root',
  template: `<router-outlet />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterModule],
})
export default class AppComponent {}
