import {Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ProviderService } from '../../__services__/providers.service';
import { AlertService } from '../../../shared/alert.service';
import {AppEventService} from '../../../shared/app-events.service';

@Component({
  selector: 'app-provider-modal',
  templateUrl: './provider-modal.component.html',
  styleUrls: ['./provider-modal.component.scss',
    '../../../auth/login-redirect/login-redirect.component.scss',
    './../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss']
})
export class ProviderModalComponent implements OnInit {
  loading = false;
  constructor(
    public dialogRef: MatDialogRef<ProviderModalComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: any,
    public providerService: ProviderService,
    public toastService: AlertService,
    public appEventService: AppEventService
  ) { }

  ngOnInit() { }

  editProvider(form: NgForm, id: number) {
      const { email, name } = form.value;
      this.loading = true;
      this.providerService.editProvider({ email, name }, id).subscribe(res => {
        this.loading = false;
        if (res.success) {
          this.toastService.success(res.message);
          this.appEventService.broadcast({ name: 'updatedProvidersEvent' });
          this.closeDialog();
        }
      }, error => {
        this.loading = false;
        this.toastService.error(error.error.message);
      } );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
