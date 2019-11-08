import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalServices } from '../../services/globalservices';
import { apiURL } from '../../_nav';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa("ashok:password")
  })
};

@Component({
  templateUrl: 'setupapplications.component.html'
})
export class SetUpApplicationsComponent {
  currAppCode: string;
  currAppDesc: string;
  currAppId: number; 
  marked = false;
  applications: any;
  activities: any;
  setupAppActivity: FormGroup;
  constructor(private http: HttpClient, private gs: GlobalServices) {
    this.setupAppActivity = new FormGroup(
      {
        appCode: new FormControl('', Validators.required),
        appDesc: new FormControl('', Validators.required),
        appActivityCode: new FormControl(),
        appActivityDesc: new FormControl(),
        enabled: new FormControl(),
        appId: new FormControl()
      }
    )
  }
  ngOnInit() {
    //Service Call to get all Application details and display in Table
    this.gs.getApplications().subscribe(
      (data) => {
        this.applications = data;
      }
    );
  }
  //To Assign the  all Application details to the fields
  fetchActivities(appCode, appDesc, appId) {
    this.setupAppActivity.patchValue({
      appCode: appCode,
      appDesc: appDesc,
      appId: appId
    })
    this.http.get(apiURL + '/getActivities/' + appCode).subscribe(
      (response) => {
        this.activities = response;
      }
    );
  }
  addRow() {
    this.activities.push({
      code: "",
      desc: "",
      enabled: false
    });
  }

  //To save the all application details
  saveActivity(value) {
    if (this.setupAppActivity.get('enabled').value == null || this.setupAppActivity.get('enabled').value == false) {
      this.setupAppActivity.controls['enabled'].setValue(0);
    } else {
      this.setupAppActivity.controls['enabled'].setValue(1);
    }
  
    let obs = this.http.post(apiURL + '/saveActivity', this.setupAppActivity.value);
    obs.subscribe(response => {
      alert("Application/activity successfully saved");
    }, error => {
      alert("Error while saving the Application/Activity");
    })
  }

  //To clear the form group values
  clear() {
    this.setupAppActivity.reset(); 
    this.activities=null;
  }

  //To fetch the values and assign to the fields
  search(value) {
    let appl = this.applications.filter(app => app.applicationCode == value.toUpperCase());
    this.fetchActivities(appl[0].applicationCode, appl[0].applicationDesc, appl[0].appId);
  }
} 
