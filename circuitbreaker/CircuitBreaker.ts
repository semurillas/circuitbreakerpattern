import {BreakerOptions} from "./BreakerOptions";
import {BreakerState} from "./breaker";
import axios, {AxiosRequestConfig} from "axios";

export class CircuitBreaker{

    private request: AxiosRequestConfig;
    private state: BreakerState;

    private failureCount: number;
    private succesCount: number;

    private nextAttempt: number;

    //options
    private failureThreshold: number;
    private succesThreshold: number;
    private timeout:number;

    constructor (request: AxiosRequestConfig, options?: BreakerOptions){
        this.request = request;
        this.state = BreakerState.GREEN;

        this.failureCount = 0;
        this.succesCount = 0;
        this.nextAttempt= Date.now();

        if (options){
            this.failureThreshold= options.failureThreshold;
            this.succesThreshold= options.succesThreshold;
            this.timeout = options.timeout;
        }else {
            this.failureThreshold = 3;
            this.succesThreshold=2;
            this.timeout=3500;
        }
    }


    private log(result: string): void {

        console.table({
            Result: result,
            Timestamp: Date.now(),
            Successes: this.succesCount,
            Failures: this.failureCount,
            State: this.state
        });
    }



    public async exec(): Promise<void> {

        if ( this.state === BreakerState.RED ) {

            if ( this.nextAttempt <= Date.now() ) {
                this.state = BreakerState.YELLOW;
            } else {
                throw new Error( "Circuito suspendido. Espere a que haya una respuesta positiva." );
            }
        }

        try {
            const response = await axios( this.request );

            if ( response.status === 200 ) {
                return this.success( response.data );
            } else {
                return this.failure( response.data );
            }
        } catch ( err: any ) {
            return this.failure( err.message );
        }
    }



    private success(res: any): any {

        this.failureCount = 0;

        if ( this.state === BreakerState.YELLOW ) {
            this.succesCount++;

            if ( this.succesCount > this.succesThreshold ) {
                this.succesCount = 0;
                this.state = BreakerState.GREEN;
            }
        }

        this.log( "Procesado" );

        return res;

    }



    private failure(res: any): any {

        this.failureCount++;

        if ( this.failureCount >= this.failureThreshold ) {
            this.state = BreakerState.RED;

            this.nextAttempt = Date.now() + this.timeout;
        }

        this.log( "Falla" );

        return res;
    }



}