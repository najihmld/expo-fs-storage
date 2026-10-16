import { ExpoFsStorageStatic } from "./types";

// Do not change this: existing apps have their data stored under this name.
const DIRECTORY_NAME = "databases";

// Minimal adapter over the two expo-file-system APIs this package supports.
type Backend = {
  baseUri: string;
  write: (uri: string, value: string) => Promise<void>;
  read: (uri: string) => Promise<string>;
  remove: (uri: string) => Promise<void>;
};

function withTrailingSlash(uri: string): string {
  return uri.endsWith("/") ? uri : uri + "/";
}

// expo-file-system v19+ (SDK 54+): class based API (File, Paths).
function createModernBackend(FS: any): Backend {
  return {
    baseUri: withTrailingSlash(FS.Paths.document.uri),
    write: async (uri, value) => {
      // Creates the file when missing and overwrites it otherwise.
      new FS.File(uri).write(value);
    },
    read: (uri) => new FS.File(uri).text(),
    remove: async (uri) => {
      new FS.File(uri).delete();
    },
  };
}

// expo-file-system up to SDK 53: functional API on the main entry point.
function createLegacyBackend(FS: any): Backend {
  return {
    baseUri: FS.documentDirectory,
    write: (uri, value) => FS.writeAsStringAsync(uri, value),
    read: (uri) => FS.readAsStringAsync(uri),
    remove: (uri) => FS.deleteAsync(uri),
  };
}

// Both APIs resolve to the same app document directory, so files written with
// one are readable with the other. The require stays a literal string so Metro
// can resolve it.
function createBackend(): Backend {
  const FS = require("expo-file-system");
  return FS.File && FS.Paths ? createModernBackend(FS) : createLegacyBackend(FS);
}

const backend = createBackend();

// Files live directly in the document directory as "databases<key>".
const getPath = (key: string) => backend.baseUri + DIRECTORY_NAME + key;

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
      () => backend.write(getPath(key), value),
      callback
    );
  },

  getItem: (key, callback) => {
    return createPromise(
      () => backend.read(getPath(key)),
      callback
    );
  },

  removeItem: (key, callback) => {
    return createPromise(
      () => backend.remove(getPath(key)),
      callback
    );
  },
};

export default ExpoFsStorage;
