// Partial MisAllocation Correction - Allocation Module

import { Component,NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

import { FormBuilder, FormArray } from '@angular/forms'; // form array things require FormGroup as well
import { HttpClient, HttpParams} from '@angular/common/http';



@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule,
    Validators

    , FormArray, FormBuilder
]
})

@Component({
  templateUrl: './manual-allocation.component.html'
})
export class ManualAllocationComponent {
 

  myForm: FormGroup;
  
  constructor(private http:HttpClient,private fb: FormBuilder){}
    
  misallocatedInput = new FormGroup({
    receiptNo: new FormControl('', Validators.required),
    BSFlag: new FormControl('', Validators.required),

    misallocationID: new FormControl({value: '0', disabled: true}),

    
  }) ;

  ngOnInit() {
    this.myForm = this.fb.group({
      corrections: this.fb.array([])
    })

  }


  validate:boolean=true

  get correctionForms() {
    return this.myForm.get('corrections') as FormArray
  }

  addCorrection() {

    const correction = this.fb.group({ 
      corSelect:[],
      corPolicyCode: [],
      corPeriod: [],
      corPartyID: [],
      corPayerName: [],
      corExpectedAmnt: [],
      corPurpose: [],
      corPurposeID: [],
      corPostStatus: [],
      corAllocatedAmnt: []
      
    })

    this.correctionForms.push(correction);
  }

  




// used for fetching misallocation details depends on receipt number or bank stmt num and flag type
 receiptnum:any;
search(x){

  alert("receipt number")

  this.getmanualhdrid(x)
 
   
}



// calling tpolmanualhdrid details  step 1 checking wheather receipt  already present in t_manualhdr 
manualallochdriservice:any;
getmanualhdrid(receipt){

  alert("receipt--->"+receipt)

  this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/manualallocation/tpolmanualhdrid?receipt=${receipt}`).
  subscribe((result)=>{console.log(result)
     this.manualallochdriservice=result
     console.log("manualservicecallhdrid---->"+this.manualallochdriservice)
     this.getManualallocationdetails(this.manualallochdriservice)
  },
  (error)=>{console.log(error)}
  )

}

receiptdetails:any;
checkingreceiptoutput:any;
// fetching receipt details based upon the flag and  receipt number 

flagdetails:any;
getManualallocationdetails(manualhdrid){

  let flag = this.misallocatedInput.get('BSFlag').value
  let receiptnum= this.misallocatedInput.get('receiptNo').value

  if(flag =='' || flag=="false"){
                           
          this.flagdetails="N"

                 }else {
                         alert("we have a flag of Y")

                         this.flagdetails="Y"

   }




  if(manualhdrid==""){
    alert("we are calling records from t_receipt so that we need to saved the record")
    
    this.getreceiptdetails(this.flagdetails,receiptnum,manualhdrid)
  }else{
      alert("we already having a record with following recipt number in tmanualallochdr")
     
      this.getreceiptdetailstodtl(this.flagdetails,receiptnum,manualhdrid)
        
  }

}


 
getreceiptdetails(flag,recipt,manualhdrid){

  this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/manualallocation/receiptdetailsflag?bankstmtflag=${flag}&receiptnum=${recipt}`).subscribe((result)=>
  {
     
    console.log(result)
    this.receiptdetails= result
    console.log("this result is coming from receipt details----"+this.receiptdetails[0].period)
    
  
  this.validate=false
   
  this.getTotalUnallocatedamounttreceipt()
  this.getTotalallocatedamounttreceipt()
 
  

  }
  
  ,(error)=>{

    alert("error has occured")
       
     console.log(error)
    });
 

}



receiptdetailstodtl:any;
receiptdatachecking:any;
// fetching receipt details based upon the flag and  receipt number  from todtl
 
getreceiptdetailstodtl(flag,recipt,manualhdrid){

  alert("flag details--->"+flag)
  alert("receiptno--->"+recipt)

  this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/manualallocation/receiptdetailsflagtodtl?bankstmtflag=${flag}&receiptnum=${recipt}`).subscribe((result)=>
  {
     
    console.log(result)

    this.receiptdetailstodtl=result


     // if no records are found in toallocation manual but if we are having manual hdr id 
     if(manualhdrid !="" && this.receiptdetailstodtl.length<=0 ){
         
       alert("this is an exception case ")

       this.getreceiptdetails(flag,recipt,manualhdrid);
     } else{

        // calling below method for displaying aloocated amount for the policies
         this.getpoliciesallocatedtodetamount()
              this.getTotalUnallocatedamount()
         this.getTotalallocatedamount()

    this.treceiptdetails=false;
    this.manualallocationdtails=true;
    this.validate=false;

     }



  }
  
  
  
  ,(error)=>{
    alert("error has occured")
     console.log(error)
    });


}

TotalPoliciesAllocatedAmount:number;
Policiesallocatedamount:number;
// gettotal allocated amount from tmanualtodet details
getpoliciesallocatedtodetamount(){
    
  this.TotalPoliciesAllocatedAmount = this.receiptdetailstodtl.reduce((sum, item) => sum + item.toallocatedamount, 0);
  this.Policiesallocatedamount=this.TotalPoliciesAllocatedAmount


}

TotalUnallocatedamount:number;
tmanualhdrunallocatedamount:number
getTotalUnallocatedamount(){



       if(this.receiptdetailstodtl.length>0){
          this.TotalUnallocatedamount=this.receiptdetailstodtl[0].totalunallocatdamo
       }
       
      
       
       
 
    this.tmanualhdrunallocatedamount= this.TotalUnallocatedamount
    alert(this.tmanualhdrunallocatedamount)

}


// this is for treceipt count
getTotalUnallocatedamounttreceipt(){

   alert("receipt length--->"+this.receiptdetails.length)
     
       if(this.receiptdetails.length>0){
        this.TotalUnallocatedamount=this.receiptdetails[0].unallocatedamount
       }
       
       
 
    this.tmanualhdrunallocatedamount= this.TotalUnallocatedamount
    alert(this.tmanualhdrunallocatedamount)

}


getTotalallocatedamounttreceipt(){
 
 if(this.receiptdetails.length>0){
  this.Totalallocatedamount=this.receiptdetails[0].allocatedamount
 }

 this.tmanualhdrallocatedamount=this.Totalallocatedamount
 alert(this.Totalallocatedamount)

}



Totalallocatedamount:number;
tmanualhdrallocatedamount:number
getTotalallocatedamount(){

  

  if(this.receiptdetailstodtl.length>0){
    this.Totalallocatedamount=this.receiptdetailstodtl[0].totalallocatedamount
 }
 

 

 this.tmanualhdrallocatedamount=this.Totalallocatedamount
 alert(this.Totalallocatedamount)
  


}



Policiesamount:any;
amount:any;
aloocamountpolicy:any=[];
// now the updating allocation amount
updatepoliciesallocatedamount(i){

  let allocamount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;  

   alert("initial amount"+allocamount+"---")

       if(allocamount=="" || allocamount==undefined || allocamount==null   ){
         alert("no amount is allocated")
         allocamount=0
       }

    alert("allocamount"+allocamount)
   // now we are storing the positon and value this will be helpful when we change the once given value 
   
   let desc = this.aloocamountpolicy.filter(app => app.position == i );

   if(desc.length != 0 ){

    alert(desc[0].amount+"amount to be removed first because already this possess same amount")
     alert("first we alloca "+allocamount)
    console.log("desc[0].amount--->"+desc[0].amount)
    alert(desc[0].amount+"coming from array after push")


     alert(this.tmanualhdrallocatedamount+"allocated amount")
  console.log(this.tmanualhdrallocatedamount+"allocated amount")
  alert(this.tmanualhdrunallocatedamount+"unallocated")
  console.log(this.tmanualhdrunallocatedamount+"unallocated")
  alert("total policies amount--->"+this.Policiesallocatedamount)
  console.log("total policies amount--->"+this.Policiesallocatedamount)

     this.tmanualhdrallocatedamount=this.tmanualhdrallocatedamount- +desc[0].amount
     this.tmanualhdrunallocatedamount=this.tmanualhdrunallocatedamount + +desc[0].amount
     this.Policiesallocatedamount=this.Policiesallocatedamount- +desc[0].amount
        

      alert(this.tmanualhdrallocatedamount+"allocated amount")
  console.log(this.tmanualhdrallocatedamount+"allocated amount")
  alert(this.tmanualhdrunallocatedamount+"unallocated")
  console.log(this.tmanualhdrunallocatedamount+"unallocated")
  alert("total policies amount--->"+this.Policiesallocatedamount)
  console.log("total policies amount--->"+this.Policiesallocatedamount)

     // after removing the existing old amount now we need to add our new amount

     for ( var j = 0;j<=i;j++ ) {
      this.amount = (<FormArray>this.myForm.controls['corrections']).at(j).get('corAllocatedAmnt').value;  
      if(this.amount=="" || this.amount==undefined || this.amount==null   ){
        alert("no amount is allocated")
        this.amount=0
      }
        
        console.log("inside amount"+this.amount)
      total = +total + +this.amount
      
  
             }  
  
  
      this.tmanualhdrallocatedamount=this.tmanualhdrallocatedamount+total
      this.tmanualhdrunallocatedamount=this.tmanualhdrunallocatedamount-total
      this.Policiesallocatedamount=this.Policiesallocatedamount+total
          

     

   }else{
      var obj = {}


    alert(allocamount+"amount used for pushing")
    obj["amount"] = allocamount
    obj["position"] = i
    this.aloocamountpolicy.push(obj);
    alert("size"+this.aloocamountpolicy.length)
    var total=0
  
  for ( var j = 0;j<=i;j++ ) {
    this.amount = (<FormArray>this.myForm.controls['corrections']).at(j).get('corAllocatedAmnt').value;  

       
    if(this.amount=="" || this.amount==undefined || this.amount==null   ){
      alert("no amount is allocated")
      this.amount=0
    }
      
    total = +total + +this.amount
    

           }  


    this.tmanualhdrallocatedamount=this.tmanualhdrallocatedamount+total
    this.tmanualhdrunallocatedamount=this.tmanualhdrunallocatedamount-total
    this.Policiesallocatedamount=this.Policiesallocatedamount+total

   }

  

  

}


//remove  the amount 


deleteCorrection(i) {
   
  // alert("position used for deleting the record--->"+i)

  // alert("initiall amount before deleting allocated amount")
  
  // alert(this.tmanualhdrallocatedamount+"allocated amount")
  // console.log(this.tmanualhdrallocatedamount+"allocated amount")
  // alert(this.tmanualhdrunallocatedamount+"unallocated")
  // console.log(this.tmanualhdrunallocatedamount+"unallocated")
  // alert("total policies amount--->"+this.Policiesallocatedamount)
  // console.log("total policies amount--->"+this.Policiesallocatedamount)
    
  var amount:number = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;
  alert("amount to be removed ---->"+amount)
  this.correctionForms.removeAt(i)
  this.tmanualhdrallocatedamount=this.tmanualhdrallocatedamount- +amount
  this.tmanualhdrunallocatedamount=this.tmanualhdrunallocatedamount + +amount
  this.Policiesallocatedamount=this.Policiesallocatedamount- +amount
  
  // alert("amount after removing the resceipt allocated policy amount")
 
  // alert(this.tmanualhdrallocatedamount+"allocated amount")
  // console.log(this.tmanualhdrallocatedamount+"allocated amount")
  // alert(this.tmanualhdrunallocatedamount+"unallocated")
  // console.log(this.tmanualhdrunallocatedamount+"unallocated")
  // alert("total policies amount--->"+this.Policiesallocatedamount)
  // console.log("total policies amount--->"+this.Policiesallocatedamount)


  // removing the record from pushed array used for checking the amount
  this.aloocamountpolicy.splice(i,1)

}


insertrecordtodtl:any=[]

treceiptdetails:boolean=true;
manualallocationdtails:boolean=false;



// pushing the receipttodet  array data to another 

gettodtlreceiptdetails(d){

  if(this.receiptdetailstodtl.length>0){

    var obj = {}

    obj["paypoint"] = d.paypointid
    obj["period"] = d.period
    obj["grossamount"] = d.grossamount
    obj["recepitno"] = d.receiptno
    obj["allocatedamount"] = d.allocatedamount
    obj["unallocatedamount"] = d.unallocatedamount
    obj["totalallocatedamount"] = d.totalallocatedamount
    obj["totalunallocatdamo"] = d.totalunallocatdamo
    
    this.insertrecordtodtl.push(obj);
    alert("size of todet array --->"+this.insertrecordtodtl.length)

    
    

  }

}



  // used from getting policy details

  policydetails:any;

  getpolicycodedetails(i){
    
    var policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;
    alert("policy code coming from user side ---->"+policycode)

    this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/misallocationcorrection/policyinfo?policycode='+policycode).subscribe(response=>{
      console.log(response)
      this.policydetails=response

      if(this.policydetails.length==0){
        alert("no policy found with this policy code");
        
      } else{
        this.patchValues(i);
      }
     
    
   

      
    },(error)=>console.log(error));


   }


   patchValues(i) {
    let x = (<FormArray>this.myForm.controls['corrections']).at(i);
    console.log("this calling form "+x);
     
    x.patchValue({
      corPartyID: this.policydetails[0].partyid,
      corPayerName:this.policydetails[0].partyName,
      corExpectedAmnt:this.policydetails[0].expectedAMOUNT,
      corPurpose:this.policydetails[0].purpose,
      corPurposeID:this.policydetails[0].purpose_id,
      corPostStatus:this.policydetails[0].postingStatus
    });
  }




insertnewrecordtodet:any=[]

// check and uncheck the checkbox based on that data is pushed into sever side

checktodtl(i){

  alert(i)

  var policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;
      
  var period = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
  var partid = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPartyID').value;

  var payername = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayerName').value;

  var excptedamount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corExpectedAmnt').value;
  var purpose = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPurpose').value;
  var purposeid = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPurposeID').value;
  var postingstatus = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPostStatus').value;
  var amount:number = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;
   
  alert(period)

   console.log("now we are printing the new manual details")
   console.log(policycode)
   console.log(period)
   console.log(partid)
   console.log(payername)
   console.log(excptedamount)
   console.log(purpose)
   console.log(amount)

   if(amount<0 || amount==null|| period==null  || policycode==null || partid==null || payername==null || excptedamount==null || purpose==null){
    alert("please filled the required details")

    var checkbox = (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').value;
    alert("checked or not "+checkbox);

    

   }else{
       
    if(this.insertnewrecordtodet.length >0){


      for(let i=0;i<this.insertnewrecordtodet.length;i++){
        alert("we enter into removing stage ")

        alert(this.insertnewrecordtodet[0].policyCode)
        alert(policycode)
        alert(this.insertnewrecordtodet[i].policyCode==policycode)


        if(this.insertnewrecordtodet[i].policyCode==policycode){
          alert("removing")
          this.insertnewrecordtodet.splice(i,1)
        }

        alert("size of the arry "+this.insertnewrecordtodet.length)
      }

    }else{
     
      alert("we are adding the record ")
     
        var obj={}
      

  
        obj["policyCode"] = policycode
        obj["period"] = period
        
       
        obj["partyId"] = partid
        obj["payorName"] = payername
        obj["expectedAmount"] = excptedamount
        
        obj["purposeName"] = purpose
        obj["purposeId"] = purposeid
        obj["postingStatus"]=postingstatus
        obj["allocatedAmount"] =  amount
       


        this.insertnewrecordtodet.push(obj); 

        alert("aray size by this we insert a record into misallocation partial to det"+this.insertnewrecordtodet.length)
        alert("allocated amount---->"+this.insertnewrecordtodet[0].allocatedAmount)

      } 

    }


}


// now dealing with totalallocatedamount,totalunallocatedamount,totalpolicies amount




// saving the record into t_pol_manual_hdr,fromdtl,todtl
 save(){
   
  let manualhdrid=this.manualallochdriservice

  if(this.manualallochdriservice==""){

    alert("we are inserting the record ")
    this.insertrecordtopolmanual()
    
  }else{
   
   
    alert("we are updating the record")
    this.gteupdatedManualallocarion()

  }
   
  



 }


 receiptdetailsallocatedamount:any;
 receiptdetailsunallocatedamount:any;
 bkstmtflag:any

   insertrecordtopolmanual(){
    
        if( this.receiptdetails==undefined)
             {  
                 alert("no receipt no is found")
             }
         
         else
           {

               if(this.receiptdetails.length<=0)
                   {
                     alert("no receipt/bank stmt details is found with this recipt number")
                   }

                if(this.insertnewrecordtodet.length<=0)
                  {
                     alert("please select a policy to allocate ")
                  }
                else{
                  
                   if(this.insertnewrecordtodet.length>0){
         
  
  
                    alert("receipt number"+this.misallocatedInput.get('receiptNo').value)
  
                     if(this.receiptdetails.length > 0){
                        this.receiptdetailsallocatedamount=null
                        this.receiptdetailsunallocatedamount=null
                        }
            
                        let flag = this.misallocatedInput.get('BSFlag').value
  
           
  
                      if(flag =='' || flag=="false"){
                           
                                 this.bkstmtflag="N"

                       }else {
                          alert("we have a flag of Y")
                 
                            this.bkstmtflag="Y"
            
                       }
  
         // now we are calling insert method in order to save record into t_pol_manual_hdr
  
                  if(this.receiptdetails.length > 0 && this.manualallochdriservice=="") {

                      if(this.insertnewrecordtodet[0].postingStatus=="P"){
                        alert("already record has been posted so it cannot be saved ")
                      }else{
                        alert("we are saving the record ")
                        this.getinsertintotpolhdr()
                      }

                   }
            
               }


           }

        }
    
   }



   // if we have already a manualhdrid for the respectivity receipt then update the record

   gteupdatedManualallocarion(){

    alert(" already in t_pol_maunalhdr  we have a id -->"+this.manualallochdriservice)
   
     this.getupdatedrecord() 

   }
  

  manualhdrid:any
   getinsertintotpolhdr(){

    alert("inserting the record has been started ")
          
    this.http.post('http://192.168.1.58:9090/CashOffice-Test/api/allocations/manualallocation/inserttpolmanualhdr',{

      "receiptNo":this.misallocatedInput.get('receiptNo').value,
      "totalAllocatedAmt":this.receiptdetailsallocatedamount,
      "totalUnallocatedAmt":this.receiptdetailsunallocatedamount,
      "totalPoliciesAmount":null,
      "bankStmtFlag":this.bkstmtflag
    }).subscribe((result)=>{
      console.log(result)
      this.manualhdrid = result;
      this.getinsertfromdtl(this.manualhdrid)
     this.getinserttpolmanualtodet(this.manualhdrid)
    },
      (error)=>{
        console.log(error);
      }
     );
   

   }

manualfromdet:any;
// inserting record into t_pol_manual
getinsertfromdtl(manualallochdrid){

  this.http.post(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/manualallocation/inserttpolmanualfromdet?manualhdrid=${manualallochdrid}`,{
   
   "paypointId":this.receiptdetails[0].paypoint,
   "period":this.receiptdetails[0].period,
   "allocatedAmount":this.receiptdetails[0].allocatedamount,
   "unallocatedAmount":this.receiptdetails[0].unallocatedamount,
   "receiptAmount":this.receiptdetails[0].recepitamount,
   "grossAmount":this.receiptdetails[0].grossamount
   

  }).subscribe((result)=>{
       console.log(result)

     this.manualfromdet=result
  },(error)=>{
       console.log(error)
  });

}

manualtodet:any;
getinserttpolmanualtodet(manualallochdrid){
    
  this.http.post(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/manualallocation/inserttpolmanualtodet?manualhdrid=${manualallochdrid}&stmtflag=${this.bkstmtflag}`,
    this.insertnewrecordtodet

  ).subscribe((result)=>{
    
     console.log(result)
      this.manualtodet = result
      alert("record is sucessfully saved")
      // this.clear()

  },(error)=>{

    console.log(error)
  })

}


// for update the record in t pol manual hdr and to insert a record in t_po_manuall_to_det
 getupdatedrecord(){

    
    if(this.insertnewrecordtodet.length>0){
      this.getupdatehdr();
      this. getupdatemanualallocationtodet(); 
      
      
    }else{
         alert("alredy record is saved ")
    }
    
     



 }

 //for update of tpolmanualhdr
 getupdatehdr(){
    let manualhdrid =this.manualallochdriservice

    let totalallocatedamount=this.tmanualhdrallocatedamount
    let totalunallocatedamount=this.tmanualhdrunallocatedamount
    let totalpoliciesamount=this.Policiesallocatedamount

    



    let modifiedby = "test"

    alert(manualhdrid+"manual hdr id for update ")
    alert(totalallocatedamount+"for update purpose")
    alert(totalunallocatedamount+"for update purpose")
    alert(totalpoliciesamount+"for update purpose ")
    alert(modifiedby)
    this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/manualallocation/updatetpolmanualallochdr?manualhdrid=${manualhdrid}&totalallocatedamount=${totalallocatedamount}&totalunallocatedamount=${totalunallocatedamount}&totalpoliciesamount=${totalpoliciesamount}&modifiedby=${modifiedby}`)
      .subscribe((result)=>{console.log(result+"this result is coming after updating manual hdr table record")
      
        
        
      
      
      },
      (error)=>{
        console.log(error)
      }
      )
    


 }


   getupdatemanualallocationtodet(){

  let manualhdrid=this.manualallochdriservice
     
    this.http.post(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/manualallocation/inserttpolmanualtodet?manualhdrid=${manualhdrid}&stmtflag=${null}`,
    this.insertnewrecordtodet

  ).subscribe((result)=>{
    
     console.log(result)
      this.manualtodet = result
      alert("record is sucessfully saved")

   // now after updating the record we are again calling receipt details for fetching new details 
       
       let flag = this.misallocatedInput.get('BSFlag').value
       let receiptno = this.misallocatedInput.get('receiptNo').value
       alert(flag)
       alert(flag)
       this.getreceiptdetails(flag,receiptno,manualhdrid)
       this.getreceiptdetailstodtl(flag,receiptno,manualhdrid)

  },(error)=>{

    console.log(error)
  })

   }


 // deleteing the existed record 
  
  deleterecordfromtpolamnual(i){
          
          if(this.receiptdetailstodtl.length>0){

                 alert("we are removing a record")
                 alert("positon of the record to be removed----->"+i)
               var amount =  this.receiptdetailstodtl[0].toallocatedamount
               alert(amount)
              
                 this.tmanualhdrallocatedamount=this.tmanualhdrallocatedamount- +amount
                 this.tmanualhdrunallocatedamount=this.tmanualhdrunallocatedamount + +amount
                 this.Policiesallocatedamount=this.Policiesallocatedamount- +amount


                 
                this.deleteamounttoallocate(i)

                }

            


          }

  

  deleteamounttoallocate(i){

    let manualhdrid =this.receiptdetailstodtl[i].manualhdrid
    let manualtodetid=this.receiptdetailstodtl[i].manualhdrtoid
    
    alert(manualhdrid+"----->manual hdr id ")
    alert(manualtodetid+"------->manualtoallocationid")
    alert(this.tmanualhdrallocatedamount+"after removing the allocated policy amount ")
    alert(this.tmanualhdrunallocatedamount)
    alert(this.Policiesallocatedamount)

    let totalallocatedamount=this.tmanualhdrallocatedamount
    let totalunallocatedamount=this.tmanualhdrunallocatedamount
    let totalpoliciesamount=this.Policiesallocatedamount
    let modifiedby = "test";



      this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/manualallocation/deletetodtl?manualhdrid=${manualhdrid}&manualToDtlId=${manualtodetid}&totalallocatedamount=${totalallocatedamount}&totalunallocatedamount=${totalunallocatedamount}&totalpoliciesamount=${totalpoliciesamount}&modifiedby=${modifiedby}`)
      .subscribe((result)=>{console.log(result)
       alert("record has been succesfully deleted");
       
    
      },
         
      (error)=>{
        console.log(error)
        }
      )
    
       // now we are updating the totalpoliciesamount,totalallocatedamount,totalunallocated amount
       this.getupdatehdr();
      
       //after deleteing the record neeed to update amount 
       let flag = this.misallocatedInput.get('BSFlag').value
       let receiptno = this.misallocatedInput.get('receiptNo').value
       alert(receiptno+"receiptnumber this are used for reloading the page")
       alert(flag+"flag ")
       //this.getreceiptdetails(flag,receiptno)
       //this.getreceiptdetailstodtl(flag,receiptno)

       this.misallocatedInput.controls['receiptNo'].setValue(receiptno)
    



  }





clear(){
  window.location.reload() ;
}

exit(){
 
}







 
  post(){
           
  }

  



}