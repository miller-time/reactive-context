import { Component } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { Observable} from 'rxjs';

import { RxContextDirective } from './rx-context.directive';

@Component({
  selector: 'app-test-component',
  template: `
    <div *rxContext="let state on stateStream">
      <p>{{state}}</p>
    </div>
  `
})
class TestRxComponent {
  stateStream: Observable<string>;
}

@Component({
  selector: 'app-test-select-component',
  template: `
    <div *rxContext="let upperState on stateStream; select:upper">
      <p>{{upperState}}</p>
    </div>
  `
})
class TestRxSelectComponent {
  stateStream: Observable<string>;
  upper(state: string) {
    return state.toUpperCase();
  }
}

describe('Directive: RxContext', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RxContextDirective,
        TestRxComponent,
        TestRxSelectComponent
      ]
    }).compileComponents();
  }));

  describe('applied to a component', () => {
    let fixture: ComponentFixture<TestRxComponent>;
    let component: TestRxComponent;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TestRxComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('should create an instance', () => {
      expect(component).toBeTruthy();
    });

    it('should render the value passed in the observable stream', async(() => {
      component.stateStream = Observable.of('hello');
      fixture.detectChanges();
      let compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('p').textContent).toContain('hello');
    }));
  });

  describe('applied to a "select" component', () => {
    let fixture: ComponentFixture<TestRxSelectComponent>;
    let component: TestRxSelectComponent;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TestRxSelectComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('should create an instance', () => {
      expect(component).toBeTruthy();
    });

    it('should render the "selected" value passed in the observable stream', async(() => {
      component.stateStream = Observable.of('hello');
      fixture.detectChanges();
      let compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('p').textContent).toContain('HELLO');
    }));
  });
});
