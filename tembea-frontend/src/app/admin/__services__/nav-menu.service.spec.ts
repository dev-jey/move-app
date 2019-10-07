import { TestBed } from '@angular/core/testing';

import { NavMenuService } from './nav-menu.service';


describe('NavMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavMenuService = TestBed.get(NavMenuService);
    expect(service).toBeTruthy();
    const tog = () => service.toggle();

    expect(tog).toThrowError();
  });

  describe('ProgressBar', () => {
    let service;
    beforeEach(() => {
      service = new NavMenuService();
    });
    it('should show progress bar ', () => {
      const serviceSpy = jest.spyOn(service.progressListener, 'next');
      service.showProgress();
      expect(serviceSpy).toHaveBeenCalled();
      expect(serviceSpy).toHaveBeenCalledWith(true);
    });

    it('should hide progress bar ', () => {
      const serviceSpy = jest.spyOn(service.progressListener, 'next');
      service.stopProgress();
      expect(serviceSpy).toHaveBeenCalled();
      expect(serviceSpy).toHaveBeenCalledWith(false);
    });
  });
});
