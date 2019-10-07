import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPaginationComponent } from './app-pagination.component';
import { Component } from '@angular/core';
import SpyInstance = jest.SpyInstance;

@Component({
  selector: 'app-wrapper-component',
  template: `
    <app-pagination [btnGroupSize]="btnGroup" (pageChange)="pageChange($event)" [totalItems]="totalItems" [pageSize]="pageSize">
    </app-pagination>`
})
class AppWrapperComponent {
  totalItems = 25;
  pageSize = 3;
  btnGroup = 3;

  pageChange() {

  }
}

describe('AppPaginationComponent', () => {
  let component: AppPaginationComponent;
  let fixture: ComponentFixture<AppWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppWrapperComponent,
        AppPaginationComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppWrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize pagination fields', function () {
      component.ngOnInit();
      expect(component.currPage).toEqual(1);
      expect(component.totalPages).toEqual(9);
      expect(component.btnGroup).toEqual([1, 2, 3]);
    });
  });

  describe('genBtnGroup', () => {
    it('should generate btnGroup array based on the current page', function () {
      let btnGroup = component.genBtnGroup(3, 1, 1);
      expect(btnGroup).toEqual([1]);

      btnGroup = component.genBtnGroup(3, 1, 2);
      expect(btnGroup).toEqual([1, 2]);

      btnGroup = component.genBtnGroup(3, 1, 4);
      expect(btnGroup).toEqual([1, 2, 3]);

      btnGroup = component.genBtnGroup(3, 4, 4);
      expect(btnGroup).toEqual([2, 3, 4]);

      btnGroup = component.genBtnGroup(3, 1, 3);
      expect(btnGroup).toEqual([1, 2, 3]);
    });
  });

  describe('changePage', () => {
    let emitter: SpyInstance;
    beforeEach(() => {
      emitter = jest.spyOn(component.pageChange, 'emit');
    });
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });
    describe('prev', () => {
      it('should not perform prev action', () => {
        // currPage = 1, therefore we should not be able to trigger prev action
        component.changePage(component.currPage - 1, 'prev');
        expect(emitter).not.toHaveBeenCalled();
      });
      it('should goto prev page not in the same button group', () => {
        // move to next button group [1,2,3] -> [4,5,6]; currPage = 4
        component.currPage = 4;
        component.btnGroup = [4, 5, 6];
        component.changePage(component.currPage - 1, 'prev');
        expect(emitter).toHaveBeenCalledWith(3);
        // clicking on the prev button, the button group should be [1,2,3]
        expect([1, 2, 3]).toEqual(component.btnGroup);
      });
      it('should goto prev page in the same button group', () => {
        // move to next button group [1,2,3] -> [4,5,6]; currPage = 4
        component.currPage = 2;
        component.changePage(component.currPage - 1, 'prev');
        expect(emitter).toHaveBeenCalledWith(1);
        // clicking on the prev button, the button group should be [1,2,3]
        expect([1, 2, 3]).toEqual(component.btnGroup);
      });
    });

    describe('next', () => {
      it('should not perform next action', () => {
        component.currPage = 9;
        component.btnGroup = [7, 8, 9];
        component.changePage(component.currPage + 1, 'next');
        expect(emitter).not.toHaveBeenCalled();
      });
      it('should goto next page not in the button group', () => {
        // move to next button group [1,2,3] -> [4,5,6]; currPage = 4
        component.changePage(null, 'next-ellipse');
        component.currPage = 6;
        component.changePage(component.currPage + 1, 'next');
        // clicking on the next button, the button group should be [7,8,9]
        expect(emitter).toHaveBeenCalledWith(7);
        expect([7, 8, 9]).toEqual(component.btnGroup);
      });

      it('should goto next page in the same button group', () => {
        component.currPage = 2;
        component.changePage(component.currPage + 1, 'next');
        expect(emitter).toHaveBeenCalledWith(3);
        expect([1, 2, 3]).toEqual(component.btnGroup);
      });
    });

    describe('prev-ellipse', () => {
      it('should not perform prev-ellipse action', () => {
        // currPage = 1, therefore we should not be able to trigger prev action
        component.changePage(null, 'prev-ellipse');
        expect(emitter).not.toHaveBeenCalled();
      });
      it('should goto prev page not in the button group', () => {
        // move to next button group [1,2,3] -> [4,5,6]; currPage = 4
        component.changePage(null, 'next-ellipse');

        component.changePage(null, 'prev-ellipse');
        // clicking on the prev button, the button group should be [1,2,3]
        expect(emitter).toHaveBeenCalledWith(4);
        expect(emitter).toHaveBeenCalledWith(3);
        expect([1, 2, 3]).toEqual(component.btnGroup);
      });
    });

    describe('next-ellipse', () => {
      it('should goto next page not in the button group', () => {
        // move to next button group [1,2,3] -> [4,5,6]; currPage = 4
        component.changePage(null, 'next-ellipse');
        expect(emitter).toHaveBeenCalledWith(4);
        expect([4, 5, 6]).toEqual(component.btnGroup);
        emitter.mockReset();

        // move to next button group [4,5,6] -> [7,8,9]; currPage = 7
        component.changePage(null, 'next-ellipse');
        expect(emitter).toHaveBeenCalledWith(7);
        expect([7, 8, 9]).toEqual(component.btnGroup);
        emitter.mockReset();

        // because totalPages = 9 then we shouldn't be able to trigger next-ellipse
        component.changePage(null, 'next-ellipse');
        expect(emitter).not.toHaveBeenCalled();
      });
    });
  });

  describe('Hide pagination button', () => {
    it('should hidden prev button', function () {
      expect(component.shouldHideBtn('prev')).toBeTruthy();
    });
    it('should show prev button', function () {
      // for totalItem = 25, pageSize = 3, then totalPages = 9
      // for btnGroupSize = 4,
      // then the prev button should show when the button group starts from page 5
      component.changePage(null, 'next-ellipse');
      expect(component.shouldHideBtn('prev')).not.toBeTruthy();
    });

    it('should hidden prev-ellipse button', function () {
      expect(component.shouldHideBtn('prev-ellipse')).toBeTruthy();
    });
    it('should show prev-ellipse button', function () {
      // for totalItem = 25, pageSize = 3, then totalPages = 9
      // for btnGroupSize = 4,
      // then the prev button should show when the button group starts from page 5
      component.changePage(null, 'next-ellipse');
      expect(component.shouldHideBtn('prev')).not.toBeTruthy();
    });

    it('should hidden next button', function () {
      // for totalItem = 25, pageSize = 3, then totalPages = 9
      // for btnGroupSize = 4,
      // update btnGroup -> [4, 5, 6]
      component.changePage(null, 'next-ellipse');
      // update btnGroup -> [7, 8, 9]
      component.changePage(null, 'next-ellipse');
      expect(component.shouldHideBtn('next')).toBeTruthy();
    });
    it('should show next button', function () {
      expect(component.shouldHideBtn('next')).not.toBeTruthy();
    });

    it('should hidden next-ellipse button', function () {
      // for totalItem = 25, pageSize = 3, then totalPages = 9
      // for btnGroupSize = 4,
      // update btnGroup -> [5, 6, 7, 8]
      component.changePage(null, 'next-ellipse');
      // update btnGroup -> [6, 7, 8, 9]
      component.changePage(null, 'next-ellipse');
      expect(component.shouldHideBtn('next')).toBeTruthy();
    });
    it('should show next-ellipse button', function () {
      expect(component.shouldHideBtn('next')).not.toBeTruthy();
    });
  });
});
