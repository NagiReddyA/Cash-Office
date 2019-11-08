import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'cashofficemaster',
        loadChildren: './views/cashofficemaster/cashofficemaster.module#CashOfficeMasterModule'
      },
      {
        path: 'cashofficereports',
        loadChildren: './views/cashofficereports/cash-office-reports.module#CashOfficeReportsModule'
      },
      {
        path: 'paypointmaster',
        loadChildren: './views/paypointmaster/paypointmaster.module#PaypointMasterModule'
      },
      {
        path: 'cashofficetransaction',
        loadChildren: './views/cashofficetransaction/cashofficetransaction.module#CashOfficeTransactionMasterModule'
      },
      {
        path: 'paypointtransaction',
        loadChildren: './views/paypointtransaction/paypointtransaction.module#PaypointTransactionModule'
      },
      {
        path: 'paypoint-reports',
        loadChildren: './views/paypointreports/paypoint-reports.module#PaypointReportsModule'
      }, 
      {
        path: 'allocation',
        loadChildren: './views/allocation/allocation.module#AllocationModule'
      },
      {
        path: 'admin',
        loadChildren: './views/admin/admin.module#AdminModule'
      },
      {
        path: 'user',
        loadChildren: './views/user/user.module#UserModule'
      },
      {
        path: 'charts',
        loadChildren: './views/chartjs/chartjs.module#ChartJSModule'
      },
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
     
      {
        path: 'icons',
        loadChildren: './views/icons/icons.module#IconsModule'
      },
      {
        path: 'notifications',
        loadChildren: './views/notifications/notifications.module#NotificationsModule'
      },
      {
        path: 'widgets',
        loadChildren: './views/widgets/widgets.module#WidgetsModule'
      },
     
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
