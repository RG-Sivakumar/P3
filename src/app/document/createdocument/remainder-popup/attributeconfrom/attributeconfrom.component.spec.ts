import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttributeconfromComponent } from './attributeconfrom.component';

describe('AttributeconfromComponent', () => {
  let component: AttributeconfromComponent;
  let fixture: ComponentFixture<AttributeconfromComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeconfromComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeconfromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
