import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupportFooterComponent } from './support-footer.component';

describe('SupportFooterComponent', () => {
  let component: SupportFooterComponent;
  let fixture: ComponentFixture<SupportFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
