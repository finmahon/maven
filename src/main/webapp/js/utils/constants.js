angular.module('citiClientOnboarding').constant('Constants', {
    commentMaxLength: 250,
    Roles: {
        admin: 'SYS_ADMIN',
        user: 'SYS_USER',
        guest: 'SYS_GUEST'
    },
    processState: [  
        { Id: 0, bpmState: 'Pending', uiState: 'Pending', Icon: 'fa-clock-o' },
        { Id: 1, bpmState: 'Active', uiState: 'Open', Icon: 'fa-thumbs-up' },
        { Id: 2, bpmState: 'Completed', uiState: 'Complete', Icon: 'fa-check' },
        { Id: 3, bpmState: 'Aborted', uiState: 'Cancelled', Icon: 'fa-exclamation-triangle' },
        { Id: 4, bpmState: 'Suspended', uiState: 'Paused', Icon: 'fa-pause-circle' }
    ], 
    ENV: { 
        'kieserver_host' : 'localhost',
        'kieserver_port' : '8080',
        'kieserver_citi_containerId' : 'citi_onboarding',
        'kieserver_ntb_processId' : 'com.citi.onboarding.ntb.newToBusinessEmea',
        'kieserver_etb_processId' : 'com.citi.onboarding.etb.existingToBusinessEmea',
        'kieserver_user' : 'user1',
        'kieserver_group' : 'casemanager-rus'
    },
    formMapper: [
        { 'InputText': 'input', 'type': 'text'},
        { 'InputTextEmail': 'input', 'type': 'email' },
        { 'InputTextInteger': 'input', type: 'number' },
        { 'InputTextPassword': 'input', type: 'password' }
    ],
    caseTypes : [
        {id : 'NTBL', desc: 'NTBL - for New to Bank - Liability only cases'},
        {id : 'NTBC', desc: 'NTBC - for New to Bank - with Credit Branch'},
        {id : 'ETBL', desc: 'ETBL - Existing to Bank - new Product'}
//      {id : 'ETBC', desc: 'ETB - Credit Renewal'}
    ],
    caseContactPositions : [
        'Chairman of the Board (CHB)',
        'Chief Executive Officer (CEO)',
        'President Chief Operating Officer (COO)',
        'Chief Finance Officer (CFO)',
        'Vice President (VP)',
        'Treasurer',
        'Controller',
        'Bookkeeper',
        'Board Member',
        'Director',
        'Executive Director',
        'Associate Director',
        'Managing Director',
        'Financial Manager',
        'Finance Supervisor',
        'Senior Financial Manager',
        'General Manager',
        'Other'
    ],
    accountNames : [
        "Main",
        "Auxilary"
    ],
    accountTypes : [
        'Checking',
        'CitiEscrow',
        'Deposit Administrator',
        'Security Deposit Control',
        'EMA',
        'Savings',
        'Money Market',
        'CD',
        'Current',
        'Transit' ,
        'Investment',
        'Deposit',
        'Corporate card account',
        'Customs card account'
    ],
    accountProducts : [
        { name: 'Cash', selected: false },
        { name: 'FX', selected: false },
        { name: 'Credit', selected: false },
        { name: 'Online Banking', selected: false },
        { name: 'Digital Signatures', selected: false },
        { name: 'Trade', selected: false }
    ],
    formTemplate: {
      "form": {
        "dataHolder": [
          {
            "id": "comments",
            "inputId": "",
            "name": "#B29FE4",
            "outId": "comments",
            "type": "basicType",
            "value": "java.lang.String"
          },
          {
            "id": "description",
            "inputId": "desc",
            "name": "#FF54A7",
            "outId": "",
            "type": "basicType",
            "value": "java.lang.String"
          },
          {
            "id": "project",
            "inputId": "project",
            "name": "#E9E371",
            "outId": "",
            "type": "basicType",
            "value": "java.lang.String"
          },
          {
            "id": "subject",
            "inputId": "subject",
            "name": "#E9E371",
            "outId": "",
            "type": "basicType",
            "value": "java.lang.String"
          }
        ],
        "displayMode": "default",
        "field": [
          {
            "errorMessage": "",
            "fieldClass": "java.lang.String",
            "fieldRequired": false,
            "groupWithPrevious": false,
            "hideContent": false,
            "id": 734456628,
            "inputBinding": "REDHAT ONBOARDING",
            "isHTML": false,
            "label": "Project",
            "name": "project",
            "position": 0,
            "readonly": true,
            "title": "",
            "type": "InputText"
          },
          {
            "errorMessage": "",
            "fieldClass": "java.lang.String",
            "fieldRequired": false,
            "groupWithPrevious": false,
            "hideContent": false,
            "id": 13473131,
            "inputBinding": "REDHAT ONBOARDING - OPENING NEW ACCOUNT OF x MILLION CREDIT.",
            "isHTML": false,
            "label": "Description",
            "name": "description",
            "position": 2,
            "readonly": true,
            "title": "",
            "type": "InputText"
          },
          {
            "fieldClass": "Separator",
            "fieldRequired": false,
            "groupWithPrevious": false,
            "id": 255316611,
            "name": ":decorator_0",
            "position": 3,
            "readonly": false,
            "type": "Separator"
          },
          {
            "errorMessage": "",
            "fieldClass": "java.lang.String",
            "fieldRequired": false,
            "groupWithPrevious": false,
            "hideContent": false,
            "id": 2029542310,
            "isHTML": false,
            "label": "Comments",
            "name": "comments",
            "outputBinding": "comments",
            "position": 4,
            "readonly": false,
            "title": "",
            "type": "InputText"
          },
          {
            "errorMessage": "",
            "fieldClass": "java.lang.String",
            "fieldRequired": false,
            "groupWithPrevious": false,
            "hideContent": false,
            "id": 547635705,
            "inputBinding": "NEW CUSTOMER READHAT ONBOARDING",
            "isHTML": false,
            "label": "Subject",
            "name": "subject",
            "position": 1,
            "readonly": true,
            "title": "",
            "type": "InputText"
          }
        ],
        "id": 684162958,
        "name": "TicketTask-taskform.form",
        "status": 0
      }
    },
    formTemplateData: {
      "form": {
        "dataHolder": [
          {
            "id": "ntbPreviousTaskEndTime",
            "inputId": "startTime",
            "name": "#9BCAFA",
            "outId": "finishTime",
            "type": "basicType",
            "value": "java.lang.String"
          },
          {
            "id": "ntbPreviousTaskStartTime",
            "inputId": "",
            "name": "#BBBBBB",
            "outId": "startTime",
            "type": "basicType",
            "value": "java.lang.String"
          }
        ],
        "displayMode": "default",
        "field": {
          "fieldClass": "java.lang.String",
          "fieldRequired": false,
          "id": 846970388,
          "inputBinding": "startTime",
          "label": "startTime (ntbPreviousTaskEndTime)",
          "name": "ntbPreviousTaskEndTime",
          "outputBinding": "finishTime",
          "position": 0,
          "readonly": false,
          "type": "InputText"
        },
        "id": 1242867301,
        "name": "Setstatusto'caseinitiated'-taskform.form",
        "status": 0
      }
    }



});


