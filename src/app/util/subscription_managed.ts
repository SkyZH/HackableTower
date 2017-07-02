import { Subscription } from 'rxjs';
import { Injector, Injectable } from '../../di';
import * as _ from 'lodash';

export class SubscriptionManaged extends Injectable {
  private subscriptions: Array<Subscription>;
  
  constructor(baseInjector: Injector) {
    super(baseInjector);
    
    this.subscriptions = new Array<Subscription>();
  }

  protected sub(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }
  protected unsub() {
    _.forEach(this.subscriptions, (sub: Subscription) => sub.unsubscribe());
  }
}
