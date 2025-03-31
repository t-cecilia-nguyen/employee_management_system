import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { Router, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLinkWithHref],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private apolloClient: ApolloClient<InMemoryCache>,
    private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: this.passwordMatchValidator, // Validator for password matching
    });
  }

  // Password match validator
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  onSubmit() {
    console.log('Form Status:', this.signupForm.status);
    console.log('Form submitted:', this.signupForm.value);
    if (this.signupForm.valid) {
      const SIGNUP_MUTATION = gql`
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(username: $username, email: $email, password: $password) {
            id
            username
            email
          }
        }
      `;

      this.apolloClient
        .mutate({
          mutation: SIGNUP_MUTATION,
          variables: {
            username: this.signupForm.value.username,
            email: this.signupForm.value.email,
            password: this.signupForm.value.password,
          },
        })
        .then(result => {
          console.log('Signup successful:', result.data);
          alert('Signup successful! You can now log in.'); // Show success pop-up
          this.router.navigate(['/login']);
        })
        .catch(error => {
          console.error('Error signing up:', error);
          console.error('Error signing up:', error);
          alert('Signup failed: ' + error.message);
        });
    } else {
      console.log('Signup Form is Invalid');
    }
  }
}
