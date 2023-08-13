/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  public element: any;
  @Input() routeConfig = false;

  @Input() isOpen?: boolean;
  @Input() title?: string;
  @Input() actionLabel!: string;
  @Input() disabled?: boolean;
  @Input() secondaryActionLabel?: string;
  @Input() size?: 'small' | 'large' = 'small';

  @Output() secondaryAction?: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() submitAction: EventEmitter<any> = new EventEmitter<any>();
  constructor(private modalService: ModalService) {}

  ngOnInit() {
    if (this.id) {
      this.element.style.display = 'none';
      if (this.routeConfig) {
        const parent = this.element.parentNode;
        parent.appendChild(this.element);
        document.body.appendChild(parent);
      } else {
        document.body.appendChild(this.element);
      }
      this.modalService.add(this);
    }
  }

  emitSecondaryAction() {
    this.secondaryAction?.emit();
  }
  emitCloseAction() {
    this.closeAction?.emit(true);
  }
  emitSubmitAction() {
    this.submitAction?.emit();
  }

  ngOnDestroy(): void {
    this.id && this.modalService.remove(this.id);
    this.element && this.element.remove();
  }

  // open modal
  open(): void {
    this.element.style.display = 'block';
    document.body.classList.add('modal-open');
  }

  public exit(): void {
    this.emitCloseAction();
  }

  // close modal
  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}
