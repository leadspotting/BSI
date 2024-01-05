import { ReadyListDownload } from './../../../shared/Models/ReadyListDownload-Model';
import { BackEndService } from 'src/app/shared/services/back-end-service';
import {
  Component,
  Input,
  OnInit,
  Output,
  TemplateRef,
  EventEmitter,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { first } from 'rxjs';
import { FinalList } from 'src/app/shared/Models/FinalList-Model';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss'],
})
export class ListCardComponent implements OnInit {
  constructor(
    private modal: NzModalService,
    private notification: NzNotificationService,
    private api: BackEndService
  ) {}
  // skelatonActive = false;
  @Input() list: any;
  @Input() firstTime: any;
  @Output() addToCartEvent = new EventEmitter<any>();
  @Output() cartDrawerEvent = new EventEmitter<any>();
  // @Output() firstTimeEvent = new EventEmitter<boolean>();
  showSpinnerSample = false;
  showSpinner = false;
  xml2js = require('xml2js');
  paypalButtonsComponent: any;

  email = false;
  ngOnInit(): void {
    // this.getFullList();
    this.randomLike = Math.trunc(Math.random() * (542 - 1128 + 1) + 1128);
    this.randomStar = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
    if (this.randomStar === '4.5') {
      this.randomStar =
        Math.random() < 0.85 ? this.randomStar - 0.5 : this.randomStar + 0.5;
    }

    if (this.firstTime == true) {
      setTimeout(() => {
        // this.skelatonActive = false;
        // this.loading = false;
        // this.firstTimeEvent.emit(false);
      }, 5000);
    }

    if ('id' in this.list) {
      this.email = true;
    }
  }

  paymentDone(value: any) {
    this.showModalSuccess(value);
  }

  // firstTimeChange() {
  //   this.firstTimeEvent.emit(false);
  // }

  randomStar: any;
  randomLike: any;
  clicked = false;
  cardLiked() {
    if (this.clicked == false) {
      this.randomLike += 1;
      this.clicked = true;
    }
  }

  // successModal(): void {
  //   this.modal.success({
  //     nzTitle: 'This is a success message',
  //     nzContent: 'some messages...some messages...',
  //   });
  // }

  notificationModal(template: TemplateRef<{}>): void {
    // if (this.showSpinner == false) {
    // while (this.showSpinner == true) {
    setTimeout(() => {
      this.notification.template(template, {
        nzPlacement: 'bottomRight',
        nzDuration: 10000,
      });
    }, 1500);
    // }
    // }
  }

  isVisiblePaymentSuccess = false;
  paymentFailed = false;
  showModalSuccess(value: any): void {
    if (value.success == true) {
      this.isVisiblePaymentSuccess = true;
      this.isVisible = false;
      if (this.list.type == 'opportunities') {
        this.getFullListOpp();
      } else {
        this.getFullList();
      }
      this.paymentFailed = false;
    } else {
      this.isVisible = true;
      this.paymentFailed = true;
    }
  }

  isVisible = false;
  isConfirmLoading = false;
  showModal(): void {
    this.isVisible = true;
    this.showSpinner = true;

    // this.isVisible ? this.paypal() : true;
  }

  isVisibleSample = false;
  showModalSample(): void {
    this.isVisibleSample = true;
    this.showSpinnerSample = true;
    this.showSpinner = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 1000);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleSample = false;
    this.isVisiblePaymentSuccess = false;
  }

  getFiveSamplesList() {
    let csv;
    this.api
      .postEmail(
        'customersuccess@leadspotting.com',
        'roy@leadspotting.com',
        'ReadyList platform - Sample list was Downloaded',
        '<div><h3>' +
          this.list.originReadyList.name +
          '</h3><p><b>Description:</b><br>' +
          this.list.originReadyList.description +
          '</p><p><b>Count:</b><br>5</p></div>'
      )
      .subscribe((res) => {});

    this.api
      .SavePurchasedLists(
        this.list.originReadyList.id,
        this.list.originReadyList.count,
        this.list.originReadyList.price,
        '0'
      )
      .subscribe((res) => {});

    let type =
      this.list.type == 'opportunities'
        ? 'opportunity'
        : this.list.type == 'leads'
        ? 'emails'
        : this.list.type == 'companies'
        ? 'companies'
        : '';
    this.api
      .UpdatesDownloads2(this.list.originReadyList.id, type)
      .subscribe((res) => {
        console.log('saved');
        console.log(res);
        this.xml2js.parseString(res, (err: any, result: any) => {
          console.log(result.LSResponse._, 'resultttt');
          if (result.LSResponse._ == '1') {
            let num = Number(this.list.originReadyList.downloads) + 1;

            this.list.originReadyList.downloads = num;
            // let doc = document.getElementById(
            //   'Down' + this.list.originReadyList.id
            // );
            // if (doc) {
            //   let num = Number(doc?.innerText) + 1;
            //   doc.setAttribute('nzValue', num.toString());
            // }
          }
        });
      });
    if (this.email == false) {
      this.api
        .getReadyFullList2(
          this.list.originReadyList.locationId,
          this.list.originReadyList.industryId,
          this.list.originReadyList.count
        )
        .subscribe((res) => {
          // console.log(res);

          let json = JSON.parse(res);
          // console.log(json);

          for (let i = 0; i < json.length; i++) {
            for (const key in json[i]) {
              if (json[i].hasOwnProperty(key)) {
                json[i][key] = json[i][key]
                  ? json[i][key].toString().replaceAll(',', '')
                  : '';
              }
            }
          }
          csv = this.createCSV(json.splice(0, 5));
          this.downloadCSV(csv);
        });
    } else {
      this.api.getReadyFullListEmails(this.list.campaignId).subscribe((res) => {
        let arr: any[] = [];
        let json = JSON.parse(res);
        // console.log(res);
        // console.log(json);

        json[0].contacts.forEach((element: any) => {
          let obj = {
            // campaignId: element.campaignId,
            company: element.company,
            // creationTime: element.creationTime,
            domain: element.domain,
            emails: '',
            // id: element.id,
            linkedinId: element.linkedinId,
            location: element.location
              ? element.location.replaceAll(',', '')
              : '',
            name: element.name.replaceAll(',', ''),
            phones: '',
            position: element.position.replaceAll(',', ''),
            // scanned: element.scanned,
            url: element.url,
          };
          let emails = '';
          try {
            element.emails.forEach((email: any) => {
              emails += email.email + '-' + email.isValid;
            });
          } catch {}
          let phones = '';
          try {
            element.phones.forEach((phone: any) => {
              phones += phone;
            });
          } catch {}
          obj.emails = emails;
          obj.phones = phones;
          arr.push(obj);
        });
        csv = this.createCSV(arr.splice(0, 5));
        this.downloadCSV(csv);
      });
    }
  }

  getFullList() {
    this.api
      .postEmail(
        'customersuccess@leadspotting.com',
        'roy@leadspotting.com',
        'ReadyList platform - Full list was Downloaded',
        '<div><h3>' +
          this.list.originReadyList.name +
          '</h3><p><b>Description:</b><br>' +
          this.list.originReadyList.description +
          '</p><p><b>Price:</b><br>' +
          this.list.originReadyList.price +
          '</p><p><b>Count:</b><br>' +
          this.list.originReadyList.roundCount +
          '</p></div>'
      )
      .subscribe((res) => {});
    let type =
      this.list.type == 'opportunities'
        ? 'opportunity'
        : this.list.type == 'leads'
        ? 'emails'
        : this.list.type == 'companies'
        ? 'companies'
        : '';
    this.api
      .UpdatesDownloads2(this.list.originReadyList.id, type)
      .subscribe((res) => {
        console.log('saved');
        console.log(res);
        this.xml2js.parseString(res, (err: any, result: any) => {
          console.log(result.LSResponse._, 'resultttt');
          if (result.LSResponse._ == '1') {
            let num = Number(this.list.originReadyList.downloads) + 1;

            this.list.originReadyList.downloads = num;
            // let doc = document.getElementById(
            //   'Down' + this.list.originReadyList.id
            // );
            // if (doc) {
            //   let num = Number(doc?.innerText) + 1;
            //   doc.setAttribute('nzValue', num.toString());
            // }
          }
        });
      });

    this.api
      .SavePurchasedLists(
        this.list.originReadyList.id,
        this.list.originReadyList.count,
        this.list.originReadyList.price,
        '1'
      )
      .subscribe((res) => {});
    let csv;
    if (this.email == false) {
      this.api
        .getReadyFullList2(
          this.list.originReadyList.locationId,
          this.list.originReadyList.industryId,
          this.list.originReadyList.count
        )
        .subscribe((res) => {
          let json = JSON.parse(res);
          // console.log(json);

          for (let i = 0; i < json.length; i++) {
            for (const key in json[i]) {
              if (json[i].hasOwnProperty(key)) {
                json[i][key] = json[i][key]
                  ? json[i][key].toString().replaceAll(',', '')
                  : '';
              }
            }
          }

          csv = this.createCSV(json);
          this.downloadCSV(csv);
        });
    } else {
      this.api.getReadyFullListEmails(this.list.campaignId).subscribe((res) => {
        let arr: any[] = [];
        let json = JSON.parse(res);
        // for (let i = 0; i < json[0].contacts.length; i++) {
        //   for (const key in json[i]) {
        //     if (json[0].contacts[i].hasOwnProperty(key)) {
        //       json[0].contacts[i][key] = json[0].contacts[i][key]
        //         ? json[0].contacts[i][key].toString()
        //         : '';
        //     }
        //   }
        // }

        json[0].contacts.forEach((element: any) => {
          let obj = {
            // campaignId: element.campaignId,
            company: element.company,
            // creationTime: element.creationTime,
            domain: element.domain,
            emails: '',
            // id: element.id,
            linkedinId: element.linkedinId,
            location: element.location
              ? element.location.replaceAll(',', '')
              : '',
            name: element.name.replaceAll(',', ''),
            phones: '',
            position: element.position.replaceAll(',', ''),
            // scanned: element.scanned,
            url: element.url,
          };
          let emails = '';
          try {
            element.emails.forEach((email: any) => {
              emails += email.email + '-' + email.isValid;
            });
          } catch {}
          let phones = '';
          try {
            element.phones.forEach((phone: any) => {
              phones += phone;
            });
          } catch {}
          obj.emails = emails;
          obj.phones = phones;
          arr.push(obj);
        });

        // if (err) {
        //   console.error(err);
        //   return;
        // }

        // let readyList: ReadyListDownload[] = result.LSResponse.Contact;
        // readyList.map(
        //   ({
        //     Company: [Company],
        //     Email: [Email],
        //     LinkedInUrl: [LinkedInUrl],
        //     Name: [Name],
        //     Position: [Position],
        //   }) => ({
        //     Company: Company,
        //     Email: Email,
        //     LinkedInUrl: LinkedInUrl,
        //     Name: Name,
        //     Position: Position,
        //   })
        // );
        // console.log(readyList);
        // for (let i = 0; i < amount - 1; i++) {
        //   readyList.push(readyList[0]);
        // }
        // console.log(readyList);

        csv = this.createCSV(arr);
        this.downloadCSV(csv);
      });
    }
  }

  getRandomElements(array: any, count: any) {
    // Create a copy of the original array
    var shuffled = array.slice(0);
    var i = array.length;
    var min = i - count;
    var temp;
    var index;

    // While there are elements in the original array
    while (i-- > min) {
      // Pick a random index from the remaining elements
      index = Math.floor((i + 1) * Math.random());

      // Swap the current element with the random element
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }

    // Return the first 'count' elements
    return shuffled.slice(min);
  }

  getFiveSamplesListOpp() {
    let csv;
    console.log(this.list);
    let posts = this.getRandomElements(this.list.readyListPosts, 5);
    console.log(posts);
    this.convertArrayToCSVPosts(posts, this.list.name + ' Sample');
    this.api
      .postEmail(
        'customersuccess@leadspotting.com',
        'roy@leadspotting.com',
        'ReadyList platform - Sample list was Downloaded',
        '<div><h3>' +
          this.list.name +
          '</h3><p><b>Description:</b><br>' +
          this.list.originReadyList.description +
          '</p><p><b>Count:</b><br>5</p></div>'
      )
      .subscribe((res) => {});

    this.api
      .SavePurchasedLists(
        this.list.originReadyList.id,
        this.list.originReadyList.count,
        this.list.originReadyList.price,
        '0'
      )
      .subscribe((res) => {});

    let type =
      this.list.type == 'opportunities'
        ? 'opportunity'
        : this.list.type == 'leads'
        ? 'emails'
        : this.list.type == 'companies'
        ? 'companies'
        : '';
    this.api
      .UpdatesDownloads2(this.list.originReadyList.id, type)
      .subscribe((res) => {
        console.log('saved');
        console.log(res);
        this.xml2js.parseString(res, (err: any, result: any) => {
          console.log(result.LSResponse._, 'resultttt');
          if (result.LSResponse._ == '1') {
            let num = Number(this.list.originReadyList.downloads) + 1;

            this.list.originReadyList.downloads = num;
            // let doc = document.getElementById(
            //   'Down' + this.list.originReadyList.id
            // );
            // if (doc) {
            //   let num = Number(doc?.innerText) + 1;
            //   doc.setAttribute('nzValue', num.toString());
            // }
          }
        });
      });

    setTimeout(() => {
      this.showSpinnerSample = false;
      this.showSpinner = false;
    }, 1500);
  }
  getFullListOpp() {
    let csv;
    console.log(this.list);
    let posts = this.list.readyListPosts;
    console.log(posts);
    this.convertArrayToCSVPosts(posts, this.list.name);
    this.api
      .postEmail(
        'customersuccess@leadspotting.com',
        'roy@leadspotting.com',
        'ReadyList platform - Full list was Downloaded',
        '<div><h3>' +
          this.list.name +
          '</h3><p><b>Description:</b><br>' +
          this.list.originReadyList.description +
          '</p><p><b>Count:</b><br>5</p></div>'
      )
      .subscribe((res) => {});
    let type =
      this.list.type == 'opportunities'
        ? 'opportunity'
        : this.list.type == 'leads'
        ? 'emails'
        : this.list.type == 'companies'
        ? 'companies'
        : '';
    this.api
      .UpdatesDownloads2(this.list.originReadyList.id, type)
      .subscribe((res) => {
        console.log('saved');
        console.log(res);
        this.xml2js.parseString(res, (err: any, result: any) => {
          console.log(result.LSResponse._, 'resultttt');
          if (result.LSResponse._ == '1') {
            let num = Number(this.list.originReadyList.downloads) + 1;

            this.list.originReadyList.downloads = num;
            // let doc = document.getElementById(
            //   'Down' + this.list.originReadyList.id
            // );
            // if (doc) {
            //   let num = Number(doc?.innerText) + 1;
            //   doc.setAttribute('nzValue', num.toString());
            // }
          }
        });
      });

    this.api
      .SavePurchasedLists(
        this.list.originReadyList.id,
        this.list.originReadyList.count,
        this.list.originReadyList.price,
        '0'
      )
      .subscribe((res) => {});
    setTimeout(() => {
      this.showSpinnerSample = false;
      this.showSpinner = false;
    }, 1500);
  }

  convertArrayToCSVPosts(data: any, name: any) {
    const csvRows = [];

    // Get the headers from the first object in the array
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    // Iterate over each object and create a CSV row
    for (const item of data) {
      const values = headers.map((header) => {
        const escapedValue = item[header].replace(/"/g, '\\"'); // Escape double quotes
        return `"${escapedValue}"`;
      });
      csvRows.push(values.join(','));
    }

    // Join all rows with newline character
    const csvContent = csvRows.join('\n');

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create a download link and trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = name + '.csv';
    downloadLink.click();
  }

  createCSV(data: any[]) {
    if (this.email == false) {
      // const header = Object.keys(data[0]).join(',');
      // const data2 = data
      //   .map((item) => Object.values(item).join(','))
      //   .join('\n');
      // const csv = `${header}\n${data2}`;
      // return csv;

      const headersToKeep = [
        'name',
        'domain',
        'yearFounded',
        'industry',
        'locality',
        'sizeRange',
        'country',
        'linkedinPage',
        'currentEmployeeEstimate',
        'totalEmployeeEstimate',
        'description',
        'emails',
        'phones',
      ];
      const dataFiltered = data.map(
        ({ id, searchDate, industriesIds, ...rest }) => rest
      );
      const header = headersToKeep.join(',');
      const data2 = dataFiltered
        .map((item) => Object.values(item).join(','))
        .join('\n');
      const csv = `${header}\n${data2}`;
      return csv;
    } else {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent +=
        'company,domain,emails,linkedinId,location,name,phones,position,url\r\n';
      // csvContent +=
      //   'campaignId,company,creationTime,domain,emails,id,linkedinId,location,name,phones,position,scanned,url\r\n';
      data.forEach(function (rowArray) {
        let row =
          // rowArray.campaignId +
          // ',' +
          rowArray.company +
          ',' +
          // rowArray.creationTime +
          // ',' +
          (rowArray.domain.length > 0 ? rowArray.domain : 'null') +
          ',' +
          (rowArray.emails.length > 0 ? rowArray.emails : 'null') +
          ',' +
          // rowArray.id +
          // ',' +
          rowArray.linkedinId +
          ',' +
          rowArray.location +
          ',' +
          rowArray.name +
          ',' +
          (rowArray.phones.length > 0 ? rowArray.phones : 'null') +
          ',' +
          rowArray.position +
          ',' +
          // rowArray.scanned +
          // ',' +
          rowArray.url +
          '\r\n';
        csvContent += row;
      });
      var encodedUri = encodeURI(csvContent);
      return encodedUri;
    }
  }

  downloadCSV(encodedUri: string) {
    setTimeout(() => {
      this.showSpinnerSample = false;
      this.showSpinner = false;
      if (this.email == false) {
        const a = document.createElement('a');
        const file = new Blob([encodedUri], { type: 'text/csv' });
        a.href = URL.createObjectURL(file);
        a.download = this.list.originReadyList.name;
        // a.download = 'test';
        a.click();
      } else {
        var link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        // link.setAttribute('download', 'my_data.csv');
        link.setAttribute('download', this.list.originReadyList.name);
        document.body.appendChild(link);
        link.click();
      }
    }, 1500);
  }

  addToCart() {
    this.addToCartEvent.emit(this.list);
    this.cartDrawerEvent.emit(true);
  }

  /*
  * custom function for adding attribute to URL because hash (https://leadstore.leadspotting.com/#/) must be included
  *  in the link. Same function is used both from home page and from details page */
  _addPostIdToUrl(postId: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('postId', encodeURIComponent(postId));
    const hash = url.hash.split('?')[0];
    return encodeURIComponent(url.origin + url.pathname + hash + url.search);
  }

  shareWhatsapp() {
    const link = this._addPostIdToUrl(this.list.id);
    window.open(
      `whatsapp://send?text=BINGO, check this great business opportunitiy discovered by LeadSpotting AI: ${this.list.originReadyList.name} - ${link}`
    );
  }

  shareEmail() {
    const link = this._addPostIdToUrl(this.list.id);
    window.open(
      `mailto:?body=${link}&subject=${  "BINGO, check this great business opportunitiy discovered by LeadSpotting AI " +  this.list.originReadyList.name}`
    );
  }
}
