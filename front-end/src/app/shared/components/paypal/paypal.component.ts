import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
declare let paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss'],
})
export class PaypalComponent implements OnInit {
  @Input() price: any;
  @Output() newPaymentEvent = new EventEmitter<any>();

  constructor() {}
  completed = false;
  ngOnInit(): void {
    let p = this.price.toString();
    // console.log(this.price.leads.toString());
    let angular = this;
    paypal
      .Buttons({
        style: {
          shape: 'pill',
          color: 'gold',
          layout: 'vertical',
        },
        // Sets up the transaction when a payment button is clicked
        createOrder: function (data: any, actions: any) {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: p, // Can reference variables or functions. Example: `value: document.getElementById('...').value`
                },
              },
            ],
          });
        },

        // Finalize the transaction after payer approval
        onApprove: function (data: any, actions: any) {
          return actions.order.capture().then((orderData: any) => {
            angular.newPaymentEvent.emit({
              success: true,
              orderData: orderData,
            });
            // if (orderData.status == 'COMPLETED') {
            //   this.completed = true;
            //   // this.newPaymentEvent.emit(true);
            // } else {
            //   this.completed = false;
            //   // this.newPaymentEvent.emit(true);
            // }

            // Successful capture! For dev/demo purposes:
            // console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
            // let orderId = orderData.id;
            // let requestedNumber = orderData.purchase_units[0].amount.value;
            // that.buyList(orderId, requestedNumber * 2);
            // When ready to go live, remove the alert and show a success message within this page. For example:
            // var element = document.getElementById('paypal-button-container');
            // element.innerHTML = '';
            // element.innerHTML = '<h3>Thank you for your payment!</h3>';
            // Or go to another URL:  actions.redirect('thank_you.html');
          });
        },
        onError: function (err: any) {
          angular.newPaymentEvent.emit({
            success: false,
            orderData: '',
          });
        },
      })
      .render('#paypal-button-container');
  }

  paymentDone(value: any) {
    this.newPaymentEvent.emit(value);
  }
}
