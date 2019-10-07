import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.scss']
})
export class RatingStarsComponent implements OnInit {
  @Input() rating: number;
  starsArr: any;
  noStars: any;

  constructor() {}

  ngOnInit() {
    this.starsArr = new Array(this.rating ? this.rating : 0);
    this.noStars = new Array(5 - this.rating);
  }
}
