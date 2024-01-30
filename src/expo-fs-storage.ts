import * as FileSystem from "expo-file-system";

import { ExpoFsStorageStatic } from "./types";

const DIRECTORY = FileSystem.documentDirectory + "databases";

function createPromise<Result, Callback extends Function>(
  asyncOperation: () => Promise<Result>,
  callback?: Callback
): Promise<Result> {
  return new Promise(async (resolve, reject) => {
    try {
      const value = await asyncOperation();
      callback?.(null, value);
      resolve(value);
    } catch (err) {
      callback?.(err);
      reject(err);
    }
  });
}

const ExpoFsStorage: ExpoFsStorageStatic = {
  setItem: (key, value, callback) => {
    return createPromise(
      () => FileSystem.writeAsStringAsync(DIRECTORY + key, value),
      callback
    );
  },

  getItem: (key, callback) => {
    return createPromise(
      () => FileSystem.readAsStringAsync(DIRECTORY + key),
      callback
    );
  },

  removeItem: (key, callback) => {
    return createPromise(
      () => FileSystem.deleteAsync(DIRECTORY + key),
      callback
    );
  },
};

export default ExpoFsStorage;
