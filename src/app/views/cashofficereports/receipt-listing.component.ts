// Daily Receipt Listing - Cash Office Reports module
// Sample Listing - Branch 106 Office LOBA 14-Jan-2019 Cashier SHLA

import { Component, NgModule, OnInit } from '@angular/core';
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
  // selector: 'app-user-management',
  templateUrl: './receipt-listing.component.html'
})
export class ReceiptListingComponent {

  listingInput = new FormGroup({
    branchCode: new FormControl('', Validators.required),
    cashOfficeCode: new FormControl('', Validators.required),
    cashierCode: new FormControl('', Validators.required),
    reportDate: new FormControl('2019-01-14', Validators.required)
  });

  branchCodes :any;
  
  cashierCodes: any ;
  cashOfficeCodes :any;
  
  displayReport = false ;
  
  receipts : any ;

  today = new Date() ;
  totalGrand: number = 0.0 ;
  totalPayment: number = 0.0 ;
  totalStatus: number = 0.0 ;


  url : string;

  constructor(private http:HttpClient){}

  ngOnInit() {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responseType': 'application/json' })
    }
    this.url = apiURL + "/cor_collection-branch/"
    this.http.get(this.url, httpOptions)
      .subscribe((response) => {
        const obj = response;

        this.branchCodes = obj;

      }
        , err => this.handleError(err));
  }

  getCashierCodes(){

    let bc = this.listingInput.get('branchCode').value ;
    // let coc = this.listingInput.get('cashOfficeCode').value ; 

    const httpOptions ={
      headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
     }
   this.url = apiURL + "/cor_collection-branch/cashier-codes/" + bc ; //+ "&" + coc ;
   this.http.get(this.url,httpOptions)
    .subscribe((response)=>{
      const obj = response;
      
      this.cashierCodes = obj; 

    }
    ,err => this.handleError(err));
  }

  getCashOfficeCodes(){

    const httpOptions ={
      headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
     }
   this.url = apiURL + "/cor_collection-branch/cash-office-codes/" + this.listingInput.get('branchCode').value ;
   this.http.get(this.url,httpOptions)
    .subscribe((response)=>{
      const obj = response;
      
      this.cashOfficeCodes = obj; 

    }
    ,err => this.handleError(err));
  }
  
  onSubmit(){
   
      console.table(this.listingInput.value) ; // dbg.

      let bc = this.listingInput.get('branchCode').value ;
      let cc = this.listingInput.get('cashierCode').value ;
      let coc = this.listingInput.get('cashOfficeCode').value ;
      let rd = this.listingInput.get('reportDate').value ;

      // receipt-listing/{receipt_date}&{cash_office_id}&{branch_code}&{cashier_code}
      let url = apiURL + "/cor_receipt-listing/" + rd + "&" + coc + "&" + bc + "&" + cc ;

      const httpOptions ={
        headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
      }

      this.http.get(url, httpOptions)

      .subscribe(
        
          (response)=>{ this.receipts = response ; }

        , err => this.handleError(err)

        , () => this.sums() 
      );

    }

  // }

  private handleError(error:Response){
    console.log(error); // dbg. 
    return Observable.throw('server error');
  }

  private sums(){

    if ( this.receipts.length == 0 ) // do error handling. Put all-else in ELSE part
    {
      console.log("No Receipts captured" ) ;

      window.alert("No Receipts captured" ) ;
    }
    // else 
    // { // open else
      //// bgn: dummy data

    this.receipts = [
      {
        "receipt_no": "342130",
        "receipt_date": "14-jan-19",
        "received_from": "kagiso pule",
        "pay_method_id": "1",
        "receipt_amount": "1937.94",
        "pay_method_code": "chq",
        "pay_method_desc": "cheque",
        "branch_code": "106",
        "cash_office_id": "4",
        "cash_office_code": "loba",
        "cash_office_desc": "lobatse",
        "posting_status": "p",
        "posting_reference": "",
        "branch_name": "lobatse branch",
        "app_id": "3",
        "app_code": "tpol",
        "app_desc": "policy",
        "rcpt_all_id": "324446",
        "rcpt_trn_id": "324275",
        "rec_allocated_amount": "1937.94",
        "reallocation_status": "n",
        "app_activity_id": "3",
        "app_activity_code": "gn",
        "app_activity_desc": "credit class premiums",
        "period": "01-nov-18",
        "policy_code": "110497980",
        "payor": "kagiso pule",
        "product_code": "",
        "paypoint_id": "",
        "paypoint_name": "",
        "loan_type": "",
        "deal_number": "",
        "units_encashed": "",
        "act_allocated_amount": "296.94",
        "cashier_id": "60",
        "cashier_code": "shla",
        "cashier_name": "shirley hlalele",
        "reference_number": "0000",
        "reference_date": "14-jan-19",
        "drawee": "kagiso pule"
      },
      {
        "receipt_no": "342130",
        "receipt_date": "14-jan-19",
        "received_from": "kagiso pule",
        "pay_method_id": "1",
        "receipt_amount": "1937.94",
        "pay_method_code": "chq",
        "pay_method_desc": "cheque",
        "branch_code": "106",
        "cash_office_id": "4",
        "cash_office_code": "loba",
        "cash_office_desc": "lobatse",
        "posting_status": "p",
        "posting_reference": "",
        "branch_name": "lobatse branch",
        "app_id": "3",
        "app_code": "tpol",
        "app_desc": "policy",
        "rcpt_all_id": "324446",
        "rcpt_trn_id": "324275",
        "rec_allocated_amount": "1937.94",
        "reallocation_status": "n",
        "app_activity_id": "3",
        "app_activity_code": "gn",
        "app_activity_desc": "credit class premiums",
        "period": "01-nov-18",
        "policy_code": "90646588",
        "payor": "kagiso pule",
        "product_code": "",
        "paypoint_id": "",
        "paypoint_name": "",
        "loan_type": "",
        "deal_number": "",
        "units_encashed": "",
        "act_allocated_amount": "349.04",
        "cashier_id": "60",
        "cashier_code": "shla",
        "cashier_name": "shirley hlalele",
        "reference_number": "0000",
        "reference_date": "14-jan-19",
        "drawee": "kagiso pule"
      },
      {
        "receipt_no": "342130",
        "receipt_date": "14-jan-19",
        "received_from": "kagiso pule",
        "pay_method_id": "1",
        "receipt_amount": "1937.94",
        "pay_method_code": "chq",
        "pay_method_desc": "cheque",
        "branch_code": "106",
        "cash_office_id": "4",
        "cash_office_code": "loba",
        "cash_office_desc": "lobatse",
        "posting_status": "p",
        "posting_reference": "",
        "branch_name": "lobatse branch",
        "app_id": "3",
        "app_code": "tpol",
        "app_desc": "policy",
        "rcpt_all_id": "324446",
        "rcpt_trn_id": "324275",
        "rec_allocated_amount": "1937.94",
        "reallocation_status": "n",
        "app_activity_id": "3",
        "app_activity_code": "gn",
        "app_activity_desc": "credit class premiums",
        "period": "01-dec-18",
        "policy_code": "110497980",
        "payor": "kagiso pule",
        "product_code": "",
        "paypoint_id": "",
        "paypoint_name": "",
        "loan_type": "",
        "deal_number": "",
        "units_encashed": "",
        "act_allocated_amount": "296.94",
        "cashier_id": "60",
        "cashier_code": "shla",
        "cashier_name": "shirley hlalele",
        "reference_number": "0000",
        "reference_date": "14-jan-19",
        "drawee": "kagiso pule"
      },
      {
        "receipt_no": "342130",
        "receipt_date": "14-jan-19",
        "received_from": "kagiso pule",
        "pay_method_id": "1",
        "receipt_amount": "1937.94",
        "pay_method_code": "chq",
        "pay_method_desc": "cheque",
        "branch_code": "106",
        "cash_office_id": "4",
        "cash_office_code": "loba",
        "cash_office_desc": "lobatse",
        "posting_status": "p",
        "posting_reference": "",
        "branch_name": "lobatse branch",
        "app_id": "3",
        "app_code": "tpol",
        "app_desc": "policy",
        "rcpt_all_id": "324446",
        "rcpt_trn_id": "324275",
        "rec_allocated_amount": "1937.94",
        "reallocation_status": "n",
        "app_activity_id": "3",
        "app_activity_code": "gn",
        "app_activity_desc": "credit class premiums",
        "period": "01-dec-18",
        "policy_code": "90646588",
        "payor": "kagiso pule",
        "product_code": "",
        "paypoint_id": "",
        "paypoint_name": "",
        "loan_type": "",
        "deal_number": "",
        "units_encashed": "",
        "act_allocated_amount": "349.04",
        "cashier_id": "60",
        "cashier_code": "shla",
        "cashier_name": "shirley hlalele",
        "reference_number": "0000",
        "reference_date": "14-jan-19",
        "drawee": "kagiso pule"
      },
      {
        "receipt_no": "342130",
        "receipt_date": "14-jan-19",
        "received_from": "kagiso pule",
        "pay_method_id": "1",
        "receipt_amount": "1937.94",
        "pay_method_code": "chq",
        "pay_method_desc": "cheque",
        "branch_code": "106",
        "cash_office_id": "4",
        "cash_office_code": "loba",
        "cash_office_desc": "lobatse",
        "posting_status": "p",
        "posting_reference": "",
        "branch_name": "lobatse branch",
        "app_id": "3",
        "app_code": "tpol",
        "app_desc": "policy",
        "rcpt_all_id": "324446",
        "rcpt_trn_id": "324275",
        "rec_allocated_amount": "1937.94",
        "reallocation_status": "n",
        "app_activity_id": "3",
        "app_activity_code": "gn",
        "app_activity_desc": "credit class premiums",
        "period": "01-jan-19",
        "policy_code": "110497980",
        "payor": "kagiso pule",
        "product_code": "",
        "paypoint_id": "",
        "paypoint_name": "",
        "loan_type": "",
        "deal_number": "",
        "units_encashed": "",
        "act_allocated_amount": "296.94",
        "cashier_id": "60",
        "cashier_code": "shla",
        "cashier_name": "shirley hlalele",
        "reference_number": "0000",
        "reference_date": "14-jan-19",
        "drawee": "kagiso pule"
      },
      {
        "receipt_no": "342130",
        "receipt_date": "14-jan-19",
        "received_from": "kagiso pule",
        "pay_method_id": "1",
        "receipt_amount": "1937.94",
        "pay_method_code": "chq",
        "pay_method_desc": "cheque",
        "branch_code": "106",
        "cash_office_id": "4",
        "cash_office_code": "loba",
        "cash_office_desc": "lobatse",
        "posting_status": "p",
        "posting_reference": "",
        "branch_name": "lobatse branch",
        "app_id": "3",
        "app_code": "tpol",
        "app_desc": "policy",
        "rcpt_all_id": "324446",
        "rcpt_trn_id": "324275",
        "rec_allocated_amount": "1937.94",
        "reallocation_status": "n",
        "app_activity_id": "3",
        "app_activity_code": "gn",
        "app_activity_desc": "credit class premiums",
        "period": "01-jan-19",
        "policy_code": "90646588",
        "payor": "kagiso pule",
        "product_code": "",
        "paypoint_id": "",
        "paypoint_name": "",
        "loan_type": "",
        "deal_number": "",
        "units_encashed": "",
        "act_allocated_amount": "349.04",
        "cashier_id": "60",
        "cashier_code": "shla",
        "cashier_name": "shirley hlalele",
        "reference_number": "0000",
        "reference_date": "14-jan-19",
        "drawee": "kagiso pule"
      },
      {
        "receipt_no": "342052",
        "receipt_date": "14-jan-19",
        "received_from": "radibanka wetshoemang",
        "pay_method_id": "2",
        "receipt_amount": "288.00",
        "pay_method_code": "csh",
        "pay_method_desc": "cash",
        "branch_code": "106",
        "cash_office_id": "4",
        "cash_office_code": "loba",
        "cash_office_desc": "lobatse",
        "posting_status": "p",
        "posting_reference": "",
        "branch_name": "lobatse branch",
        "app_id": "3",
        "app_code": "tpol",
        "app_desc": "policy",
        "rcpt_all_id": "324369",
        "rcpt_trn_id": "324198",
        "rec_allocated_amount": "288.00",
        "reallocation_status": "n",
        "app_activity_id": "3",
        "app_activity_code": "gn",
        "app_activity_desc": "credit class premiums",
        "period": "14-jan-19",
        "policy_code": "990716353",
        "payor": "radibankawetshoemang",
        "product_code": "",
        "paypoint_id": "",
        "paypoint_name": "",
        "loan_type": "",
        "deal_number": "",
        "units_encashed": "",
        "act_allocated_amount": "288.00",
        "cashier_id": "60",
        "cashier_code": "shla",
        "cashier_name": "shirley hlalele",
        "reference_number": "",
        "reference_date": "",
        "drawee": ""
      },
      {
        "receipt_no": "342010",
        "receipt_date": "14-jan-19",
        "received_from": "bantle kgosiemang-mp357809",
        "pay_method_id": "2",
        "receipt_amount": "50.00",
        "pay_method_code": "csh",
        "pay_method_desc": "cash",
        "branch_code": "106",
        "cash_office_id": "4",
        "cash_office_code": "4",
        "cash_office_desc": "loba",
        "posting_status": "p",
        "posting_reference": "p",
        "branch_name": "lobatse branch",
        "app_id": "7",
        "app_code": "gpl",
        "app_desc": "GROUP LIFE SYSTEM",
        "rcpt_all_id": "",
        "rcpt_trn_id": "324328",
        "rec_allocated_amount": "50.00",
        "reallocation_status": "n",
        "app_activity_id": "27",
        "app_activity_code": "GFP",
        "app_activity_desc": "GROUP FUNERAL PREMIUM RECEIPTS",
        "period": "31-dec-18",
        "policy_code": "",
        "payor": "",
        "product_code": "",
        "paypoint_id": "",
        "paypoint_name": "",
        "loan_type": "",
        "deal_number": "",
        "units_encashed": "",
        "act_allocated_amount": "50.00",
        "cashier_id": "60",
        "cashier_code": "shla",
        "cashier_name": "shla",
        "reference_number": "",
        "reference_date": "",
        "drawee": ""
      }
    ] ;
    
        //// end: dummy data

    this.totalGrand = this.receipts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.act_allocated_amount)}, 0 ) ;
    this.totalPayment = this.receipts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.act_allocated_amount)}, 0 ) ;
    this.totalStatus = this.receipts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.act_allocated_amount)}, 0 ) ;

    this.showGroupies();
    // }  // close else 
    
  }
  
  toggleDisplayReport(){
    this.displayReport = !this.displayReport ;
  }

  // dbg. dummy data for receipt items
  application = "Policy" ; // Group Life System, or Sundry Receipts

  // flag for print-preview data
  printPreview = false ;

  togglePrintPreview()
  {
    this.printPreview = ! this.printPreview ;

    // call pdf print preview pop up window here
  }

  ///////////////////////// Grouped Items 

  groupies: any;

  showGroupies() {
    // console.log( _.groupBy(this.receipts, "app_desc") ) ; // dbg
    this.groupies = _.groupBy(this.receipts, "receipt_no" ) ;

    this.displayReport = true ;
  }

  // policyCode total
  getSum(x: any): number {
    // console.log(x) ; // dbg
    return x.reduce(function (accumulator, currentValue) { return accumulator + parseFloat(currentValue.allocated_amount) }, 0);
  }

  // group by application
  getApps(x: any){
    return _.groupBy(x, "app_desc") ;
  }

  // group by policyCode
  getPolicies(k: any, x: any){
    let f: any = [] ;

    if ( k == "GROUP LIFE SYSTEM" ) // || k== "SUNDRY RECEIPTS")
    {
      console.log(x);

      console.log(k + " will not return anything") ;
      f = x ;
      console.log(f);
    }
    else 
    {
      // console.log(x);
      f = _.groupBy(x, "policy_code") ;
    }

    return f ; 
  }

}
