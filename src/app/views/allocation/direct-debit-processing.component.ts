// Direct Debit Processing - Allocation Module 

import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

import { FormBuilder, FormArray } from '@angular/forms'; // form array things require FormGroup as well

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
    ReactiveFormsModule

    , FormArray, FormBuilder
]
})

@Component({
  templateUrl: './direct-debit-processing.component.html'
})
export class DirectDebitProcessingComponent {

  bsModalRef: BsModalRef;
  today = new Date() ;
  bnkAccDetails:FormGroup;
  myForm: FormGroup;
  bankdetailsstmt:any;
  bankdetailsstmtexclusions:any;
  bankdetailsstmtsundry:any;
  bankdetailsstmtreversals:any;
  bankdetailsstmtunspecified:any;
  bnkStmtDetails:FormGroup;
  statusMessage:any;
   scc:any;
   scc1:any;
   scc2:any;
   scc3:any;
   scc4:any;
   kk:any;
   usergroup:any;
   test:any;
  selectedPaypoint: any;
  dde:FormGroup;
    dderow:any;
    // globally adding bank statstmt
    bankstmtcode:any;
    paypointDetails:any;
   policyexclusions :FormGroup;
   policyReversals:FormGroup;
     



  constructor(private fb: FormBuilder,private http:HttpClient,private ads:AdminService,private http1: Http,
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
    
  this.policyexclusions = new FormGroup({
        Period: new FormControl(''),
        PolicyCode: new FormControl(''),
        PolicyStatus: new FormControl(''),
        Payour: new FormControl(''),
        ExceptedPremium: new FormControl(''),
        AllocatedAmount:new FormControl('')

  });
       
       //Reversals
       this.policyReversals=new FormGroup({
       TranscationType:new FormControl(''),
       CPeriod: new FormControl(''),
       cPolicyCode: new FormControl(''),
       cPolicyStatus: new FormControl(''),
       cPayour: new FormControl(''),
       ccExceptedPremium: new FormControl(''),
       cAllocatedAmount: new FormControl(''),

      });


   }



   // array to add for transcation types 
DDE=['CRE','CRX']
Sundry=['CRE','CRX','LRE','LRX','UPR','UPX']
Unspecified=['CRE','CRX','LRE','LRX','UPR','UPX']
Reversals=['CRX']
Premium=['CRE']



  
  ngOnInit() {    
    

    
  
    //this.getres();    
    //this.getcheck();
     
  this.myForm = this.fb.group({
    corrections: this.fb.array([])
  })
    
  this.getpaypointname();
  
  }

  // paypoint mode and name 

  getpaypointname(){
    this.pms.getPayPointDetails().subscribe(
    
    response => {
     // console.log(response+"this data is coming from paypoint naveen details");
    
      this.paypointDetails = response;
      console.log("paypoint short name"+this.paypointDetails[0].pay_mode_short_name)
   
    },
    error => {
      alert("Error at fetching paypoint details");
    }
    )
    
    
  }



  // code for getting bank stmt details

  getALLBankAccountDetails(code){
  
    let Bankstmt1=code;
    
    this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/stmt?Bankstmt='+Bankstmt1)
      .subscribe(
        response => {
         // console.log(response);
          
          this.bankdetailsstmt=response
          console.log("fetching the bank statement "+this.bankdetailsstmt)
          this.fetchbankstmtdetails()
        }, (error) =>{
          console.log(error);
          this.statusMessage = "no record found with this bank statment id";
      }
    
      
  );
  }


  //reading dde details 
  ddedetailsbank:any
  getALLDDEDetails(code){
  
    let Bankstmt1=code;
    
    this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/stmt/ddedetails?Bankstmt='+Bankstmt1)
      .subscribe(
        response => {
          console.log(response);

          alert(response[0].bk_transaction_type+"this is fetching from dde details")

          let re = response[0].bk_transaction_type;
          alert("response data --->"+re)

            if(re==null){
                   // alert("inside if condition")
                    this.ddedetailsbank=null
            } 
            else{
              
              this.ddedetailsbank=response
           // alert("outside if condition")
      
            }
              

          this.fetchbankstmtdetails()
        }, (error) =>{
          console.log(error);
          this.statusMessage = "no record found with this bank statment id";
      }
    
      
  );
  }
  
  
  // code for fetching exclusions

  getALLBankAccountDetailsexclusions(bankstmtcode){

     let exclusions = bankstmtcode;
 
    
    this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/stmt/exclusions?Bankstmtexclusions='+exclusions)
      .subscribe(
        response => {
         // console.log(response);
          
          this.bankdetailsstmtexclusions=response;
          console.log(this.bankdetailsstmtexclusions[0]+"this details are fetching from exclusions ")
        }, (error) =>{
          console.log(error);
          this.statusMessage = "no record found with this bank statment id";
      }
    
      
  );


  }


   // code for fetching REVERSALS

   getALLBankAccountDetailsexclusionsREVERSALS(bankstmtcode){

    let REVERSALS = bankstmtcode;

   
   this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/stmt/DetReversals?BankstmtexclusionsDetReversals='+REVERSALS)
     .subscribe(
       response => {
         console.log(response);
         
         this.bankdetailsstmtreversals=response;
         console.log(this.bankdetailsstmtreversals[0]+"THIS IS REVERSAL COMING FROM DB")
         this.setPage(1);
       }, (error) =>{
         console.log(error);
         this.statusMessage = "no record found with this bank statment id";
     }
   
     
 );


 }

 pager: any = {};
  pagedItems: any[];

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.bankdetailsstmtreversals.length, page, 10);

    // get current page of items
    this.pagedItems = this.bankdetailsstmtreversals.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  // code for fetching sundry

  getALLBankAccountDetailsexclusionssundry(bankstmtcode){

    let sundry = bankstmtcode;

    alert("calling sundry"+sundry)

   
   this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/stmt/sundry?Bankstmtexclusionssundry1='+sundry)
     .subscribe(
       (response) => {
         //console.log(response);
         
         this.bankdetailsstmtsundry=response
         alert("sundry result from service call--->"+this.bankdetailsstmtsundry[0].bk_sundry_id)
         console.log(this.bankdetailsstmtsundry[0].aLLOCATED_AMOUNT+"this details are coming from sundry")
       }, (error) =>{
         console.log(error);
         this.statusMessage = "no record found with this bank statment id";
     }
   
     
 );


 }




 // code for fetching unspecified

 getALLBankAccountDetailsexclusionsunspecified(bankstmtcode){

  let unspecified = bankstmtcode;

 
 this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/stmt/unspecified?Bankstmtexclusionsunspecified='+unspecified)
   .subscribe(
     response => {
       //console.log(response);
       
       this.bankdetailsstmtunspecified=response;
       console.log(this.bankdetailsstmtunspecified[0]+"this details are coming from unspecified ")
       this.fetchbankstmtdetails()
     
     }, (error) =>{
       console.log(error);
       this.statusMessage = "no record found with this bank statment id";
   }
 
   
);


}



x:any;
x1:any;
x2:any;
x3:any;
x4:any;
x5:any;
x6:any


  element1(i){
   
   // getting the values from form array 
     this.x = (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').value;
     this.x1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPaypointCode').value;
    this.x2 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayPointName').value;
    this.x3 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corStrikeDate').value;
    this.x4 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corGrossAmnt').value;
    this.x5 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;
    this.x6= (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
    
    console.log("this value is coming from form array checkbox "+this.x);
    alert(this.x+"--------corTransType")
    alert(this.x1+"--------corPaypointCode")
    alert(this.x2+"--------corPayPointName")
    alert(this.x3+"--------corStrikeDate")
    alert(this.x4+"--------corGrossAmnt")
    alert(this.x5+"--------corAllocatedAmnt")
    alert(this.x6+"------period value")

    if(this.x6 == null){
      alert("period must be added ")
    }
    
  }


   //reversal 
   TranscationType1:any;
   CPeriod1:any;
   cPolicyCode1:any;
   cPolicyStatus1:any;
   cPayour1:any;
   ccExceptedPremium1:any;
   cAllocatedAmount1:any;

    

   reversalcheckboxvaluecapture(i) {
    this.TranscationType1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('ccTranscationType').value;
    this.CPeriod1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('CPeriod').value;
    this.cPolicyCode1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('cPolicyCode').value;
   this.cPolicyStatus1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('cPolicyStatus').value;
   this.cPayour1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('cPayour').value;
  this.ccExceptedPremium1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('ccExceptedPremium').value;
  this.cAllocatedAmount1= (<FormArray>this.myForm.controls['corrections']).at(i).get('cAllocatedAmount').value; 
   
   alert("coming fom reversal check box method"+ this.TranscationType1)
   alert( this.CPeriod1)
   alert( this.cPolicyCode1)
   alert(this.cPolicyStatus1)
   alert(this.cPayour1 )
   alert(this.ccExceptedPremium1)
   alert(this.cAllocatedAmount1)
   }

   reversalcheckbox(i){
    console.log("count"+1)
    //this.TranscationType1 = (<FormArray>this.myForm.controls['corrections']).at(0).get('ccTranscationType').value
    //console.log("countdata "+this.TranscationType1)
   this.reversalcheckboxvaluecapture(0)
  }


  



  corSelectsun1:any;
  corTransTypesun1:any;
  corSundryDescription1:any;
  corTransDatesun1:any;
  corAllocatedAmntsun1:any;


   sundrycheckboxvaluecapture(i) {

    //this.corSelectsun1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelectsun').value;
    this.corTransTypesun1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransTypesun').value;
    this.corSundryDescription1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corSundryDescription').value;
   this.corTransDatesun1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransDatesun').value;
   this.corAllocatedAmntsun1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmntsun').value;  
      
      alert("we are deals with sundry values"+this.corTransTypesun1)
      alert(this.corSundryDescription1)
      alert(this.corTransDatesun1)
      alert(this.corAllocatedAmntsun1)
   }
     
   

   


   sundrycheckbox(i){
           this.sundrycheckboxvaluecapture(i)
   }

    //post for sundry
    postforsundry(){
     
      alert("call post method of sundry ------->")
       if(this.corTransTypesun1==null){
  
        alert("required to filled transcation type");
  
       } else{
  
  
        if(this.bnkStmtDetails.value.postingStatus=='P' || this.bnkStmtDetails.value.postingStatus==null || this.bnkStmtDetails.value.postingStatus==undefined ){
          let ppp = this.bnkStmtDetails.value.postingStatus;
          alert("only unposted records can we added "+ppp);
        } else{
  
          this.http.post('http://192.168.1.58:9090/CashOffice-Test/api/allocations/sundry/post',
   {
   "bK_TRANSACTION_TYPE":this.corTransTypesun1,
    "bK_TRANSACTION_DESC":this.corSundryDescription1,
    "pERIOD":this.corTransDatesun1,
      "aLLOCATED_AMOUNT": this.corAllocatedAmntsun1,
      "bk_stmt_id": this.bankstmtcode
  
   }
   )
   .subscribe(
     (response) => {
       
      alert("record has been inserted")
      console.log("save method returns response"+response)
      // this.bankdetailsstmtreversalpost=response;
       
     //  console.log(this.bankdetailsstmtreversalpost)
       this.getALLBankAccountDetails(this.bankstmtcode)
       this.getALLBankAccountDetailsexclusionssundry(this.bankstmtcode);
      
     }, (error) =>{
       console.log(error);
   }
  
  
  );
  
  
  
  
  
  }
  
  
  
       }
  
  
  
  
  
  
  
    }

  // deleting sundry record

  deletesundryrecord(dde){

    let rv = dde

    alert("sundry record will be deleted by using its primary key id --->"+dde.bk_sundry_id)
    

    this.http.delete(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/dde/deletesundry?sundryid=${dde.bk_sundry_id}`)
    .subscribe(
      (response) => {
        console.log(response);

        alert(response);
        alert("succesfully record has been deleted")
        this.getALLBankAccountDetails(this.bankstmtcode)
        this.getALLBankAccountDetailsexclusionssundry(this.bankstmtcode)

       
      }, (error) =>{
        console.log(error)
    }
 
   
);



  }

 
 

 






 // bankdetailsstmtreversalpost:any

  postforreversal(){
     
    alert("call post method of reversals ------->")
     if(this.TranscationType1==null){

      alert("required to filled transcation type");

     } else{


      if(this.bnkStmtDetails.value.postingStatus=='P' || this.bnkStmtDetails.value.postingStatus==null || this.bnkStmtDetails.value.postingStatus==undefined ){
        let ppp = this.bnkStmtDetails.value.postingStatus;
        alert("only unposted records can we added "+ppp);
      } else{

        this.http.post('http://192.168.1.58:9090/CashOffice-Test/api/allocations/reversalposting/posting',
 {
  "aLLOCATED_AMOUNT": this.cAllocatedAmount1,
  "bK_TRANSACTION_TYPE": this.TranscationType1,
  "bk_stmt_id": this.bankstmtcode,
  "eXPECTED_PREMIUM": this.ccExceptedPremium1,
  "pAYOR": this.cPayour1,
  "pERIOD_FOR_REVERSALS": this.CPeriod1,
  "pOLICY_CODE":this.cPolicyCode1,
  "pOLICY_STATUS_ID": this.cPolicyStatus1

 }
 )
 .subscribe(
   (response) => {
     
    alert("record has been inserted")
    console.log("save method returns response"+response)
    // this.bankdetailsstmtreversalpost=response;
     
   //  console.log(this.bankdetailsstmtreversalpost)
     this.getALLBankAccountDetails(this.bankstmtcode)
     this.getALLBankAccountDetailsexclusionsREVERSALS(this.bankstmtcode);
    
   }, (error) =>{
     console.log(error);
 }


);





}



     }







  }


  //deleteing the record

  deletereversalrecord(dde){

    let rv = dde

    alert("reversal record will be deleted by --->"+dde.pAYOR+"-----"+dde.pOLICY_CODE+"--"+dde.eXPECTED_PREMIUM+"----"+dde.aLLOCATED_AMOUNT)
    

    this.http.delete(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/dde/deletereversal?pAYOR=${dde.pAYOR}&pOLICY_CODE=${dde.pOLICY_CODE}&eXPECTED_PREMIUM=${dde.eXPECTED_PREMIUM}&aLLOCATED_AMOUNT=${dde.aLLOCATED_AMOUNT}`)
    .subscribe(
      (response) => {
        console.log(response);

        alert(response);
        alert("succesfully record has been deleted")
        this.getALLBankAccountDetails(this.bankstmtcode)
        this.getALLBankAccountDetailsexclusionsREVERSALS(this.bankstmtcode)

       
      }, (error) =>{
        console.log(error)
    }
 
   
);



  }



   
  // getting the value from form array unspecified 
   unspecifiedvariable1:any;
   unspecifiedvariable2:any;
   unspecifiedvariable3:any;
   unspecifiedvariable4:any;
  elementunspecifiedvalues(i){
     
     this.unspecifiedvariable1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('uTransactionType').value;
     this.unspecifiedvariable2 = (<FormArray>this.myForm.controls['corrections']).at(i).get('uDescription').value;
     this.unspecifiedvariable3 = (<FormArray>this.myForm.controls['corrections']).at(i).get('uperiod').value;
     this.unspecifiedvariable4 = (<FormArray>this.myForm.controls['corrections']).at(i).get('uallocatedamount').value;
     alert(this.unspecifiedvariable1+"---"+this.unspecifiedvariable2+"----"+this.unspecifiedvariable3+"-----"+this.unspecifiedvariable4)
  }
    
   // delete dde record using allocated amount and gross amount
    
  //  dderecord(ga,aa){

  //   alert("this is my gross amount------->"+ga);
  //   alert("this is allocated amount--------->"+aa);
     
  //  }


   dderecorddeletedinfo:any;
   dderecorddeleted(ddg,dda){
    alert("this is my gross amount delete method is started------->"+ddg);

    this.http.delete(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/dde/deletedde?grossamount=${ddg}&allocatedamount=${dda}`)
    .subscribe(
      (response) => {
        console.log(response);

        alert(response);
        alert("succesfully record has been deleted")
        this.getALLBankAccountDetails(this.bankstmtcode)
       
      }, (error) =>{
        console.log(error)
    }
 
   
);






   }


  // code for posting the dde ;

postforDDE(){

  if(this.x == null || this.x1 == null || this.x2 == null || this.x3 == null || this.x4 == null || this.x5 == null || this.x6 == null || this.bnkStmtDetails.value.postingStatus=='p'){
      
    alert("all required fields need to be filled");


    if(this.x == null){
      alert("TRANSACTION TYPE should not be null");
    }

   if(this.x1 == null){
    alert("PAYPOINT CODE should not be null");
   }
  
   if(this.x2 == null){
    alert("PAYPOINT NAME should not be null");
   }

   if(this.x3 == null){
    alert("STRIKE DATE should not be null");
   }

   if(this.x4 == null){
    alert("GROSS AMOUNT should not be null");
   }

   if(this.x5 == null){
    alert("ALLOCATED AMOUNT should not be null");
   }
   
   if(this.x6 == null){
     alert("period should not be null")
   }
     
  

  } else{


    if(this.bnkStmtDetails.value.postingStatus=='P'){
      let ppp = this.bnkStmtDetails.value.postingStatus;
      alert("only unposted records can we added "+ppp);
    } else{

      alert("the following details will be posted to backend code ----")

  alert("bk_transaction_type----"+this.x)
  alert("period-------->"+this.scc4)
  alert(" ------period formatted-------> that we can use it "+this.formattedDate4)
  alert("paypoint_id------------>"+this.x1)
  alert("pay_point_name--------------->"+this.x2)
  alert("strike_date--------------->"+this.x3)
  alert("gross_amount--------------->"+this.x4)
  alert("allocated_amount--------------->"+this.x5)
  alert("bank_stmt_id--------------->"+this.bankstmtcode)

  alert("the following details will be posted to backend code because the posting status is unposted ")


  this.http.post('http://192.168.1.58:9090/CashOffice-Test/api/allocations/dde',
 {
  "bk_transaction_type":this.x,
  "period": this.scc4,
  "paypoint_id":this.x1,
  "pay_point_name":this.x2,
  "strike_date":this.x3,
  "gross_amount":this.x4,
  "allocated_amount":this.x5,
  "bank_stmt_id":this.bankstmtcode
 })
      .subscribe(
        response => {
          console.log(response);
         console.log("save method returns response")
          this.bankdetailsstmt=response;
          console.log(this.bankdetailsstmt);
          this.getALLBankAccountDetails(this.bankstmtcode);
         
        }, (error) =>{
          console.log(error);
          this.statusMessage = "no record found with this bank statment id";
      }
   
     
 );
  alert("calling get method for dde with bankstament code----->"+this.bankstmtcode)
 
  this.myForm.reset();
  this.x=null;
  this.x1=null;
  this.x2=null;
  this.x3=null;
  this.x4=null;
  this.x5=null;
  this.x6=null;

    }

    




    }
}



// post to unspecified

postforunspecified(){
   
  alert("calling postforunspecified method")

  let bankstmtnumber = this.bnkAccDetails.value.bankStatementID

  alert("this bankstmt number is coming from post unspecified"+bankstmtnumber)

  if(this.unspecifiedvariable1 == null || this.unspecifiedvariable2 == null || this.unspecifiedvariable3 == null || this.unspecifiedvariable4 == null || bankstmtnumber == null){
      
    alert(" all details need to be  filled ")

    if(this.unspecifiedvariable1 == null){
      alert(" Transcation type cannot be null")
    }

    if(this.unspecifiedvariable2 == null){
      alert(" Description cannot be null")
    }

    if(this.unspecifiedvariable4 == null){
      alert(" allocated amount cannot be null")
    }

  }else {

    let BK_TRANSACATION_TYPE = this.unspecifiedvariable1;
    let DESCRIPTION = this.unspecifiedvariable2;
    let PERIOD = this.unspecifiedvariable3;
    let ALLOCATED  = this.unspecifiedvariable4
    this.http.post('http://192.168.1.58:9090/CashOffice-Test/api/allocations/unspecified/post',
   {
    "bK_TRANSACTION_TYPE":BK_TRANSACATION_TYPE ,
    "pERIOD": PERIOD,
    "aLLOCATED_AMOUNT": ALLOCATED,
    "bK_TRANSACTION_DESC": DESCRIPTION,
    "bk_stmt_id": bankstmtnumber
  
   })
        .subscribe(
          response => {
            console.log(response)
            alert(response)
            this.getALLBankAccountDetails(this.bankstmtcode);
            this.getALLBankAccountDetailsexclusionsunspecified(this.bankstmtcode);
           
          }, (error) =>{
            console.log(error);
            this.statusMessage = "no record found with this bank statment id";
        }
     
       
    );
  

  }

 
}


unspecifieddelete(dde){
  alert("bank stmt unspecified primary key ----->"+dde.bK_STMT_DET_UNSP_ID)
   

  this.http.delete(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/dde/deleteunspecified?bK_STMT_DET_UNSP_ID=${dde.bK_STMT_DET_UNSP_ID}`)
    .subscribe(
      (response) => {
        console.log(response);

        alert(response);
        alert("succesfully record has been deleted")
        this.getALLBankAccountDetails(this.bankstmtcode)
        this.getALLBankAccountDetailsexclusionsunspecified(this.bankstmtcode)
       
      }, (error) =>{
        console.log(error)
    }
 
   
);
 


}


  fetchbankstmtdetails(){
           this.scc = this.bankdetailsstmt[0].creation_date;
          console.log("creation_DATE"+"------"+this.scc);

          this.scc1 = this.bankdetailsstmt[0].modified_datetime;
          console.log("modified_DATETIME"+"------"+this.scc1);

          this.scc2 = this.bankdetailsstmt[0].stmt_start_date;
          console.log("stmt_START_DATE"+"------"+this.scc2);


          this.scc3 = this.bankdetailsstmt[0].stmt_end_date;
          console.log("stmt_END_DATE"+"------"+this.scc3);

          this.scc4 = this.bankdetailsstmt[0].period_for_reversals;
          console.log("period_FOR_REVERSALS"+"------"+this.scc4);
 
           // assiging date pipe 

        

          this.bnkAccDetails.patchValue({
                   
            paymentMode: this.bankdetailsstmt[0].payment_mode,

          
            accountNo:this.bankdetailsstmt[0].account_number,
            accountDesc: this.bankdetailsstmt[0].description,
              bankName: this.bankdetailsstmt[0].pay_point_name,
            creationDate: this.bankdetailsstmt[0].creation_date,
            modifiedDate: this.bankdetailsstmt[0].modified_datetime,
           
           
          })

          this.bnkStmtDetails.patchValue({

            statementNo:this.bankdetailsstmt[0].bank_stmt_nummber,
            fromDate:this.bankdetailsstmt[0].stmt_start_date,
            openingBalance:this.bankdetailsstmt[0].stmt_opening_balance,
            reversalPeriod:this.bankdetailsstmt[0].period_for_reversals,
            branch:this.bankdetailsstmt[0].captured_by_branch,
            postingStatus:this.bankdetailsstmt[0].posting_status,
            toDate:this.bankdetailsstmt[0].stmt_end_date,
            closingBalance:this.bankdetailsstmt[0].stmt_closing_balance,
            loginName:this.bankdetailsstmt[0].captured_by





          })

         //  code used for formatting the date 
          const format = 'dd-MM-yyyy';
          const locale = 'en-US';
           this.formattedDate = formatDate(this.scc, format, locale);
          this.formattedDate1 = formatDate(this.scc1, format, locale);
           this.formattedDate2 = formatDate(this.scc2, format, locale);
            this.formattedDate3 = formatDate(this.scc3, format, locale);
           this.formattedDate4 = formatDate(this.scc4, format, locale);
          
        this.bnkAccDetails.controls['creationDate'].setValue(this.formattedDate);
        this.bnkAccDetails.controls['modifiedDate'].setValue(this.formattedDate1);
        this.bnkStmtDetails.controls['fromDate'].setValue(this.formattedDate2);
         this.bnkStmtDetails.controls['toDate'].setValue(this.formattedDate3);
        //this.bnkStmtDetails.controls['reversalPeriod'].setValue(this.scc4.substring(0, 10));

        if(this.scc4==null){
          this.bnkStmtDetails.controls['reversalPeriod'].setValue('');
        }
        else{
          this.bnkStmtDetails.controls['reversalPeriod'].setValue(this.formattedDate4);
        }
          
      //  reading bank statment id 

      // let id =  this.bnkStmtDetails.get('bankStatementID').value
      // console.log(id+"-----------------------")
// this.period=this.bnkStmtDetails.get('reversalPeriod').value;

 
        }

        formattedDate:any;
        formattedDate1:any;
        formattedDate2:any;
        formattedDate3:any;
        formattedDate4:any;
 
period:any;

   get correctionForms() {
    return this.myForm.get('corrections') as FormArray
   }

  addCorrection() {

    const correction = this.fb.group({ 

      // DDE/EFT
      corSelect:[], 
      corTransType: [],
      corPeriod: [],
      corPaypointCode: [],
      
      corPayPointName: [],
       corStrikeDate:[],
      corGrossAmnt: [],
      
      corAllocatedAmnt: [],

      //POLICY EXCLUSIONS
        check:[],
        Period:[],
        PolicyCode:[],
        PolicyStatus:[],
        Payour:[],
        ExceptedPremium:[],
        AllocatedAmount:[],

        //Reversals
        ccHeck:[],
        ccTranscationType:[],
        CPeriod:[],
        cPolicyCode:[],
        cPolicyStatus:[],
        cPayour:[],
        ccExceptedPremium:[],
        cAllocatedAmount:[],


          // sundry

          corSelectsun:[],
          corTransTypesun:[],
          corSundryDescription:[],
          corTransDatesun:[],
          corAllocatedAmntsun:[],

              //unspecified
            UCHECK:[],
              uTransactionType:[],
              uDescription:[],
              uperiod:[],
              uallocatedamount:[]


    })

    this.correctionForms.push(correction);
  }

  deleteCorrection(i) {
    this.correctionForms.removeAt(i) ;
  }

    
    // pop up details 
    
    openModalWithComponent() {
      //console.log("modal call");
      this.bsModalRef = this.modalService.show(PaypointComponent);
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.onClose.subscribe(result => {

        console.log("this my data"+result[0].paypoint_id)
        console.log("this my data"+result[0].payPoint_Name)
        this.selectedPaypoint = result[0];
        console.log("this my data 2 "+this.selectedPaypoint.paypoint_id)

   // corrections: this.fb.array([])
   this.patchValues(0)
   this.patchValuesreversal(0)

      })
    }
    openModalWithComponent1() {
      //console.log("modal call");
      this.bsModalRef = this.modalService.show(PaypointComponent);
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.onClose.subscribe(result => {

        console.log("this my data"+result[0].paypoint_id)
        console.log("this my data"+result[0].payPoint_Name)
        this.selectedPaypoint = result[0];
        console.log("this my data 2 "+this.selectedPaypoint.paypoint_id)

   // corrections: this.fb.array([])
  //  this.patchValues(0)
   this.patchValuesreversal(0)

      })
    }
 
// click event for patch value 

getpatch(){
 
  this.patchValuesunspecified(0);
}




   

   search(s){
   

    alert(s)
    this.bankstmtcode=s;
    this.getALLBankAccountDetails(s)
    //this.getALLDDEDetails(s)
  // this.getALLBankAccountDetailsexclusions(s);
 // this.getALLBankAccountDetailsexclusionsREVERSALS(s);
    //this.getALLBankAccountDetailsexclusionssundry(s);
    this.getALLBankAccountDetailsexclusionsunspecified(s);
   }


   // fetching all account details
   

 

    onSelectIngredient(event,i): void {
      // const formData = {
      //   ingredient_id: event.target.value
      // }
      // console.log(formData,i);
      // this.patchValues(event.target.value,i);
      console.log("this for reversals "+event.target.value);
    }
   
  clear(){    
    
    this.postforDDE();
  }


  // pop up the paypoint details
  patchValues(i) {
    let x = (<FormArray>this.myForm.controls['corrections']).at(i);
    console.log("this calling form "+x);
     
    x.patchValue({
      corPayPointName: this.selectedPaypoint.payPoint_Name,
      corPaypointCode:this.selectedPaypoint.paypoint_id,
     // corPeriod: this.bnkStmtDetails.value.reversalPeriod,

    });
  }


  // patch value used to unspecified period

  patchValuesunspecified(i) {
    let x = (<FormArray>this.myForm.controls['corrections']).at(i);
    console.log("this calling form "+x);
     
    x.patchValue({
     // uperiod: this.bnkStmtDetails.value.reversalPeriod,

    });
  }

  // patching for reversal paypoint id

  patchValuesreversal(i) {
    let x = (<FormArray>this.myForm.controls['corrections']).at(i);
    console.log("this calling form "+x);
     
    x.patchValue({

     cPolicyCode:this.selectedPaypoint.paypoint_id

    });
  }

  


  

  exit(){
    // Re-direct to app landing page
     window.location.href = "http://localhost:4200/#/dashboard" ;
    
  }
  
  print(){
    console.table(this.myForm.get('corrections').value) ; // dbg
  }

  element(i){
    console.log("count"+i)
    this.element1(0)
  }


  elementunspecified(i){

    console.log("calling unspecified values")
    
     
          this.elementunspecifiedvalues(0);
  }

  // code used to performe the various conditon post method
  ddedetails:Boolean;
  policyexclusion:Boolean;
   reversal:Boolean;
   sundry:Boolean;
   unspecified:Boolean;


   savedde(){
        
    this.ddedetails=true
    this.reversal=false
    this.sundry=false
    this.unspecified=false
     this.policyexclusion=false

     alert("ddde method calling ")
  }
  saveExclusions(){

    this.ddedetails=false
    this.policyexclusion=true
    this.reversal=false
    this.sundry=false
    this.unspecified=false

    alert("policy exclusion method calling ")
     
  }
  
  savereversal(){
    this.ddedetails=false
    this.policyexclusion=false
    this.reversal=true
    this.sundry=false
    this.unspecified=false
    alert("revesal calling")
  }

  savesundry(){
    this.ddedetails=false
    this.policyexclusion=false
    this.reversal=false
    this.sundry=true
    this.unspecified=false

    alert("sundry calling")
 
  }

  saveunspecified(){
    this.ddedetails=false
    this.policyexclusion=false
    this.reversal=false
    this.sundry=false
    this.unspecified=true

    alert("unspecified ")
    
  }

  
    
  save(){
    
     alert("we are calling save method----------><--------------")


     if(this.ddedetails){
       alert("we are calling dde post methoded")
     } 
     
     if(this.saveExclusions){
      alert("we are calling saveExclusions post methoded")
     }
       if(this.reversal){
      alert("we are calling reversal post methoded")
     }  
     if(this.sundry){
      alert("we are calling sundry post methoded")
     } 
     
     if(this.unspecified){
      alert("we are calling unspecified post methoded")
     }

 // this.postforDDE();
  // this.postforreversal();
  // this.postforsundry();
 // this.postforunspecified();
  }

  cancel(){
   
    // this.postforunspecified();

    }

}



