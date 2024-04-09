<div align="center">
  <h1>Node-threadify</h1>
  <p>A package to use threads efficiently in nodejs.</p>
  <p>
    <a href="https://www.npmjs.com/package/node-threadify"><img src="https://img.shields.io/npm/v/node-threadify?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/node-threadify"><img src="https://img.shields.io/npm/dt/node-threadify?maxAge=3600" alt="NPM downloads" /></a>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/node-threadify"><img src="https://nodei.co/npm/node-threadify.png?downloads=true&stars=true" alt="NPM Banner"></a>
  </p>
</div>

## 📂 | Installation

```sh
npm install node-threadify
# (or)
yarn add node-threadify
```

## 📜 | Setup

```js
const { Threading } = require("node-threadify"); //Importing client
const threads = new Threading({ threads: 5, type: "concurrent" }); //Amount of threads
```

## ✨ | Key Features

- **Highly Customizable and Efficient:** Node-threadify offers full customization, dynamic behavior, and efficient resource management. Users can specify the number of threads to use, leading to better resource utilization and reduced memory usage.

- **Two Threading Methods: Concurrent and Sequential**

    - **Concurrent Threading:** Enables parallel task execution with dynamic thread allocation. Threads are initiated based on the completion of earlier tasks, allowing for optimal resource utilization. For instance, if the concurrency limit is set to 4 threads, additional threads are spawned as earlier ones complete, ensuring efficient processing. Check out more examples in the example folder.
  
    - **Sequential Threading:** Ensures orderly task execution by processing a fixed number of threads sequentially. Tasks are executed in pairs, one after the other, maintaining controlled execution flow. For example, with a concurrency limit of 4 threads, tasks will be executed sequentially, ensuring minimal resource contention. Explore additional examples in the example folder.

- **Event Handling for Enhanced Functionality**

    - **Error Handling:** Receive notifications when errors occur during threaded operations. Handle errors effectively using the error event. Example:
        ```javascript
        threads.emitter.on("error", (error) => {
          // Handle error messages
        });
        ```

    - **Thread Start Event:** Get notified when a thread starts execution and access the parameters passed to the thread. Example:
        ```javascript
        /**
         * @description Event listener for the "begin" event emitted by threads.emitter for concurrent threading.
         * This event is triggered when a thread begins its execution.
         *
         * @param {Array} res - An array containing the arguments passed to the thread.
         * @example
         * Example usage:
         * threads.emitter.on("begin", (res) => {
         *   // Access parameters passed to the thread
         * });
         */
        threads.emitter.on("begin", (res) => {
          // Access parameters passed to the thread
        });
        ```

    - **Thread End Event:** Receive notifications when a thread completes its execution and access information such as the threading type, arguments passed to the thread, and the result returned by the function. Example:
        ```javascript
        /**
         * @description Event listener for the "end" event emitted by threads.emitter for concurrent threading.
         * This event is triggered when a thread completes its execution.
         *
         * @param {Object} res - The event payload.
         * @param {string} res.type - The type of the threading used (`sequential` or `concurrent`).
         * @param {Array.<any>} res.arguments - The arguments passed to the callback function of the thread.
         * @param {any} res.result - The result returned by the callback function of the thread.
         * @example
         * Expected result when a threading operation completes successfully:
         * {
         *   type: 'sequential' | 'concurrent',
         *   arguments: [argument1, argument2, ...],
         *   result: callbackResult
         * }
         */
        threads.emitter.on("end", (res) => {
          // Access threading type, arguments, and result
        });
        ```


## ✍ | Examples

- Simple usage
```js
/**
 * @description
 * Demonstrates a simple process with default threading type (concurrent).
 * No specific threading type is specified, so it defaults to concurrent threading.
 * In this example, multiple image downloads are initiated concurrently.
 */
import { Threading } from "node-threadify";

// Create a new instance of Threading
const threads = new Threading({ threads: 4 });

// List of image URLs to download concurrently
const imageUrls = [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg",
  "https://example.com/image3.jpg",
  "https://example.com/image4.jpg",
  "https://example.com/image5.jpg",
  "https://example.com/image6.jpg",
  "https://example.com/image7.jpg",
  "https://example.com/image8.jpg",
];

// Insert image download tasks into the threading instance
imageUrls.forEach((url) => {
  threads.insert(downloadImage, url);
});

// Execute the threaded tasks
threads.run();

/**
 * Downloads an image from the specified URL.
 * @param {string} url - The URL of the image to download.
 * @returns {Promise<string>} A Promise that resolves with the downloaded image URL.
 */
async function downloadImage(url) {
  console.log(`Starting to download image from: ${url}`);
  await download(url);
  console.log(`Downloaded image from: ${url}`);
  return url;
}

/**
 * Utility function to simulate image download.
 * @param {string} url - The URL of the image to download.
 * @returns {Promise<void>} A Promise that resolves after a random delay, simulating the download process.
 */
async function download(url) {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 10000); // Simulate varying download times
  });
}
```

- Concurrent threads
```js
/**
 * @description
 * Demonstrates the functionality of concurrent threading with dynamic processing.
 *
 * Concurrent threading facilitates parallel task execution with dynamic thread processing based on the completion of earlier threads.
 * Threads are allocated dynamically, allowing tasks to execute simultaneously based on available resources.
 * For example, if the concurrency limit is set to 4 threads, additional threads are initiated as earlier threads complete,
 * ensuring optimal resource utilization and efficient task processing.
 *
 * @example
 * An example to download multiple images with concurrent threading system featuring dynamic thread processing.
 */

import { Threading } from "node-threadify";

// Create a new instance of Threading with sequential type
const threads = new Threading({ threads: 4, type: "concurrent" });

/**
 * @description Listens to the "begin" event emitted by threads.emitter for concurrent threading.
 * This event is triggered when a thread begins execution.
 *
 * @param {Array} res An array containing arguments passed to the thread.
 * @example
 * Example usage:
 * threads.emitter.on("begin", (res) => {
 *   console.log(`Thread started with arguments: ${res.join(', ')}`);
 * });
 */
threads.emitter.on("begin", (res) => {
  console.log(`Thread started, Starting to download image from: ${res[0]}`);
});

/**
 * @description Listens to the "end" event emitted by threads.emitter for concurrent threading.
 * This event is triggered when a thread completes its execution.
 *
 * @param {Object} res - The event payload.
 * @param {string} res.type - The type of the event. Can be 'concurrent'.
 * @param {Array.<any>} res.arguments - The arguments passed to the callback function.
 * @param {Object} res.result - The result of the callback function.
 * @example
 * Expected result when a concurrent operation completes successfully:
 * {
 *   type: 'concurrent',
 *   arguments: [ 'param1', 'param2', ... ],
 *   result: { ..result }
 * }
 */
threads.emitter.on("end", (res) => {
  console.log(
    `Thread completed, downloaded image from: ${JSON.stringify(res.result)}`
  );
  // Now we can persist the result by saving it to a file or database.
});

/**
 * @description Event listener for the "error" event emitted by threads.emitter for concurrent threading.
 * This event is triggered when an error occurs during a threaded operation.
 *
 * @param {Object} error - The error object representing the occurred error.
 * @param {string} error.message - A descriptive message explaining the error.
 * @param {string} error.stack - The stack trace of the error.
 * @example
 * Example usage:
 * threads.emitter.on("error", (error) => {
 *   console.error(`An error occurred: ${error.message}`);
 * });
 */
threads.emitter.on("error", (error) => {
  console.error(`An error occurred: ${error.message}`);
});

// Define an array of image URLs to download sequentially
const imageUrls = [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg",
  "https://example.com/image3.jpg",
  "https://example.com/image4.jpg",
  "https://example.com/image5.jpg",
  "https://example.com/image6.jpg",
  "https://example.com/image7.jpg",
  "https://example.com/image8.jpg",
];

// Insert image download tasks into the threading instance
imageUrls.forEach((url) => {
  threads.insert(downloadImage, url);
});

// Run the threaded tasks
threads.run();

/**
 * Downloads an image from the specified URL.
 * @param {string} url - The URL of the image to download.
 * @returns {Promise<void>} A Promise that resolves when the download is complete.
 */
async function downloadImage(url) {
  await download(url);
  return url;
}

/**
 * Utility function to simulate image download.
 * @param {string} url - The URL of the image to download.
 * @returns {Promise<void>} A Promise that resolves after a random delay, simulating the download process.
 */
async function download(url) {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 10000); // Simulate varying download times
  });
}
```

- Sequential threads
```js
/**
 * @description
 * Demonstrates the functionality of sequential threading.
 *
 * Sequential threading ensures orderly task execution by processing a predetermined number of threads sequentially.
 * Each batch of threads is completed before proceeding to the next set, maintaining controlled execution flow.
 * For example, if the concurrency limit is set to 4 threads, tasks will be executed in pairs, one after the other,
 * ensuring efficient task processing with minimal resource contention.
 *
 * @example
 * An example to download multiple images with sequential threading system.
 */

import { Threading } from "node-threadify";

// Create a new instance of Threading with sequential type
const threads = new Threading({ threads: 4, type: "sequential" });

/**
 * @description Listens to the "begin" event emitted by threads.emitter for sequential threading.
 * This event is triggered when a thread begins execution.
 *
 * @param {Array} res An array containing arguments passed to the thread.
 * @example
 * Example usage:
 * threads.emitter.on("begin", (res) => {
 *   console.log(`Thread started with arguments: ${res.join(', ')}`);
 * });
 */
threads.emitter.on("begin", (res) => {
  console.log(`Thread started, Starting to download image from: ${res[0]}`);
});

/**
 * @description Listens to the "end" event emitted by threads.emitter for sequential threading.
 * This event is triggered when a thread completes its execution.
 *
 * @param {Object} res - The event payload.
 * @param {string} res.type - The type of the event. Can be 'sequential'.
 * @param {Array.<any>} res.arguments - The arguments passed to the callback function.
 * @param {Object} res.result - The result of the callback function.
 * @example
 * Expected result when a sequential operation completes successfully:
 * {
 *   type: 'sequential',
 *   arguments: [ 'param1', 'param2', ... ],
 *   result: { ..result }
 * }
 */
threads.emitter.on("end", (res) => {
  console.log(
    `Thread completed, downloaded image from: ${JSON.stringify(res.result)}`
  );
  // Now we can persist the result by saving it to a file or database.
});

/**
 * @description Event listener for the "error" event emitted by threads.emitter for sequential threading.
 * This event is triggered when an error occurs during a threaded operation.
 *
 * @param {Object} error - The error object representing the occurred error.
 * @param {string} error.message - A descriptive message explaining the error.
 * @param {string} error.stack - The stack trace of the error.
 * @example
 * Example usage:
 * threads.emitter.on("error", (error) => {
 *   console.error(`An error occurred: ${error.message}`);
 * });
 */
threads.emitter.on("error", (error) => {
  console.error(`An error occurred: ${error.message}`);
});

// Define an array of image URLs to download sequentially
const imageUrls = [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg",
  "https://example.com/image3.jpg",
  "https://example.com/image4.jpg",
  "https://example.com/image5.jpg",
  "https://example.com/image6.jpg",
  "https://example.com/image7.jpg",
  "https://example.com/image8.jpg",
];

// Insert image download tasks into the threading instance
imageUrls.forEach((url) => {
  threads.insert(downloadImage, url);
});

// Run the threaded tasks
threads.run();

/**
 * Downloads an image from the specified URL.
 * @param {string} url - The URL of the image to download.
 * @returns {Promise<void>} A Promise that resolves when the download is complete.
 */
async function downloadImage(url) {
  await download(url);
  return url;
}

/**
 * Utility function to simulate image download.
 * @param {string} url - The URL of the image to download.
 * @returns {Promise<void>} A Promise that resolves after a random delay, simulating the download process.
 */
async function download(url) {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 10000); // Simulate varying download times
  });
}
```

All of our examples and activites are in examples folder.
If you have any other problems/questions, you can open up a issue.
