export default class ApplicationException {
    constructor(msg, inner, context) {
        this.message = msg;
        this.inner = inner;
        this.context = context;
      }

      toString() {
        return this.message;
      }
}
