import { Component, OnInit } from '@angular/core';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  employees: any[] = [];
  searchDesignation: string = '';
  searchDepartment: string = '';

  constructor(
    private apolloClient: ApolloClient<InMemoryCache>,
    private authService: AuthService,
    private router: Router) {}

    ngOnInit() {
      this.fetchEmployees(); // Call when component loads
    }

    fetchEmployees(searchDesignation?: string, searchDepartment?: string) {
      const EMPLOYEE_QUERY = searchDesignation || searchDepartment 
      ? gql`
        query SearchEmployee($designation: String, $department: String) {
          searchEmployee(designation: $designation, department: $department) {
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
            }
          }
        `
        : gql`
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
          }
        }
      `;

    this.apolloClient
    .query({
      query: EMPLOYEE_QUERY,
      variables: searchDesignation || searchDepartment ? { designation: searchDesignation, department: searchDepartment } : {},
    })
    .then((result: any) => {
      console.log('Fetched Employees:', result.data.getAllEmployees || result.data.searchEmployee);
      this.employees = result.data.getAllEmployees || result.data.searchEmployee; // Update employee list
    
      // Clear search fields after fetching results
      this.searchDesignation = '';
      this.searchDepartment = '';
    })
    .catch((error) => {
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
    const DELETE_EMPLOYEE_MUTATION = gql`
      mutation DeleteEmployee($id: ID!) {
        deleteEmployee(id: $id)
      }
    `;
  
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apolloClient
        .mutate({ mutation: DELETE_EMPLOYEE_MUTATION, variables: { id: employeeId } })
        .then(() => {
          alert('Employee deleted successfully!');
          window.location.reload(); // Refresh list after deletion
        })
        .catch((error) => console.error('Error deleting employee:', error));
    }
  }  

  signOut() {
    alert('You have been successfully signed out.');
    this.authService.clearToken(); // Remove token
    this.router.navigate(['/login']); // Redirect to login
  }
}
