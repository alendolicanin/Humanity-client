import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnconfirmedDonationsComponent } from './unconfirmed-donations.component';

describe('UnconfirmedDonationsComponent', () => {
  let component: UnconfirmedDonationsComponent;
  let fixture: ComponentFixture<UnconfirmedDonationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnconfirmedDonationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnconfirmedDonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
