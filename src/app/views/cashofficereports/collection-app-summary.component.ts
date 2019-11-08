// http://10.1.49.225:8080/cash/collection-summary/106&2019-01-01&2019-01-31

import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as _ from 'underscore'; /// npm install underscore

import { apiURL } from '../../_nav' ;

@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
  ]
})

@Component({
  templateUrl: 'collection-app-summary.component.html'
})
export class CollectionAppSummaryComponent {

  detailInput = new FormGroup({
    branchCode: new FormControl('', Validators.required),
    fromDate: new FormControl('2019-01-01', Validators.required),
    toDate: new FormControl('2019-01-31', Validators.required)
  });

  branchCodes: any
  branchName: string = "";

  displayReport = false;

  receipts: any;

  totalBranch: number = 0.0;

  url: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' })
    }
    this.url = apiURL + "/cor_collection-branch/" ;
    this.http.get(this.url, httpOptions)
      .subscribe((response) => {
        const obj = response;

        this.branchCodes = obj;

      }
        , err => this.handleError(err));
  }

  detailReport() {

    // function btoa(stringToEncode) and atob(stringToDecode) using Base64 things
    let bc = this.detailInput.get('branchCode').value;
    let fd = this.detailInput.get('fromDate').value;
    let td = this.detailInput.get('toDate').value;

    let url = apiURL + "/cor_collection-summary/" + bc + "&" + fd + "&" + td;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' })
    }
    this.http.get(url, httpOptions)
      .subscribe((response) => {
        this.receipts = response;
      }
        , err => this.handleError(err)
        , () => this.sums()
      );

    this.displayReport = true;

  }

  private handleError(error: Response) {
    console.log(error);
    return Observable.throw('server error');
  }

  private sums() {
    this.branchName = this.receipts[0].branch_name;

    this.totalBranch = this.receipts.reduce(function (accumulator, currentValue) { return accumulator + parseFloat(currentValue.allocated_amount) }, 0);

    this.showGroupies();
  }

  toggleDisplayReport() {
    this.displayReport = !this.displayReport;
  }

  groupies: any;

  showGroupies() {
    // console.log( _.groupBy(this.receipts, "app_desc") ) ; // dbg
    this.groupies = _.groupBy(_.sortBy(this.receipts, "app_desc"), "app_desc");
  }

  getCount(x: any): number {
    // console.log(x) ; // dbg
    return x.reduce(function (accumulator, currentValue) { return accumulator + parseInt(currentValue.receipt_count) }, 0);
  }

  getSum(x: any): number {
    // console.log(x) ; // dbg
    return x.reduce(function (accumulator, currentValue) { return accumulator + parseFloat(currentValue.allocated_amount) }, 0);
  }

}
