import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupportHeaderComponent } from './support-header.component';

describe('SupportHeaderComponent', () => {
  let component: SupportHeaderComponent;
  let fixture: ComponentFixture<SupportHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
