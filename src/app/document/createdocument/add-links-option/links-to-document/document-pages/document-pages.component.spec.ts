import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentPagesComponent } from './document-pages.component';

describe('DocumentPagesComponent', () => {
  let component: DocumentPagesComponent;
  let fixture: ComponentFixture<DocumentPagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
