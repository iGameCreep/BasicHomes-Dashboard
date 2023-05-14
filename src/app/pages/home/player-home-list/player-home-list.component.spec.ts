import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerHomeListComponent } from './player-home-list.component';

describe('PlayerHomeListComponent', () => {
  let component: PlayerHomeListComponent;
  let fixture: ComponentFixture<PlayerHomeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerHomeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerHomeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
