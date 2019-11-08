// Sample Receipt Number: 2955 

import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
// import { ReceiptListingComponent } from './receipt-listing.component';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { apiURL } from '../../_nav' ;

@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule]
})

@Component({
  selector: 'reprint-receipt',
  templateUrl: './reprint-receipt.component.html'
})
export class ReprintReceiptComponent {

  receiptInput = new FormGroup({
    receiptNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$") ] ) 
  } ) ;

  branchCode : string = "" ;

  cashier : string = "" ;

  paymentType : string = "" ;
  
  receipt_date : string = "" ;
  receipts: any ; 
  received: string = "" ;

  sum : number = 0.0 ; 

  constructor(private http:HttpClient){}

  onSubmit(){

    let rn = this.receiptInput.get('receiptNumber').value ;

    let url = apiURL + "/cor_reprint-receipt/" + rn ;

    const httpOptions ={
      headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
     }
   this.http.get(url, httpOptions)

    .subscribe(
      
        (response)=>{ this.receipts = response ; }

      , err => this.handleError(err)

      , () => this.sums() 
    );

    this.displayReport = true ; // show container for the results

  }

  private handleError(error:Response){
    console.log(error);
    return Observable.throw('server error');
  }

  private sums(){

    this.branchCode = this.receipts[0].branch_code ;

    this.cashier = this.receipts[0].cashier_name ;

    this.paymentType = this.receipts[0].pay_method_code ;

    let rd = this.receipts[0].receipt_date ;
    this.receipt_date = rd.substring(0, rd.indexOf(" ") ) ; 

    this.received = this.receipts[0].received_from ;

    this.sum = this.receipts[0].receipt_amount ;
    
  }

  /////////////////////////////////////|\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  
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
  
}
