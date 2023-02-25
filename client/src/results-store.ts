export class ResultsStore<T> {
  private results: T[] = [];

  size(): number {
    return this.results.length;
  }

  push(result: T): void {
    this.results.push(result);
  }

  getResults(): T[] {
    return this.results;
  }
}
