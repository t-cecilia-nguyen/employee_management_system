import { Component, OnInit } from '@angular/core';
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
export class EmployeeComponent implements OnInit {
  employees: any[] = [];

  constructor(
    private apolloClient: ApolloClient<InMemoryCache>,
    private authService: AuthService,
    private router: Router) {}

    ngOnInit() {
      this.fetchEmployees(); // Call fetchEmployees when component loads
    }

    fetchEmployees() {
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
      console.log('Fetched Employees:', result.data.getAllEmployees);
      this.employees = result.data.getAllEmployees;
    }).catch(error => {
      console.error('Error fetching employees:', error);
    });    
  }

  addEmployee() {
    this.router.navigate(['/add-employee']); // Navigate to add employee page
  }

  viewDetails(employeeId: string): void {
    this.router.navigate([`/employees/${employeeId}`]); // Navigate to details page
  }
  
  editEmployee(employeeId: string): void {
    this.router.navigate([`/update-employee/${employeeId}`]); // Navigate to update employee page
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
