class Utils {
  static isNull(value) {
    return value === null;
  }

  static isUndefined(value) {
    return value === undefined;
  }

  static isNullOrUndefined(value) {
    return this.isNull(value) || this.isUndefined(value);
  }

  static isNotNullOrUndefined(value) {
    return !this.isNullOrUndefined(value);
  }

  static coalesce(a, b, c) {
    return this.isNotNullOrUndefined(a)
      ? a
      : this.isNotNullOrUndefined(b)
      ? b
      : this.isNotNullOrUndefined(c)
      ? c
      : null;
  }
}

export default Utils;
