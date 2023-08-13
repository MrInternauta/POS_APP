import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() label!: string;
  @Output() onClick = new EventEmitter<string>();
  @Input() disabled?: boolean;
  @Input() outline?: boolean;
  @Input() size?: 'small' | 'large' = 'small';
  @Input() icon?: string;
  constructor() {}

  ngOnInit() {
    return;
    //do nothing
  }
  click() {}
}
