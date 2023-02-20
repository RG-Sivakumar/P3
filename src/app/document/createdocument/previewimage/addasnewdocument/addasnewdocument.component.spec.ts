import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddasnewdocumentComponent } from './addasnewdocument.component';

describe('AddasnewdocumentComponent', () => {
  let component: AddasnewdocumentComponent;
  let fixture: ComponentFixture<AddasnewdocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddasnewdocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddasnewdocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
