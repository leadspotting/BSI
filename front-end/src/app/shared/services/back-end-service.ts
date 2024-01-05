import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BackEndService {
  constructor(private http: HttpClient) {}

  getCrmConfig() {
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

  getReadyLists2() {
    return this.http.get(
      `${environment.BASE_URL2}Command=CompaniesReadyLists`,
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

  getReadyFullList2(countryId: string, industryId: string, limit: string) {
    return this.http.get(
      `${environment.BASE_URL2}Command=ReadyListCompanySearch&Country=${countryId}&Industry=${industryId}&Limit=${limit}
`,
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
}
