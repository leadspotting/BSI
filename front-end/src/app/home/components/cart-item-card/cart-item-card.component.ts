import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cart-item-card',
  templateUrl: './cart-item-card.component.html',
  styleUrls: ['./cart-item-card.component.scss'],
})
export class CartItemCardComponent implements OnInit {
  @Input() list: any;
  @Output() removeItemEvent = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {

  }
  removeItem() {
    this.removeItemEvent.emit(this.list);
  }
}
