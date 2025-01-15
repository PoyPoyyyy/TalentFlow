import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepliableContainerComponent } from './repliable-container.component';

describe('RepliableContainerComponent', () => {
  let component: RepliableContainerComponent;
  let fixture: ComponentFixture<RepliableContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepliableContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepliableContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
