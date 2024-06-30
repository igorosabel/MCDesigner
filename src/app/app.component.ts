import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'mcd-root',
  standalone: true,
  template: `<router-outlet />`,
  imports: [RouterModule],
})
export default class AppComponent {}
