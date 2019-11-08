export const navItems = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Cash Office'
  },
  {
    name: 'CashOffice Master',
    url: '/cashofficemaster',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Setup Cashier',
        url: '/cashofficemaster/setupcashier',
        //icon: 'icon-star'
      },
      {
        name: 'Setup PaymentMethod',
        url: '/cashofficemaster/setuppaymentmethod',
        //icon: 'icon-star'
      },
      {
        name: 'Setup Applications',
        url: '/cashofficemaster/setupapplications',
        //icon: 'icon-star'
      },
      {
        name: 'Setup CashOffice',
        url: '/cashofficemaster/setupcashoffice',
        //icon: 'icon-star'
      },
      {
        name: 'Assign Cashier',
        url: '/cashofficemaster/assigncashier',
        //icon: 'icon-star'
      }      
    ]
  }, 
  {
    name: 'CashOffice Transactions',
    url: '/cashofficetransaction',
    icon: 'icon-puzzle',
    children: [
        
    {
      name: 'Cash Office Activity',
      url: '/cashofficetransaction/cashofficeactivity',
      //icon: 'icon-star'
    },
    {
      name: 'Cash Till Activity',
      url: '/cashofficetransaction/cashtillactivity',
      //icon: 'icon-star'
    },
    {
      name: 'Payment Receipt',
      url: '/cashofficetransaction/paymentreceipt',
      //icon: 'icon-star'
    },
      {
        name: 'Query Receipt',
        url: '/cashofficetransaction/QueryReceipt',
        //icon: 'icon-star'
      },
      {
        name: 'Cancel Payment Receipt',
        url: '/cashofficetransaction/cancelpaymentreceipt',
        //icon: 'icon-star'
      },
    
    {
      name: 'Approve Receipt Cancellation',
      url: '/cashofficetransaction/Approvecancellation',
      //icon: 'icon-star'
    },
    {
      name: 'Print Bank Deposit Slip',
      url: '/cashofficetransaction/PrintSlip',
      //icon: 'icon-star'
    },
   
    {
      name: 'Receipt Posting',
      url: '/cashofficetransaction/ReceiptPosting',
      //icon: 'icon-star'
    }
    
      // {
      //   name: 'Secured Loan Enquiry',
      //   url: '/cashofficetransaction/secureloanenquire',
      //   //icon: 'icon-star'
      // }             
    ]
  },
  {
    name: 'CashOffice Reports',
    url: '/cashofficereports',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Daily Receipt Listing',
        url: '/cashofficereports/receipt-listing',
        //icon: 'icon-star'
      },
      {
        name: 'Reprint Receipt',
        url: '/cashofficereports/reprint-receipt',
        //icon: 'icon-star'
      },  
      {
        name: 'Reprint Deposit Slip',
        url: '/cashofficereports/deposit-slip',
        //icon: 'icon-star'
      },
      {
        name: 'Collection By Branch',  
        url: '/cashofficereports/collection-branch', 
        //icon: 'icon-star'
      },
      {
        name: 'Collection By Application-Summary',
        url: '/cashofficereports/collection-app-summary',
        //icon: 'icon-star'
      },
      {
        name: 'Collection By Application-Detail',
        url: '/cashofficereports/collection-app-detail',
        //icon: 'icon-star'
      },
      {
        name: 'Cashier Assignment',
        url: '/cashofficereports/cashier-assignment',
        //icon: 'icon-star'
      }           
    ]
  },
      
  {
    name: 'Pay Point Master',
    url: '/paypointmaster',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Debit File Template Assignment',
        url: '/paypointmaster/debit-file-template-assignment',
        //icon: 'icon-star'        
      },
      {
        name: 'File Designer',
        url: '/paypointmaster/filedesigner',
        //icon: 'icon-star'
      }      
    ]
  },
 
  {
    name: 'Pay Point Transaction',
    url: '/paypointtransaction',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Generate DebitFile',
        url: '/paypointtransaction/generate-debitfile',
        //icon: 'icon-star'        
      },
      {
        name: 'Split/Merge DebitFile',
        url: '/paypointtransaction/split-merge-debitfile',
        //icon: 'icon-star'
      },
      {
        name: 'Split/Merge Search',
        url: '/paypointtransaction/split-merge-search',
        //icon: 'icon-star'
      },
      {
        name: 'Upload CreditFile',
        url: '/paypointtransaction/upload-creditfile',
        //icon: 'icon-star'
      }      
    ]
  },

  {
    name: 'Allocation',
    url: '/allocation',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Electronic Allocation',
        url: '/allocation/electronic',
        //icon: 'icon-star'
      },
      {
        name: 'Manual Allocation',
        url: '/allocation/manual-allocation',
        //icon: 'icon-star'
      },
      {
        name: 'Direct Debit Processing',
        url: '/allocation/direct-debit',
        //icon: 'icon-star'
      },
      {
        name: 'Bank Stop Order Processing',
        url: '/allocation/bank-processing',
        //icon: 'icon-star'
      },
      {
        name: 'Bank Statement Posting',
        url: '/allocation/bank-posting',
        //icon: 'icon-star'
      },
      {
        name: 'Misallocation correction',
        url: '/allocation/missallocation-correction',
        //icon: 'icon-star'
      },
      {
        name: 'Pay Point Misallocation',
        url: '/allocation/paypoint-missallocation',
        //icon: 'icon-star'
      },
      {
        name: 'Bank Statement Adjustment Voucher',
        url: '/allocation/bank-adjustment',
        //icon: 'icon-star'
      },
      {
        name: 'Manual Adjustment Voucher',
        url: '/allocation/manual-adjustment',
        //icon: 'icon-star'
      },
      {
        name: 'Pay Point Collection History',
        url: '/allocation/paypoint-history',
       // icon: 'icon-star'
      },
      {
        name: 'Partial Misallocation Correction',
        url: '/allocation/partial-correction',
        //icon: 'icon-star'
      }
      
      
    ]  
  },

  {
    name: 'PayPoint Reports',
    url: '/paypoint-reports',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Overs And Unders',
        url: '/paypoint-reports/oversandunders',
        //icon: 'icon-bell'
      },
  
    {
      name: 'Rejections',
      url: '/paypoint-reports/rejections',
      //icon: 'icon-bell'
    },
    {
      name: 'PayPoint Summary',
      url: '/paypoint-reports/paypoint-summary',
      //icon: 'icon-bell'
    },
    {
      name: 'UnAllocated Cash Reciepts',
      url: '/paypoint-reports/unallocated-cashReciepts',
      //icon: 'icon-bell'
    },
    { 
      name: 'Unmatched Credits',
      url: '/paypoint-reports/unmatchedCredit',
      //icon: 'icon-bell'
    },
    {
      name: 'Reciept Allocation Status',
      url: '/paypoint-reports/reciept-allocation-status',
      //icon: 'icon-bell'
    }
    ,
    {
      name: 'Unspecified Bank',
      url: '/paypoint-reports/unspecified-bank',
    }
    ,
    {
      name: 'Unspecified GSO-ESO',
      url: '/paypoint-reports/unspecified-gsoeso',
    },
    {
      name: 'Bank Statement',
      url: '/paypoint-reports/bank-statement',
    },
    {
      name: 'Manual Adjustment Report',
      url: '/paypoint-reports/manual-adjustment'
    },
    {
      name: 'Bank Statement Allocation',
      url: '/paypoint-reports/statement-allocation'
    }
    
  ]
  },
  {
    name: 'Admin',
    url: '/admin',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'User Management',
        url: '/admin/user-management',
        //icon: 'icon-bell'
      },  
    {
      name: 'Assign Role',
      url: '/admin/assign-role',
      //icon: 'icon-bell'
    },
    {
      name: 'Group Master',
      url: '/admin/group-master',
      //icon: 'icon-bell'
    },
    {
      name: 'Page Access',
      url: '/admin/page-access',
      //icon: 'icon-bell'
    },
    { 
      name: 'Reset Password',
      url: '/admin/reset-password',
      //icon: 'icon-bell'
    } ,  
    {
      name: 'Country Denomination',
      url: '/admin/country-denomination',
      //icon: 'icon-bell'
    }
  ]
  },
  {
    name: 'User',
    url: '/user',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Password Management',
        url: '/user/pass-management',
        //icon: 'icon-bell'
      }  ]
  },
  /*{
    name: 'Charts',
    url: '/charts',
    icon: 'icon-pie-chart'
  },

  {
    name: 'Icons',
    url: '/icons',
    icon: 'icon-star',
    children: [
      {
        name: 'CoreUI Icons',
        url: '/icons/coreui-icons',
        icon: 'icon-star',
        badge: {
          variant: 'success',
          text: 'NEW'
        }
      },
      {
        name: 'Flags',
        url: '/icons/flags',
        icon: 'icon-star'
      },
      {
        name: 'Font Awesome',
        url: '/icons/font-awesome',
        icon: 'icon-star',
        badge: {
          variant: 'secondary',
          text: '4.7'
        }
      },
      {
        name: 'Simple Line Icons',
        url: '/icons/simple-line-icons',
        icon: 'icon-star'
      }
    ]
  },
  {
    name: 'Notifications',
    url: '/notifications',
    icon: 'icon-bell',
    children: [
      {
        name: 'Alerts',
        url: '/notifications/alerts',
        icon: 'icon-bell'
      },
      {
        name: 'Badges',
        url: '/notifications/badges',
        icon: 'icon-bell'
      },
      {
        name: 'Modals',
        url: '/notifications/modals',
        icon: 'icon-bell'
      }
    ]
  }, 
  {
    name: 'Widgets',
    url: '/widgets',
    icon: 'icon-calculator',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },*/
  {
    divider: true
  },
  {
    title: true,
    name: 'Extras',
  },
  {
    name: 'Pages',
    url: '/pages',
    icon: 'icon-star',
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'icon-star'
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'icon-star'
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'icon-star'
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'icon-star'
      }
    ]    
  }
 
];
//export const apiURL="http://192.168.1.158:9090/CashOffice-Test/api";  
export const apiURL="http://localhost:9090/CashOffice-Test/api";  
//export const apiURL="http://192.168.1.113:9090/CashOffice-Test/api";
//export const apiURL="http://192.168.1.18:9090/CashOffice-Test/api";
//export const apiURL="http://192.168.1.135:9090/CashOffice-Test/api"; 