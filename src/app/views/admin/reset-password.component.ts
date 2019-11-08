// Reset Password - Admin Module

import { Component, NgModule,Input, ɵConsole } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SELECTOR } from 'ngx-bootstrap/modal/modal-options.class';
import { AdminService } from './admin.service';


@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule
  ]
})

@Component({
  templateUrl: 'reset-password.component.html',
  selector: 'app-child'
})
export class ResetPasswordComponent {


   userdetails:any;
   statusMessage:any;
   desc:any;
   userInputDetails:FormGroup;
   passworddetails:any;



 
  constructor(private adminservice:AdminService){


    this.userInputDetails = new FormGroup({
      pusername: new FormControl(''), //Validators.required),
      pfirstName: new FormControl(''),
      plastName: new FormControl('')
    }) ;
     

  }


  ngOnInit(){

    console.log("calling user details");
     
    this.getallusersdetails();
   
  }

   getallusersdetails(){

    this.adminservice.getallusers()
    .subscribe((bd) =>
     {this.userdetails=bd;
      console.log(bd);
          console.log(this.userdetails[0]);
     
    
     },
    (error) =>{
        console.log(error);
        this.statusMessage = "Problem with service. Please try again later!";
    }
  
 
); 

    
   }


   // to find user by  using change event 

   updategroupdesc(event){
            
     this.desc = this.userdetails.filter(app => app.username == event.target.value);

     console.log("value is printing"+event.target.value);

     

    if(this.desc != 0){

      this.userInputDetails.patchValue({
        pfirstName: this.desc[0].firstName,
        plastName:this.desc[0].lastName

      });
    }
      
   }

  
   // updating the user password

   resetpass(v){
   
    console.log(v);

    alert(v);

    let us = v.pusername;

    alert(us);


    this.adminservice.resetuserspassword(us,v)
    .subscribe((bd) =>
     {this.passworddetails=bd;
      console.log(bd);

      alert(this.passworddetails.password);
      
     
    
     },
    (error) =>{
        console.log(error);
        this.statusMessage = "Problem with service. Please try again later!";
    }
  
 
); 
 
  

      
   }

  

  clear(){
    this.userInputDetails.reset() ;
  }

  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }

  reset(){}

}
