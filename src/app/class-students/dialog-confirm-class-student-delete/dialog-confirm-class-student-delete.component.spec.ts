import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmClassStudentDeleteComponent } from './dialog-confirm-class-student-delete.component';

describe('DialogConfirmClassStudentDeleteComponent', () => {
  let component: DialogConfirmClassStudentDeleteComponent;
  let fixture: ComponentFixture<DialogConfirmClassStudentDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmClassStudentDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfirmClassStudentDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
