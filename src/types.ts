export declare type Callback = (error?: Error | null) => void;
export declare type CallbackWithResult<T> = (
  error?: Error | null,
  result?: T | null
) => void;

export declare type ExpoFsStorageStatic = {
  setItem: (key: string, value: string, callback?: Callback) => Promise<void>;
  getItem: (
    key: string,
    callback?: CallbackWithResult<string>
  ) => Promise<string | null>;
  removeItem: (key: string, callback?: Callback) => Promise<void>;
};
