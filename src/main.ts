import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { SignupComponent } from './app/signup/signup.component';
import { EmployeeComponent } from './app/employee/employee.component';
import { EmployeeDetailsComponent } from './app/employee/employee-details/employee-details.component';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { AuthGuard } from './app/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard] },
  { path: 'employees/:id', component: EmployeeDetailsComponent},
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