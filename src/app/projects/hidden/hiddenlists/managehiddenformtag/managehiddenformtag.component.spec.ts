import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagehiddenformtagComponent } from './managehiddenformtag.component';

describe('ManagehiddenformtagComponent', () => {
  let component: ManagehiddenformtagComponent;
  let fixture: ComponentFixture<ManagehiddenformtagComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagehiddenformtagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagehiddenformtagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
