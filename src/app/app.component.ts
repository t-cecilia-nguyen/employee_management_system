import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref],
  template: `
    <nav>
      <a routerLink="/login">Login</a>
      <a routerLink="/signup">Signup</a>
      <a routerLink="/employee">Employee</a>
    </nav>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = '100749684_comp3133_assignment2';
}

