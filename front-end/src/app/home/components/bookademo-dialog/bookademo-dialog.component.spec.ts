import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookademoDialogComponent } from './bookademo-dialog.component';

describe('BookademoDialogComponent', () => {
  let component: BookademoDialogComponent;
  let fixture: ComponentFixture<BookademoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookademoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookademoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
