export interface IPageMeta {
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalResults?: number;
  totalItems?: number;
}

export class PageMeta implements IPageMeta {
  constructor(
    public page?: number,
    public pageSize?: number,
    public totalPages?: number,
    public totalResults?: number,
  ) {
  }
}
