import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IDepartmentsModel, IDepartmentResponse } from 'src/app/shared/models/departments.model';
import { DepartmentsService } from 'src/app/admin/__services__/departments.service';
import { AlertService } from 'src/app/shared/alert.service';
import { AppEventService } from 'src/app/shared/app-events.service';

@Component({
  templateUrl: './add-departments-modal.component.html',
  styleUrls: ['./add-departments-modal.component.scss']
})
export class AddDepartmentsModalComponent implements OnInit {
  model: IDepartmentsModel;
  loading: boolean;
  departmentName: string;
  constructor(
    public dialogRef: MatDialogRef<AddDepartmentsModalComponent>,
    public departmentService: DepartmentsService,
    public alert: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: IDepartmentsModel,
    private appEventService: AppEventService
  ) {
    this.model = this.data;
    this.departmentName = this.data.name;
  }

  ngOnInit() {
    this.loading = false;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  logError(error) {
    if (error && error.status === 404) {
      const { error: { message } } = error;
      this.alert.error(message);
    } else if (error && error.status === 409) {
      const { error: { message } } = error;
      this.alert.error(message);
    } else {
      this.alert.error('Something went wrong, please try again');
    }
  }
  refereshDepartment(message) {
    this.alert.success(message);
    this.appEventService.broadcast({ name: 'newDepartment' });
    this.loading = false;
    this.dialogRef.close();
  }

  updateDepartment(department: IDepartmentsModel) {
    const { name, location, email, oldName } = department;
    this.departmentService.update(oldName, name, email, location).subscribe((res: IDepartmentResponse) => {
      if (res.success) {
        this.refereshDepartment(res.message);
      }
    },
      (error) => {
        this.logError(error);
        this.loading = false;
    });
  }

  addDepartment(): void {
    this.loading = true;
    if (this.model.id) {
      return this.updateDepartment(this.model);
    }
    this.departmentService.add(this.model)
    .subscribe(
      (res) => {

        if (res.success) {
          this.refereshDepartment(res.message);
        }
      },
      (error) => {
        this.logError(error);
        this.loading = false;
      }
    );
  }
}
