import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-player-mobile',
  templateUrl: './player-mobile.component.html',
  styleUrls: ['./player-mobile.component.scss'],
})
export class PlayerMobileComponent implements OnInit {
  @Input() name: string;
  @Input() playerActive: boolean = false;
  @Input() image: string = 'player.png';
  constructor() {}

  ngOnInit(): void {}
}
