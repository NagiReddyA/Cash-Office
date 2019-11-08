import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { NgxPrintModule } from 'ngx-print'; // npm install ngx-print
// import { NgxSpinnerService } from 'ngx-spinner'; //npm install ngx-spinner
import * as _ from 'underscore'; /// npm install underscore
import { apiURL } from '../../_nav' ;

@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
    HttpClient,
    // NgxPrintModule,
 
  ]
})

@Component({
  templateUrl: './cashier-assignment.component.html'
})
export class CashierAssignmentComponent implements OnInit {

  cashierInput = new FormGroup({
    branchCode: new FormControl('', Validators.required),
    cashOfficeCode: new FormControl('', Validators.required),
  });
  url: string;
  branchCodes: any;
  cashCodes: any;
  paymentMethod: any;
  All_paymentMethod: any;
  reportNumber: Number;
  branchName: string;
  cashOfficeDesc: string;
  applications: any;
  cashiers: any;
  allReports: any;
  receipts: any;
  groupies: any;


  // constructor(private http: HttpClient, private spinner: NgxSpinnerService) {
    constructor(private http: HttpClient) {

  }

  displayAll = false;
  displayReport = false;
  currentDate = new Date();
  error_message = false;

  ngOnInit() {

  
/** spinner starts on init */
// this.spinner.show();
 
// setTimeout(() => {
//     /** spinner ends after 5 seconds */
//     this.spinner.hide();
// }, 5000);


    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' }),
    };
    this.url = apiURL +"/cor_collection-branch/";
    this.http.get(this.url, httpOptions)
      .subscribe((response) => {
        const obj = response;

        this.branchCodes = obj;
        console.log(response);

      }
        , err => this.handleError(err));
 

  }
  getCashCodes() {

    const bc = this.cashierInput.get('branchCode').value;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' })
    };
    this.url =  apiURL +'/cor_collection-branch/cash-office-codes/' + bc;
    this.http.get(this.url, httpOptions)
      .subscribe((response) => {
        if (response != null) {
          const obj = response;
          this.cashCodes = obj;

        } else {
          this.error_message = true;
        }

      }
        , err => this.handleError(err));


  }
  private handleError(error: Response) {
    console.log(error);
    return 'Error';
  }


  toggleDisplayReport() {
    this.displayAll = !this.displayAll; // false
  }
  selectMeth() {

  }  // An Method to hold dynamic data - Payment Methods:
  getPaymentMethods() {

    const bc = this.cashierInput.get('branchCode').value;
    const co = this.cashierInput.get('cashOfficeCode').value;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' })
    };
    this.url =  apiURL +'/cor_cashier-assignment/paymentMethods/' + bc + '&' + co;
    this.http.get(this.url, httpOptions)
      .subscribe((response) => {
        const obj = response;
        console.log(obj);
        this.paymentMethod = obj;
        this.branchName = this.paymentMethod[0].branch_name;
        this.cashOfficeDesc = this.paymentMethod[0].cash_office_desc;



      }
        , err => this.handleError(err));



  }
  checkOffice(x: any) {
    console.log(x);
  }

  getAll_PaymentMethods(bc: any, co: any) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' })
    };
    this.url =  apiURL +'/cor_cashier-assignment/paymentMethods/' + bc + '&' + co;
    this.http.get(this.url, httpOptions)
      .subscribe((response) => {
        const obj = response;
        this.All_paymentMethod = obj;

        console.log(this.All_paymentMethod.branch_name);

      }
        , err => this.handleError(err));

    console.log(this.All_paymentMethod);
    return this.All_paymentMethod;
  }

  // An Method to hold dynamic data - Application:
  getApplication() {

    const bc = this.cashierInput.get('branchCode').value;
    const co = this.cashierInput.get('cashOfficeCode').value;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' })
    };
    this.url =  apiURL +'/cor_cashier-assignment/application/' + bc + '&' + co;
    this.http.get(this.url, httpOptions)
      .subscribe((response) => {
        const obj = response;

        this.applications = obj;

      }
        , err => this.handleError(err));



  }
  getAllApplication() {

    const bc = this.cashierInput.get('branchCode').value;
    const co = this.cashierInput.get('cashOfficeCode').value;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' })
    };
    this.url =  apiURL +'/cor_cashier-assignment/application/' + bc + '&' + co;
    this.http.get(this.url, httpOptions)
      .subscribe((response) => {
        const obj = response;

        this.applications = obj;




      }
        , err => this.handleError(err));



  }
  getCashiers() {

    const bc = this.cashierInput.get('branchCode').value;
    const co = this.cashierInput.get('cashOfficeCode').value;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' })
    };
    this.url =  apiURL +'/cor_cashier-assignment/cashier/' + bc + '&' + co;
    this.http.get(this.url, httpOptions)
      .subscribe((response) => {
        const obj = response;

        this.cashiers = obj;




      }
        , err => this.handleError(err));



  }

  getAllCashiers() {

    const bc = this.cashierInput.get('branchCode').value;
    const co = this.cashierInput.get('cashOfficeCode').value;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' })
    };
    this.url =  apiURL +'/cor_cashier-assignment/cashier/' + bc + '&' + co;
    this.http.get(this.url, httpOptions)
      .subscribe((response) => {
        const obj = response;

        this.cashiers = obj;




      }
        , err => this.handleError(err));



  }

  randomInt() {
    const max = 10000000;
    const min = 1346;

    this.reportNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getAll_reports() {

    this.displayReport = !this.displayReport;
    this.displayReport = false;
    this.displayAll = true;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' })
    };
    this.url =  apiURL +'/cor_cashier-assignment/all-ca/';
    this.http.get(this.url, httpOptions)
      .subscribe((response) => {
        const obj = response;
        this.allReports = obj;

        console.log(this.allReports);

      }
        , err => this.handleError(err)
        , () => this.sums());


  }

  // bgn. processing for "when no input"


  sums() {

    // this.branchName = this.receipts[0].branch_name;

    // this.totalBranch = this.receipts.reduce(function (accumulator, currentValue)
    // { return accumulator + parseFloat(currentValue.allocated_amount) }, 0);

    this.showGroupies();
  }


  showGroupies() {
    this.groupies = _.groupBy(this.allReports, 'branch_code'); // or sort cash_office_desc

    // console.log(this.groupies);
  }
  // end. processing for "when no input"
  sort_value(x: any) {
    return _.groupBy(x, 'cash_office_code');
  }

  sort_value_Pay(x: any) {
    return _.groupBy(x, 'pay_method_code');
  }
  sort_value_Cashiers(x: any) {
    return _.groupBy(x, 'cashier_code');
  }

  sort_value_Applications(x: any) {


    return _.groupBy(x, 'app_code');

  }


  onSubmit() {

    this.displayAll = !this.displayAll;
    const x: number = this.cashierInput.get('branchCode').value.length;
    const y: number = this.cashierInput.get('cashOfficeCode').value.length;

    if (y < 1) {

      console.log('Please Complete all fields');
      this.displayReport = !this.displayReport;
      // show container for the results
    } else {

      this.getPaymentMethods();
      this.getApplication();
      this.getCashiers();
      this.displayReport = true;
      // this.cashierInput.disabled;
    }

  }
}
