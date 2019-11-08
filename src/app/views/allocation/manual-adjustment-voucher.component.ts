// Manual Adjustment Voucher - Allocation Module

import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { AllocationsService } from "./allocations.service";
import { Http, Response } from '@angular/http';
import { HttpClient, HttpParams} from '@angular/common/http';
import{BiboComponent} from './bibo/Bibo.component'
import { formatDate } from "@angular/common";

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
  templateUrl: './manual-adjustment-voucher.component.html'
})
export class ManualAdjustmentVoucherComponent{


  bsModalRef: BsModalRef;
  today = new Date() ; 
  newTransInput:FormGroup;

  ngOnInit() {
    
    this.getreadingpostingdetails();
   
  }


  constructor(private http1: HttpClient,
    private modalService: BsModalService, private pms:AllocationsService ){
   
      this.newTransInput = new FormGroup({
        policyCode: new FormControl('', Validators.required),
        amount: new FormControl('', Validators.required),
        period: new FormControl(''),
        transType: new FormControl('', Validators.required),
        comments: new FormControl('', Validators.required),
    
        bnkStmtNo: new FormControl(''),
        maualadjvouncherid: new FormControl('')
    
      });

    }
    
    // reading records for posting  details
    postingdetails:any;
    getreadingpostingdetails(){

         this.pms.getpostingdetails().subscribe((bbb) =>
         {
          console.log(bbb);

          this.postingdetails = bbb;

  
  },
  (error) =>{
   
      alert("Problem with service. Please try again later!")
  }


);    
    }

    formattedDate:any;
// fetching bank statement number 
 gettingRecordPostingFromCheckEvent(r){

  alert("data coming from radio button event"+r.adjTransactionType)

  const format = 'yyyy-MM-dd';
  const locale = 'en-US';
   this.formattedDate = formatDate(r.period, format, locale);

  this.newTransInput.patchValue({
    
    policyCode:r.policyCode,
    amount    : r.amount,
    period:this.formattedDate,   
    transType: r.adjTransactionType,
    comments: r.comments,

    bnkStmtNo: r.bobiRefNumber,
    maualadjvouncherid:r.manualAdjId

  })
        
 }

 
// this code is used for pop up screen for bank statement number which is used for saving the details
select;
openModalWithComponent() {
  //console.log("modal call");
  this.bsModalRef = this.modalService.show(BiboComponent);
  this.bsModalRef.content.closeBtnName = 'Close';
  this.bsModalRef.content.onClose.subscribe(result => {
 
    
    alert(result);

    this.select = result;
    alert("selected value coming from entery component"+this.select)
    
  alert("patching popup bibo trnasction id to btstmt---->")
  this.popupbobivalue();

  })
}

   
//reading the values from pop up and patching it 

popupbobivalue(){
  this.newTransInput.patchValue({

    bnkStmtNo:this.select


  })

} 

// reading the patch values 
getcomments(){
  alert(this.newTransInput.value.comments)
}


// now upedating or saving the record 

postingrecords(p){
   
  let cashier= this.postingdetails.filter(app=>app.manualAdjId==p)
   if(cashier.length != 0){

    alert("you can post the details");

   } else{
     alert("you canot post because record is not saved");
   }


}

savingrecords(p){

  alert(p)
   
  let cashier= this.postingdetails.filter(app=>app.manualAdjId==p)
   if(cashier.length != 0){

    alert("for update --->"+cashier[0].manualAdjId)

    alert("record has been updated");

    let modifiedBy ="test"
     this.http1.put(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/manualadjustmentvoucher/unpostingstatus/updaterecord`,{

      "policyCode":this.newTransInput.value.policyCode,
      "adjTransactionType":this.newTransInput.value.transType,
      "period":this.newTransInput.value.period,
      "amount":this.newTransInput.value.amount,
      "comments":this.newTransInput.value.comments,
      "bobiRefNumber":this.newTransInput.value.bnkStmtNo,
      "modifiedBy":modifiedBy,
      "manualAdjId":this.newTransInput.value.maualadjvouncherid

     }).subscribe((result)=>{
       console.log(result)
     },(error)=>{
       console.log(error)
     })




   } else{
     alert("recored in saved mode");

      let createdby="test"
      let postedby ="test"
      let modifiedBy ="test"
      
     this.http1.post(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/manualadjustmentvoucher/unpostingstatus/saverecord`,{

      "policyCode":this.newTransInput.value.policyCode,
      "adjTransactionType":this.newTransInput.value.transType,
      "period":this.newTransInput.value.period,
      "amount":this.newTransInput.value.amount,
      "comments":this.newTransInput.value.comments,
      "postingStatus":"UNPOSTED",
      "createdBy":createdby,
      "bobiRefNumber":this.newTransInput.value.bnkStmtNo,
      "postedBy":postedby,
      "modifiedBy":modifiedBy

     }).subscribe((result)=>{
       console.log(result)
     },(error)=>{
       console.log(error)
     })




   }


}


  
clear(){
  window.location.reload() ;
  }

  exit(){   
    // Re-direct to app landing page
  window.location.href = "http://localhost:4200/#/dashboard" ;  }

  post(p){
    this.postingrecords(p);
  }


  save(s){
  
   this.savingrecords(s);

  }
  

}
