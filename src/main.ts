import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { SignupComponent } from './app/signup/signup.component';
import { EmployeeComponent } from './app/employee/employee.component';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
    { provide: ApolloClient, useValue: apolloClient },
  ],
});