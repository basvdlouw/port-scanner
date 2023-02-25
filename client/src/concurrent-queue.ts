export class ConcurrentQueue<T, E extends any[]> {
  private readonly queue: Array<{
    item: T;
    taskFunction: (...args: E) => Promise<any>;
    args: E;
  }> = [];

  private runningCount: number = 0;
  private readonly maxConcurrency: number;

  constructor(maxConcurrency: number) {
    this.maxConcurrency = maxConcurrency;
  }

  enqueue(
    item: T,
    taskFunction: (...args: E) => Promise<any>,
    ...args: E
  ): void {
    this.queue.push({ item, taskFunction, args });
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
      .then(() => {
        this.runningCount--;
        this.dequeue();
      })
      .catch((_error) => {
        this.runningCount--;
        this.dequeue();
      });
  }

  private async runTask(
    taskFunction: (...args: E) => Promise<any>,
    ...args: E
  ): Promise<void> {
    await taskFunction(...args);
  }
}
