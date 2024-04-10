import EventEmitter from "events";
import {
  ThreadingType,
  type Callbacks,
  type ThreadData,
  type ThreadingEvents,
} from "../interfaces";
import { Utils } from "../utils";

export interface Threading {
  on<K extends keyof ThreadingEvents>(
    event: K,
    listener: (...args: ThreadingEvents[K]) => void
  ): this;

  once<K extends keyof ThreadingEvents>(
    event: K,
    listener: (...args: ThreadingEvents[K]) => void
  ): this;

  emit<K extends keyof ThreadingEvents>(
    event: K,
    ...args: ThreadingEvents[K]
  ): boolean;
}

export class Threading extends EventEmitter {
  /**
   * Number of threads to use for threading.
   */
  public threads!: number;
  /**
   * Sahil fill this tq!
   */
  public running: number = 0;
  /**
   * Type of threading to use.
   */
  public type!: ThreadingType;
  /**
   * Callbacks to run.
   */
  public callbacks!: Callbacks[];

  constructor(data: ThreadData) {
    super({ captureRejections: true });

    Utils.checkThreadData(data);

    this.threads = data.threads;
    this.type = data.type || ThreadingType.Sequential;
    this.callbacks = [];
  }

  /**
   * Waits for an available thread before executing a task.
   * @returns {Promise<void>}
   */
  private async waitForThread() {
    return new Promise((resolve) => {
      const checkThread = () => {
        if (this.running < this.threads) {
          resolve(true);
        } else {
          setTimeout(checkThread, 10);
        }
      };

      checkThread();
    });
  }

  /**
   * Executes a callback function and manages the thread pool in concurrent.
   * @param {Function} callback - The callback function to execute
   * @param {Array} args - Arguments to pass to the callback function
   * @returns {Promise<any>} - The result of the callback function
   */
  private async regulateConcurrent(callback: Function, args: any[]) {
    if (this.running >= this.threads) {
      await this.waitForThread();
    }
    this.running++;

    try {
      this.emit("begin", args);
      const result = await callback(...args);
      this.emit("end", {
        type: ThreadingType.Concurrent,
        arguments: args,
        result,
      });
      return result;
    } catch (err: any) {
      this.emit("error", {
        message: err.message,
        stack: err.stack,
        name: err.name || "Error",
      });
    } finally {
      this.running--;
    }
  }

  /**
   * Executes a callback function and manages the thread pool according to threads sequential.
   * @param {Function} callback - The callback function to execute
   * @param {Array} args - Arguments to pass to the callback function
   * @returns {Promise<any>} - The result of the callback function
   */
  private async regulateSequential() {
    for (let i = 0; i < this.callbacks.length; i = i + this.threads) {
      const chunkTasks = [];

      for (let j = 0; j < this.threads; j++) {
        if (this.callbacks[i + j]) {
          chunkTasks.push({
            callback: this.callbacks[i + j].callback,
            arguments: [...this.callbacks[i + j].arguments],
          });
        }
      }

      for (const task of chunkTasks) {
        this.emit("begin", task.arguments);
      }

      const results = await Promise.all(
        chunkTasks.map(async (task) => {
          try {
            const result = await task.callback(...task.arguments);
            return { result, arguments: task.arguments };
          } catch (error: any) {
            this.emit("error", {
              message: error.message,
              stack: error.stack,
              name: error.name || "Error",
            });
            return null;
          }
        })
      );

      results.forEach((resultWithArguments) => {
        if (resultWithArguments !== null) {
          this.emit("end", {
            type: ThreadingType.Sequential,
            arguments: resultWithArguments.arguments,
            result: resultWithArguments.result,
          });
        }
      });
    }
  }

  /**
   * Adds a callback function and its arguments to the queue.
   * @param {Function} callback - The callback function to execute
   * @param  {...args} args - The arguments to pass to the callback function
   */
  public insert(callback: Function, ...args: any[]): void {
    this.callbacks.push({ callback, arguments: args });
  }

  /**
   * Executes the queued callback functions asynchronously.
   * @returns {Promise<void>}
   */
  public async run() {
    let type = Utils.checkThreadingType(this.type);
    if (type === ThreadingType.Sequential) {
      await this.regulateSequential();
    } else if (type === ThreadingType.Concurrent) {
      for (let i = 0; i < this.callbacks.length; i++) {
        this.regulateConcurrent(
          this.callbacks[i]?.callback,
          this?.callbacks[i].arguments
        );
      }
    }
  }
}
