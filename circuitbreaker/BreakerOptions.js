"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreakerOptions = void 0;
class BreakerOptions {
    constructor(failureThreshold, succesThreshold, timeout) {
        this.failureThreshold = failureThreshold;
        this.succesThreshold = succesThreshold;
        this.timeout = timeout;
    }
}
exports.BreakerOptions = BreakerOptions;
