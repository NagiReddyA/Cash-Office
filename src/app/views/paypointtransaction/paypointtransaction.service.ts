import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL } from '../../_nav';

@Injectable({
    providedIn: 'root'
})
export class PaypointTransactionService {

    constructor(private http: HttpClient) {

    }

    generateDebitFile(form) {
        return this.http.post(apiURL + "/generateDebitFileForPaypoint", form.value);
    }
    getTemplateNameForPaypoint(id) {
        return this.http.get(apiURL + "/getTemplateName/" + id, { responseType: 'text' });//this will use pathvariable at REST end
    }
    getFileDetails(period) {
        return this.http.get(apiURL + "/getDebitFilesDetails/"+ period);
    }

    splitDebitFile(input) {
        return this.http.post(apiURL + "/splitDebitFile", input);
    }
    mergeDebitFiles(input) {
        return this.http.post(apiURL + "/mergeDebitFiles", input);
    }
    searchSplitFiles(formValue){
        return this.http.get(apiURL+"/searchSplitFiles?period="+formValue.period+"&pp="+formValue.paypointId);
    }
    searchMergeFiles(formValue){
        return this.http.get(apiURL+"/searchMergeFiles?period="+formValue.period+"&pp="+formValue.paypointId);
    }

    getCreditFileName(paypointId){
        return this.http.get(apiURL+"/getCreditFileNameForPp?paypointId="+paypointId,{
            reportProgress: true,
            responseType: 'text'
          });
    }

    uploadCreditFile(formData) {
        return this.http.post(apiURL + "/uploadCrediFile", formData);
      }

}
