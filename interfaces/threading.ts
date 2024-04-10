/**
 * ThreadingType enum.
 * @enum {string}
 */
export enum ThreadingType {
  /*
   *Threads are processed one after another in a batched manner.
   */
  Sequential = "sequential",
  /**
   * Threads are processed dynamically based on the completion of earlier threads.
   */
  Concurrent = "concurrent",
}

/**
 * ThreadData interface.
 */
export interface ThreadData {
  /**
   * Number of threads to use for threading.
   */
  threads: number;
  /**
   * Type of threading to use.
   */
  type?: ThreadingType;
}

export interface EndEvent {
  type: ThreadingType;
  arguments: any[];
  result: any;
}

/**
 * ThreadingEvents interface.
 */
export interface ThreadingEvents {
  error: [Error];
  begin: [any[]];
  end: [EndEvent];
}

/**
 * Callbacks interface.
 */
export interface Callbacks {
  callback: Function;
  arguments: any[];
}
