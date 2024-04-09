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
