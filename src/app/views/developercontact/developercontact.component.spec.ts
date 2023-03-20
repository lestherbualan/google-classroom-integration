import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopercontactComponent } from './developercontact.component';

describe('DevelopercontactComponent', () => {
  let component: DevelopercontactComponent;
  let fixture: ComponentFixture<DevelopercontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevelopercontactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevelopercontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
