import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClassConductComponent } from './add-class-conduct.component';

describe('AddClassConductComponent', () => {
  let component: AddClassConductComponent;
  let fixture: ComponentFixture<AddClassConductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClassConductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClassConductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
