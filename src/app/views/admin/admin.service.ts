
import {Injectable} from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Users } from './users';


@Injectable()
export class AdminService{



     
 
    constructor(private httpservice:Http){}
 
    //code for getting all the users from USER table
    getallusers():Observable<Users[]>{       

        
        return this.httpservice.get("http://192.168.1.58:9090/CashOffice-Test/api/admin/usermanagement")
                .map((response: Response) => {
                    console.log("service data"+response);
                    return response.json(); })
                .catch(this.handleError);

    }


    getallusergroup(){
        return this.httpservice.get("http://192.168.1.58:9090/CashOffice-Test/api/admin/usergroup")
        .map((responsegroup: Response) => { console.log(responsegroup); return responsegroup.json(); })
        .catch(this.handleError);


    }



    // code for updating the users password 

    resetuserspassword(userfs,userdetail){

        return this.httpservice.put('http://192.168.1.58:9090/CashOffice-Test/api/admin/usermanagement/passwordreset?username='+userfs,userdetail)
        .map((responsegroup: Response) => { console.log(responsegroup); return responsegroup.json(); })
        .catch(this.handleError);
    }
  

    getallbranchnames(){

        return this.httpservice.get('http://192.168.1.58:9090/CashOffice-Test/api/admin/branchnames')
        .map((responsegroup: Response) => { console.log(responsegroup); return responsegroup.json(); })
        .catch(this.handleError);
    }
 
//     getallstmthrd():Observable<any>{
// console.log("admin service");
// let code =353423;
//         return this.httpservice.get('http://192.168.1.118:9090/CashOffice-Test/api/allocations/stmt/DetReversals')
//         .map((responsegroup: Response) => { console.log(responsegroup); return responsegroup.json(); })
//         .catch(this.handleError);
//     }
    getstmthdrlist():Observable<any>{       
  
        return this.httpservice.get("192.168.1.58:9090/CashOffice-Test/api/allocations/stmt/DetReversals")
                .map((response: Response) => {
                    console.log("service data"+response);
                    return response.json(); })
                .catch(this.handleError);

    }




  // to handle the error
  private handleError(error: Response){
    console.error(error);
    return Observable.throw(error);
}



}