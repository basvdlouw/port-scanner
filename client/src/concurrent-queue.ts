import { ResultsStore } from "./results-store";

export class ConcurrentQueue<T, E extends any[]> {
  private readonly queue: Array<{
    item: T;
    taskFunction: (...args: E) => Promise<any>;
    args: E;
  }> = [];

  private runningCount = 0;
  private completedCount = 0;
  private pendingTasks = 0;
  private readonly maxConcurrency: number;
  private resolvePromise!: () => void;

  constructor(
    maxConcurrency: number,
    private readonly resultsStore: ResultsStore<any>
  ) {
    this.maxConcurrency = maxConcurrency;
  }

  enqueue(
    item: T,
    taskFunction: (...args: E) => Promise<any>,
    ...args: E
  ): void {
    this.queue.push({ item, taskFunction, args });
    this.pendingTasks++;
    this.dequeue();
  }

  private dequeue(): void {
    if (this.runningCount >= this.maxConcurrency) {
      return;
    }

    const item = this.queue.shift();
    if (item == null) {
      return;
    }

    this.runningCount++;

    this.runTask(item.taskFunction, ...item.args)
      .then((result) => {
        console.log(`pending tasks: ${this.pendingTasks}`);
        console.log(`completed tasks: ${this.completedCount}`);
        this.resultsStore.push(result);
        this.completedCount++;
        this.pendingTasks--;
        this.runningCount--;
        this.dequeue();
        if (
          this.pendingTasks === 0 &&
          this.completedCount === this.resultsStore.size()
        ) {
          this.resolvePromise();
        }
      })
      .catch((_error) => {
        console.log(`pending tasks: ${this.pendingTasks}`);
        console.log(`completed tasks: ${this.completedCount}`);
        this.completedCount++;
        this.pendingTasks--;
        this.runningCount--;
        this.dequeue();
        if (
          this.pendingTasks === 0 &&
          this.completedCount === this.resultsStore.size()
        ) {
          this.resolvePromise();
        }
      });
  }

  waitForCompletion(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  private async runTask(
    taskFunction: (...args: E) => Promise<any>,
    ...args: E
  ): Promise<any> {
    return taskFunction(...args);
  }
}
