import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/shared/services/back-end-service';
@Component({
  selector: 'app-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.scss'],
})
export class ListContainerComponent implements OnInit {
  constructor(private api: BackEndService) {}

  xml2js = require('xml2js');
  readyLists = [];
  crmConfig: any[] = [];
  listOfIndustryOption: Array<{ value: string; label: string }> = [];
  selectedIndustryValue = null;
  industryPhrases = [];
  industries = [];
  selectedLocationValue = null;
  listOfLocationOption: Array<{ value: string; label: string }> = [];
  ngOnInit(): void {
    this.api.getReadyLists().subscribe((res) => {
      // console.log(res);
      this.xml2js.parseString(res, (err: any, result: any) => {
        if (err) {
          console.error(err);
          return;
        }

        let readyLists = result.LSResponse.ReadyList;
        console.log(readyLists);
        this.readyLists = readyLists;
      });
    });

    this.api.getIndustryPhrases().subscribe((res) => {
      // console.log(res);

      this.xml2js.parseString(res, (err: any, result: any) => {
        if (err) {
          console.error(err);
          return;
        }

        let industryPhrases = result.LSResponse.IndustryPhrases;
        console.log(industryPhrases);
        this.industryPhrases = industryPhrases;
      });
    });

    this.api.getCrmConfig().subscribe((res) => {
      // console.log(res);

      this.xml2js.parseString(res, (err: any, result: any) => {
        if (err) {
          console.error(err);
          return;
        }

        let crmConfig = result.LSResponse.CRMConfigs[0];
        console.log('CRMCONFIG', crmConfig);
        this.crmConfig = crmConfig;
        this.getIndustries(crmConfig);
        this.getLocations(crmConfig);
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
    console.log(newArr);
  }

  getLocations(model: any) {
    let countries: Country[] = model.countries[0].countries;
    let regions: Region[] = model.regions[0].regions;

    // let newArr = countries.map(({ id: [id], name: [name] }) => ({
    //   value: id,
    //   label: name,
    // }));

    // this.listOfIndustryOption = newArr.sort((a, b) => {
    //   if (a.label < b.label) return -1;
    //   if (a.label > b.label) return 1;
    //   return 0;
    // });
    let newArr = countries.map(
      ({ id: [id], name: [name], regionId: [regionId] }) => {
        let region = regions.find(({ id: [id] }) => id === regionId);
        if (region === undefined) return { id, name };
        return Object.assign({}, { id, name: `${name}, ${region.name[0]}` });
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
    console.log(finalLocationsArr);
  }

  lists = [
    {
      name: 'test name',
      quantity: 1000,
      description: 'test description',
      img: '',
    },
    {
      name: 'test name',
      quantity: 1000,
      description: 'test description',
      img: '',
    },
    {
      name: 'test name',
      quantity: 1000,
      description: 'test description',
      img: '',
    },
    {
      name: 'test name',
      quantity: 1000,
      description: 'test description',
      img: '',
    },
    {
      name: 'test name',
      quantity: 1000,
      description: 'test description',
      img: '',
    },
  ];
  CompaniesType = true;
  EmailsType = true;
  companiesTypeClicked() {
    this.CompaniesType = !this.CompaniesType;
  }
  emailsTypeClicked() {
    this.EmailsType = !this.EmailsType;
  }
}

export interface ListPost {
  name: string;
  quantity: number;
  description: string;
  img: string;
}

interface Industry {
  id: Array<string>;
  name: Array<string>;
}

export interface Country {
  id: Array<string>;
  name: Array<string>;
  regionId: Array<string>;
}

interface Region {
  id: Array<string>;
  name: Array<string>;
}
