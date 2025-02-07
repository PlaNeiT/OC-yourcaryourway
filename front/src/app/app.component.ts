import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>`,
  standalone: true,
  imports: [
    RouterOutlet
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
