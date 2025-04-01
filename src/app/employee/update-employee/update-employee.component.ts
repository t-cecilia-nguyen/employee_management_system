import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css'],
})
export class UpdateEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  employeeId!: string;

  constructor(
    private fb: FormBuilder,
    private apolloClient: ApolloClient<InMemoryCache>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.fetchEmployeeDetails();
  }

  initializeForm() {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', Validators.required],
      department: ['', Validators.required],
    });
  }

  fetchEmployeeDetails() {
    const GET_EMPLOYEE_BY_ID = gql`
      query SearchEmployeeById($id: ID!) {
        searchEmployeeById(id: $id) {
          id
          first_name
          last_name
          designation
          salary
          department
        }
      }
    `;

    this.apolloClient
      .query({ query: GET_EMPLOYEE_BY_ID, variables: { id: this.employeeId } })
      .then((result: any) => {
        this.employeeForm.patchValue(result.data.searchEmployeeById);
      })
      .catch((error) => console.error('Error fetching employee:', error));
  }

  onSubmit() {
    const UPDATE_EMPLOYEE_MUTATION = gql`
      mutation UpdateEmployee(
        $id: ID!,
        $first_name: String,
        $last_name: String,
        $designation: String,
        $salary: Float,
        $department: String
      ) {
        updateEmployee(
          id: $id,
          first_name: $first_name,
          last_name: $last_name,
          designation: $designation,
          salary: $salary,
          department: $department
        ) {
          id
          first_name
          last_name
          designation
          salary
          department
        }
      }
    `;

    this.apolloClient
      .mutate({
        mutation: UPDATE_EMPLOYEE_MUTATION,
        variables: { id: this.employeeId, ...this.employeeForm.value },
      })
      .then(() => {
        alert('Employee updated successfully!');
        this.router.navigate(['/employee']);
      })
      .catch((error) => console.error('Error updating employee:', error));
  }

  goBack() {
    this.router.navigate(['/employee']); // Navigate to employee list
  }
}
