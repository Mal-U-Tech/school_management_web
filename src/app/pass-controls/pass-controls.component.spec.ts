import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassControlsComponent } from './pass-controls.component';

describe('PassControlsComponent', () => {
  let component: PassControlsComponent;
  let fixture: ComponentFixture<PassControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
