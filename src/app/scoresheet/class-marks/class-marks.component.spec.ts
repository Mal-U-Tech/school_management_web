import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassMarksComponent } from './class-marks.component';

describe('ClassMarksComponent', () => {
  let component: ClassMarksComponent;
  let fixture: ComponentFixture<ClassMarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassMarksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
