import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionPageComponent } from './mission-page.component';

describe('MissionPageComponent', () => {
  let component: MissionPageComponent;
  let fixture: ComponentFixture<MissionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
