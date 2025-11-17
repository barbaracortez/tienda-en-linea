import {
  Component,
  input,
  signal,
  OnInit,
  AfterViewInit,
  OnDestroy,
  effect,
  computed,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  imports: [CommonModule],
  templateUrl: './counter.component.html',
})
export class CounterComponent implements OnInit, AfterViewInit, OnDestroy {
  // Inputs con $
  $duration = input.required<number>();
  $message = model.required<string>();
  // Signals derivados y locales con $
  $doubleDuration = computed(() => this.$duration() * 2);
  $counter = signal(0);

  counterRef: number | undefined;

  constructor() {
    console.log('constructor');
    console.log('-'.repeat(10));

    effect(() => {
      this.$message();
      this.doSomethingTwo();
    });
  }

  ngOnInit() {
    console.log('ngOnInit');
    console.log('-'.repeat(10));
    console.log('duration =>', this.$duration());
    console.log('message =>', this.$message());

    this.counterRef = window.setInterval(() => {
      console.log('run interval');
      this.$counter.update(prev => prev + 1);
    }, 1000);
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    console.log('-'.repeat(10));
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    console.log('-'.repeat(10));
    window.clearInterval(this.counterRef);
  }

  doSomething() {
    console.log('change duration');
  }

  doSomethingTwo() {
    console.log('change message');
  }

  setMessage() {
    this.$message.set('Hola');
  }
}
