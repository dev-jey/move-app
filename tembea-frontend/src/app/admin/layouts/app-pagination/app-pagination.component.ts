import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

type Position = 'left' | 'right';
type Direction = 'prev' | 'next' | 'prev-ellipse' | 'next-ellipse';

@Component({
  selector: 'app-pagination',
  templateUrl: './app-pagination.component.html',
  styleUrls: ['./app-pagination.component.scss']
})
export class AppPaginationComponent implements OnInit, OnChanges {

  private pTotalItems = null;
  private pPageSize: number;

  get pageSize(): number {
    if (this.pPageSize == null) {
      throw new Error('pageSize must be provided.');
    }
    return this.pPageSize;
  }

  @Input()
  set pageSize(value: number) {
    this.pPageSize = value;
  }

  get totalItems() {
    if (this.pTotalItems == null) {
      throw new Error('totalItems must be provided.');
    }
    return this.pTotalItems;
  }

  @Input()
  set totalItems(page) {
    this.pTotalItems = page;
  }

  @Input() position: Position = 'right';
  @Input() page: number;
  @Input() btnGroupSize = 3;
  @Output() pageChange: EventEmitter<number> = new EventEmitter();

  public totalPages: number;
  public currPage: number;
  public btnGroup: Array<number> = [];

  ngOnInit() {
    this.initPagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.totalItems) {
      this.initPagination();
    }
  }

  initPagination() {
    this.currPage = this.page || 1;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;
    this.btnGroup = this.genBtnGroup(this.btnGroupSize, this.page, this.totalPages);
  }

  changePage(page: number, direction: Direction) {
    const handles = {
      'prev': this.goto,
      'next': this.goto,
      'prev-ellipse': this.gotoPrevBtnGroup,
      'next-ellipse': this.gotoNextBtnGroup
    };
    const handle = handles[direction] || this.updatePageInfo;
    handle(page, direction);
  }

  shouldHideBtn(direction) {
    const btnGroup = [...this.btnGroup];
    const first = btnGroup[0];
    const last = btnGroup.pop();
    const prevEl = this.btnGroup.includes(1) && first === 1;
    const nextEl = this.btnGroup.includes(this.totalPages) && last === this.totalPages;

    const show = {
      'prev': this.currPage <= 1 || this.btnGroup.includes(1),
      'next': this.currPage >= this.totalPages || this.btnGroup.includes(this.totalPages),
      'prev-ellipse': prevEl,
      'next-ellipse': nextEl,
    };
    return show[direction];
  }

  public genBtnGroup = (btnGroupSize, pageVal, totalPages) => {
    const numArray = [...Array.from(Array(totalPages + 1).keys())];
    const normalizePage = Math.min(pageVal, totalPages);
    const normalizeBtnGroupSize = Math.min(btnGroupSize, totalPages);
    let start = Math.max(numArray.indexOf(normalizePage), 1);
    let end = start + normalizeBtnGroupSize;
    if (end > numArray.length) {
      start -= (end - numArray.length);
      end = start + normalizeBtnGroupSize;
    }
    return numArray.slice(start, end);
  }

  /* Private fields */

  private updatePageInfo = (page) => {
    const validPage = page >= 1 && page <= this.totalPages;

    if (validPage && this.currPage !== page) {
      this.currPage = page;
      this.pageChange.emit(page);
    }
  }

  private goto = (page, direction: Direction) => {
    if (this.btnGroup.includes(page)) {
      this.updatePageInfo(page);
    } else {
      const val = <Direction>`${direction}-ellipse`;
      this.changePage(null, val);
    }
  }

  private gotoNextBtnGroup = () => {
    const validGroup = this.shouldHideBtn('next-ellipse');
    if (validGroup) {
      return;
    }
    this.btnGroup = this.calcNextBtnGroup(this.btnGroup, this.totalPages);
    this.updatePageInfo(this.btnGroup[0]);
  }

  private gotoPrevBtnGroup = () => {
    const validGroup = this.shouldHideBtn('prev-ellipse');
    if (validGroup) {
      return;
    }
    this.btnGroup = this.calcPrevBtnGroup(this.btnGroup);
    const lastIndex = this.btnGroup.length - 1;
    this.updatePageInfo(this.btnGroup[lastIndex]);
  }

  private calcPrevBtnGroup = (btnGroup: Array<number>) => {
    const numberGrp = [...btnGroup];
    const size = numberGrp.length;
    const first = numberGrp[0];
    let decrement = size;
    if (first - size < 1) {
      decrement = first - 1;
    }
    return numberGrp.map((val) => {
      return val - decrement;
    });
  }

  private calcNextBtnGroup = (btnGroup: Array<number>, totalPages: number) => {
    const numberGrp = [...btnGroup];
    const size = numberGrp.length;
    const last = numberGrp[size - 1];
    let increment = size;
    if (last > totalPages - size) {
      increment = totalPages - last;
    }
    return numberGrp.map((val) => {
      return val + increment;
    });
  }
}
