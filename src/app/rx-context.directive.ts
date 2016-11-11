import {
  ChangeDetectorRef,
  Directive,
  DoCheck,
  EmbeddedViewRef,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import {
  Observable,
  Subscription
} from 'rxjs';

@Directive({
  selector: '[rxContext][rxContextOn]'
})
export class RxContextDirective implements DoCheck, OnInit {
  // the observable passed in from the expression:
  //     `let x on y`
  // (`y` is the observable in this example)
  @Input() rxContextOn: Observable<any>;
  // the optional function to map to the observable stream:
  //     `let x on y; select: foo`
  // (`foo` is the function in this example)
  @Input() rxContextSelect: (any) => any;

  // the subscription bound to the passed in observable
  private _subscription: Subscription;
  private _viewRef: EmbeddedViewRef<any>;
  // reference to "current" observable
  // (when a different observable is passed, directive is considered "dirty")
  private _context: Observable<any>;

  constructor(
    public templateRef: TemplateRef<any>,
    public changeDetectorRef: ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef
  ) { }

  // create a view container & subscribe to observable if it exists
  ngOnInit() {
    this._viewRef = this.viewContainerRef.createEmbeddedView(this.templateRef);
    this._context = this.rxContextOn;
    if (this._context) {
      this.connect(this._context);
    }
  }

  // subscribe to the observable and update view with
  // contents that arrive in the stream
  connect(contextStream: Observable<any>) {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    this._context = contextStream;
    let stateStream: Observable<any>;
    if (this.rxContextSelect) {
      stateStream = contextStream
        .map((state) => this.rxContextSelect(state));
    } else {
      stateStream = contextStream;
    }

    this._subscription = stateStream
      .subscribe((context) => this.update(context));
  }

  // inject value of `context` into the view
  update(context: any) {
    this._viewRef.context.$implicit = context;
    this.changeDetectorRef.detectChanges();
  }

  // Lifecycle hook that is called when Angular dirty checks a directive
  ngDoCheck() {
    if (this.rxContextOn && this.rxContextOn !== this._context) {
      this.connect(this.rxContextOn);
    }
  }
}
