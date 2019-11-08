// REPRINT DEPOSIT SLIP

import { Component,NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

import { HttpClient, HttpHeaders } from '@angular/common/http' ;
import { Observable } from 'rxjs' ;

import * as _ from 'underscore' ;

import { apiURL } from '../../_nav' ;

@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule,
  Validators]
})

@Component({
  // selector: 'app-user-management',
  templateUrl: './deposit-slip.component.html'
})
export class DepositSlipComponent {

  depositNumber = new FormControl('', [ Validators.required, Validators.pattern("^[0-9]*$") ]) ;

  accountNumber : string = "001" ; // default/placeholder
  accountName : string = "BLIL" ; // default/placeholder

  cashSlips : any ;
  chequeSlips : any ;

  valueDate : string = "" ;
  reference : string = "" ;
  slips : any ;
  
  totalCash: number = 0.00 ;
  totalCheque: number = 0.00 ;

  constructor(private http:HttpClient){}

  exitReport(){
    // reload the page
    window.location.reload() ; // "http://localhost:4200/#/cashoffice-reports/deposit-slip" ;
  }

  viewReport(){

    // console.log('Receipt No. ' + this.depositNumber.value) ; // dbg.

    let dn = this.depositNumber.value ;

    let url = apiURL + "/cor_reprint-deposit/" + dn ;

    const httpOptions ={
      headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
     }

    this.http.get(url, httpOptions)

    .subscribe(
      
        (response)=>{ this.slips = response ; }

      , err => this.handleError(err)

      , () => this.sums() 
    );

  }

  private handleError(error:Response){
    console.log(error);
    return Observable.throw('server error');
  }

  private sums(){

    if ( this.slips.length == 0 ) // do error handling. Put all-else in ELSE part
    {
      console.log("There is no information for Slip No. " + this.depositNumber.value ) ;

      window.alert("There is no information for Slip No. " + this.depositNumber.value ) ;
    }
    else 
    {
// console.log( this.slips ) ; // dbg.

    // this.accountNumber = this.slips[0]. // /?
    // this.accountName = this.slips[0]. // /? 
    this.valueDate = this.slips[0].deposit_date ;
    this.reference = this.slips[0].branch_name ;

    this.cashSlips = this.filterApp( this.slips, "CSH") ;
    this.cashSlips.sort(function( a, b){ return parseFloat(a.deposited_amount) - parseFloat(b.deposited_amount) ;  } ).reverse() ;


    let chequeSlip = this.filterApp( this.slips, "CHQ").sortBy ;
    this.chequeSlips = _.sortBy(chequeSlip, 'received_from') ;

    this.totalCash = this.cashSlips.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.deposited_amount)}, 0 ) ;
    this.totalCheque = this.chequeSlips.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.deposited_amount)}, 0 ) ;

    this.displayReport = true ;
    }
    
  }

  // returns all items that have "filter" from the "list"
  filterApp(list, filter) { return list.filter(e=>e.pay_method_id.includes(filter));}

  displayReport = false ;

  toggleDisplayReport() { 
    this.displayReport = ! this.displayReport ;
  }

  printPreview = false ;

  togglePrintPreview()
  {
    this.printPreview = ! this.printPreview ;

    // call pdf print preview pop up window here
  }

  url : string ;
  
}
