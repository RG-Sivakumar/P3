import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentManagetagComponent } from './document-managetag.component';

describe('DocumentManagetagComponent', () => {
  let component: DocumentManagetagComponent;
  let fixture: ComponentFixture<DocumentManagetagComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentManagetagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentManagetagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
