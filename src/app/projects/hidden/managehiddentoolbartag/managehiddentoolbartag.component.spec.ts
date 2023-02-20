import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagehiddentoolbartagComponent } from './managehiddentoolbartag.component';

describe('ManagehiddentoolbartagComponent', () => {
  let component: ManagehiddentoolbartagComponent;
  let fixture: ComponentFixture<ManagehiddentoolbartagComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagehiddentoolbartagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagehiddentoolbartagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
