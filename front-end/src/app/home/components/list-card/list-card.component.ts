import { Component, OnInit, TemplateRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss'],
})
export class ListCardComponent implements OnInit {
  constructor(
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.randomLike = Math.trunc(Math.random() * (542 - 1128 + 1) + 1128);
    this.randomStar = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
    if (this.randomStar === '4.5') {
      this.randomStar =
        Math.random() < 0.85 ? this.randomStar - 0.5 : this.randomStar + 0.5;
    }
  }
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
    this.notification.template(template, {
      nzPlacement: 'bottomRight',
      nzDuration: 10000,
    });
  }

  isVisible = false;
  isConfirmLoading = false;
  showModal(): void {
    this.isVisible = true;
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
  }
}
