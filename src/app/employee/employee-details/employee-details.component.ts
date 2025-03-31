import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
})
export class EmployeeDetailsComponent implements OnInit {
  employeeId: string | null = null;
  employee: any = null;
  date_of_joining: string = '';

  constructor(
    private route: ActivatedRoute, 
    private apolloClient: ApolloClient<InMemoryCache>,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Retrieve employee ID from route parameters
    this.employeeId = this.route.snapshot.paramMap.get('id');

    if (this.employeeId) {
      this.fetchEmployeeDetails(this.employeeId);
    }
  }

  fetchEmployeeDetails(employeeId: string): void {
    const SEARCH_EMPLOYEE_BY_ID = gql`
      query SearchEmployeeById($id: ID!) {
        searchEmployeeById(id: $id) {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
        }
      }
    `;

    this.apolloClient
    .query({
      query: SEARCH_EMPLOYEE_BY_ID,
      variables: { id: employeeId }, // Pass employee ID
    })
    .then((result: any) => {
      this.employee = result.data.searchEmployeeById;
      console.log('Employee Details:', this.employee);

      // Convert date_of_joining to a readable format
      const rawTimestamp = this.employee.date_of_joining;
      const date = new Date(Number(rawTimestamp)); //  Cast to a number
      this.date_of_joining = date.toLocaleDateString('en-US', { // Format date
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    })
    .catch((error: any) => {
      console.error('Error fetching employee details:', error); // Handle errors
    });
  }

  goBack(): void {
    this.router.navigate(['/employee']); // Navigate to employee list
  }
}