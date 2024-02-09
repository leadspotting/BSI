import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Injectable} from '@angular/core';

const md5 = require('md5');

@Injectable({
  providedIn: 'root',
})
export class BackEndService {
  constructor(private http: HttpClient) {}


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

  login(form: any) {
    let email = form.email;
    let password = form.password;
    let remember = form.rememberMe;
    if (remember == true) {
      localStorage.setItem('userOpp', email);
      localStorage.setItem('userPassOpp', password);
    }
    return this.http.get(
      `${environment.BASE_URL}Command=Login2&Email=${email}&Password=${md5(
        password
      )}&AppId=20`,
      {
        //return this.http.get(`${environment.BASE_URL}?Command=Login2&Email=defense@leadspotting.com&Password=${hash("defense")}&AppId=12`, {
        responseType: 'text',
      }
    );
  }

  getCompaniesList(userId: string) {
    return this.http.get(
      `${environment.BASE_URL2}Command=BSICompaniesList&UserId=${userId}`,
      {
        responseType: 'text',
      }
    );
  }

  getCrmConfig() {
    return this.http.get(
      environment.BASE_URL2 + 'Command=CRMConfigs&ClientId=1468&Narrow=1',
      {
        responseType: 'text',
      }
    );
  }

  getIndustryPhrases() {
    return this.http.get(`${environment.BASE_URL2}Command=IndustryPhrases`, {
      responseType: 'text',
    });
  }

  getReadyFullList2(countryId: string, industryId: string, limit: string) {
    return this.http.get(
      `${environment.BASE_URL2}Command=ReadyListCompanySearch&Country=${countryId}&Industry=${industryId}&Limit=${limit}
`,
      {
        responseType: 'text',
      }
    );
  }
  getMyCompany(clientId:string) {
    return this.http.get(
      `${environment.BASE_URL2}Command=BSICompaniesList&ClientId=${clientId}`,
      {
        responseType: 'text',
      }
    );
  }

  updateUserInfo(clientId: string, description: string, industryId: string, countryId: string, benefits: string,
                 benefitsImageUrl: string, lookingFor: string, youtubeUrl: string, logo: string, name: string,
                 domain: string, visible: boolean, token:string) {
    return this.http.get(
      `${environment.BASE_URL2}Command=BSIUpdateUserInfo`
            + `&ClientId=${clientId}`
            + `&Description=${description}`
            + `&IndustryId=${industryId}`
            + `&CountryId=${countryId}`
            + `&Benefits=${benefits}`
            + `&BenefitsImage=${benefitsImageUrl}`
            + `&LookingFor=${lookingFor}`
            + `&YoutubeUrl=${youtubeUrl}`
            + `&Logo=${logo}`
            + `&Name=${name}`
            + `&Domain=${domain}`
            + `&Visible=${visible ? "1" : "0"}`
            + `&Token=${token}`,
      {
        responseType: 'text',
      }
    );
  }

  makeIntroduction(userId: string, companyId: string, message: string) {
    return this.http.get(
      `${environment.BASE_URL2}Command=BSUIetIntroduction`
            + `&UserId=${userId}`
            + `&CompanyId=${companyId}`
            + `&Message=${message}`,
      {
        responseType: 'text',
      }
    );
  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getReadyLists() {
    return this.http.get(`${environment.BASE_URL2}Command=readyLists`, {
      responseType: 'text',
    });
  }

  getReadyLists2() {
    return this.http.get(
      `${environment.BASE_URL2}Command=CompaniesReadyLists`,
      {
        responseType: 'text',
      }
    );
  }

  getBenefitsList() {
    return this.http.get(
      `${environment.BASE_URL2}Command=BSIBenefitsList`,
      {
        responseType: 'text',
      }
    );
  }

  getFiveSamplesList() {
    return this.http.get(`${environment.BASE_URL2}Command=GetFiveSamples`, {
      responseType: 'text',
    });
  }

  getReadyFullList(Amount: number) {
    return this.http.get(
      `${environment.BASE_URL2}Command=GetContactsByAmount&Amount=${Amount}`,
      {
        responseType: 'text',
      }
    );
  }

  getReadyListEmails() {
    return this.http.get(
      `${environment.BASE_URL2}Command=EmailsReadyLists
`,
      {
        responseType: 'text',
      }
    );
  }
  getSectorPost() {
    return this.http.get(
      `${environment.BASE_URL2}Command=GetSectorPosts
`,
      {
        responseType: 'json',
      }
    );
  }

  getReadyFullListEmails(campaignId: string) {
    return this.http.get(
      `${environment.BASE_URL2}Command=getClientCampaign&ClientId=1485&CampaignId=${campaignId}
`,
      //     return this.http.get(
      //       `${environment.BASE_URL2}Command=getClientCampaign&ClientId=4247&CampaignId=${campaignId}
      // `,
      {
        responseType: 'text',
      }
    );
  }

  postEmail(fromname: string, to: string, subject: string, body: string) {
    return this.http.get(
      `${environment.BASE_URL2}Command=sendEmail&fromname=${fromname}&to=${to}&subject=${subject}&body=${body}`,
      {
        responseType: 'text',
      }
    );
  }

  SavePurchasedLists(
    ListId: string,
    AmountOfLeads: string,
    Cost: string,
    Purchased: string
  ) {
    return this.http.get(
      `${environment.BASE_URL2}Command=SavePurchasedLists&ListId=${ListId}&AmountOfLeads=${AmountOfLeads}&Cost=${Cost}&Purchased=${Purchased}`,
      {
        responseType: 'text',
      }
    );
  }

  // UpdatesDownloads(CampaignId: any) {
  //   return this.http.get(
  //     `${environment.BASE_URL2}Command=UpdatesDownloads&CampaignId=${CampaignId}`,
  //     {
  //       responseType: 'text',
  //     }
  //   );
  // }

  UpdatesDownloads2(id: any, table: any) {
    return this.http.get(
      `${environment.BASE_URL2}Command=UpdatesDownloads&Id=${id}&Table=${table}`,
      {
        responseType: 'text',
      }
    );
  }

  // getNewContactBookList() {
  //   return this.http.get(`${environment.BASE_URL2}Command=IndustryPhrases`, {
  //     responseType: 'text',
  //   });
  // }
  // getNewContactBookList() {
  //   return this.http.get(`${environment.BASE_URL2}Command=IndustryPhrases`, {
  //     responseType: 'text',
  //   });
  // }

  UploadImageToPost(PostId: any, WatchListId: any, formData: FormData) {
    return this.http.post(
      `${environment.BASE_URL}Command=UploadImageToPost&PostId=${PostId}&WatchListId=${WatchListId}`,
      formData,
      {
        responseType: 'text',
      }
    );
  }
}
