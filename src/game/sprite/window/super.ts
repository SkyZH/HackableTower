import Immutable = require('immutable');
import Monapt = require('monapt');

class Super {
  static prototypeHistory: Immutable.Map<any, Immutable.Stack<any>> =
    Immutable.Map<any, Immutable.Stack<any>>();

  static get<T>(object: any, property: string): T {
    let value: T;

    try {
      value = Super.__getPropertyDescriptor('get', object, property).get.call(object);
    }
    finally {
      Super.__popPrototypeHistory('get', object, property);
    }

    return value;
  }

  static set<T>(object: any, property: string, value: T): void {
    try {
      Super.__getPropertyDescriptor('set', object, property).set.call(object, value);
    }
    finally {
      Super.__popPrototypeHistory('set', object, property);
    }
  }

  // :LINK: http://wiki.ecmascript.org/doku.php?id=harmony:extended_object_api
  private static __getPropertyDescriptor(action: string, object: any, property: string): PropertyDescriptor {
    // :HACK: Avoid dropping 'back down' the prototype chain when calling a Super call to a property
    // inside another Super call to the same property call.
    const basePrototype: any = Monapt.Option(Super.prototypeHistory.getIn([action, object, property]))
      .map((stack: Immutable.Stack<any>) => stack.peek())
      .getOrElse(() => object.constructor.prototype);

    let proto: any = Object.getPrototypeOf(basePrototype);
    let pd: PropertyDescriptor = Object.getOwnPropertyDescriptor(proto, property);

    while (pd === undefined && proto !== null) {
      proto = Object.getPrototypeOf(proto);
      pd = Object.getOwnPropertyDescriptor(proto, property);
    }

    Super.prototypeHistory = Super.prototypeHistory.updateIn(
      [action, object, property],
      () => {
        return Super.prototypeHistory.getIn([action, object, property], Immutable.Stack<any>())
          .push(proto);
      }
    );

    return pd;
  }

  private static __popPrototypeHistory(action: string, object: any, property: string): void {
    const newStack: Monapt.Option<Immutable.Stack<any>> =
      Monapt.Option(Super.prototypeHistory.getIn([action, object, property]))
        .map((stack: Immutable.Stack<any>) => stack.pop())
        .filter((stack: Immutable.Stack<any>) => stack.size > 0);

    Super.prototypeHistory = newStack.match({
      None: (): Immutable.Map<any, Immutable.Stack<any>> => Super.prototypeHistory.deleteIn([action, object, property]),
      Some: (stack: Immutable.Stack<any>): Immutable.Map<any, Immutable.Stack<any>> => {
        return Super.prototypeHistory.updateIn([action, object, property], () => stack);
      }
    });
  }
}

export default Super;
