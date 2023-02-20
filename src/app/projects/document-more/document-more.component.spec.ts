import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentMoreComponent } from './document-more.component';

describe('DocumentMoreComponent', () => {
  let component: DocumentMoreComponent;
  let fixture: ComponentFixture<DocumentMoreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
