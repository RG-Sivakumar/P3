import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupportRequestComponent } from './support-request.component';

describe('SupportRequestComponent', () => {
  let component: SupportRequestComponent;
  let fixture: ComponentFixture<SupportRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
