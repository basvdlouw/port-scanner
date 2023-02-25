export class ConcurrentQueue<T> {
  private readonly queue: Array<{
    item: T;
    taskFunction: (...args: any[]) => Promise<any>;
  }> = [];

  private runningCount: number = 0;
  private readonly maxConcurrency: number;

  constructor(maxConcurrency: number) {
    this.maxConcurrency = maxConcurrency;
  }

  enqueue(item: T, taskFunction: (...args: any[]) => Promise<any>): void {
    this.queue.push({ item, taskFunction });
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

    this.runTask(item.taskFunction)
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
    taskFunction: (...args: any[]) => Promise<any>,
    ...args: any[]
  ): Promise<void> {
    await taskFunction(...args);
  }
}
