export default class Random {
  // Properties
  // LCG using GCC's constants
  public m: number = 0x80000000; // 2**31;
  public a: number = 1103515245;
  public c: number = 12345;
  public state: number;
  public seed: number;
  public generations: number = 0;
  // Constructor
  constructor(seed?: number) {
    this.seed = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    this.state = this.seed;
  }
  public nextRandomInt(): number {
    this.generations++;
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
  }
  public nextRandomFloat(): number {
    // returns in range [0,1]
    return this.nextRandomInt() / (this.m - 1);
  }
  public nextRandomRange(start: number, end: number): number {
    // returns in range [start, end): including start, excluding end
    // can't modulu nextInt because of weak randomness in lower bits
    const rangeSize = end - start;
    const randomUnder1 = this.nextRandomInt() / this.m;
    return start + Math.floor(randomUnder1 * rangeSize);
  }
  public nextRandomChoice<ElementType>(arr: Array<ElementType>): ElementType {
    return arr[this.nextRandomRange(0, arr.length)];
  }
}