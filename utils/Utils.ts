import { ThreadingType, type ThreadData } from "../interfaces";

export class Utils {
  public static checkThreadData(data: ThreadData) {
    if (!data.threads || typeof data.threads !== "number" || data.threads < 1) {
      throw new Error("ThreadData.threads is required.");
    }

    if (data.type && typeof data.type !== "string") {
      throw new Error("ThreadData.type must be a string.");
    }
  }

  public static checkThreadingType(type: string) {
    type = type.toLowerCase();

    if (
      type !== ThreadingType.Sequential &&
      type !== ThreadingType.Concurrent
    ) {
      throw new Error("Invalid ThreadingType.");
    }

    return type;
  }
}
