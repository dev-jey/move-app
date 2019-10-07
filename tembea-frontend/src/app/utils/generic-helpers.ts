import { ConfirmModalComponent } from '../admin/confirmation-dialog/confirmation-dialog.component';

export const getDialogProps = (
  displayText,
  confirmText = 'Yes',
  width = '592px',
  backdropClass = 'modal-backdrop',
  panelClass = 'small-modal-panel-class'
  ) => {
    return {
      width,
      backdropClass,
      panelClass,
      data: {
        confirmText,
        displayText
      }
    };
  };

  export const openDialog = (dialog, displayText) => (dialog.open(ConfirmModalComponent, getDialogProps(displayText)));
