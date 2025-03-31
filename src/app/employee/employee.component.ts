import { Component } from '@angular/core';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent {
  employees: any[] = [];

  constructor(
    private apolloClient: ApolloClient<InMemoryCache>,
    private authService: AuthService,
    private router: Router) {
    const GET_ALL_EMPLOYEES = gql`
      query GetAllEmployees {
        getAllEmployees {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          employee_photo
          created_at
          updated_at
        }
      }
    `;

    this.apolloClient.query({ query: GET_ALL_EMPLOYEES }).then((result: any) => {
      console.log('Fetched Employees:', result.data.getAllEmployees); // Debugging
      this.employees = result.data.getAllEmployees;
    }).catch(error => {
      console.error('Error fetching employees:', error); // Log any errors
    });    
  }

  viewDetails(employeeId: string) {
    console.log('View employee details:', employeeId);
  }

  editEmployee(employeeId: string) {
    console.log('Edit employee:', employeeId);
  }

  deleteEmployee(employeeId: string) {
    console.log('Delete employee:', employeeId);
  }

  signOut() {
    alert('You have been successfully signed out.');
    this.authService.clearToken(); // Remove token
    this.router.navigate(['/login']); // Redirect to login
  }
}
