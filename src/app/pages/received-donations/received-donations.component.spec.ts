import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedDonationsComponent } from './received-donations.component';

describe('ReceivedDonationsComponent', () => {
  let component: ReceivedDonationsComponent;
  let fixture: ComponentFixture<ReceivedDonationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivedDonationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivedDonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
