import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouNotesComponent } from './thank-you-notes.component';

describe('ThankYouNotesComponent', () => {
  let component: ThankYouNotesComponent;
  let fixture: ComponentFixture<ThankYouNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThankYouNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThankYouNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
