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
      title1: 'Welcome to your go-to source for high-quality leads lists!',
      title2: ' Grow your business with high-quality leads from our portal',
      text2: 'Start boosting your sales today!',
    },
    {
      title1:
        'Filter with ease and find the perfect leads list for your business',
      title2:
        'Find the perfect list for your business by filtering by industry and location',
      text2:
        'Custom lists available upon request. Payment is easy and secure with PayPal',
    },
    {
      title1: 'Instant access to targeted leads lists',
      title2:
        'Simply find the list you need and make your purchase with LeadSpot',
      text1: 'no login or registration required',
    },
    {
      title1: 'Not sure if our lists are right for you? ',
      title2: 'Download a free sample of 5 leads to try before you commit',
      text2: 'You' + "'ll see firsthand the value of our lists from LeadSpot",
    },
  ];
  effect = 'scrollx';
}
