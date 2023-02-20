import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddasnewtoolbarComponent } from './addasnewtoolbar.component';

describe('AddasnewtoolbarComponent', () => {
  let component: AddasnewtoolbarComponent;
  let fixture: ComponentFixture<AddasnewtoolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddasnewtoolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddasnewtoolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
