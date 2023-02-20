import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteformComponent } from './deleteform.component';

describe('DeleteformComponent', () => {
  let component: DeleteformComponent;
  let fixture: ComponentFixture<DeleteformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
