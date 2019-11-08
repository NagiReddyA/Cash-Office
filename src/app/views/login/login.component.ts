import { Component } from '@angular/core';
import {FormControl,FormGroup} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/finally';
import { Observable } from 'rxjs';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { apiURL } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  userDtls:any;
  constructor(private http :HttpClient,private router:Router){

  }
  ngOnInit() {
    sessionStorage.clear();
    sessionStorage.setItem('token', '');
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }
  userLogin(value) {
    console.log(this.loginForm.value);
    let Id=this.loginForm.get('username').value;
    let Pwd=this.loginForm.get('password').value.toString();
    console.log("Password: "+Pwd);
    this.http.get(apiURL+`/userAuthenticate?uName=${Id}&Pwd=${Pwd} `).subscribe(
      response => {
        this.userDtls=response; 
        console.log(response);       
        
        if (this.userDtls.length>0) {   
          alert("Authentication Successful.")
          console.log("User Details:"+this.userDtls[0].firstName);
          sessionStorage.setItem('userName', Id);
          sessionStorage.setItem('FirstName', this.userDtls[0].firstName);
          sessionStorage.setItem('LastName', this.userDtls[0].lastName);
          sessionStorage.setItem('userID', this.userDtls[0].userId);
          sessionStorage.setItem('BranchCode', this.userDtls[0].branchCode);
          sessionStorage.setItem('CashierID', this.userDtls[0].attribute1);
          window.location.href = "http://localhost:4200/#/dashboard" ;  
        } else {
          alert("Authentication failed.")
          this.loginForm.reset();   
      }
  });   
}
}    
