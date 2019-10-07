import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss']
})
export class CustomDropdownComponent implements OnInit {
   selectedValue = 'None';

  @Input()
  dropdownItems: object;

  @Output()
  handleSelected = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  handleDropdown() {
    this.handleSelected.emit(this.selectedValue);
  }

}
