import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionFormAddComponent } from './session-form-add.component';

describe('SessionFormAddComponent', () => {
  let component: SessionFormAddComponent;
  let fixture: ComponentFixture<SessionFormAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionFormAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionFormAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
