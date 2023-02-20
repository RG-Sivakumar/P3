import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeletemediaComponent } from './deletemedia.component';

describe('DeletemediaComponent', () => {
  let component: DeletemediaComponent;
  let fixture: ComponentFixture<DeletemediaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletemediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletemediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
