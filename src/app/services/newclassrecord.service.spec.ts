import { TestBed } from '@angular/core/testing';

import { NewclassrecordService } from './newclassrecord.service';

describe('NewclassrecordService', () => {
  let service: NewclassrecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewclassrecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
