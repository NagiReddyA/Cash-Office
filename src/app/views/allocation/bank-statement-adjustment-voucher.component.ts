// Bank Statement Adjustment Voucher - Allocation Module

import { Component, NgModule, ɵConsole } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormBuilder, FormArray } from '@angular/forms'; // form array things require FormGroup as well
import { HttpClient, HttpParams} from '@angular/common/http';
import { IfStmt } from '@angular/compiler';


@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule,
    Validators
  
  , FormArray, FormBuilder]
})

@Component({
  templateUrl: 'bank-statement-adjustment-voucher.component.html'
})
export class BankStatementAdjustmentVoucherComponent {


  constructor(private fb: FormBuilder,private http:HttpClient) { }
      
  UNPOSTED:any="UNPOSTED";
  applicationcodes=['TPOL','ACL']
  Transcationtyps=['CRE','CRX','LRE','LRX','UPR','UPX']


     bankStmtId = new FormGroup({
      bankStatementID : new FormControl('')
     });

 

    bnkAccDetails = new FormGroup({
    paymentMode: new FormControl(''),
    creationDate: new FormControl(''),
    modifiedDate: new FormControl(''),
    bankName: new FormControl(''),
    accountNo: new FormControl(''),
    accountDesc: new FormControl('')

  }) ;
 
  bnkStmtDetails = new FormGroup({
    statementNo: new FormControl(''),
    fromDate: new FormControl(''),
    openingBalance: new FormControl(''),
    postingStatus: new FormControl(''),
    toDate: new FormControl(''),
    closingBalance: new FormControl(''),
    glPostingStatus: new FormControl(''),
    loginName: new FormControl(''),
    branch: new FormControl('')
  }) ;


  search(x){
      alert(x) 

      this.getbankstmtdetails(x)
     
  
  }


 bankstmtdetails:any;
 getbankstmtdetails(bankstmtid){
   alert(bankstmtid)

 this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/bankstmtadjustmentvoucher/bankstmtdetails?bankstmtid=${bankstmtid}`).subscribe((result)=>{
   console.log(result)
   this.bankstmtdetails=result;
   alert( this.bankstmtdetails)
   if(this.bankstmtdetails.length==0){
     alert("no statment details is found with this id ")
     this.creamount=0
     this.lreamount=0
     this.crxamount=0
     this.lrxamount=0
    }
  else{
    this.patchAccouctDeatils();
    this.getunspecifieddetails(bankstmtid);
   }
   
 },(error)=>{
   console.log(error) 
  
 })

 }


 unspecifieddetails:any
 // fetch unspecified details
 getunspecifieddetails(bankstmtid){
  alert(bankstmtid)

this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/bankstmtadjustmentvoucher/unspecifieddetails?bankstmtid=${bankstmtid}`).subscribe((result)=>{
  console.log(result)
  this.unspecifieddetails=result;
  this.creamount=0
  this.lreamount=0
  this.crxamount=0
  this.lrxamount=0
  this.gettotalamountcre();
  this.gettotalamountlre();
  this.gettotalamountcrx();
  this.gettotalamountlrx();
  this.getreallocationdetails(bankstmtid);
},(error)=>{
  console.log(error) 
 
})

}


reallocationdetails:any
// fetch unspecified details
getreallocationdetails(bankstmtid){
 alert(bankstmtid)

this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/bankstmtadjustmentvoucher/reallocation?bankstmtid=${bankstmtid}`).subscribe((result)=>{
 console.log(result)
 this.reallocationdetails=result;

 this.reallocatecreamount=0;
 this.reallocatelreamount=0;
 this.reallocatecrxamount=0;
 this.reallocatelrxamount=0;


 this.gettotalreallocamountcre();
 this.gettotalreallocamountlre();
 this.gettotalreallocamountcrx();
 this.gettotalreallocamountlrx();

 
},(error)=>{
 console.log(error) 

})

}

 // patching the bank statement details

  patchAccouctDeatils(){
    this.bnkAccDetails.patchValue({
   
      paymentMode:this.bankstmtdetails[0].paymentmode,
      creationDate:this.bankstmtdetails[0].creationdate,
      modifiedDate:this.bankstmtdetails[0].modifieddate,
      bankName:this.bankstmtdetails[0].bankname,
      accountNo:this.bankstmtdetails[0].accountnumber,
      accountDesc:this.bankstmtdetails[0].description
    })



    this.bnkStmtDetails.patchValue({

      statementNo:this.bankstmtdetails[0].bankstatementnumber,
      fromDate:this.bankstmtdetails[0].stmtstartdate,
      openingBalance:this.bankstmtdetails[0].openingbalance,
      postingStatus:this.bankstmtdetails[0].postingstatus,
      toDate:this.bankstmtdetails[0].stmtenddate,
      closingBalance:this.bankstmtdetails[0].closingbalance,
      glPostingStatus:this.bankstmtdetails[0].posttogl,
      loginName:this.bankstmtdetails[0].capatureby,
      branch:this.bankstmtdetails[0].capaturebybranch
       

    })


  }


  // caluclating the total unamount of different transcation types
  creamount:any;
  gettotalamountcre(){

      if(this.unspecifieddetails.length<=0 || this.unspecifieddetails=="" || this.unspecifieddetails==null ||this.unspecifieddetails==undefined){
        this.creamount=0;
      }else{

        let amount = 0 

        for(let i = 0 ; i<this.unspecifieddetails.length;i++){

          if(this.unspecifieddetails[i].bktranstype=="CRE"){
              
           let  specifiedcreamount = this.unspecifieddetails[i].allocatedamount

           amount= +amount + +specifiedcreamount

           this.creamount = +amount
       
          
          
          }

        }

      }

  
      alert("final amount to be displayed--->"+ +this.creamount)


  }


  lreamount:any;
  gettotalamountlre(){

      if(this.unspecifieddetails.length<=0 || this.unspecifieddetails=="" || this.unspecifieddetails==null ||this.unspecifieddetails==undefined){
        this.lreamount=0;
      }else{

        let amount = 0 

        for(let i = 0 ; i<this.unspecifieddetails.length;i++){

          if(this.unspecifieddetails[i].bktranstype=="LRE"){
              
           let  specifiedcreamount = this.unspecifieddetails[i].allocatedamount

           amount= +amount + +specifiedcreamount

           this.lreamount = +amount
           
           
          
          
          }

        }

      }

  
      alert("final amount to be displayed--->"+ +this.lreamount)


  }


  crxamount:any;
  gettotalamountcrx(){

      if(this.unspecifieddetails.length<=0 || this.unspecifieddetails=="" || this.unspecifieddetails==null ||this.unspecifieddetails==undefined){
        this.crxamount=0;
      }else{

        let amount = 0 

        for(let i = 0 ; i<this.unspecifieddetails.length;i++){

          if(this.unspecifieddetails[i].bktranstype=="CRX"){
              
           let  specifiedcreamount = this.unspecifieddetails[i].allocatedamount

           amount= +amount + +specifiedcreamount

           this.crxamount = +amount
          
          }

        }

      }

  
      alert("final amount to be displayed--->"+ +this.crxamount)


  }
 
  
  lrxamount:any;
  gettotalamountlrx(){

      if(this.unspecifieddetails.length<=0 || this.unspecifieddetails=="" || this.unspecifieddetails==null ||this.unspecifieddetails==undefined){
        this.lrxamount=0;
      }else{

        let amount = 0 

        for(let i = 0 ; i<this.unspecifieddetails.length;i++){

          if(this.unspecifieddetails[i].bktranstype=="LRX"){
              
           let  specifiedcreamount = this.unspecifieddetails[i].allocatedamount

           amount= +amount + +specifiedcreamount

           this.lrxamount = +amount
          
          }

        }

      }

  
      alert("final amount to be displayed--->"+ +this.lrxamount)


  }


  // caluclating the total unamount of different transcation types
  reallocatecreamount:any;
  gettotalreallocamountcre(){

      if(this.reallocationdetails.length<=0 || this.reallocationdetails=="" || this.reallocationdetails==null ||this.unspecifieddetails==undefined){
        this.reallocatecreamount=0;
      }else{

        let amount = 0 

        for(let i = 0 ; i<this.reallocationdetails.length;i++){

          if(this.reallocationdetails[i].transactionCode=="CRE"){
              
           let  specifiedcreamount = this.reallocationdetails[i].amount

           amount= +amount + +specifiedcreamount

           this.reallocatecreamount = +amount
       
          
          
          }

        }

      }

  
      alert("final realloc amount to be displayed--->"+ +this.reallocatecreamount)


  }

   
  reallocatelreamount:any;
  gettotalreallocamountlre(){

      if(this.reallocationdetails.length<=0 || this.reallocationdetails=="" || this.reallocationdetails==null ||this.unspecifieddetails==undefined){
        this.reallocatelreamount=0;
      }else{

        let amount = 0 

        for(let i = 0 ; i<this.reallocationdetails.length;i++){

          if(this.reallocationdetails[i].transactionCode=="LRE"){
              
           let  specifiedcreamount = this.reallocationdetails[i].amount

           amount= +amount + +specifiedcreamount

           this.reallocatelreamount = +amount
       
          
          
          }

        }

      }

  
      alert("final realloc amount to be displayed--->"+ +this.reallocatelreamount)


  }

  reallocatecrxamount:any;
  gettotalreallocamountcrx(){

      if(this.reallocationdetails.length<=0 || this.reallocationdetails=="" || this.reallocationdetails==null ||this.unspecifieddetails==undefined){
        this.reallocatecrxamount=0;
      }else{

        let amount = 0 

        for(let i = 0 ; i<this.reallocationdetails.length;i++){

          if(this.reallocationdetails[i].transactionCode=="CRX"){
              
           let  specifiedcreamount = this.reallocationdetails[i].amount

           amount= +amount + +specifiedcreamount

           this.reallocatecrxamount = +amount
       
          
          
          }

        }

      }

  
      alert("final realloc amount to be displayed--->"+ +this.reallocatecrxamount)


  }


  reallocatelrxamount:any;
  gettotalreallocamountlrx(){

      if(this.reallocationdetails.length<=0 || this.reallocationdetails=="" || this.reallocationdetails==null ||this.unspecifieddetails==undefined){
        this.reallocatelrxamount=0;
      }else{

        let amount = 0 

        for(let i = 0 ; i<this.reallocationdetails.length;i++){

          if(this.reallocationdetails[i].transactionCode=="CRX"){
              
           let  specifiedcreamount = this.reallocationdetails[i].amount

           amount= +amount + +specifiedcreamount

           this.reallocatelrxamount = +amount
       
          
          
          }

        }

      }

  
      alert("final realloc amount to be displayed--->"+ +this.reallocatelrxamount)


  }

 
  insertnewrecordtodet:any=[];
  insertRecordToInsertNewRecordToDet (i){


    alert(i)
  
    let application = (<FormArray>this.myForm.controls['corrections']).at(i).get('corApplication').value;
        
    let activity = (<FormArray>this.myForm.controls['corrections']).at(i).get('corActivity').value;
    let period = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
  
    let referencenumber = (<FormArray>this.myForm.controls['corrections']).at(i).get('corRefNo').value;
  
    let referencestatus = (<FormArray>this.myForm.controls['corrections']).at(i).get('corRefStatus').value;
    let payor = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayor').value;
    let transcationtype = (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').value;
    let amount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAmount').value;
   // var postingstatus= (<FormArray>this.myForm.controls['corrections']).at(i).get('corRPostingStatus').value;
   let postingstatus="U"
    
  
    //  alert(application)
    //  alert(activity)
    //  alert(period)
    //  alert(referencenumber)
    //  alert(referencestatus)
    //  alert(payor)
    //  alert(transcationtype)
    //  alert(amount)
     alert(postingstatus+"-------posting status")
    

  
     if(application==null || activity==null|| period==null  || referencenumber==null || referencestatus==null || payor==null || transcationtype==null || amount==null || postingstatus==null){
      alert("please filled the required details")
  
         if(application==null){
            alert(1)
         }

         if(activity==null){
          let activity = (<FormArray>this.myForm.controls['corrections']).at(i).get('corActivity').value;
          alert(2)
          alert("activity--->"+activity)
        }

        if(period==null){
          alert(3)
        }

        if(referencenumber==null ){
          alert(4)
        }

        if(referencestatus==null){
          alert(5)
        }

        if( payor==null){
          alert(6)
        }
        if(transcationtype==null){
          alert(7)
        }

        if(amount==null){
          alert(8)
        }
         if(postingstatus==null){
          alert(9)
         }
  
      
  
     } else{
          
      if(this.insertnewrecordtodet.length>0){
        for(let i=0;i<this.insertnewrecordtodet.length;i++){
          alert("we enter into removing stage ")
  
          alert(this.insertnewrecordtodet[i].referenceNo)
          alert(referencenumber)
          alert(this.insertnewrecordtodet[i].referenceNo==referencenumber)
  
  
          if(this.insertnewrecordtodet[i].referenceNo==referencenumber){
            alert("removing")
            this.insertnewrecordtodet.splice(i,1)
          }
  
          alert("size of the arry "+this.insertnewrecordtodet.length)
        }
       
      }else{

        
                       
       alert("all details are ok ")
         
      
       alert("we are adding the record ")
      // alert(this.bankstmtdetails[0].bankstmtreallocid)
      
       var obj={}
     
       obj["toreallocpostingStatus"]=postingstatus
       obj["bkstmtreallocid"]=this.bankstmtdetails[0].bankstmtreallocid
       obj["appCode"] = application
       obj["appActivityCode"] = activity
       obj["referenceNo"] = referencenumber 
       obj["referenceStatus"] = referencestatus
       obj["toreallocateperiod"] = period
       obj["payor"] = payor
       obj["transactionCode"]=transcationtype
       obj["amount"] =  amount
      
       this.insertnewrecordtodet.push(obj); 

       alert("aray size by this we insert a record into misallocation partial to det"+this.insertnewrecordtodet.length)
       alert("referencenumber ---->"+this.insertnewrecordtodet[0].referenceNo)
 

      }
        

    


      }


 
  
  }

  toplselect:boolean=false;
  aclselect:boolean=false;
  applicationcodeselect(i){

   // alert(x.target.value+"value")
    let applicationcode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corApplication').value;
    alert(applicationcode)
        if(applicationcode=="TPOL"){
          this.toplselect=true
          this.aclselect=false
        }
    
        if(applicationcode=="ACL"){
          this.aclselect=true
          this.toplselect=false;
        }
    

        
  }



  //fetch the refernce number details
referncedetails:any;
  referencedetails(i){
    
    let applicationcode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corApplication').value;
    let referencenumber = (<FormArray>this.myForm.controls['corrections']).at(i).get('corRefNo').value;
        alert(applicationcode)
        alert(referencenumber)

        if(applicationcode==null || referencenumber==null ){
           
           if(applicationcode==null){
             alert("application must be selected")
           }
           
           if(referencenumber==null){
            alert("referencenumber must be selected")
          }

        }else{

           this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/bankstmtadjustmentvoucher/referencedetails?referencenumber=${referencenumber}&applicationcode=${applicationcode}`).subscribe((result)=>{
             console.log(result);
             this.referncedetails=result;
             this.patchreferncedetails(i)
           })


        }
  }


    //patching the refernce status and payour details
     patchreferncedetails(i){
      let x = (<FormArray>this.myForm.controls['corrections']).at(i);
      console.log("this calling form "+x);
       
      x.patchValue({
        corRefStatus: this.referncedetails[i].statusname,
        corPayor:this.referncedetails[i].partyname
        
      });
     }





  // insert the record into reallocation todet 

   inserttoreallocationdet(){


    alert(this.insertnewrecordtodet[0].toreallocpostingStatus+"POSTINGSTATUS")

     let createdby ="test"
     this.http.post(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/bankstmtadjustmentvoucher/insertreallocationtodetrecord?createdby=${createdby}`,
     
      this.insertnewrecordtodet
    
     
        
     ).subscribe((result)=>{
      
      console.log(result)
      alert("record is succesfully saved")

     },(error)=>{
          console.log(error)
          alert("eerror occured during saving the error")
     })



   }



  // deleting the record if posting status is unposted
  message:any;
      deleterecordreallocationtodet(i){
        
        alert("position of record to be removed--->"+i)

      

        let postingstatus=this.reallocationdetails[i].toreallocpostingStatus
        alert("before deleting the record we are checking posting status--->"+postingstatus)

        if(postingstatus=="U"){
          alert("recored is already posted so it cannot be deleted ")
        }else{

          let reallocidtodet =this.reallocationdetails[i].bkStmtToReallDetId
          alert(reallocidtodet)
          console.log(reallocidtodet)
          alert("by using realloctodet id we will delete it ")
          this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/bankstmtadjustmentvoucher/deleterecordtbkreallocation?reallocidtodet=${reallocidtodet}`)
          .subscribe((result)=>{
            console.log(result+"result");
            this.message=result;

            alert(this.message)
          },(error)=>{
            console.log(error);
            alert("error occured during deleting the record")
          })
        }

      

      }
  
  

      // updating amount based on allocated and avaliability amount
      updateamountchanges(i){
          alert("positon of variable amount to be change "+i);
          
          alert("based on transcation types")

          var transcationtype = (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').value;

          if(transcationtype=="CRE" || transcationtype=="LRE" || transcationtype=="CRX" || transcationtype=="LRX" ){
            alert("now we can check the excat amount to detected")

          }else{
            alert("please check the required transcation type")
          }

      }

  myForm: FormGroup;
  ngOnInit() {
    this.myForm = this.fb.group({
      corrections: this.fb.array([])
    })

  }

  get correctionForms() {
    return this.myForm.get('corrections') as FormArray
  }

  addCorrection() {

    const correction = this.fb.group({ 
      corSelect:[],
      corApplication: [],
corActivity: [],
corPeriod: [],
corRefNo: [],
corRefStatus: [],
corPayor: [],
corTransType: [],
corAmount: [],
corRPostingStatus: []
      
    })

    this.correctionForms.push(correction);
  }

  deleteCorrection(i) {
    alert(i)
    this.correctionForms.removeAt(i)
  }



save(){


  if(this.insertnewrecordtodet.length <=0){
    alert("please select  atleast to save the record")
  }else{

    this.inserttoreallocationdet()
  }
}


  clear(){

  }
  
}
