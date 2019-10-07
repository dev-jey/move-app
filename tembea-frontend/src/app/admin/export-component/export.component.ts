import { Component, Input } from '@angular/core';
import fileSaver from 'file-saver';
import { AlertService } from 'src/app/shared/alert.service';
import { ExportService } from '../__services__/export.component.service';

@Component({
  selector: 'app-export-view',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {
  @Input() tableName: string;
  @Input() sort: string;
  @Input() filterParams: any;

  constructor(
    public toastr: AlertService,
    public exportService: ExportService
  ) { }

  async exportToPDFOrCSV(type) {
    let infoToastr;
    if (this.tableName !== 'awaitingProvider') {
      infoToastr = this.toastr.info('Hold on tight, we\'re getting your document ready.');
      this.toastr.clear(infoToastr);
      const dataType = type === 'pdf' ? 'pdf' : 'csv';
      await this.saveFiles(`application/${dataType}`, dataType);
    } else {
      infoToastr = this.toastr.info('Ooops! This feature has not been implemented for this table yet. Check back soon!');
      this.toastr.clear(infoToastr);
    }
  }

  async saveFiles(contenType, fileType) {
    await this.exportService.exportData(this.tableName, this.sort, this.filterParams, fileType)
      .subscribe(async (data: any) => {
        const blob = new Blob([data], { type: contenType });
        await fileSaver.saveAs(blob, `${this.tableName}.${fileType}`);
        this.toastr.success(`Success! ${this.tableName}.${fileType} downloaded!`);
      }, () => {
        this.toastr.error('Failed to download. Try Again!');
      });
  }
}
