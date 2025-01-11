import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleRecipientsComponent } from './eligible-recipients.component';

describe('EligibleRecipientsComponent', () => {
  let component: EligibleRecipientsComponent;
  let fixture: ComponentFixture<EligibleRecipientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EligibleRecipientsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EligibleRecipientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
