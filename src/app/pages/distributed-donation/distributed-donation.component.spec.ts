import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributedDonationComponent } from './distributed-donation.component';

describe('DistributedDonationComponent', () => {
  let component: DistributedDonationComponent;
  let fixture: ComponentFixture<DistributedDonationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributedDonationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributedDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
