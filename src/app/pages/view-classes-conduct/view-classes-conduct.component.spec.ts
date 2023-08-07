import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClassesConductComponent } from './view-classes-conduct.component';

describe('ViewClassesConductComponent', () => {
  let component: ViewClassesConductComponent;
  let fixture: ComponentFixture<ViewClassesConductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewClassesConductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewClassesConductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
