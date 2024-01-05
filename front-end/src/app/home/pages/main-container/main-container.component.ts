import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss'],
})
export class MainContainerComponent implements OnInit {
  constructor(private notification: NzNotificationService) {}

  ngOnInit(): void {}
  drawer = false;
  cart: any[] = [];
  addToCart(listItem: any) {
    this.cart.includes(listItem)
      ? this.createNotification()
      : (this.cart.push(listItem), (this.drawer = true));
    setTimeout(() => {
      this.drawer = false;
    }, 1500);
  }

  drawerCart(boolean: any) {
    this.drawer = boolean;
  }

  onActivate(component: any) {
    component.addToCartEvent.subscribe((data: any) => this.addToCart(data));
    try {
      component.drawerCartEvent.subscribe((data: any) => this.drawerCart(data));
    } catch {}
  }
  // onActivate2(component: any) {
  //   // component.addToCartEvent.subscribe((data: any) => this.addToCart(data));
  //   component.drawerCartEvent.subscribe((data: any) => this.drawerCart(data));
  // }
  createNotification(): void {
    this.notification.create(
      'info',
      'Item Already in Shopping Cart',
      'This item is already in your shopping cart. You can find it in the cart section of the website.',
      { nzPlacement: 'bottomRight' }
    );
  }
}
