import { Component, ViewEncapsulation, NgModule, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from 'underscore'; /// npm install underscore
import { apiURL } from '../../_nav' ;

@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,


  ]

})

@Component({
  templateUrl: 'oversandunders.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./spinner.component.scss'],
})
export class OversandUndersComponent implements OnInit {

  detailInput = new FormGroup({
    PayPointID: new FormControl('', Validators.required),

    Paypoint_Name: new FormControl(''),
    Period: new FormControl('', Validators.required)
  });
  paypointIds: any;
  paypointName: any;
  error_message: any;
  err: any;
  report: any;
  url: any;
  groupies: any;
  showSpinner: boolean;
  total: number;
  totalCred: number;
  content: any;
  constructor(private http: HttpClient) { }

  displayReport = false;
  disableForm = false;
  detailReport() {
    this.displayReport = true;

    console.table(this.detailInput.value);

    // form-processing code
  }

  toggleDisplayReport() {

    this.displayReport = false;
    this.detailInput.reset();
  }
  ngOnInit() {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' }),
    };
    this.url = apiURL +'/collection-branch/paypoints';
    this.http.get(this.url, httpOptions)
      .subscribe((response) => {
        const obj = response;
        this.paypointIds = obj;
        this.error_message = false;
      }
        ,
        (err) => {
          this.err = 'Server unreachable | Check if ts running |  available branch codes not retrieved';
          this.error_message = true;
          this.displayReport = false;
        });
  }
  getPaypointName() {
    const ppID = this.detailInput.get('PayPointID').value;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' })
    };
    this.url = apiURL +'/oversunders/paypointname/' + ppID;
    this.http.get(this.url, httpOptions)
      .subscribe((response) => {


        this.paypointName = response;
      }, (err) => {

        this.err = 'No Cash Office Codes';
        this.error_message = true;
        this.displayReport = false;
      });
  }

  getReport() {

    this.showSpinner = true;
    const ppID = this.detailInput.get('PayPointID').value;
    const period = this.detailInput.get('Period').value;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' })
    };
    this.url = apiURL +'/oversunders/report/' + ppID + '&' + period;
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
  }
  showGroupies() {
    this.groupies = _.groupBy(this.report, 'pay_point_id'); // or sort cash_office_desc
  }


  totalDebitsAndCredits() {
    this.total = this.report.reduce(function (accumulator, currentValue) { return accumulator + parseFloat(currentValue.debits) }, 0);
    this.totalCred = this.report.reduce(function (accumulator, currentValue) { return accumulator + parseFloat(currentValue.credits) }, 0);

  }
}
