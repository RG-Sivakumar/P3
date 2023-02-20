import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RenametoolbarhiddenComponent } from './renametoolbarhidden.component';

describe('RenametoolbarhiddenComponent', () => {
  let component: RenametoolbarhiddenComponent;
  let fixture: ComponentFixture<RenametoolbarhiddenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RenametoolbarhiddenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenametoolbarhiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
