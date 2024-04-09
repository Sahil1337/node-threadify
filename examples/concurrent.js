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
