import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentswitchpageComponent } from './documentswitchpage.component';

describe('DocumentswitchpageComponent', () => {
  let component: DocumentswitchpageComponent;
  let fixture: ComponentFixture<DocumentswitchpageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentswitchpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentswitchpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
