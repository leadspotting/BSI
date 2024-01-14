import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }
  screenWidth: any;
  titles = [
    {
      title1: 'Welcome to the Israel Technology marketplace introduction space!',
      title2: 'Search for companies and partners from Israel and from the rest of the world.',
      text2: 'Request 5 introductions a month.',
    },
    {
      title1:'Israel is a hi-tech and international export power.',
      title2:'its all about the people. Diligent and striving forward.',
      text2:'We are welcome you to find the right company to do business with.',
    },
    {
      title1: 'The companies presented on the website also specialize in exports.',
      title2:  'You are welcome to search for the branch that suits your business and get in touch today – its free.',
      text1: 'This is the right time to do business with Israeli businesses',
    },
    {
      title1: 'Collaborations between people. between companies.',
      title2: 'Here you will find a database of companies in different and diverse fields of activity',
      text2: 'Dive in and find your next Israeli business partners',
    },
  ];
  effect = 'scrollx';
}
