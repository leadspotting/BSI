import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookademo-dialog',
  templateUrl: './bookademo-dialog.component.html',
  styleUrls: ['./bookademo-dialog.component.scss'],
})
export class BookademoDialogComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const script1 = document.createElement('script');
    script1.src = 'https://assets.calendly.com/assets/external/widget.js';
    script1.type = 'text/javascript';

    const script2 = document.createElement('script');
    script2.innerHTML = `
    Calendly.initInlineWidget({
      url: "https://calendly.com/roy-business-schedule/15min?hide_event_type_details=1&background_color=eaf1f9",
      parentElement: document.getElementById("cal"), style: {
    minWidth: "320px",
    height: "700px",
  },
    });
  `;

    document.head.appendChild(script1);
    document.body.appendChild(script2);
  }
}
