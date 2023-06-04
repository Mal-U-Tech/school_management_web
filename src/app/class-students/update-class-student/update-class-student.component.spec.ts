import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateClassStudentComponent } from './update-class-student.component';

describe('UpdateClassStudentComponent', () => {
  let component: UpdateClassStudentComponent;
  let fixture: ComponentFixture<UpdateClassStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateClassStudentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateClassStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
