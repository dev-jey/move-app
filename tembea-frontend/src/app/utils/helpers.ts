export const createDialogOptions = (data, width = '512px', _class = 'small-modal-panel-class') => {
    return {
      width, panelClass: _class,
      data
    };
};
