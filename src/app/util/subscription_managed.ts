import { Subscription } from 'rxjs';
import * as _ from 'lodash';

export class SubscriptionManaged {
  private subscriptions: Array<Subscription>;
  
  constructor() {
    this.subscriptions = new Array<Subscription>();
  }

  protected sub(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }
  protected unsub() {
    _.forEach(this.subscriptions, (sub: Subscription) => sub.unsubscribe());
  }
}