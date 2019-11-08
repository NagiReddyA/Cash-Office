import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { FormBuilder, FormArray } from '@angular/forms'; // form array things require FormGroup as well
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

import { HttpClient, HttpParams} from '@angular/common/http';
import { formatDate } from "@angular/common";

import {AdminService } from '../admin/admin.service';
import { Http, Response } from '@angular/http';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { PaypointComponent } from "./paypoint/paypoint.component"
import { AllocationsService } from "./allocations.service";
import { PagerService, GlobalServices } from './../../services/index';


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
  templateUrl: 'bank-stop-order-processing.component.html'
})
export class BankStopOrderProcessingComponent {

//  ---------------------------------------initial set up started-------------------------

bsopremiumdetails:any;
bnkAccDetails:FormGroup;
bnkStmtDetails:FormGroup;
paypointDetails:any;
bankdetailsstmt:any;

  
  myForm: FormGroup;

  // step 1 in invoking the form array 
  myForm1:FormGroup;

  constructor(private fb: FormBuilder,private http:HttpClient,private ads:AdminService,
    private modalService: BsModalService, private pms:AllocationsService,private pagerService: PagerService ) {

      this.bnkAccDetails = new FormGroup({
        paymentMode: new FormControl('', Validators.required),
        bankName: new FormControl('', Validators.required),
        creationDate: new FormControl(''),
        modifiedDate: new FormControl(''),
    
        bankStatementID: new FormControl(''),
        accountNo: new FormControl(''), // , Validators.required), // auto-filled
        accountDesc: new FormControl('') // , Validators.required) // auto-filled
    
      }) ;
    
      this.bnkStmtDetails = new FormGroup({
        statementNo: new FormControl(''),
        fromDate: new FormControl(''),
        openingBalance: new FormControl(''),
        reversalPeriod: new FormControl(''),
        branch: new FormControl(''),
        postingStatus: new FormControl(''),
        toDate: new FormControl(''),
        closingBalance: new FormControl(''),
        loginName: new FormControl('')
    
      }) ;
     
    
 

    }

  ngOnInit() {
    this.myForm = this.fb.group({
      corrections: this.fb.array([]),
      corrections1: this.fb.array([]),
      corrections2: this.fb.array([]),
    })

    this.fetchbanknames()

  }


 

  


  get correctionForms() {
    return this.myForm.get('corrections') as FormArray
  }

  get correctionForms1() {
    return this.myForm.get('corrections1') as FormArray
  }

  get correctionForms2() {
    return this.myForm.get('corrections2') as FormArray
  }


  addCorrection() {

    const correction = this.fb.group({ 
     // corTransType:[],
     corSelect:[],
     corTransType:[],
     corPeriod:[],
     corPolicyCode:[],
     corPolicyStatus:[],
     corPayer:[],
     corExceptedPremium:[],
     corAllocatedPremium:[]

     
      
    })

    this.correctionForms.push(correction);
    
  }
  deleteCorrection(i) {
    this.correctionForms.removeAt(i)
  }

   // form array for sundry

   addCorrection1() {

    const correction1 = this.fb.group({ 
     
      
      corSelectsun:[],
      corTransTypesun:[],
      corSundryDescription:[],
      corTransDatesun:[],
      corAllocatedAmntsun:[],
 
      
       
     })
 
     this.correctionForms1.push(correction1);
     
  }

  deleteCorrection1(i) {
    this.correctionForms1.removeAt(i)
  }


  addCorrection2() {

    const correction2 = this.fb.group({ 
     
      
      UCHECK:[],
      uTransactionType:[],
      uDescription:[],
      uperiod:[],
      uallocatedamount:[]
 
      
       
     })
 
     this.correctionForms2.push(correction2);
     
  }



  deleteCorrection2(i) {
    this.correctionForms2.removeAt(i)
  }


  // ------------------------------------initial setup ended---------------------------

  // serach by using bank stmt id 

  search(x){
    alert(x)
    this.getbankstmtdetails(x)
  }

 banknames:any
  //fetchbankdetails
   fetchbanknames(){
    this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/stmt/bankdetails')
    .subscribe(
      response => {
       console.log(response);
        
        this.banknames=response
     
       
       
      }, (error) =>{
        console.log(error);
     
    }
  
    
);
   }




  getbsopremium(stmtid){
  alert("bso premium")

    this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/bankstoporderprocessing/bsopremium?stmtid='+stmtid)
      .subscribe(
        response => {
         console.log(response);
          
          this.bsopremiumdetails=response
          console.log("fetching the bso premium details"+this.bsopremiumdetails[0])
          alert(this.bsopremiumdetails.length)
          //this.patchthebankstmtdetails()
          this.setPage(1)
         
        }, (error) =>{
          console.log(error);
       
      }
    
      
  );
    
  }


  // used for fetching all the basic details about  bank statement details
  getbankstmtdetails(stmtid){
     
    this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/bankstoporderprocessing/bankstmtdetails?stmtid='+stmtid)
      .subscribe(
        response => {
         console.log(response);
          
          this.bankdetailsstmt=response
          console.log("fetching the bank statement "+this.bankdetailsstmt[0])
          this.patchthebankstmtdetails()
          this.getbsopremium(stmtid)
          this.getbsosundry(stmtid)
          this.getbsounspecified(stmtid)
          
         
        }, (error) =>{
          console.log(error);
       
      }

      
    
      
  );

 

  }


  //fetching sundry details 


   bsosundry:any;
   getbsosundry(bankstmtcode){

    let sundry = bankstmtcode;

    alert("calling sundry"+sundry)

   
   this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/stmt/sundry?Bankstmtexclusionssundry1='+sundry)
     .subscribe(
       (response) => {
         //console.log(response);
         
         this.bsosundry=response
         alert("length-->"+this.bsosundry.length)
         console.log(this.bsosundry[0].aLLOCATED_AMOUNT+"this details are coming from sundry")
         this.setPage1(1)
       }, (error) =>{
         console.log(error);
         
       }
     
 );


 }

  bsounspecified:any;
  // unspecified api call 
  getbsounspecified(bankstmtcode){

    let unspecified = bankstmtcode;
  
   
   this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/stmt/unspecified?Bankstmtexclusionsunspecified='+unspecified)
     .subscribe(
       response => {
         console.log(response);
         
         this.bsounspecified=response;
         console.log(this.bsounspecified.length+"---->length")
         this.setPage2(1)
       
       }, (error) =>{
         console.log(error);
         
     }
   
     
  );
  
  
  }



  bsopcodeperiod:any;
  //fetch the policy details using policy code and period

  fetchpolicydetailsbypcodeperiod(i){
    alert(i)
   var  period:Date = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
   var policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;
    alert(period)
   if(period ==null || policycode ==null ){
     alert("period and policy code both are required")
   }else{
     alert("now we can fetch required details")

     this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/bankstoporderprocessing/bsopcodeperiod?policycode=${policycode}&period=${period}`)
     .subscribe(
       response => {
         console.log(response);
         
         this.bsopcodeperiod=response;
         console.log(this.bsopcodeperiod.length+"---->length")
        
       
       }, (error) =>{
         console.log(error);
         
     }
   
     
  );
   }

  }

  insertbsopremium:any;

  // by using this we can push the data to a array
  oncheck(i){

    alert("we enter into hdr")
    alert(this.insertbsopremium.length+"----length")
    
    var  transcationtype:Date = (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').value;
    var  period:Date = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
    var policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;
    var  policystatus:Date = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyStatus').value;
    var  payor = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayer').value;
    
    var  exceptedpremium = (<FormArray>this.myForm.controls['corrections']).at(i).get('corExceptedPremium').value;
    var  allocatedamount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedPremium').value;
    

    //below code is used when we check and uncheck the data 
  
    if(this.insertbsopremium.length >0){
  
      for(let i=0;i<this.insertbsopremium.length;i++){
         
            
  
        if(this.insertbsopremium[i].policyCode==policycode){
          alert("removing")
          this.insertbsopremium.splice(i,1)
        }
      
       }
  
    } else{

    
      
      var obj = {}
      obj["bkTransactionType"] = transcationtype
      obj["period"] = period
      obj["policyCode"] = policycode
      obj["policyStatusId"] = policystatus
      obj["payor"] = payor
      obj["expectedPremium"] = exceptedpremium
      obj["allocatedAmount"] = allocatedamount

    
      
      this.insertbsopremium.push(obj);
  
      alert("size of todet array --->"+this.insertbsopremium.length)
    
    }
  


  }


  pager: any = {};
  pagedItems: any[];
  pager1: any = {};
  pagedItems1: any[];
  pager2: any = {};
  pagedItems2: any[];

  // this set page is for bso bsopremium
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.bsopremiumdetails.length, page, 10);

    // get current page of items
    this.pagedItems = this.bsopremiumdetails.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
 

  // this set page is for bso sundry
  setPage1(page1: number) {
    if (page1 < 1 || page1 > this.pager1.totalPages) {
      return;
    }
    // get pager object from service
    this.pager1 = this.pagerService.getPager(this.bsosundry.length, page1, 10);

    // get current page of items
    this.pagedItems1 = this.bsosundry.slice(this.pager1.startIndex, this.pager1.endIndex + 1);
  }


  // this set page is for bso unspecified
  setPage2(page2: number) {
    if (page2 < 1 || page2 > this.pager2.totalPages) {
      return;
    }
    // get pager object from service
    this.pager2 = this.pagerService.getPager(this.bsounspecified.length, page2, 10);

    // get current page of items
    this.pagedItems2 = this.bsounspecified.slice(this.pager2.startIndex, this.pager2.endIndex + 1);
  }




  // patch the result object which has camed from api calls 

  patchthebankstmtdetails(){

    this.bnkAccDetails.patchValue({
                   
      paymentMode: this.bankdetailsstmt[0].paymentmode,
  
    
      accountNo:this.bankdetailsstmt[0].accountnumber,
      accountDesc: this.bankdetailsstmt[0].description,
        bankName: this.bankdetailsstmt[0].bankname,
      creationDate: this.bankdetailsstmt[0].creationdate,
      modifiedDate: this.bankdetailsstmt[0].modifieddate,
     
     
    })
  
    this.bnkStmtDetails.patchValue({
  
      statementNo:this.bankdetailsstmt[0].bankstatementnumber,
      fromDate:this.bankdetailsstmt[0].stmtstartdate,
      openingBalance:this.bankdetailsstmt[0].openingbalance,
      reversalPeriod:this.bankdetailsstmt[0].closingbalance,
      branch:this.bankdetailsstmt[0].capaturebybranch,
      postingStatus:this.bankdetailsstmt[0].postingstatus,
      toDate:this.bankdetailsstmt[0].stmtenddate,
      closingBalance:this.bankdetailsstmt[0].closingbalance,
      loginName:this.bankdetailsstmt[0].capatureby
  
    })




  }













}
