import { TestBed } from '@angular/core/testing';

import { ClassRecordService } from './class-record.service';

describe('ClassRecordService', () => {
  let service: ClassRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
