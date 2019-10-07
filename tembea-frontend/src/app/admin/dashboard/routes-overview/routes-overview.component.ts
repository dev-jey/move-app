import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-routes-overview',
  templateUrl: './routes-overview.component.html',
  styleUrls: ['./routes-overview.component.scss']
})
export class RoutesOverviewComponent implements OnInit {

  @Input() data: any;
  @Input() usage: string;
  constructor() { }

  ngOnInit() {
  }

}
