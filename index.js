"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CircuitBreaker_1 = require("./circuitbreaker/CircuitBreaker");
const BreakerOptions_1 = require("./circuitbreaker/BreakerOptions");
const circuitBreaker = new CircuitBreaker_1.CircuitBreaker({
    method: "get",
    url: "http://localhost:8080"
}, new BreakerOptions_1.BreakerOptions(3, 5, 5000));
setInterval(() => {
    circuitBreaker
        .exec()
        .then(console.log)
        .catch(console.error);
}, 1000);
