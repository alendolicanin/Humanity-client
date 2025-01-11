import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouNoteDialogComponent } from './thank-you-note-dialog.component';

describe('ThankYouNoteDialogComponent', () => {
  let component: ThankYouNoteDialogComponent;
  let fixture: ComponentFixture<ThankYouNoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThankYouNoteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThankYouNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
