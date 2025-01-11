import { TestBed } from '@angular/core/testing';

import { ThankYouNoteService } from './thank-you-note.service';

describe('ThankYouNoteService', () => {
  let service: ThankYouNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThankYouNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
