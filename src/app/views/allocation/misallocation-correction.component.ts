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
  templateUrl: './misallocation-correction.component.html'
})
export class MisallocationCorrectionComponent {
 
  viewMisallocations = false ;
  makeCorrections = false ; // show editable table for "Premium Reallocation" transactions.
  misallocationpolicy:any=[];
  misallocationtodet:any=[];
  pager: any = {};
  pagedItems: any[];
  checkboxupdating:any;
  policydetails:any;
  totalmisallocationreversalamount:any;
  misallochdrid:any;
  // toggleMakeCorrections(transaction_type){
  //   if ( transaction_type == 'allocate')
  //   {
  //     this.makeCorrections = true ;
  //   }

  //   if ( transaction_type == 'reverse')
  //   {
  //     this.makeCorrections = false ;
  //   }
  // }

  constructor(private http:HttpClient,private pagerService: PagerService){}

  misallocatedInput = new FormGroup({
    policyCode: new FormControl('', Validators.required),
    misallocationID: new FormControl(''),

    // radios: new FormControl(''), // radio button things

    // transType: new FormControl('') // radio button things
  }) ;

  checkboxform = new FormGroup({
    
    cbf: new FormControl('')
        
  });

  myForm = new FormGroup({
    policyCode2: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    payer: new FormControl('', Validators.required),

    
  }) ;

  // calling misallocation policy details 

   getmisallocationdetails(m){
        
         this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/misallocationcorrection/misallocpolicy?policycode='+m).subscribe(

          response => {

         console.log(response)
          this.misallocationpolicy=response

          if(this.misallocationpolicy.length==0){
            alert("no data found on this policycode ")
          } else {
                 
             
  // from the below code we are asigning the extra variable to object so that by using it we can manual chek the checkbox
         
         
  this.misallocationpolicy.forEach((key) => {
    key["quantity"] = 0;
  })

  // calculating the total amount 

  this.totalmisallocationreversalamount = this.misallocationpolicy.reduce((sum, item) => sum + item.amount, 0);

  console.log("total amount "+this.totalmisallocationreversalamount); 
  console.log("now im printing custom value--->"+this.misallocationpolicy[0].quantity)
  this.setPage(1)


  
   for (let i = 0; i < this.misallocationpolicy.length; i++) {

    //patching the value 

    this.misallocatedInput.patchValue({
      misallocationID:this.misallocationpolicy[i].misallocationId
    })
         
    if(this.misallocationpolicy[i].misallocationId == 0){
      console.log("-----no misallocation data another than zero----"+i);
    }
    else{
      alert("now calling To_Misallcation_Det method ")
      
      //patching the value 

      this.misallocatedInput.patchValue({
        misallocationID:this.misallocationpolicy[i].misallocationId
      })
      

      this.getmisallocationtodetfrommisallocationid(this.misallocationpolicy[i].misallocationId)
      break;
    }
}
console.log("out from the loop");




          }
        
          },
          (error)=>console.log(error)
         );
   }


   totalpolicyamount:any;
      // CALLING MISALLOCATIONTODET RECORD DETAILS

   getmisallocationtodetfrommisallocationid(td){
     alert("misallocationhdrid---->"+td)
     this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/misallocationcorrection/misallocationdettoget?misallocationhdrid='+td).subscribe(response=>{
       console.log(response)
       this.misallocationtodet=response

       this.totalpolicyamount = this.misallocationtodet.reduce((sum, item) => sum + item.amount, 0);
       this.checkboxupdate()  
     
    

       
     },(error)=>console.log(error));

     
   }

// by using this we can get total policy allocated amount
policyallocamount(){
  this.totalpolicyamount = this.misallocationtodet.reduce((sum, item) => sum + item.amount, 0);
}
   


// used for check the checkboxs 

  checkboxupdate(){
     
    console.log("enter into checkbox looping")

    console.log("now reading custom value ---->"+this.checkboxform.get('cbf').value)
    
   // alert(this.checkboxform.get('cbf').value == 0)

    for(let  i=0;i<this.misallocationtodet.length;i++){

      for(let j=0;j<this.misallocationpolicy.length;j++){


        if(this.misallocationtodet[j].recepitNumber==this.misallocationpolicy[i].recepitNumber){

          this.checkboxform.controls['cbf'].setValue(1);
            
           

                }
      
      }

      
      
    
    }

      

  }


//method used for removing the listed element from array

// removeuncheckeditem(arr, attr, value){
//     var i = arr.length;
//     while(i--){
//        if( arr[i] 
//            && arr[i].hasOwnProperty(attr) 
//            && (arguments.length > 2 && arr[i][attr] === value ) ){ 

//            arr.splice(i,1);

//        }
//     }
//     return arr;
// }
   
   oncheck(u,ind){

    var count = 1;    // pushing record


      for(let i=0;i<this.misallocationtodet.length;i++){
       
          

          if(this.misallocationtodet[i].recepitNumber==u.recepitNumber){
            alert("removing")
            console.log(this.misallocationtodet[i].recepitNumber+"coming from array")
            this.misallocationtodet.splice(i,1)
            alert("size of todet array --->"+this.misallocationtodet.length)
            
            count=0;

          }


          
      }

      console.log(count+"checking the count")
      console.log(count==1)
    
       if(count==1){
         alert("entering first stage")
         alert(this.misallocationtodet.length)

         if(this.misallocationtodet.length==0){
           alert("no data found initially so we are adding for own")
          var obj = {}

          // here u is coming from html page by using ngfor 

          // obj["period"] = u.period
          // obj["amount"] = u.amount
          // obj["receiptNumber"]=u.recepitNumber
          // obj["polMisAllocationId"]=u.misallocationId
          // obj["partyId"]=u.partyid
          // obj["payorName"]=u.partyname
          // obj["policyCode"]=u.policyCode
          // obj["policyid"]=u.policyid
          // obj["postingStatus"]=u.postingstatus
          // obj["policystatus"]=u.policystatus


          // amount: 405.6
          // collectionflag: "PP"
          // id: 24223608
          // misallocationId: 0
          // partyid: 1021886
          // partyname: "KATSO BONANG GAOBAKWE"
          // period: "2019-02-28T18:30:00.000+0000"
          // policyCode: "81087264"
          // policyid: 36576
          // policystatus: "Inforce"
          // postingstatus: "U"
          // quantity: 0
          // recepitNumber: 349971
          
          obj["amount"] = u.amount
          obj["collectionflag"] = u.collectionflag
          obj["id"] = u.id
          obj["period"] = u.period
          obj["partyid"]=u.partyid
          obj["partyname"]=u.partyname
          obj["policyCode"]=u.policyCode
          obj["policyid"]=u.policyid
          obj["policystatus"]=u.policystatus
          obj["postingStatus"]=u.postingstatus
          obj["recepitNumber"]=u.recepitNumber
          obj["misallocationId"]=u.misallocationId
         
         
         
          
          
         
        

          this.misallocationtodet.push(obj);
          alert("size of todet array --->"+this.misallocationtodet.length)
          this.policyallocamount()


         }else{

          for(let i=0;i<this.misallocationtodet.length;i++){
 
          
            if(this.misallocationtodet[i].receiptNumber !== u.recepitNumber){
    
              alert("adding")
            
                 var obj = {}
                 obj["amount"] = u.amount
                 obj["collectionflag"] = u.collectionflag
                 obj["id"] = u.id
                 obj["period"] = u.period
                 obj["partyid"]=u.partyid
                 obj["partyname"]=u.partyname
                 obj["policyCode"]=u.policyCode
                 obj["policyid"]=u.policyid
                 obj["policystatus"]=u.policystatus
                 obj["postingStatus"]=u.postingstatus
                 obj["recepitNumber"]=u.recepitNumber
                 obj["misallocationId"]=u.misallocationId
                  this.misallocationtodet.push(obj);
                  alert("size of todet array --->"+this.misallocationtodet.length)
                  count=1
                  this.policyallocamount()
                  break;
    
            }
          }
          



         }
           
    }

       
      

   

  }


 
   // getting policy details



   getpolicycodedetails(){
    
    var policycode= this.myForm.get('policyCode2').value
    alert("policy code coming from user side ---->"+policycode)

    this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/misallocationcorrection/policyinfo?policycode='+policycode).subscribe(response=>{
      console.log(response)
      this.policydetails=response

      if(this.policydetails.length==0){
        alert("no policy found with this policy code");
        
      } else{
        this.myForm.patchValue({
          policyCode2:this.policydetails[0].policycode,
          status:this.policydetails[0].postingStatus, 
          payer:this.policydetails[0].partyName

        })
      }
     
    
   

      
    },(error)=>console.log(error));


   }

 


   // code for checking wheteher user is check the checkbox in order to allocate the policy
   policyallocatecorrection(){
     if(this.misallocationtodet.length==0){
       alert("please select a policy ")
     }else{

      let misallocatedid = this.misallocatedInput.get('misallocationID').value;
   if(misallocatedid==0){
     alert("we are saving the record ")

      // console.log("reversal amount--->"+this.misallocationtodet[0].amount)
      // console.log("allocated amount--->"+this.misallocationtodet[0].amount)
      // console.log("posting status --->"+this.misallocationtodet[0].postingStatus)
    
       
       if(this.misallocatedInput.get('misallocationID').value==0){
         alert("entering into 3 stages programm")
        this.inserthdrrecord()
        
      
       } else{
         alert("enter into 2 stages programm")
        this.insertingrecordmisallocfromdet(this.misallochdrid,this.misallocationtodet)
        this.insertrecordmisalloctodet(this.misallochdrid,this.misallocationtodet)
       }
      
       





   }else {
     alert("we are updating the record ")
     this.insertingrecordmisallocfromdet(this.misallocatedInput.get('misallocationID').value,this.misallocationtodet)
        this.insertrecordmisalloctodet(this.misallocatedInput.get('misallocationID').value,this.misallocationtodet)


   }

     }
   }

  // inserting the record to misallochdr

  inserthdrrecord(){
      
    this.http.post('http://192.168.1.58:9090/CashOffice-Test/api/allocations/misallocationcorrection/misallocationhdrrecordinsert',{
         "totalReversalAmt":this.totalmisallocationreversalamount, 
         "totalAllocatedAmt":this.totalmisallocationreversalamount,
         "postingStatus":null,
         "createdBy":"Naveen",
         "modifiedBy":"Naveen"
    }
 
    
    ).subscribe( response=>{
      console.log(response+"this will be used for futhuerused to save todet")
   
      this.misallochdrid = response 

     alert(this.misallochdrid)
     this.misallocatedInput.controls['misallocationID'].setValue(this.misallochdrid)

     console.log("misallocationhdr id --->"+this.misallochdrid)
     this.insertingrecordmisallocfromdet(this.misallocatedInput.get('misallocationID').value,this.misallocationtodet)
        this.insertrecordmisalloctodet(this.misallocatedInput.get('misallocationID').value,this.misallocationtodet)
    
      
     

      
    },(error)=>console.log(error)
    
    
  );


 }
  

   

   // inserting tohdr
   insertingrecordmisallocfromdet(id,s){

    alert("we are entering into from det post request --->"+id)
    this.http.post('http://192.168.1.58:9090/CashOffice-Test/api/allocations/misallocationcorrection/misallocationfromdetinsertnewrecord?misallocidhdr='+id,
     
 s

 
 ).subscribe( response=>{
   console.log(response+"this will be used for  to save todet and from det ")

  var POL_MISALLOCATION_from_detID = response 

  alert(POL_MISALLOCATION_from_detID)

  console.log("misallocationhdrfrm id --->"+POL_MISALLOCATION_from_detID)
 


   
 },(error)=>console.log(error)
 
 
);
   }
   
   

   // insert into misalloctodet

   insertrecordmisalloctodet(id,s){

    alert("we are entering into to det post request --->"+id)

    this.http.post('http://192.168.1.58:9090/CashOffice-Test/api/allocations/misallocationcorrection/misallocationtodetinsertnewrecord?misallocidhdr='+id,
     
    s
   
    
    ).subscribe( response=>{
      console.log(response+"this will be used for  to save todet and from det ")
   
     var POL_MISALLOCATION_to_detID = response 
   
     alert(POL_MISALLOCATION_to_detID)
   
     console.log("misallocationhdrto id --->"+POL_MISALLOCATION_to_detID)
    
   
   
      
    },(error)=>console.log(error)
    
    
   );


   }

  search(x){

    // alert("policy code---->"+x)
    this.getmisallocationdetails(x)
    this.misallocationtodet=[]
    

  }
    
 
 




//  [checked]="value ? true : false
 
// onSelect(x, position) 
// {
//   var element = <HTMLInputElement> document.getElementById(position);
//   var isChecked = element.checked;
  
//   this.selectedItem = x ;
//   console.log("Selected item No. " + position ) ; // dbg
  
//   if(isChecked){
//     this.selectedItem2.push(x);
//     // console.log("issa chkd") ; //dbg
//   }
//   else
//   {
//     // console.table(this.selectedItem2);
//     this.selectedItem2.splice( this.selectedItem2.findIndex(a => a.collID==x.collID) ,1);
//     // console.table(this.selectedItem2);
//     // position-1;

//   }
  
//   console.log( this.selectedItem2.length );
//   this.makeCorrections = true;
// }

clear(){
 
  this.misallocatedInput.get('policyCode').reset();
  this.misallocatedInput.get('misallocationID').setValue(0);
 
}

exit(){
  // Re-direct to app landing page
  window.location.href = "http://localhost:4200/#/dashboard" ;
}

save(){
  
   this.policyallocatecorrection();
}



setPage(page: number) {
  if (page < 1 || page > this.pager.totalPages) {
    return;
  }
  // get pager object from service
  this.pager = this.pagerService.getPager(this.misallocationpolicy.length, page, 10);

  // get current page of items
  this.pagedItems = this.misallocationpolicy.slice(this.pager.startIndex, this.pager.endIndex + 1);
}
// 

  // total: number = 
  //   this.misallocations.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.amount}, 0 ) ;
  //   total2: number = 
  //   this.selectedItem2.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.amount}, 0 ) ;

}