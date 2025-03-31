import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { Router } from '@angular/router';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private apolloClient: ApolloClient<InMemoryCache>,
    private router: Router) {
    this.employeeForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      date_of_joining: ['', [Validators.required]],
      department: ['', [Validators.required]],
      employee_photo: [null],
    });
  }

  // File upload function
  async onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      try {
        // Compress file
        const options = { maxSizeMB: 1, maxWidthOrHeight: 800 };
        const compressedFile = await imageCompression(file, options);
  
        // Prepare form data for Cloudinary
        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('upload_preset', 'assignment_2');
  
        // Upload to Cloudinary
        const response = await fetch('https://api.cloudinary.com/v1_1/di8nf7iph/image/upload', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
  
        if (data.secure_url) {
          // Update the employee_photo with the Cloudinary image URL
          this.employeeForm.patchValue({ employee_photo: data.secure_url });
          console.log('Uploaded Photo URL:', data.secure_url);
        } else {
          throw new Error('Failed to upload image to Cloudinary.');
        }
      } catch (error) {
        console.error('Image upload error:', error);
      }
    }
  }  

  // Submit form data to GraphQL server
  onSubmit() {
    if (this.employeeForm.valid) {
      const ADD_EMPLOYEE_MUTATION = gql`
        mutation AddEmployee(
          $first_name: String!,
          $last_name: String!,
          $email: String!,
          $gender: String!,
          $designation: String!,
          $salary: Float!,
          $date_of_joining: String!,
          $department: String!,
          $employee_photo: String
        ) {
          addEmployee(
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            gender: $gender,
            designation: $designation,
            salary: $salary,
            date_of_joining: $date_of_joining,
            department: $department,
            employee_photo: $employee_photo
          ){
            id
            first_name
            last_name
            email
          }
        }
      `;

      const photo = this.employeeForm.value.employee_photo;
      console.log('Photo size (Base64):', photo ? photo.length : 0, 'characters');

      // Perform GraphQL mutation
      this.apolloClient
        .mutate({
          mutation: ADD_EMPLOYEE_MUTATION,
          variables: { ...this.employeeForm.value },
        })
        .then((result) => {
          console.log('Employee added successfully:', result.data);
          alert('Employee added successfully!');
          this.employeeForm.reset(); // Clear form
          this.router.navigate(['/employee']); // Navigate to employee list
        })
        .catch((error) => {
          console.error('Error adding employee:', error);
          alert('Failed to add employee.');
        });
    } else {
      alert('Please complete all required fields.');
    }
  }

  goBack(): void {
    this.router.navigate(['/employee']); // Navigate to employee list
  }
}