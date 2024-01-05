import {ActivatedRoute, Params, Router} from '@angular/router';
import { FinalList2 } from './../../../shared/Models/FinalList-Model';
import {
  ReadyListServer2,
  ReadyList2,
  EmailListServer2,
  EmailList2,
} from './../../../shared/Models/ReadyList-Model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Country } from 'src/app/shared/Models/Country-Model';
import { FinalList } from 'src/app/shared/Models/FinalList-Model';
import { Industry } from 'src/app/shared/Models/Industry-Model';
import { Region } from 'src/app/shared/Models/Region-Model';
import { State } from 'src/app/shared/Models/State-Model';
import { BackEndService } from 'src/app/shared/services/back-end-service';
@Component({
  selector: 'app-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.scss'],
})
export class ListContainerComponent implements OnInit {
  constructor(private api: BackEndService, private activatedRoute: ActivatedRoute) {}
  @Output() addToCartEvent = new EventEmitter<any>();
  @Output() cartDrawerEvent = new EventEmitter<any>();

  xml2js = require('xml2js');
  readyLists: ReadyList2[] = [];
  emailLists: EmailList2[] = [];

  crmConfig: any;
  listOfIndustryOption: Array<{ value: string; label: string }> = [];
  listOfIndustryOptionBackup: Array<{ value: string; label: string }> = [];
  selectedIndustryValue: string[] = [];
  industryPhrases = [];
  industries = [];
  selectedLocationValue = [];
  listOfLocationOption: Array<{ value: string; label: string }> = [];
  listOfLocationOptionBackup: Array<{ value: string; label: string }> = [];
  finalLists: any[] = [];
  currentPage = 1;
  currentPageSize = 9;
  totalPages = -1;
  totalLists = 0;
  finalListss: FinalList2[] = [];
  backUpListss: FinalList2[] = [];
  backUpListss2: FinalList2[] = [];
  options: any[] = [];
  firstTime = true;
  loadingFinalListss = false;
  ngOnInit(): void {
    // this.callAndLog();

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const { postId } = params;

      if (postId) {
        this.callAndLog(postId);
      } else {
        this.callAndLog();
      }
    });

    setTimeout(() => {
      this.firstTime = false;
    }, 5000);
  }

  changeFirstTime(event: boolean) {
    this.firstTime = event;
  }

  async callAndLog(postId: string | null = null) {
    this.loadingFinalListss = true;
    await this.getCRMConfig(postId).then((res) => {
      // setTimeout(() => {
      // this.getReadyLists().then((res) => {});
      // }, 1100);
    });
  }

  async getCRMConfig(postId: string | null = null) {
    return this.api.getCrmConfig().subscribe((res) => {
      // console.log(res);

      this.xml2js.parseString(res, (err: any, result: any) => {
        if (err) {
          console.error(err);
          return;
        }

        let crmConfig = result.LSResponse.CRMConfigs[0];
        this.crmConfig = crmConfig;
        this.getLocations(crmConfig, postId);
        this.getIndustries(crmConfig);
        this.getIndustryPhrases();
      });
    });
  }

  async getReadyLists(postId: string | null = null) {
    let final: any;
    this.api.getReadyLists2().subscribe((res) => {
      // console.log(res);

      this.xml2js.parseString(res, (err: any, result: any) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('lists', result);

        let readyLists: ReadyListServer2[] =
          result.LSResponse.CompaniesReadyList;
        this.readyLists = readyLists.map(
          ({
            // count: [count],
            creationTime: [creationTime],
            description: [description],
            id: [id],
            industryId: [industryId],
            locationId: [locationId],
            mediaUrl: [mediaUrl],
            name: [name],
            downloads: [downloads],
            // price: [price],
            readyListCalculations: [
              {
                count: [count],
                price: [price],
                roundCount: [roundCount],
              },
            ],
          }) => ({
            // count: count,
            downloads: downloads,
            creationTime: creationTime,
            description: description,
            id: id,
            industryId: industryId,
            locationId: locationId,
            mediaUrl: mediaUrl,
            name: name,
            readyListCalculations: {
              count: count,
              price: price,
              roundCount: roundCount,
            },
            // price: price,
          })
        );
        // console.log('ready Lists', this.readyLists);
        // let location = this.parseLocationIdToListName('62,73');

        final = this.readyLists.map(
          ({
            // count: count,
            downloads: downloads,
            creationTime: creationTime,
            description: description,
            id: id,
            industryId: industryId,
            locationId: locationId,
            mediaUrl: mediaUrl,
            name: name,
            readyListCalculations: {
              count: count,
              price: price,
              roundCount: roundCount,
            },

            // price: price,
          }) => {
            let location = this.parseLocationIdToListName(locationId);
            // let namee: any = this.listOfIndustryOption.find(
            //   ({ value: value }) => value === industryId
            // )?.label;
            // location.country.name.length > 0
            //   ? (namee += ', ' + location.country.name)
            //   : '';
            // location.region.name.length > 0
            //   ? (namee += ', ' + location.region.name)
            //   : '';
            // location.state.name.length > 0
            //   ? (namee += ', ' + location.state.name)
            //   : '';

            return Object.assign(
              {},
              {
                // name: namee,
                location: location,
                type: 'companies',
                // leads: this.getNumberOfLeads(leads),
                originReadyList: {
                  // count: count,
                  downloads: downloads,
                  creationTime: creationTime,
                  description: description,
                  id: id,
                  industryId: industryId,
                  locationId: locationId,
                  mediaUrl: mediaUrl,
                  name: name,
                  count: count,
                  price: price,
                  roundCount: roundCount,

                  // readyListCalculations: {
                  //   count: count,
                  //   price: price,
                  //   roundCount: roundCount,
                  // },
                  // price: price,
                },
              }
            );
          }
        );
        let finall: any;

        this.api.getReadyListEmails().subscribe((res) => {
          this.xml2js.parseString(res, (err: any, result: any) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(result);

            let emailListss: EmailListServer2[] =
              result.LSResponse.EmailsReadyList;
            this.emailLists = emailListss.map(
              ({
                campaignId: [campaignId],
                clientId: [clientId],
                downloads: [downloads],

                // count: [count],
                creationTime: [creationTime],
                description: [description],
                id: [id],
                industryId: [industryId],
                // jobCategoryId: [jobCategoryId],
                locationId: [locationId],
                mediaUrl: [mediaUrl],
                name: [name],
                readyListCalculations: [
                  {
                    count: [count],
                    price: [price],
                    roundCount: [roundCount],
                  },
                ],
                // price: [price],
              }) => ({
                downloads: downloads,

                campaignId: campaignId,
                clientId: clientId,
                // count: count,
                creationTime: creationTime,
                description: description,
                id: id,
                industryId: industryId,
                // jobCategoryId: jobCategoryId,
                locationId: locationId,
                mediaUrl: mediaUrl,
                name: name,
                readyListCalculations: {
                  count: count,
                  price: price,
                  roundCount: roundCount,
                },
                // price: price,
              })
            );
            // let location = this.parseLocationIdToListName('62,73');
          });
          finall = this.emailLists.map(
            ({
              downloads: downloads,

              campaignId: campaignId,
              clientId: clientId,
              // count: count,
              creationTime: creationTime,
              description: description,
              id: id,
              industryId: industryId,
              // jobCategoryId: jobCategoryId,
              locationId: locationId,
              mediaUrl: mediaUrl,
              name: name,
              readyListCalculations: {
                count: count,
                price: price,
                roundCount: roundCount,
              },
              // price: price,
            }) => {
              let location = this.parseLocationIdToListName(locationId);
              // location.country.name.length > 0
              //   ? (namee += ', ' + location.country.name)
              //   : '';
              // location.region.name.length > 0
              //   ? (namee += ', ' + location.region.name)
              //   : '';
              // location.state.name.length > 0
              //   ? (namee += ', ' + location.state.name)
              //   : '';

              return Object.assign(
                {},
                {
                  campaignId: campaignId,
                  clientId: clientId,
                  // count: count,
                  creationTime: creationTime,
                  description: description,
                  id: id,
                  industryId: industryId,
                  // jobCategoryId: jobCategoryId,
                  locationId: locationId,
                  mediaUrl: mediaUrl,
                  name: name,
                  price: price,
                  location: location,
                  type: 'leads',

                  // roundCount: roundCount,
                  originReadyList: {
                    downloads: downloads,

                    count: count,
                    roundCount: roundCount,
                    creationTime: creationTime,
                    description: description,
                    id: id,
                    industryId: industryId,
                    locationId: locationId,
                    mediaUrl: mediaUrl,
                    name: name,
                    price: price,
                  },
                }
              );
            }
          );

          //////////////
          let sectorsList: any[] = [];

          this.api.getSectorPost().subscribe((res: any) => {
            // this.xml2js.parseString(res, (err: any, result: any) => {
            //   if (err) {
            //     console.error(err);
            //     return;
            //   }
            res.tags.forEach((element: any) => {
              // element.forEach((post:any) => {

              // });
              let obj = {
                campaignId: '',
                clientId: '',
                // count: count,
                creationTime: '',
                description: element.label,
                id: element.id,
                industryId: '',
                // jobCategoryId: jobCategoryId,
                locationId: '',
                mediaUrl: '',
                // mediaUrl: element.readyListPosts[1].mediaurl,
                name: element.label,
                price: '0',
                location: '',
                type: 'opportunities',
                readyListPosts: element.readyListPosts,
                // roundCount: roundCount,
                originReadyList: {
                  downloads: '0',

                  count: element.readyListPosts.length,
                  roundCount: element.readyListPosts.length,
                  creationTime: '',
                  description: 'Top 100 ' + element.label + ' Opportunities',
                  id: element.id,
                  industryId: '',
                  locationId: '',
                  mediaUrl: '',
                  name: element.label,
                  price: '0',
                  readyListPosts: element.readyListPosts,
                },
              };
              sectorsList.push(obj);
            });

            // let list = [...final, ...finall];
            let list = [...sectorsList, ...finall, ...final];

            if(postId != null){
              list = list.filter(x => x.id == postId)
            }

            console.log('final list', list);
            console.log('sectorss', sectorsList);

            this.finalLists = list;
            // this.options = final;

            this.totalPages = this.finalLists.length;
            this.finalListss = this.getList(
              this.currentPage,
              this.currentPageSize,
              list
            );
            this.backUpListss = list;
            this.backUpListss2 = list;
            this.totalLists = this.finalLists.length - this.currentPageSize;
            this.options = this.uniqueArr(this.finalListss);
            this.loadingFinalListss = false;

            //   let emailListss: EmailListServer2[] =
            //     result.LSResponse.EmailsReadyList;
            //   this.emailLists = emailListss.map(
            //     ({
            //       campaignId: [campaignId],
            //       clientId: [clientId],
            //       downloads: [downloads],

            //       // count: [count],
            //       creationTime: [creationTime],
            //       description: [description],
            //       id: [id],
            //       industryId: [industryId],
            //       // jobCategoryId: [jobCategoryId],
            //       locationId: [locationId],
            //       mediaUrl: [mediaUrl],
            //       name: [name],
            //       readyListCalculations: [
            //         {
            //           count: [count],
            //           price: [price],
            //           roundCount: [roundCount],
            //         },
            //       ],
            //       // price: [price],
            //     }) => ({
            //       downloads: downloads,

            //       campaignId: campaignId,
            //       clientId: clientId,
            //       // count: count,
            //       creationTime: creationTime,
            //       description: description,
            //       id: id,
            //       industryId: industryId,
            //       // jobCategoryId: jobCategoryId,
            //       locationId: locationId,
            //       mediaUrl: mediaUrl,
            //       name: name,
            //       readyListCalculations: {
            //         count: count,
            //         price: price,
            //         roundCount: roundCount,
            //       },
            //       // price: price,
            //     })
            //   );
            // });
            // let finall;
            // finall = this.emailLists.map(
            //   ({
            //     downloads: downloads,

            //     campaignId: campaignId,
            //     clientId: clientId,
            //     // count: count,
            //     creationTime: creationTime,
            //     description: description,
            //     id: id,
            //     industryId: industryId,
            //     // jobCategoryId: jobCategoryId,
            //     locationId: locationId,
            //     mediaUrl: mediaUrl,
            //     name: name,
            //     readyListCalculations: {
            //       count: count,
            //       price: price,
            //       roundCount: roundCount,
            //     },
            //     // price: price,
            //   }) => {
            //     let location = this.parseLocationIdToListName(locationId);
            //     // location.country.name.length > 0
            //     //   ? (namee += ', ' + location.country.name)
            //     //   : '';
            //     // location.region.name.length > 0
            //     //   ? (namee += ', ' + location.region.name)
            //     //   : '';
            //     // location.state.name.length > 0
            //     //   ? (namee += ', ' + location.state.name)
            //     //   : '';

            //     return Object.assign(
            //       {},
            //       {
            //         campaignId: campaignId,
            //         clientId: clientId,
            //         // count: count,
            //         creationTime: creationTime,
            //         description: description,
            //         id: id,
            //         industryId: industryId,
            //         // jobCategoryId: jobCategoryId,
            //         locationId: locationId,
            //         mediaUrl: mediaUrl,
            //         name: name,
            //         price: price,
            //         location: location,
            //         type: 'leads',

            //         // roundCount: roundCount,
            //         originReadyList: {
            //           downloads: downloads,

            //           count: count,
            //           roundCount: roundCount,
            //           creationTime: creationTime,
            //           description: description,
            //           id: id,
            //           industryId: industryId,
            //           locationId: locationId,
            //           mediaUrl: mediaUrl,
            //           name: name,
            //           price: price,
            //         },
            //       }
            //     );
            //   }
            // );

            // let list = [...final, ...finall];
            // console.log('final list', list);

            // this.finalLists = list;
            // // this.options = final;

            // this.totalPages = this.finalLists.length;
            // this.finalListss = this.getList(
            //   this.currentPage,
            //   this.currentPageSize,
            //   list
            // );
            // this.backUpListss = list;
            // this.backUpListss2 = list;
            // this.totalLists = this.finalLists.length - this.currentPageSize;
            // this.options = this.uniqueArr(this.finalListss);
            // });
          });
          ////////////

          // let list = [...sectorsList, ...final, ...finall];
          // console.log('final list', list);
          // console.log('sectorss', sectorsList);

          // this.finalLists = list;
          // // this.options = final;

          // this.totalPages = this.finalLists.length;
          // this.finalListss = this.getList(
          //   this.currentPage,
          //   this.currentPageSize,
          //   list
          // );
          // this.backUpListss = list;
          // this.backUpListss2 = list;
          // this.totalLists = this.finalLists.length - this.currentPageSize;
          // this.options = this.uniqueArr(this.finalListss);
        });
      });
    });
  }

  getIndustries(model: any) {
    let industries: Industry[] = model.industries[0].industries;
    let newArr = industries.map(({ id: [id], name: [name] }) => ({
      value: id,
      label: name,
    }));

    this.listOfIndustryOption = newArr.sort((a, b) => {
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    });
    setTimeout(() => {
      this.listOfIndustryOptionBackup = this.listOfIndustryOption;
    }, 1000);
  }

  getIndustryPhrases() {
    this.api.getIndustryPhrases().subscribe((res) => {
      this.xml2js.parseString(res, (err: any, result: any) => {
        if (err) {
          console.error(err);
          return;
        }

        let industryPhrases = result.LSResponse.IndustryPhrases;
        this.industryPhrases = industryPhrases;
      });
    });
  }

  getLocations(model: any, postId: string | null = null) {
    let countries: Country[] = model.countries[0].countries;
    let regions: Region[] = model.regions[0].regions;

    let newArr = countries.map(
      ({ id: [id], name: [name], regionId: [regionId] }) => {
        let region = regions.find(({ id: [id] }) => id === regionId);
        if (region === undefined) return { id, name };
        return Object.assign(
          {},
          { id: `${id},${regionId}`, name: `${name}, ${region.name[0]}` }
        );
      }
    );

    let finalLocationsArr = newArr.map(({ id, name }) =>
      Object.assign({}, { value: id, label: name })
    );
    this.listOfLocationOption = finalLocationsArr.sort((a, b) => {
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    });
    setTimeout(() => {
      this.listOfLocationOptionBackup = this.listOfLocationOption;

      this.getReadyLists(postId);
      // this.getReadyListEmail();
    }, 1000);
  }

  CompaniesType = true;
  EmailsType = true;
  OppType = true;
  companiesTypeClicked() {
    this.CompaniesType = !this.CompaniesType;
    this.filter();
  }
  emailsTypeClicked() {
    this.EmailsType = !this.EmailsType;
    this.filter();
  }
  oppTypeClicked() {
    this.OppType = !this.OppType;
    this.filter();
  }

  parseLocationIdToListName(locationId: any) {
    let test: any = [];

    // let locations = locationId.split(',');
    let countries: Country[] = this.crmConfig.countries[0].countries;
    let regions: Region[] = this.crmConfig.regions[0].regions;
    let states: State[] = this.crmConfig.states[0].states;
    if (locationId.includes('239')) {
      let stateIdPad = this.padStart(locationId % 100, 2);
      locationId = Math.floor(locationId / 100);

      let countryIdPad = this.padStart(locationId % 1000, 3);
      locationId = Math.floor(locationId / 1000);

      let regionIdPad = this.padStart(locationId, 2);

      let location = {
        country: { id: '', name: '' },
        region: { id: '', name: '' },
        state: { id: '', name: '' },
      };

      let regionn = regions.find(({ id: [id] }) => id === regionIdPad);
      regionn ? (location.region.id = regionn.id[0]) : '';
      regionn ? (location.region.name = regionn.name[0]) : '';
      let countriyy = countries.find((c: any) => {
        if (c.id[0] === countryIdPad) {
          return c;
        }
      });
      countriyy ? (location.country.id = countriyy.id[0]) : '';
      countriyy ? (location.country.name = countriyy.name[0]) : '';

      let statee = states
        .map(({ id: [id], name: [name] }) => ({
          id: [this.padStart(id, 2)],
          name: [name],
        }))
        .find((s: any) => {
          if (s.id[0] === stateIdPad) {
            return s;
          }
        });

      statee ? (location.state.id = statee.id[0]) : '';
      statee ? (location.state.name = statee.name[0]) : '';

      let name =
        location.country.name +
        ' ' +
        location.state.name +
        ' ' +
        location.region.name;

      test = {
        regionId: location.region.id,
        id: location.country.id,
        name: name,
      };
      // console.log('usa', test);

      return test;
    } else {
      let locations = this.getMiddleDigits(locationId);

      let result = countries.filter((country) => locations == country.id[0]);
      // let test = [];
      test = result.map(({ id: [id], name: [name], regionId: [regionId] }) => ({
        regionId: regionId,
        id: id,
        name: name,
      }));
      // console.log('no usa', test[0]);
      return test[0];
    }

    // console.log(regionn, countriyy, statee);

    // return test;
  }

  padStart(number: any, digits: any) {
    return (
      Array(Math.max(digits - String(number).length + 1, 0)).join('0') + number
    );
  }

  getMiddleDigits(number: any) {
    // const numString = number.toString();
    const numLength = number.length;
    const startIndex = Math.floor((numLength - 3) / 2);
    const endIndex = startIndex + 3;
    const middleDigits = number.slice(startIndex, endIndex);
    return middleDigits.replace(/0/g, '');
  }

  getNumberOfLeads(leads: string) {
    let arr = [1, 10, 50, 200, 500, 1000, 5000, 10000, 15000, 20000];
    let closest = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (
        Math.abs(parseInt(leads) - closest) > Math.abs(parseInt(leads) - arr[i])
      ) {
        closest = arr[i];
      }
    }
    return closest;
  }

  roundDownToNearestTen(num: number) {
    let numString = num.toString();
    let firstNum = numString.substring(0, numString.length - 1);
    let zeros = '0'.repeat(1);
    return parseInt(firstNum + zeros);
  }

  onPageIndexChange(event: any) {
    this.currentPage = event;
    this.finalListss = this.getList(
      this.currentPage,
      this.currentPageSize,
      this.backUpListss
    );
  }
  onPageSizeChange(event: any) {
    this.currentPageSize = event;
    this.finalListss = this.getList(
      this.currentPage,
      this.currentPageSize,
      this.backUpListss
    );
    this.totalLists = this.finalLists.length - this.currentPageSize;
  }

  getList(currentPage: any, currentPageSize: any, arr: FinalList2[]) {
    let list: FinalList2[];
    currentPage == 1
      ? (list = arr.slice(0, currentPageSize))
      : (list = arr.slice(
          currentPage * currentPageSize,
          currentPage * currentPageSize + currentPageSize
        ));
    return list;
  }

  inputValue: string = '';
  // options: Array<{ value: string; category: string; count: number }> = [];
  empty: boolean = false;
  onChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (value != '') {
      let list: FinalList2[];
      list = this.backUpListss2.filter((list) => {
        return list.originReadyList.name
          .toLowerCase()
          .includes(value.toLowerCase());
      });
      this.backUpListss = list;
      this.currentPage = 1;

      this.finalListss = this.getList(1, this.currentPageSize, list);
      this.totalLists = list.length - this.currentPageSize;
      this.currentPage;
      this.options = this.finalListss;

      if (this.finalListss.length == 0) {
        this.empty = true;
      } else {
        this.empty = false;
      }
      // this.options = this.uniqueArr(this.finalListss);
    } else {
      this.currentPage = 1;
      this.empty = false;

      this.finalListss = this.getList(
        1,
        this.currentPageSize,
        this.backUpListss2
      );
      this.totalLists = this.finalListss.length - this.currentPageSize;

      this.options = this.backUpListss;
      this.backUpListss = this.backUpListss2;
    }
  }

  onOptionClicked(e: string) {
    if (e != '') {
      let list: FinalList2[];
      list = this.backUpListss.filter((list) => {
        return list.originReadyList.name.toLowerCase() == e.toLowerCase();
      });
      this.backUpListss = list;
      this.currentPage = 1;

      this.finalListss = this.getList(1, this.currentPageSize, list);
      this.totalLists = list.length - this.currentPageSize;
      if (this.finalListss.length == 0) {
        this.empty = true;
      } else {
        this.empty = false;
      }
    } else {
      this.empty = false;

      this.currentPage = 1;
      this.finalListss = this.getList(
        1,
        this.currentPageSize,
        this.backUpListss2
      );
      this.totalLists = this.backUpListss2.length;

      this.backUpListss = this.backUpListss2;
    }
  }

  onSearchClicked() {
    let searchInput = this.inputValue;
    if (searchInput != '' && searchInput) {
      let list: FinalList2[];
      list = this.backUpListss.filter((list) => {
        return list.originReadyList.name
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });
      this.backUpListss = list;
      this.currentPage = 1;

      this.finalListss = this.getList(1, this.currentPageSize, list);
      this.totalLists = list.length - this.currentPageSize;
    } else {
      this.currentPage = 1;
      this.finalListss = this.getList(
        1,
        this.currentPageSize,
        this.backUpListss2
      );
      this.totalLists = this.backUpListss2.length;

      this.backUpListss = this.backUpListss2;
    }
  }

  uniqueArr(array: any) {
    return array.filter((obj: any, pos: any, arr: any) => {
      return arr.map((mapObj: any) => mapObj.name).indexOf(obj.name) === pos;
    });
  }

  filter() {
    this.backUpListss = this.backUpListss2;
    let list: any[] = [];
    if (
      this.selectedIndustryValue?.length > 0 ||
      this.selectedLocationValue?.length > 0 ||
      this.inputValue.length > 0 ||
      this.CompaniesType == true ||
      this.CompaniesType == false ||
      this.EmailsType == true ||
      this.EmailsType == false ||
      this.OppType == true ||
      this.OppType == false
    ) {
      list = this.backUpListss.filter(
        (item: any) =>
          (this.inputValue.length > 0
            ? item.originReadyList.name
                .toLowerCase()
                .includes(this.inputValue.toLowerCase())
            : true) &&
          (this.selectedIndustryValue.length > 0
            ? this.selectedIndustryValue.some((name: string) => {
                // return item.originReadyList.industryId == name;
                return item.originReadyList.industryId
                  .split(',')
                  .some((i: any) => {
                    return i == name;
                  });
              })
            : true) &&
          (this.selectedLocationValue.length > 0
            ? this.selectedLocationValue.some((name: string) => {
                return (
                  item.location?.regionId == name.split(',')[1] &&
                  item.location?.id == name.split(',')[0]
                );
                // return item.location.some((l) => {
                //   console.log('filter', name, l);

                //   return (
                //     l.id == name.split(',')[0] &&
                //     l.regionId == name.split(',')[1]
                //   );
                // });
                // item.location.country.id == name.split(',')[0] &&
                // item.location.region.id == name.split(',')[1]
              })
            : true) &&
          (this.CompaniesType == true &&
          this.EmailsType == false &&
          this.OppType == false
            ? item.type == 'companies'
            : true) &&
          (this.CompaniesType == false &&
          this.EmailsType == true &&
          this.OppType == false
            ? item.type == 'leads'
            : true) &&
          (this.CompaniesType == true &&
          this.EmailsType == true &&
          this.OppType == true
            ? true
            : true) &&
          (this.CompaniesType == false &&
          this.EmailsType == false &&
          this.OppType == false
            ? false
            : true) &&
          (this.CompaniesType == false &&
          this.EmailsType == false &&
          this.OppType == true
            ? item.type == 'opportunities'
            : true) &&
          (this.CompaniesType == false &&
          this.EmailsType == true &&
          this.OppType == true
            ? item.type == 'opportunities' || item.type == 'leads'
            : true) &&
          (this.CompaniesType == true &&
          this.EmailsType == false &&
          this.OppType == true
            ? item.type == 'opportunities' || item.type == 'leads'
            : true) &&
          (this.CompaniesType == true &&
          this.EmailsType == true &&
          this.OppType == false
            ? item.type != 'opportunities'
            : true)
        // (this.CompaniesType == true &&
        // this.EmailsType == false &&
        // this.OppType == false
        //   ? !('campaignId' in item)
        //   : true) &&
        // (this.CompaniesType == false &&
        // this.EmailsType == true &&
        // this.OppType == false
        //   ? 'campaignId' in item
        //   : true) &&
        // (this.CompaniesType == true &&
        // this.EmailsType == true &&
        // this.OppType == true
        //   ? true
        //   : true) &&
        // (this.CompaniesType == false &&
        // this.EmailsType == false &&
        // this.OppType == false
        //   ? false
        //   : true) &&
        // (this.CompaniesType == false &&
        // this.EmailsType == false &&
        // this.OppType == true
        //   ? 'readyListPosts' in item
        //   : true) &&
        // (this.CompaniesType == false &&
        // this.EmailsType == true &&
        // this.OppType == true
        //   ? 'readyListPosts' in item && item.type == 'leads'
        //   : true) &&
        // (this.CompaniesType == true &&
        // this.EmailsType == false &&
        // this.OppType == true
        //   ? 'readyListPosts' in item && item.type == 'leads'
        //   : true)
      );
      let loc: Array<{ value: string; label: string }> =
        this.listOfLocationOptionBackup;
      let filteredLocations = loc.filter((location) => {
        for (let list1 of list) {
          if (list1.location?.id == location.value.split(',')[0]) {
            return true;
          }
        }
        return false;
      });
      if (filteredLocations.length > 0) {
        this.listOfLocationOption = filteredLocations;
      }
      let ind: Array<{ value: string; label: string }> =
        this.listOfIndustryOptionBackup;
      let filteredIndustries = ind.filter((Industry) => {
        for (let list1 of list) {
          if (list1.originReadyList.industryId == Industry.value) {
            return true;
          }
        }
        return false;
      });
      if (filteredIndustries.length > 0) {
        this.listOfIndustryOption = filteredIndustries;
      }

      this.backUpListss = list;
      this.currentPage = 1;
      this.finalListss = this.getList(1, this.currentPageSize, list);
      if (list.length < this.currentPageSize) {
        this.totalLists = list.length;
      } else {
        this.totalLists = list.length - this.currentPageSize;
      }
      this.options = this.finalListss;
      if (this.finalListss.length == 0) {
        this.empty = true;
      } else {
        this.empty = false;
      }
    } else {
      this.empty = false;

      this.currentPage = 1;
      this.finalListss = this.getList(
        1,
        this.currentPageSize,
        this.backUpListss2
      );
      this.totalLists = this.backUpListss2.length - this.currentPageSize;

      this.backUpListss = this.backUpListss2;

      // this.listOfLocationOption = this.listOfLocationOptionBackup;
    }
  }
  // private getRandomInt(max: number, min: number = 0): number {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }
  addToCart(listItem: any) {
    this.addToCartEvent.emit(listItem);
  }
  drawerCart(boolean: any) {
    this.cartDrawerEvent.emit(boolean);
  }

  toJson(x: any){
    return JSON.stringify(x);
  }
}
export interface OppPost {
  id: number;
  label: string; // price: Array<string>;
  readyListPosts: Array<OppPostOne>;
}
export interface OppPostOne {
  postId: string;
  headline: string;
  content: string;
  mediaurl: string;
  url: string;
}
