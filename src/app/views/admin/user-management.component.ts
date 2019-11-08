// User Management - Admin Module 

import { Component, NgModule,Output,EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


import { PagerService, GlobalServices } from './../../services/index';
import { HttpClient, HttpParams} from '@angular/common/http';

import { AdminService } from './admin.service';
import { Http } from '@angular/http';
import { Users } from './users';



@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule
    // ,  HttpClient, HttpHeaders
  ]
})

@Component({
  templateUrl: './user-management.component.html'
})

export class UserManagementComponent {
  userInput:FormGroup ;
  groupInput:FormGroup;

  constructor(private http: HttpClient,private pagerService: PagerService,private adminservice: AdminService){
    this.userInput = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      enabled: new FormControl(''),
      branchName: new FormControl('', Validators.required
      )
    }) ;
  
    this.groupInput = new FormGroup({
      username: new FormControl({value:'', disabled:true}), //Validators.required),
      firstName: new FormControl({value:'', disabled:true}),
      lastName: new FormControl({value:'', disabled:true}),
      groupName: new FormControl('', Validators.required),
      groupDesc: new FormControl({value:'', disabled:true}),
      enabled: new FormControl({value:'', disabled:true}),
    }) ;
    
     
     
  }

  // writing the code for sending data from usermanagement component to rest-password component

  //  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

   

  viewUserGroups = false ;
  viewUserMgt = true ;
  users:any;
  pager: any = {};
  pagedItems: any[];
  usergroup:any;
  statusMessage: string;
  branchname:any;
  branchdetalis:any;
  branchcode:any;
  abc:any;

 

  ngOnInit() {

     
     this.getusers();
     this.getusergroup();

     this.userInput.controls['password'].setValue('Temp#1234');


      this.getallbranchnamesdetails();
    
  }
    

  getusers(){
    
    this.adminservice.getallusers()
        .subscribe((bd) =>
         {this.users=bd;
         
          // setpage is used for pagination
          this.setPage(1);},
        (error) =>{
            console.log(error);
            this.statusMessage = "Problem with service. Please try again later!";
        }
      
     
    );    
    
}

getallbranchnamesdetails(){
  this.adminservice.getallbranchnames()
  .subscribe((bbb) =>
         {this.branchdetalis=bbb;
          console.log(bbb);
          console.log(this.branchdetalis[0]);
          // setpage is used for pagination
        },
        (error) =>{
            console.log(error);
            this.statusMessage = "Problem with service. Please try again later!";
        }
      
     
    );    
}


getusergroup(){
  this.adminservice.getallusergroup()
        .subscribe((bb) =>
         {this.usergroup=bb;
          console.log(bb);
          console.log(this.usergroup[0]);
          // setpage is used for pagination
        },
        (error) =>{
            console.log(error);
            this.statusMessage = "Problem with service. Please try again later!";
        }
      
     
    );    
    

}

    
    

  save(userInput) {
    console.log(this.userInput.value.username);
    console.log(this.userInput.value.password);


    let us = this.userInput.value.username;
    let userfs = this.userInput.value.firstName;
    let branchname = this.userInput.value.branchName;
    let usersBody = this.userInput.value;

    alert(branchname);

    console.log(us);
    console.log(userfs+"this is to find the firstname");

    // const  params = new  HttpParams().set('branchcodedetails', this.branchcode);

    let bcode = this.branchdetalis.filter(app => app.branch_name == branchname )
    let bcode2;
    if(bcode.length != 0){
      bcode2 = bcode[0].branch_code
    }

    this.branchcode =bcode2;
   
    alert(bcode2);



     let record = this.users.filter(app => app.username == us ) 

     if(record.length != 0){

      this.http.put(`http://192.168.1.118:9090/CashOffice-Test/api/admin/usermanagement/userupdatedrecord?firstname=${userfs}&branchcode=${bcode2}`,usersBody)
      .subscribe(
        response => {
          console.log(response);
          alert("user updating is successfully Updated");
        },error =>{
          alert("Error while updating existing user");
          console.log(error);
        }
      );


    } else {

   if(this.userInput.get('enabled').value == null )  { 

    this.userInput.controls['enabled'].setValue(0);

    }

    else {
      this.userInput.controls['enabled'].setValue(1);
    }

    this.http.post('http://192.168.1.118:9090/CashOffice-Test/api/admin/usersave?branchcode='+bcode2,
      this.userInput.value).subscribe(
        response => {
          console.log(response);
          alert("user saving is successfully Created/Updated");
        },error =>{
          alert("Error while saving user"+" -> "+ JSON.stringify(error));
        }
      );

    }
  }
 
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.users.length, page, 10);

    // get current page of items
    this.pagedItems = this.users.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

 

  element(username,password,firstname,lastname,checkedbox) {
 
    console.log(firstname); 
    console.log(checkedbox);       

    this.userInput.patchValue({
      username:username,
      password:password,
      lastName:lastname,
      firstName:firstname,
      enabled:checkedbox
      
    })
 }
  
 
 assignGroup(){
    this.viewUserMgt = false ;
    this.viewUserGroups = true ; 
    this.userInput.disable() ;

  

    // other assignGroup code here
  }
  
  clear(){
    
    this.userInput.reset() ;
   
  
  
  }
  

  clearUserGroups(){
    this.groupInput.reset() ;
  }

  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }

  exitUserGroups(){
    this.viewUserGroups = false ;
    this.viewUserMgt = true ;

    this.userInput.enable() ;
  }

  search(value){
    let cashier=this.users.filter(app => app.firstName == value);
    if(cashier.length != 0){
      this.userInput.patchValue({
        username: cashier[0].username,
        password: cashier[0].password,
        lastName: cashier[0].lastName,
        firstName: cashier[0].firstName
       
      });
    }else{
      alert("No user exits with that first name "+value);
    }    
  }


 updategroupdesc(event){

  let desc = this.usergroup.filter(app => app.authority ==  event.target.value);

  

  if(desc.length != 0 ){
    this.groupInput.patchValue({
      groupDesc: desc[0].groupauthoritydesc
    }
    );
  }

 }
 
  reset(){
    this.userInput.patchValue({
      userName:'',
      password:'',
      lastName:'',
      firstName:'',
      
    })
  }

  save1(value){
  console.log(value.value.firstName);
  }

 

  saveUserGroups(){

  }

  // Array to hold dynamic data - Users
  // users = [
  //   { username: "ioamu", password: "ioamu221", firstName: "Yioagos", lastName: "Avraamu", enabled: "false"},
  //   { username: "amios", password: "amios332", firstName: "Avram", lastName: "Tarasios", enabled: "true"},
  //   { username: "inard", password: "inard2341", firstName: "Quitin", lastName: "Edward", enabled: "false"}
  // ]

  // Array to hold dynamic data - User Groups
  // userGroups = [
  //   { groupName: "CAS", groupDesc: "Cashier", firstName: "Yioagos", lastName: "Avraamu", enabled: "false"},
  //   { groupName: "SRC", groupDesc: "Senior Cashier", firstName: "Avram", lastName: "Tarasios", enabled: "true"},
  //   { groupName: "CAS", groupDesc: "Cashier", firstName: "Quitin", lastName: "Edward", enabled: "false"}
  // ]

  //[checked]="assignee.enb=='true'
  
}


