export class Injector {
  private _providers: Map<any, any>;
  constructor(private baseInjector?: Injector) {
    this._providers = new Map<any, any>();
  }

  public provide(cls: any, obj: any) {
    this._providers.set(cls, obj);
  }

  public resolve <T extends Injectable> (cls: { new(...args : any[]): T }) : T {
    if (this._providers.has(cls)) return this._providers.get(cls);
    if (this.baseInjector) return this.baseInjector.resolve(cls);
    throw new Error(`class ${cls.name} not resolvable`);
  }

  public create <T extends Injectable> (cls: { new(...args : any[]): T }) : T {
    return new cls(this);
  }

  public selfProvide <T extends Injectable> (cls: { new(...args : any[]): T }) : T {
    let obj = this.create(cls);
    this.provide(cls, obj);
    return obj;
  }
}

export class Injectable {
  protected injector: Injector;
  constructor(baseInjector: Injector) {
    this.injector = new Injector(baseInjector);
  }
}

export const bootstrap = (App: any) => {
  return new App(null);
};
