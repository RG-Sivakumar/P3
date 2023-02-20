import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinksToDocumentComponent } from './links-to-document.component';

describe('LinksToDocumentComponent', () => {
  let component: LinksToDocumentComponent;
  let fixture: ComponentFixture<LinksToDocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LinksToDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinksToDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
