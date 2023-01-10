import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.scss'],
})
export class ListContainerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  selectedIndustryValue = null;
  listOfIndustryOption: Array<{ value: string; label: string }> = [
    {
      label: 'test industry',
      value: '1',
    },
    {
      label: 'test industry',
      value: '2',
    },
    {
      label: 'test industry',
      value: '3',
    },
  ];
  selectedLocationValue = null;
  listOfLocationOption: Array<{ value: string; label: string }> = [
    {
      label: 'test country',
      value: '1',
    },
    {
      label: 'test country',
      value: '2',
    },
    {
      label: 'test country',
      value: '3',
    },
  ];

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

export interface Industry {
  name: string;
  id: number;
}
