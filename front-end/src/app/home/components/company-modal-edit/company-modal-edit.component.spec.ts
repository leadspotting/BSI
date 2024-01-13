import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyModalEditComponent } from './company-modal-edit.component';

describe('ListCardComponent', () => {
  let component: CompanyModalEditComponent;
  let fixture: ComponentFixture<CompanyModalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyModalEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
