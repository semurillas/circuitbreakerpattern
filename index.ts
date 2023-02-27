import { CircuitBreaker } from "./circuitbreaker/CircuitBreaker";
import { BreakerOptions } from "./circuitbreaker/BreakerOptions";

const circuitBreaker = new CircuitBreaker({
  method: "get",
  url: "http://localhost:8080"
}, new BreakerOptions( 3, 5, 5000 ) );


setInterval(() => {
    circuitBreaker
        .exec()
        .then( console.log )
        .catch( console.error )
}, 1000 );