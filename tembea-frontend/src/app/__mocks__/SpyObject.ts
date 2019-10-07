// idea was borrowed from https://github.com/jhipster/jhipster-sample-app-noi18n/blob/master/src/test/javascript/spec/helpers/spyobject.ts

export class SpyObject {
  constructor(type = null) {
    if (type) {
      Object.keys(type.prototype).forEach(prop => {
        let m = null;
        try {
          m = type.prototype[prop];
        } catch (e) {
          // As we are creating spys for abstract classes,
          // these classes might have getters that throw when they are accessed.
          // As we are only auto creating spys for methods, this
          // should not matter.
        }
        if (typeof m === 'function' && !this[prop]) {
          // @ts-ignore
          const spyInstance = jest.spyOn(type.prototype, prop);
          spyInstance.mockReturnValue({});
          this[prop] = type.prototype[prop];
        }
      });
    }
  }
}
