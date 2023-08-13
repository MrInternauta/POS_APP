import { Directive, OnDestroy } from '@angular/core';

// libs
import { Subject } from 'rxjs';

@Directive()
export abstract class ComponentBase implements OnDestroy {
  private _destroy$?: Subject<void>;

  get destroy$() {
    if (!this._destroy$) {
      // Perf optimization:
      // since this is likely used as base component everywhere
      // only construct a Subject instance if actually used
      this._destroy$ = new Subject();
    }
    return this._destroy$;
  }

  ngOnDestroy() {
    if (this._destroy$) {
      this._destroy$.next(void 0);
      this._destroy$.complete();
    }
  }
}
