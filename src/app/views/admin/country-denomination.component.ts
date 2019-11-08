import { apiURL } from '../../_nav';
import { Component, NgModule, ɵConsole } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReturnStatement } from '@angular/compiler';
import { isUndefined } from 'util';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators]
})

@Component({
  templateUrl: 'country-denomination.component.html',
  providers: [DatePipe]
})
export class CountryDenominationComponent {

  countryDenomination: FormGroup;
  CountryDetails: any;
  details: Array<any> = [];
  data: Array<any> = [];
  enabled; any;
  temp: any;
  code: Array<any> = [];
  varcode: any;
  constructor(private http: HttpClient) {
    this.countryDenomination = new FormGroup(
      {
        countryName: new FormControl(''),
        countryCode: new FormControl(''),
        denominationCode: new FormControl(''),
        denominationcode: new FormControl(''),
        currencyCode: new FormControl(''),
        enabled: new FormControl('')
      }
    )
  }

  //To get the countries dtails with their currency code
  ngOnInit() {
    this.http.get(apiURL + '/getCountryDetails/')
      .subscribe(
        data => {
          console.log(data);
          this.CountryDetails = data;
        });
  }

  //to get Denominations based on selected country
  updateCountry(event) {
    console.log(event);
    let co = this.CountryDetails.filter(co => co.countryName == event.target.value)[0];
    // console.log(event.target.value + JSON.stringify(co));
    this.countryDenomination.patchValue({
      currencyCode: co.currencyCode
    })
    this.http.get(apiURL + '/getDenominationCodeDetails/' + JSON.stringify(co.countryName))
      .subscribe(
        data => {
          console.log(data);
          this.temp = data;
        });
  }

  clear() {
    //Clear all Input Parameter values
    this.countryDenomination.reset();
    this.temp = null;
    this.ngOnInit();
  }

  //to save the All the Denominations and country deails.
  save(countryDenomination) {
    if (this.countryDenomination.value.enabled)
      this.countryDenomination.controls['enabled'].setValue(1);
    else
      this.countryDenomination.controls['enabled'].setValue(0);

    let code = this.temp.filter(app => app.denominationCode == this.countryDenomination.value.denominationCode);
    console.log(code);
    console.log(this.countryDenomination.value);

    this.http.post(apiURL + '/createDenomination',
      this.countryDenomination.value).subscribe(
        response => {
          console.log(response);
          alert("Denomination is successfully Created/Updated");
        }, error => {
          alert("Error while saving Denomination");
        }
      );
    alert("Denomination Saved successfully");
    window.location.reload();

  }
}
