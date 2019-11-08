// Bank Statement - Paypoint Reports Module
// NOTE: Defines custom Pipe (MyFilterPipe) to filter transactions from transactions array

import { Component, OnInit, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from 'underscore'; /// npm install underscore
import { apiURL } from '../../_nav' ;

@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule]
})

@Component({
  templateUrl: './bank-statement.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class BankStatementComponent {

  today = new Date();

  receiptInput = new FormGroup({
    bankStatementID: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")])
  });
  error_message: any;
  showSpinner: any;
  receipt: any;
  displayReport: any = false;
  report: any;
  url: any;
  err: any;
  groupies: any;
  trans: any;
  total: any;

  constructor(private http: HttpClient) { }




  toggleDisplayReport() {
    this.displayReport = !this.displayReport;
  }

  getReport() {

    this.displayReport= false;
    this.showSpinner = true;
    const bsID = this.receiptInput.get('bankStatementID').value;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' })
    };
    this.url = apiURL +'/bstmtp/report/' + bsID;
    this.http.get(this.url, httpOptions)
      .subscribe((response) => {

        this.report = response;
        if (this.report.length == 0) // Error handling. Put all-else in ELSE part
        {
          this.error_message = true;
          this.showSpinner = false;
          this.err = "No Matching Data Found";
          this.displayReport = false;
        } else {
          this.totalDebitsAndCredits();
          this.showSpinner = false;
          this.error_message = false;
          this.displayReport = true;

        }
      }, (err) => {

        this.err = 'No Cash Office Codes';
        this.error_message = true;
        this.displayReport = false;
      },
        () => this.sums());

  }
  sums() {
    this.showGroupies();
    this.showTrans();
  }
  showGroupies() {
    this.groupies = _.groupBy(this.report, 'bank_ACCOUNT'); // or sort cash_office_desc
  }
  showTrans() {
    this.trans = _.groupBy(this.report, 'trns_DESC'); // or sort cash_office_desc
  }
  totalDebitsAndCredits() {
    this.total = this.report.reduce(function (accumulator, currentValue) { return accumulator + parseFloat(currentValue.amount) }, 0);
    

  }
}
