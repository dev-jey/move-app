import { AlertService } from '../alert.service';

describe('test AlertService', () => {
  let alert: AlertService;

  const mockToastr = {
    success: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    clear: jest.fn()
  };

  const options = {
    positionClass: 'toast-top-center',
    preventDuplicates: true
  };

  beforeEach(() => {
    alert = new AlertService(mockToastr);
  });
  it('test success toastr', () => {
    expect(alert.options).toEqual(options);
    alert.success('success');
    expect(mockToastr.success).toHaveBeenCalledWith(
      'success', undefined, options);
  });

  it('test error toastr', () => {
    alert.error('an error');
    expect(mockToastr.error).toHaveBeenCalledWith(
      'an error', undefined, options);
  });

  it('test info toast', () => {
    alert.info('hold on tight');
    expect(mockToastr.info).toHaveBeenCalledWith(
      'hold on tight', undefined, options
    );
  });

  it('test warning toast', () => {
    alert.warning('warning');
    expect(mockToastr.warning).toHaveBeenCalledWith(
      'warning', undefined, options
    );
  });
  it('test clear toast', () => {
    alert.clear(mockToastr.error);
    expect(mockToastr.clear).toHaveBeenCalledWith(mockToastr.error);
  });
});
