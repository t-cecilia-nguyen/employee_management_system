import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { Router, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLinkWithHref],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private apolloClient: ApolloClient<InMemoryCache>,
    private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const LOGIN_QUERY = gql`
        query Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            token
          }
        }
      `;

      this.apolloClient
        .query({
          query: LOGIN_QUERY,
          variables: {
            username: this.loginForm.value.username,
            password: this.loginForm.value.password,
          },
        })
        .then(result => {
          console.log('Login successful:', result.data);
          alert('Login successful!');
          this.router.navigate(['/employee']); // Navigate to employee page on successful login
        })
        .catch(error => {
          console.error('Error logging in:', error);
          alert('Login failed! Please check your credentials.');
        });
    } else {
      console.log('Login Form is Invalid');
    }
  }
}
