import EventEmitter from "events";

class Threading {
  /**
   * @param {Object} data - Data to start threading.
   * @param {number} data.threads - Number of threads to use for threading.
   * @param {("sequential"|"concurrent")} data.type - Type of threading to use.
   *        - "sequential": Threads are processed one after another in a batched manner.
   *        - "concurrent": Threads are processed dynamically based on the completion of earlier threads.
   */

  constructor(data) {
    this.threads = data.threads;
    this.running = 0;
    this.callbacks = [];
    this.emitter = new EventEmitter();
    this.type = data?.type ? data?.type : "concurrent";

    if (!this.threads || !(this.threads > 0))
      throw new Error("Enter number of threads, must be a postive integer.");

    this.emitter.on("error", () => {});
    this.emitter.on("begin", () => {});
    this.emitter.on("end", () => {});
  }

  /**
   * Adds a callback function and its arguments to the queue.
   * @param {Function} callback - The callback function to execute
   * @param  {...any} args - Arguments to pass to the callback function
   */
  insert(callback, ...args) {
    this.callbacks.push({ callback, arguments: [...args] });
  }

  /**
   * Executes the queued callback functions asynchronously.
   * @returns {Promise<void>}
   */
  async run() {
    if (this.type.toLowerCase() === "sequential") {
      this.#regulateSequential();
    } else if (this.type.toLowerCase() === "concurrent") {
      for (let i = 0; i < this.callbacks.length; i++) {
        this.#regulateConcurrent(
          this.callbacks[i]?.callback,
          this?.callbacks[i].arguments
        );
      }
    }
  }

  /**
   * Executes a callback function and manages the thread pool according to threads sequential.
   * @param {Function} callback - The callback function to execute
   * @param {Array} args - Arguments to pass to the callback function
   * @returns {Promise<any>} - The result of the callback function
   */
  async #regulateSequential() {
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
        this.emitter.emit("begin", task.arguments);
      }

      const results = await Promise.all(
        chunkTasks.map(async (task) => {
          try {
            const result = await task.callback(...task.arguments);
            return { result, arguments: task.arguments };
          } catch (error) {
            this.emitter.emit("error", {
              message: error.message,
              stack: error.stack,
            });
            return null;
          }
        })
      );

      results.forEach((resultWithArguments) => {
        if (resultWithArguments !== null) {
          this.emitter.emit("end", {
            type: "sequential",
            arguments: resultWithArguments.arguments,
            result: resultWithArguments.result,
          });
        }
      });
    }
  }

  /**
   * Executes a callback function and manages the thread pool in concurrent.
   * @param {Function} callback - The callback function to execute
   * @param {Array} args - Arguments to pass to the callback function
   * @returns {Promise<any>} - The result of the callback function
   */
  async #regulateConcurrent(callback, args) {
    if (this.running >= this.threads) {
      await this.#waitForThread();
    }
    this.running++;

    try {
      this.emitter.emit("begin", args);
      const result = await callback(...args);
      this.emitter.emit("end", {
        type: "concurrent",
        arguments: args,
        result,
      });
      return result;
    } catch (error) {
      this.emitter.emit("error", {
        message: error.message,
        stack: error.stack,
      });
    } finally {
      this.running--;
    }
  }

  /**
   * Waits for an available thread before executing a task.
   * @returns {Promise<void>}
   */
  async #waitForThread() {
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
}

export { Threading };
