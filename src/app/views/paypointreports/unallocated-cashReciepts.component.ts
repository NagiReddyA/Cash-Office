// Unallocated Cash Receipts - Paypoint Report Receipts
// localhost:8080/cash/paypoint-reports/unallocated-cash-receipts/06-AUG-2018&03-SEP-2018
// date('2006-03-01') AND date('2006-03-15') ;
// paypoint-reports/unallocated-cash-receipts/2000-10-07&2019-10-07

import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  templateUrl: 'unallocated-cashReciepts.component.html'
})
export class unallocatedCashRecieptsComponent {
  
  detailInput = new FormGroup({
    fromDate: new FormControl('2019-01-01', Validators.required),
    to_Date: new FormControl('2019-01-31', Validators.required)
  });

  disableForm = false;
  displayReport = false ;
 
  headerDetails: any ;

  paypointIds: any ;

  receipt_status = "" ;
  reportNo = 1234 ;  // /?
  
  today = new Date() ;
  totalAllocated: number = 0.0 ;
  totalGross: number = 0.0 ;
  totalReceipt: number = 0.0 ;
  totalUnallocated: number = 0.0 ;

  unallocated_cash_receipts: any ;
  url: string = "" ;

  constructor(private http:HttpClient){}
  
  detailReport(){
    
    this.detailInput.disable() ;
    
    let fd = this.detailInput.get('fromDate').value ; /// actual fuctionality
    let td = this.detailInput.get('to_Date').value  ; /// actual fuctionality
    console.log("Start " + fd + " " + "End " + td ) ; // 2000-10-07&2019-10-07

    // let url = apiURL + "receipt-listing/" + '14-Jan-2019' + "&" + 'LOBA' + "&" + 106 + "&" + 'SHLA' ; // dbg. dummy functionality
    let url = apiURL + "/paypoint-reports/unallocated-cash-receipts/" + fd + "&" + td ; /// actual fuctionality

    const httpOptions ={
      headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
     }
   this.http.get(url, httpOptions)

    .subscribe(
      
        (response)=>{ this.unallocated_cash_receipts = response ; }

      , err => this.handleError(err)

      , () => this.sums() 
    );

  }

  print(){
    // Print-handler functionality
    console.log("Printing...") ; //
  }

  private handleError(error:Response){
    console.log(error);
    return Observable.throw('server error');
  }

  private sums(){

    if ( this.unallocated_cash_receipts.length == 0 ) // Error handling. Put all-else in ELSE part
    {
      this.detailInput.enable() ;

      console.log("[No Matching Data Found]" ) ;

      window.alert("[No Matching Data Found]" ) ;
    }
    else // bgn: Actual Data Functionality
    {
      
    // Dummy Data from THITOE2
    // this.unallocated_cash_receipts =  [
    //   {"receipt_no": 340541, "bobi_rec_no": "----", "pay_mode": "ESO(Semi-Electronic)","paypoint_id": 219, "pay_point_name":"MOTOR CENTRE BOTSWANA", "paypoint_due_date":"01-JAN-2019", "branch": "GABORONE HEAD OFFICE", "rcpt_date": "03-01-2019", "rcpt_date_1": "03-01-2019", "no_of_days": 155, "gross_amount": 146778.82, "receipt_amount": 142669.01, "allocated_amount": 146778.82, "status": "P", "temp_value": 1, "start_date": "01-01-2019", "end_date": "31-01-2019" },
    //   {"receipt_no": 340543, "bobi_rec_no": "----", "pay_mode": "ESO(Electronic)", "paypoint_id":1044, "pay_point_name":"BCL LIQUIDATION ", "paypoint_due_date":"01-JAN-2019", "branch": "GABORONE HEAD OFFICE", "rcpt_date": "03-01-2019", "rcpt_date_1": "03-01-2019", "no_of_days": 155, "gross_amount": 65902.98, "receipt_amount": 64255.41, "allocated_amount": 65902.98, "status": "P", "temp_value": 1, "start_date": "01-01-2019", "end_date": "31-01-2019" },
    //   {"receipt_no": 340567, "bobi_rec_no": "----", "pay_mode": "GSO", "paypoint_id":513, "pay_point_name":"GSO-PERMANENT","paypoint_due_date":"01-JAN-2019", "branch": "GABORONE HEAD OFFICE", "rcpt_date": "03-01-2019", "rcpt_date_1": "03-01-2019", "no_of_days": 155, "gross_amount": 1262.95, "receipt_amount": 1262.95, "allocated_amount": 1262.95, "status": "P", "temp_value": 1, "start_date": "01-01-2019", "end_date": "31-01-2019" },
    //   {"receipt_no": 340596, "bobi_rec_no": "----", "pay_mode": "ESO(Semi-Electronic)", "paypoint_id":2035, "pay_point_name":"BOTSWANA EXAMINATIONS COUNCIL", "paypoint_due_date":"01-JAN-2019", "branch": "GABORONE HEAD OFFICE", "rcpt_date": "03-01-2019", "rcpt_date_1": "03-01-2019", "no_of_days": 155, "gross_amount": 62160.82, "receipt_amount": 60606.8, "allocated_amount": 62160.82, "status": "P", "temp_value": 1, "start_date": "01-01-2019", "end_date": "31-01-2019" },
    //   {"receipt_no": 340702, "bobi_rec_no": "----", "pay_mode": "ESO(Electronic)", "paypoint_id":4036, "pay_point_name":"TSABONG ADMINISTRATIVE AUTHORITY PERMANENT","paypoint_due_date":"01-JAN-2019", "branch": "GABORONE HEAD OFFICE", "rcpt_date": "03-01-2019", "rcpt_date_1": "03-01-2019", "no_of_days": 155, "gross_amount": 119714.98, "receipt_amount": 113729.23, "allocated_amount": 119714.98, "status": "P", "temp_value": 1, "start_date": "01-01-2019", "end_date": "31-01-2019" },
    //   {"receipt_no": 340709, "bobi_rec_no": "----", "pay_mode": "ESO(Electronic)", "paypoint_id":201,"pay_point_name": "AIR BOTSWANA", "paypoint_due_date":"01-JAN-2019", "branch": "GABORONE HEAD OFFICE", "rcpt_date": "03-01-2019", "rcpt_date_1": "03-01-2019", "no_of_days": 155, "gross_amount": 100101.77, "receipt_amount": 97599.23, "allocated_amount": 100101.77, "status": "P", "temp_value": 1, "start_date": "01-01-2019", "end_date": "31-01-2019" },
    //   {"receipt_no": 340713, "bobi_rec_no": "----", "pay_mode": "ESO(Semi-Electronic)", "paypoint_id":654,"pay_point_name": "ELEPHANT BACK SAFARIS","paypoint_due_date":"01-JAN-2019", "branch": "GABORONE HEAD OFFICE", "rcpt_date": "03-01-2019", "rcpt_date_1": "03-01-2019", "no_of_days": 155, "gross_amount": 15339.77, "receipt_amount": 14956.28, "allocated_amount": 15339.77, "status": "P", "temp_value": 1, "start_date": "01-01-2019", "end_date": "31-01-2019" },
    //   {"receipt_no": 340893, "bobi_rec_no": "----", "pay_mode": "ESO(Electronic)", "paypoint_id":574,"pay_point_name": "ELECTRONIC - FRANCISTOWN CITY COUNCIL - PERMANENT","paypoint_due_date":"01-JAN-2019", "branch": "GABORONE HEAD OFFICE", "rcpt_date": "04-01-2019", "rcpt_date_1": "04-01-2019", "no_of_days": 154, "gross_amount": 151973.1, "receipt_amount": 149037.4, "allocated_amount": 151973.1, "status": "P", "temp_value": 1, "start_date": "01-01-2019", "end_date": "31-01-2019" }
    // ]  ; 

      this.headerDetails = this.unallocated_cash_receipts[0] ; // track features common to all receipt items
      console.table( this.headerDetails ) ; // dbg. 

      this.receipt_status = "Allocated" ; /// frontEnd.status (bold tableCaption) is "Allocated":: What is backEnd field?

      this.totalAllocated = this.unallocated_cash_receipts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.allocated_amount)}, 0 ) ;
      this.totalGross = this.unallocated_cash_receipts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.gross_amount)}, 0 ) ;
      this.totalReceipt = this.unallocated_cash_receipts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.receipt_amount)}, 0 ) ;
      this.totalUnallocated = this.totalGross - this.totalAllocated ; 

      this.displayReport = true ;
      } // end: Actual Data Functionality
    }

  toggleDisplayReport()
  {
    this.displayReport = !this.displayReport ; // false

    this.detailInput.enable() ;
  }

}
