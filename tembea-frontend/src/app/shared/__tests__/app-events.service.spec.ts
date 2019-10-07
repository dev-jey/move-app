import { inject, TestBed } from '@angular/core/testing';
import { AppEventService } from '../app-events.service';

const callback = (spyService) => {
  spyService.called = true;
};

describe('Event Manager Test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppEventService]
    });
  });

  it('should not fail when no subscriber and broadcasting', inject([AppEventService],
    (eventManager: AppEventService) => {
      expect(eventManager.observer).toBeUndefined();
      eventManager.broadcast({ name: 'modifier', content: 'modified something' });
    }));

  it('should broadcast to a specify observer by name', inject([AppEventService],
    (eventManager: AppEventService) => {
      const spyServiceA = { called: false };
      const spyServiceB = { called: false };

      expect(spyServiceA.called).toBeFalsy();
      expect(spyServiceB.called).toBeFalsy();
      eventManager.subscribe('modifierA', () => callback(spyServiceA));
      eventManager.subscribe('modifierB', () => callback(spyServiceB));
      eventManager.broadcast({ name: 'modifierA', content: 'modified something' });
      expect(spyServiceA.called).toBeTruthy();
      expect(spyServiceB.called).toBeFalsy();
    }));

});
