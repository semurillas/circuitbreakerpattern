
export class BreakerOptions{
    constructor(
        public failureThreshold: number,
        public succesThreshold: number,
        public timeout:number
    ){

    }
}
