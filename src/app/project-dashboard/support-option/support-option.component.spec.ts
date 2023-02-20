import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupportOptionComponent } from './support-option.component';

describe('SupportOptionComponent', () => {
  let component: SupportOptionComponent;
  let fixture: ComponentFixture<SupportOptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
