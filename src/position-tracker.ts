import scrollManager from "@gen-tech/scroll-manager";
import resizeManager from "@gen-tech/resize-manager";
import { Observable } from 'rxjs';
import { merge, map, throttleTime } from "rxjs/operators";
import { noop } from "@gen-tech/js-utils";

export interface IElementPosition {
  left: number;
  top: number;
}

export class PositionTracker {

  constructor(
    private defaultThrottleTime = 90
  ) {
  }

  public trackElement(element: HTMLElement): Observable<IElementPosition> {
    const trigger = resizeManager.root.throttleBy(0)
      .pipe(
        merge(scrollManager.root.throttleBy(0)),
        merge(resizeManager.observe(element.parentElement).throttleBy(0)),
        merge(scrollManager.observe(element.parentElement).throttleBy(0))
      );

    return this.trackElementByOwnTrigger(element, trigger);
  }

  public trackElementByOwnTrigger(
    element: HTMLElement,
    trigger: Observable<any>,
    _throttleTime = this.defaultThrottleTime
  ): Observable<IElementPosition> {
    return trigger.pipe(
      throttleTime(_throttleTime),
      map(() => this.getElementPosition(element))
    );
  }

  public getElementPosition(element: HTMLElement): IElementPosition {
    const { top, left } = element.getBoundingClientRect();
    return {top, left};
  }
}