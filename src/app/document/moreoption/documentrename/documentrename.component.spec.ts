import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentrenameComponent } from './documentrename.component';

describe('DocumentrenameComponent', () => {
  let component: DocumentrenameComponent;
  let fixture: ComponentFixture<DocumentrenameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentrenameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentrenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
