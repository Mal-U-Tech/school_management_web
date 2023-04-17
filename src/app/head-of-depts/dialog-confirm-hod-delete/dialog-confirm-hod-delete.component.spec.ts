import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmHODDeleteComponent } from './dialog-confirm-hod-delete.component';

describe('DialogConfirmHODDeleteComponent', () => {
  let component: DialogConfirmHODDeleteComponent;
  let fixture: ComponentFixture<DialogConfirmHODDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmHODDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfirmHODDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
