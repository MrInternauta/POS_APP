import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

/** Width of the knob and the padding around it, kept in step with the scss */
const KNOB_SIZE = 48;
const TRACK_PADDING = 4;

/** How far along the track the knob has to be taken for the action to count as confirmed */
const CONFIRM_AT = 0.9;

/** How long the filled track stays on screen before it goes back to the start */
const SETTLE_MS = 400;

/**
 * A control that only fires once it has been dragged from one end to the other. It stands in for a
 * button and a confirmation dialog at once: the gesture is long enough that it cannot be done by
 * accident, so there is nothing left to confirm afterwards.
 */
@Component({
  selector: 'app-slide-to-confirm',
  templateUrl: './slide-to-confirm.component.html',
  styleUrls: ['./slide-to-confirm.component.scss'],
})
export class SlideToConfirmComponent implements AfterViewInit, OnDestroy {
  @Input() label = '';
  @Output() confirmed = new EventEmitter<void>();

  @ViewChild('track', { static: true }) private track!: ElementRef<HTMLElement>;

  /** 0 with the knob at rest, 1 with it at the far end */
  public progress = 0;
  public dragging = false;

  private pointerId: number | null = null;
  private startX = 0;
  private travel = 0;
  private settleTimer?: ReturnType<typeof setTimeout>;
  private _disabled = false;

  @Input()
  set disabled(disabled: boolean) {
    this._disabled = disabled;

    //A control that turns unusable half way through a drag must not keep the knob out there
    if (disabled) {
      this.cancelDrag();
    }
  }

  get disabled(): boolean {
    return this._disabled;
  }

  ngAfterViewInit(): void {
    this.measure();
  }

  ngOnDestroy(): void {
    clearTimeout(this.settleTimer);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.measure();
    this.cancelDrag();
  }

  onPointerDown(event: PointerEvent): void {
    if (this.disabled) {
      return;
    }

    this.measure();
    this.pointerId = event.pointerId;
    this.dragging = true;
    this.startX = event.clientX;
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.dragging || event.pointerId !== this.pointerId) {
      return;
    }

    const moved = event.clientX - this.startX;
    this.progress = this.travel > 0 ? Math.min(Math.max(moved / this.travel, 0), 1) : 0;
  }

  @HostListener('document:pointerup', ['$event'])
  @HostListener('document:pointercancel', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (!this.dragging || event.pointerId !== this.pointerId) {
      return;
    }

    this.dragging = false;
    this.pointerId = null;

    if (this.progress < CONFIRM_AT) {
      this.progress = 0;
      return;
    }

    this.progress = 1;
    this.confirmed.emit();

    //Back to the start either way. A sale that went through empties the cart and takes this with
    //it, one the api refused leaves it ready to be tried again.
    this.settleTimer = setTimeout(() => (this.progress = 0), SETTLE_MS);
  }

  get knobOffset(): number {
    return this.progress * this.travel;
  }

  private measure(): void {
    const element = this.track?.nativeElement;
    this.travel = element ? Math.max(element.clientWidth - KNOB_SIZE - TRACK_PADDING * 2, 0) : 0;
  }

  private cancelDrag(): void {
    clearTimeout(this.settleTimer);
    this.dragging = false;
    this.pointerId = null;
    this.progress = 0;
  }
}
