import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BackEndService {
  constructor(private http: HttpClient) {}

  getCrmConfig() {
    // if (selectedUserId == 0) {
    //   params = new HttpParams().set(
    //     'clientId',
    //     localStorage.getItem('LeadSpotClientId')
    //   );
    // } else {
    //  let params = new HttpParams().set('clientId', 1468);3551
    // }
    return this.http.get(
      environment.BASE_URL2 + 'Command=CRMConfigs&ClientId=1468',
      {
        responseType: 'text',
      }
    );
  }

  getReadyLists() {
    return this.http.get(`${environment.BASE_URL2}Command=readyLists`, {
      responseType: 'text',
    });
  }

  getIndustryPhrases() {
    return this.http.get(`${environment.BASE_URL2}Command=IndustryPhrases`, {
      responseType: 'text',
    });
  }

  getNewContactBookList() {
    return this.http.get(`${environment.BASE_URL2}Command=IndustryPhrases`, {
      responseType: 'text',
    });
  }

  // buyList(model: any) {
  //   let params = new HttpParams()
  //     .set('industryId', model.industryId)
  //     .set('orderId', model.orderId)
  //     .set('count', model.count)
  //     .set('locationId', model.locationId);
  //   return this.http.get(environment.BASE_URL + 'Lead/buyList', {
  //     params: params,
  //   });
  // }

  // billingInfo() {
  //   let params = new HttpParams().set(
  //     'clientId'
  //     // localStorage.getItem('LeadSpotClientId')
  //   );
  //   return this.http.get<any>(environment.BASE_URL + 'User/BillingInfo', {
  //     params: params,
  //   });
  // }

  // copyListToClient(listId, industryId, locationId, count) {
  //   let params = new HttpParams()
  //     .set('clientId', localStorage.getItem('LeadSpotClientId'))
  //     .set('listId', listId)
  //     .set('industryId', industryId)
  //     .set('locationId', locationId)
  //     .set('count', count);
  //   return this.http.get<string>(
  //     environment.BASE_URL + 'Search/copyListToClient',
  //     { params }
  //   );
  // }

  // clientPlan(selectedUserId) {
  //   let params;
  //   if (selectedUserId == 0) {
  //     params = new HttpParams().set(
  //       'clientId',
  //       localStorage.getItem('LeadSpotClientId')
  //     );
  //   } else {
  //     params = new HttpParams().set('clientId', selectedUserId);
  //   }
  //   return this.http.get<PlanModel>(
  //     environment.API_BASE_URL + 'User/ClientPlan',
  //     { params: params }
  //   );
  // }

  // getIndustryPhrases() {
  //   return this.http.get<any>(environment.BASE_URL + 'Search/industyPhrases');
  // }
}
