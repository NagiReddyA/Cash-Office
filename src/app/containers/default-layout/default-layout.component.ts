import { Component, Input } from '@angular/core';
import { navItems } from './../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  fullName:any;
  UserName:any;
  userId:any;
  constructor() {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }

  ngOnInit() {
    this.UserName=sessionStorage.getItem('FirstName')+ " " +
                  sessionStorage.getItem('LastName');
    this.userId=sessionStorage.getItem('userName');

    if(this.userId!= null){
      console.log("User Full Name: "+ this.UserName);
      console.log("User Id: "+ this.userId);
      this.fullName=this.UserName;
    }
    else
      window.location.href = "http://localhost:4200/#/login" ;     
  }
}
