"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
const breaker_1 = require("./breaker");
const axios_1 = __importDefault(require("axios"));
class CircuitBreaker {
    constructor(request, options) {
        this.request = request;
        this.state = breaker_1.BreakerState.GREEN;
        this.failureCount = 0;
        this.succesCount = 0;
        this.nextAttempt = Date.now();
        if (options) {
            this.failureThreshold = options.failureThreshold;
            this.succesThreshold = options.succesThreshold;
            this.timeout = options.timeout;
        }
        else {
            this.failureThreshold = 3;
            this.succesThreshold = 2;
            this.timeout = 3500;
        }
    }
    log(result) {
        console.table({
            Result: result,
            Timestamp: Date.now(),
            Successes: this.succesCount,
            Failures: this.failureCount,
            State: this.state
        });
    }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state === breaker_1.BreakerState.RED) {
                if (this.nextAttempt <= Date.now()) {
                    this.state = breaker_1.BreakerState.YELLOW;
                }
                else {
                    throw new Error("Circuito suspendido. Espere a que haya una respuesta positiva.");
                }
            }
            try {
                const response = yield (0, axios_1.default)(this.request);
                if (response.status === 200) {
                    return this.success(response.data);
                }
                else {
                    return this.failure(response.data);
                }
            }
            catch (err) {
                return this.failure(err.message);
            }
        });
    }
    success(res) {
        this.failureCount = 0;
        if (this.state === breaker_1.BreakerState.YELLOW) {
            this.succesCount++;
            if (this.succesCount > this.succesThreshold) {
                this.succesCount = 0;
                this.state = breaker_1.BreakerState.GREEN;
            }
        }
        this.log("Procesado");
        return res;
    }
    failure(res) {
        this.failureCount++;
        if (this.failureCount >= this.failureThreshold) {
            this.state = breaker_1.BreakerState.RED;
            this.nextAttempt = Date.now() + this.timeout;
        }
        this.log("Falla");
        return res;
    }
}
exports.CircuitBreaker = CircuitBreaker;
