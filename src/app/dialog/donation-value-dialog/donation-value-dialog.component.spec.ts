import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationValueDialogComponent } from './donation-value-dialog.component';

describe('DonationValueDialogComponent', () => {
  let component: DonationValueDialogComponent;
  let fixture: ComponentFixture<DonationValueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationValueDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationValueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
