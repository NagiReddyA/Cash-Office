// Partial MisAllocation Correction - Allocation Module

import { Component,NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

import { FormBuilder, FormArray } from '@angular/forms'; // form array things require FormGroup as well

import { HttpClient, HttpParams} from '@angular/common/http';
import { PagerService, GlobalServices } from './../../services/index';


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
  templateUrl: './partial-misallocation-correction.component.html'
})
export class PartialMisallocationCorrectionComponent {
 
  constructor(private http:HttpClient,private pagerService: PagerService,private fb: FormBuilder){}


  viewMisallocations = false ;
  makeCorrections = false ; // show editable table for "Premium Reallocation" transactions.
  isReadOnly:any=true;
   newmanualrecord:any=[];
   insertrecordhdr:any=[];
   insertrecordfromdetpartial:any=[]
   totalallocatedamount:any;
   totalallocatedamount1:any;
   insertnewrecordtodet:any=[]
  

  

  toggleMakeCorrections(transaction_type){
    if ( transaction_type == 'allocate')
    {
      this.makeCorrections = true ;
    }

    if ( transaction_type == 'reverse')
    {
      this.makeCorrections = false ;
    }
  }

  
    
  misallocatedInput = new FormGroup({

    policyCode: new FormControl('', Validators.required),

    period: new FormControl('', Validators.required),

    misallocationID: new FormControl({value: '', disabled: true}),

    radios: new FormControl(''), // radio button things

     transType: new FormControl('') // radio button things
  }) ;


  policycorrection = new FormGroup({
  
    policycode1: new FormControl(''),
    period1: new FormControl(''),
    partyid : new FormControl(''),
    payername:  new FormControl(''),
    expectedamount: new FormControl(''),
    purpose :  new FormControl(''),
    allocated: new FormControl('')


  });

  // getting misallocation policy info   -- step 1
    misallocatedpolicyinfo:any;
   getpolicyinfo(policy,policydate){

    alert(policy)
    alert(policydate)
   
    //  this.http.get('').subscribe((response)=>{
    //    console.log(response)
    //  },(error)=>console.log(error));

    this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/partialmisallocationdetails/policycode?policycode=${policy}&period=${policydate}`
     


    ).subscribe((response)=>{

          console.log(response)
     this.misallocatedpolicyinfo=response

     alert("data is feteched")

     this.gettodetdetailsarray(this.misallocatedpolicyinfo[0])
    

     if(this.misallocatedpolicyinfo.length==0){
       alert("no record is found with this policy code and period ")
     }else{

            var misallocparitalhdrid = this.misallocatedpolicyinfo[0].misallocationid

            alert(misallocparitalhdrid)
          
             this.misallocatedInput.controls['misallocationID'].setValue(misallocparitalhdrid)
             
            
             if(misallocparitalhdrid>0){
               this.getmisalloctodet(misallocparitalhdrid)
             }
         }
    

     },(error)=>
     {console.log(error)
    
      alert("error occured during fetching the policy details")
    }
     
      
     );



   }

   // now from the above result we are using this result and push to a array insertrecordfromdetpartial

     gettodetdetailsarray(u){

       if(this.misallocatedpolicyinfo.length>0){

         var obj = {}

          
         obj["policyId"] = u.policyid
          obj["policyCode"] = u.policycode
          obj["period"] = u.period
          obj["policyStatus"] = u.transcationtype
          
          obj["amount"] = u.amount
          obj["partyId"] = u.partyid
          obj["payorName"] = u.partyname
          obj["receiptNo"] = u.recepitnumber
          obj["listId"] = u.id
          obj["postingStatus"] = u.postingstatus
          obj["collectionFlag"] = u.flag
         

           
          this.insertrecordfromdetpartial.push(obj);
          alert("size of todet array --->"+this.insertrecordfromdetpartial.length)
       }
     }


   // if we having misallocparitalhdrid greater than 0 then we will call one more api call -- step 2 if misallochdrid > 0
misallocparialtodet:any;
getmisalloctodet(id){
  alert("now we are entering into todet")

     this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/partialmisallocationdetails/todet?hdrid=${id}`).subscribe((response)=>{
       console.log(response)
       this.misallocparialtodet=response
       this.gettotalallocatedamount()
     },(error)=>console.log(error));



}


// step -3 getting the manual record 
newmanualdetails(i){
  alert(i)

  var policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;
   var poclicydate = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;


   alert(policycode)
   alert(poclicydate)
   alert(policycode == null)
  if (policycode == null){
    alert("enter policy code ")
  }else{

    
       this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/partialmisallocationdetails/pnewpolicycode?policycode=${policycode}&period=${poclicydate}`).subscribe((response)=>{
   console.log(response)
    this.newmanualrecord=response
   
  if(this.newmanualrecord[0].policycode=="00"){
    alert("no details found with this policy details")
  }else{
    this.patchValues(i);
   
  }



 },(error)=>console.log(error));
 

  }

}



patchValues(i) {
  let x = (<FormArray>this.myForm.controls['corrections']).at(i);
  console.log("this calling form "+x);
   
  x.patchValue({
    corPartyID: this.newmanualrecord[0].partyid,
    corPayerName:this.newmanualrecord[0].partyname,
    corExpectedAmnt:this.newmanualrecord[0].exceptedamount,
    corPurpose:this.newmanualrecord[0].purpose
  });
}
    


// inserting a record to partial misalloc hdr 


oncheckhdr(u){

  alert("we enter into hdr")
  alert(this.insertrecordhdr.length+"----length")

  //below code is used when we check and uncheck the data 

  if(this.insertrecordhdr.length >0){

    for(let i=0;i<this.insertrecordhdr.length;i++){
       
          

      if(this.insertrecordhdr[i].recepitNumber==u.recepitNumber){
        alert("removing")
        this.insertrecordhdr.splice(i,1)
      }
    
     }

  } else{
    var obj = {}
    obj["totalReversalAmt"] = u.amount
    obj["totalAllocatedAmt"] = u.amount
  
    
    this.insertrecordhdr.push(obj);

    alert("size of todet array --->"+this.insertrecordhdr.length)
  
  }

 
    
}

// fetching new policy detailss




//on check method for policy correction
crosscheck:boolean=true; 
checktodetdate(i){
       alert(i+"array inde")

       var policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;
      
       var period = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
       var partid = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPartyID').value;

       var payername = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayerName').value;

       var excptedamount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corExpectedAmnt').value;
       var purpose = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPurpose').value;
       var amount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;

    
        console.log("now we are printing the new manual details")
        console.log(policycode)
        console.log(period)
        console.log(partid)
        console.log(payername)
        console.log(excptedamount)
        console.log(purpose)
        console.log(amount)



    

       if(amount<0 || amount==null || amount =="undefiend" || policycode==null || partid==null || payername==null || excptedamount==null || purpose==null){
             alert("please filled the required details")

             var checkbox = (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').value;
             alert(checkbox);
            

            

       }
       else{ 

        // alert("we has entered into todet attay object")


  //here insertrecordfromdetpartial deals with misallocationpartialpolicy details which are push to below array of insertrecordfromdetpartial

          if(this.insertrecordfromdetpartial.length<=0){

            alert("select the result which is came from mis correction details ")

          
           

          }else{

          // this is our new array insertnewrecordtodet in which we push the new manual record details 
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
          alert(this.insertrecordfromdetpartial[0].receiptNo)
        
            var obj={}
          

      
            obj["policyCode"] = policycode
            obj["period"] = period
         
            obj["amount"] = amount
            obj["partyId"] = partid
            obj["payorName"] = payername
            
            obj["purpose"] = purpose
            obj["policyId"] = this.newmanualrecord[0].policyid
            obj["receiptNumber"] = this.insertrecordfromdetpartial[0].receiptNo
          


            this.insertnewrecordtodet.push(obj); 

            alert("aray size by this we insert a record into misallocation partial to det"+this.insertnewrecordtodet.length)

          }
        }

        
 
        }




}







hdrid:any;
transcartiontype1:any;



save(){


  let transcartiontype = this.misallocatedInput.get('transType').value

  if(transcartiontype == 'allocation' || transcartiontype== 'reverse' ){

    
    this.transcartiontype1 = this.misallocatedInput.get('transType').value
  

   
    
                    if(this.insertrecordhdr.length==0){
                                alert("please select the misallocation patrially")
     
                   }  else{

    
     

                              if(this.transcartiontype1=="allocation" ){

                                   alert("we will run all post method  ")
                                   alert(this.insertnewrecordtodet.length)

                                           if(this.insertnewrecordtodet.length>0){
                                               alert("now we can isert the complete details")
                                               alert(this.insertnewrecordtodet[0].policyCode+"1")
                                               alert(this.insertnewrecordtodet[0].period+"2")

                                             
                                               alert(this.insertnewrecordtodet[0].amount+"4")
                                               alert(this.insertnewrecordtodet[0].partyId+"5")

                                               alert(this.insertnewrecordtodet[0].payorName+"6")
                                               alert(this.insertnewrecordtodet[0].purpose+"7")
                                               alert(this.insertnewrecordtodet[0].policyId+"8")
                                               alert(this.insertnewrecordtodet[0].receiptNumber+"9")
                                              

                                                this.pmhdr()
                                                this.pmtodet()
                                             }else{
                                                  alert("policy correction ")
                                              }
                         
                       
                              

                           } 

                         
                           if( this.transcartiontype1=="reverse"){
                           alert("we will run only 2 post methods ")
                              //this.pmhdr()
                             // this.pmfromdet()
                            }

    

            }

  } else{
    alert("please select the a transcation type")
  }
   

  

}


//post to hdr 

pmhdr(){
  this.http.post(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/partialmisallocationdetails/inserthdr`,{
       
    "totalReversalAmt":this.insertrecordhdr[0].totalReversalAmt,
    "totalAllocatedAmt":this.insertrecordhdr[0].totalAllocatedAmt,
    "transactionType":this.transcartiontype1

   }).subscribe((response)=>{
     console.log(response)
     alert(response)
     this.hdrid=response
    },(error)=>console.log(error));
}

//post to partial misallocation from det 
pmfromdet(){
  this.http.post(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/partialmisallocationdetails/inserfromdetr?pmishdrid=${this.hdrid}`,this.insertrecordfromdetpartial
       
        
       ).subscribe((response)=>{
         console.log(response)
          },(error)=>console.log(error));

}

// posttodet

pmtodet(){

  this.http.post(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/partialmisallocationdetails/insertoetr?pmishdrid=${this.hdrid}`,this.insertnewrecordtodet
       
        
       ).subscribe((response)=>{
         console.log(response)
          },(error)=>console.log(error));


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

  // to calculate the total amount 
  gettotalallocatedamount(){
    this.totalallocatedamount = this.misallocparialtodet.reduce((sum, item) => sum + item.amount, 0);
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
      corAllocatedAmnt: []
      
    })

    this.correctionForms.push(correction);

    // if(this.misallocparialtodet.length>0){

    //   this.totalallocatedamount = this.misallocparialtodet.reduce((sum, item) => sum + item.amount, 0);

       
    // }else{
           
    // }


  }

  arrayamount:number;
  amount:number=0;
  gettotalamountfromcorrectionarry(i){
     this.arrayamount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;
     this.amount= (+this.arrayamount)+this.amount
     alert(this.amount+"amount that we are dealing ")
  }

  deleteCorrection(i) {
    this.correctionForms.removeAt(i)
  }



  

  
  post(){}
  

  clear(){
    window.location.reload() ;
  }

  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }

   // search(x){
//   console.log("Searching " + x) ;
//   this.viewMisallocations = true ;
// }


// onSelect(x, position) 
// {
//   this.selectedItem = x ;
//   console.log("Selected item No. " + ( position +1 ) ) ; // dbg
// }
   totalAllocatedAmount: number ;

}