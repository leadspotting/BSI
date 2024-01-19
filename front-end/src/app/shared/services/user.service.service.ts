import { Observable, Subject } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { BackEndService } from 'src/app/shared/services/back-end-service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
const md5 = require('md5');

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private quotaSub = new Subject<number>();

  quotaObservable$ = this.quotaSub.asObservable();

  increaseQuota(quota: number) {
    this.quotaSub.next(quota);
  }
  xml2js = require('xml2js');

  constructor(
    private http: HttpClient,
    private api: BackEndService
  ) {}

  login(form: any): Observable<any> {
    let email = form.email;
    let rememberMe = form.rememberMe;

    return this.api.login(form).pipe(
      map((res: any) => {
        let result:any = null;
        this.xml2js.parseString(res, (err1: any, result1: any) => {result = result1});
        // return this.xml2js.parseString(res, (err: any, result: any) => {
        //   debugger;
          if (
            result?.LSResponse?.Response[0].IntroDone[0] == '1' ||
            result?.LSResponse?.Response[0].IntroDone[0] == '0'
          ) {
            const userData = result.LSResponse.Response[0];

            sessionStorage.setItem('email', email);
            sessionStorage.setItem('user', JSON.stringify(userData));
            return userData;
          }
          return false;
        // });
      }
    ));
  }

  register(form: any) {
    let email = form.email;
    let password = form.password;
    let name = form.firstName + ' ' + form.lastName;
    return this.http.get(
      `${
        environment.BASE_URL
      }Command=Register2&AppId=20&Portal=iei&Name=${name}&Email=${email}&Pwd=${md5(
        password
      )}&Source=2`,
      {
        responseType: 'text',
      }
    );
  }

  verifyUser(token: any) {
    return this.http.get(
      `${environment.BASE_URL}Command=VarifyEmail&Token=${token}&Type=${'PIN'}`,
      {
        responseType: 'text',
      }
    );
  }

  isUserLoggedIn() {
    if (sessionStorage.getItem('user') || localStorage.getItem('user')) {
      return true;
    } else {
      return false;
    }
    // return sessionStorage.getItem('user') || localStorage.getItem('user');
  }

  getUserData() {
    let userDataString = null;
    try {
      userDataString = sessionStorage.getItem('user');
      // userDataString = localStorage.getItem('user');
    } catch {}
    // const userDataString = localStorage.getItem('user');
    if (!userDataString) return null;

    return JSON.parse(userDataString);
  }

  getUserId() {
    return this.getUserData()?.Login?.[0];
  }

  forgotPasswordRequest(email: string) {
    let host = 'http://app.leadspotting.com/#/';
    return this.http.get(
      `${environment.BASE_URL2}Command=ForgotPasswordRequest&Email=${email}&AppId=20&Host=${host}`,
      {
        responseType: 'text',
      }
    );
  }

  logOut() {
    sessionStorage.clear();
    localStorage.clear();
  }

  updateClientPlan(planId: any, subscriptionId: any, SubscriptionType: any) {
    let clientId: any =
      sessionStorage.getItem('user') || localStorage.getItem('user');

    let params = new HttpParams()
      .set('clientId', clientId)
      .set('PlanId', planId)
      .set('SubscriptionId', subscriptionId)
      .set('SubscriptionType', SubscriptionType);
    return this.http.get<string>(
      environment.BASE_URL2 + 'User/updateClientPlan',
      { params: params }
    );
  }
}
