// import { Injectable } from "@angular/core";
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, empty, forkJoin, Observable } from 'rxjs';
// import { take } from 'rxjs/operators';
// // import { Customer } from 'src/app/leadspotApp/Models/Customer';
// import { CustomerModel } from "../models/customer-model";
// // import { ContactBookModel } from '../models/ContactBookModel';
// import { ContactBookModel } from "../models/contact-book-model";
// // import { PlanModel } from '../models/PlanModel';
// import { PlanModel } from "../models/plan-model";
// // import { BackEndService } from './back-end.service';
// import { BackEndService } from "./back-end-service";
// // import { DashService } from './dash.service';
// import { of } from 'rxjs';
// @Injectable({
//   providedIn: 'root',
// })
// export class SharedService {
//   allData: any[] = new Array<any>();
//   allData$: BehaviorSubject<any[]>;
//   contactBookData$: BehaviorSubject<ContactBookModel>;
//   sharedata;
//   customerSourcesMap: Map<number, string> = new Map();
//   planData;
//   planData$: BehaviorSubject<PlanModel>;
//   workEmailsData$: BehaviorSubject<string[]>;

//   constructor(
//     private backEnd: BackEndService,
//     // private dash: DashService,
//     private http: HttpClient
//   ) {
//     this.sharedata = {
//       regions: [],
//       jobCategories: [],
//       countries: [],
//       industries: [],
//       states: [],
//       products: [],
//       statuses: [],
//       positions: [],
//       sizes: [],
//       userPlans: null,
//       templates: [],
//       campaigns: [],
//       tags: [],
//       customerSources: [],
//       templatesPlaceholders: [],
//       crmStats: [],
//       leadProjects: [],
//       clientVolume: null,
//       plan: null,
//       companyContactDiscovery: 0,
//       clientUsers: null,
//       customers: [],
//       partners: [],
//       companySearchStats: [],
//       BillingInfo: null,
//       clientContactBookCampaigns: [],
//       defaultList: null,
//       industryPhrases: new Map<any, any>(),
//     };
//     this.allData$ = <BehaviorSubject<any[]>>(
//       new BehaviorSubject(new Array<any>())
//     );
//     this.contactBookData$ = <BehaviorSubject<ContactBookModel>>(
//       new BehaviorSubject(new ContactBookModel())
//     );
//     this.planData$ = <BehaviorSubject<PlanModel>>(
//       new BehaviorSubject(new PlanModel())
//     );
//     this.workEmailsData$ = <BehaviorSubject<string[]>>(
//       new BehaviorSubject(new Array<string>())
//     );
//   }

//   getWorkEmailsBlackList() {
//     return this.http
//       .get<string>(
//         'https://gist.githubusercontent.com/okutbay/5b4974b70673dfdcc21c517632c1f984/raw/d20464bc292c182d46373e00650b6f7b81a17cc0/free_email_provider_domains.txt',
//         { responseType: 'text' as 'json' }
//       )
//       .pipe(take(1))
//       .subscribe((res) => {
//         this.workEmailsData$.next(res.split('\n'));
//       });
//   }

//   updateDefaultList(defaultList:any) {
//     this.sharedata.defaultList = defaultList;
//     this.allData$.next(this.sharedata);
//   }

//   addNewListWithStatusToContactBook(id, name) {
//     let list = {
//       id: parseInt(id),
//       name: name,
//       startDate: new Date(),
//       contacts: [],
//       taskStatus: 'IN PROGRESS',
//     };
//     this.sharedata.clientContactBookCampaigns.unshift(list);
//     let model = {
//       campaigns: this.sharedata.clientContactBookCampaigns,
//       defaultList: this.sharedata.defaultList,
//     };
//     this.contactBookData$.next(model);
//   }

//   updateContactBookCampaigns(data) {
//     let model = {
//       campaigns: data,
//       defaultList: this.sharedata.defaultList,
//     };
//     this.contactBookData$.next(model);
//   }

//   getDataForContactBook(callback?) {
//     this.backEnd.getClientCampaigns().subscribe((res) => {
//       this.sharedata.clientContactBookCampaigns = res;
//       var defualtListIndex =
//         this.sharedata.clientContactBookCampaigns.findIndex((li) => {
//           return li.defaultList;
//         });
//       if (defualtListIndex > -1) {
//         this.sharedata.defaultList =
//           this.sharedata.clientContactBookCampaigns[defualtListIndex];
//         this.sharedata.defaultList.verified =
//           this.sharedata.defaultList.contacts.filter((c) => {
//             return c.emails[0]?.isValid == 'TRUE';
//           }).length;
//         this.sharedata.clientContactBookCampaigns.splice(defualtListIndex, 1);
//         this.sharedata.clientContactBookCampaigns.forEach((element) => {
//           element.verified = element.contacts.filter((c) => {
//             return c.emails[0]?.isValid == 'TRUE';
//           }).length;
//         });
//       }
//       let model = {
//         campaigns: this.sharedata.clientContactBookCampaigns,
//         defaultList: localStorage.getItem('LeadSpotClientId')
//           ? this.sharedata.defaultList
//           : '',
//       };
//       this.contactBookData$.next(model);
//       callback ? callback() : '';
//     });
//   }

//   getPlanData() {
//     this.backEnd.clientPlan(0).subscribe((res) => {
//       this.planData$.next(res);
//     });
//   }

//   getShared(id = localStorage.getItem('LeadSpotClientId')) {
//     // if (this.allData$.value.length==0)

//     this.backEnd.getCrmConfig(id).subscribe((res) => {
//       this.sharedata.countriesPerRegion = res.countriesPerRegion;
//       this.sharedata.linkedInMapping = res.linkedInMapping;
//       this.sharedata.regions = res.regions;
//       this.sharedata.regions = res.regions.sort((a: any, b: any) => {
//         if (a.name > b.name) {
//           return 1;
//         }
//         if (a.name < b.name) {
//           return -1;
//         }
//         return 0;
//       });
//       this.sharedata.jobCategories = res.jobCategories.sort(
//         (a: any, b: any) => {
//           if (a.name > b.name) {
//             return 1;
//           }
//           if (a.name < b.name) {
//             return -1;
//           }
//           return 0;
//         }
//       );
//       this.sharedata.countries = res.countries;
//       this.sharedata.industries = res.industries.sort((a: any, b: any) => {
//         if (a.name > b.name) {
//           return 1;
//         }
//         if (a.name < b.name) {
//           return -1;
//         }
//         return 0;
//       });
//       this.sharedata.states = res.states;
//       this.sharedata.states = res.states.sort((a: any, b: any) => {
//         if (a.name > b.name) {
//           return 1;
//         }
//         if (a.name < b.name) {
//           return -1;
//         }
//         return 0;
//       });
//       this.sharedata.products = res.products;
//       this.sharedata.statuses = res.statuses;
//       this.sharedata.positions = res.positions;
//       this.sharedata.sizes = res.sizes;
//       this.sharedata.userPlans = res.plans;
//       this.sharedata.templates = res.templates;
//       this.sharedata.templates.map((t) => {
//         if (res.defaultTemplates?.some((m) => m.id == t.id)) t.isDefault = true;
//         return t;
//       });
//       this.sharedata.defaultTemplates = res.defaultTemplates;
//       this.sharedata.campaigns = res.campaigns;
//       this.sharedata.tags = res.tags;
//       this.sharedata.customerSources = res.customerSources;
//       this.sharedata.templatesPlaceholders = res.templatesPlaceholders;
//       //parse customerSources to key value
//       this.sharedata.customerSources.forEach((src) => {
//         this.customerSourcesMap.set(src.id, src.name);
//       });
//       let observables = [];
//       // observables.push(this.backEnd.getClientContactHistory())
//       observables.push(id ? this.backEnd.getCrmStats(id) : of(null));
//       observables.push(id ? this.backEnd.getLeadProjects(id) : of(null));
//       observables.push(id ? this.backEnd.clientPlan(id) : of(null));
//       observables.push(id ? this.backEnd.getclientUsers() : of(null));
//       observables.push(id ? this.backEnd.getCustomers(id) : of(null));
//       observables.push(id ? this.backEnd.getpartnerClients() : of(null));
//       observables.push(id ? this.backEnd.billingInfo() : of(null));
//       observables.push(this.backEnd.getIndustryPhrases());
//       observables.push(this.backEnd.getReadyLists());

//       if (
//         localStorage.getItem('LeadSpotAdminId') != '-1' &&
//         localStorage.getItem('LeadSpotAdminId')
//       ) {
//         this.backEnd
//           .getCrmConfig(localStorage.getItem('LeadSpotAdminId'))
//           .subscribe((res) => {
//             res.campaigns.forEach((element) => {
//               element.createdByAdmin = true;
//             });
//             res.products.forEach((element) => {
//               element.createdByAdmin = true;
//             });
//             res.tags.forEach((element) => {
//               element.createdByAdmin = true;
//             });
//             res.statuses.forEach((element) => {
//               element.createdByAdmin = true;
//             });
//             this.sharedata.tags = this.sharedata.tags.concat(res.tags);
//             this.sharedata.campaigns = this.sharedata.campaigns.concat(
//               res.campaigns
//             );
//             this.sharedata.products = this.sharedata.products.concat(
//               res.products
//             );
//             // this.statuses=this.statuses.concat(res.statuses)
//           });
//       }

//       forkJoin(observables).subscribe((innerRes: any) => {
//         this.sharedata.crmStats = innerRes[0];
//         this.sharedata.leadProjects = innerRes[1];
//         this.sharedata.clientVolume = innerRes[2];
//         if (!id) {
//           this.sharedata.isAdmin = innerRes[2]?.isAdmin;
//         }
//         let plan = this.sharedata.userPlans?.find(
//           (plan) => plan.id == this.sharedata.clientVolume?.planId
//         );
//         this.sharedata.userPlan = plan;
//         this.sharedata.clientUsers = innerRes[3];
//         // if(id){
//         this.sharedata.customers = innerRes[4];
//         if (this.sharedata.customers)
//           Object.keys(this.sharedata.customers).forEach((key) => {
//             if (this.sharedata.customers[key]) {
//               let list = this.sharedata.customers[key].sort(
//                 (a: Customer, b: Customer) => {
//                   let aTime = new Date(a.managementData.actionDate).getTime();
//                   let bTime = new Date(b.managementData.actionDate).getTime();
//                   if (aTime < 0) return 1;
//                   if (bTime < 0) return -1;
//                   return aTime - bTime;
//                 }
//               );
//               Object.assign(this.sharedata.customers[key], list);
//             }
//           });

//         this.sharedata.partners = innerRes[5];
//         innerRes[6]?.BillingInfo
//           ? (this.sharedata.BillingInfo = innerRes[6].BillingInfo)
//           : '';

//         this.parseIndustryPhrases(innerRes[7].IndustryPhrases);
//         // }else{
//         // this.sharedata.partners = res[5]
//         // this.sharedata.companySearchStats = res[6]
//         // res[7]?.BillingInfo ? this.sharedata.BillingInfo = res[7].BillingInfo : ''
//         // this.parseIndustryPhrases(res[8].IndustryPhrases)
//         // }
//         this.sharedata.industriesMap = new Map<string, string>(
//           this.sharedata.industries.map(
//             (x) => [x.id, x.name] as [string, string]
//           )
//         );
//         this.sharedata.regionsMap = new Map<string, string>(
//           this.sharedata.regions.map(
//             (x) => [this.padStart(x.id, 2), x.name] as [string, string]
//           )
//         );
//         this.sharedata.countriesMap = new Map<string, string>(
//           this.sharedata.countries.map(
//             (x) => [this.padStart(x.id, 3), x.name] as [string, string]
//           )
//         );
//         this.sharedata.statesMap = new Map<string, string>(
//           this.sharedata.states.map(
//             (x) => [this.padStart(x.id, 2), x.name] as [string, string]
//           )
//         );
//         this.sharedata.readyLists = innerRes[8];

//         this.allData$.next(this.sharedata);
//       });
//     });
//   }
//   padStart(number, digits) {
//     return (
//       Array(Math.max(digits - String(number).length + 1, 0)).join('0') + number
//     );
//   }
//   parseIndustryPhrases(res) {
//     res.forEach((element) => {
//       if (!this.sharedata.industryPhrases.has(element.IndustryId)) {
//         this.sharedata.industryPhrases.set(element.IndustryId, {
//           descriptionPhrases: element.DescriptionPhrases,
//           productsPhrases: element.ProductsPhrases,
//         });
//       }
//     });
//     this.sharedata.industryPhrases = this.sharedata.industryPhrases;
//   }
// }
