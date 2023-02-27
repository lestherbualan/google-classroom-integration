import { TestBed } from '@angular/core/testing';

import { GuessGuard } from './guess.guard';

describe('GuessGuard', () => {
  let guard: GuessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
