
# @najihmld/expo-fs-storage

An persistent, key-value storage system for React Native Expo, which does not have size limitations of @react-native-async-storage/async-storage


## Installation
With npm:

```bash
npm install @najihmld/expo-fs-storage
```
With Yarn:
```bash
yarn add @najihmld/expo-fs-storage
```

With Expo CLI:
```bash
npx expo install @najihmld/expo-fs-storage
```

## Usage
**ExpoFsStorage** can only store `string` data. In order to store object data,
you need to serialize it first. For data that can be serialized to JSON, you can
use `JSON.stringify()` when saving the data and `JSON.parse()` when loading the
data.

### Importing

```js
import ExpoFsStorage from '@najihmld/expo-fs-storage';
```

### Storing data

`setItem()` is used both to add new data item (when no data for given key
exists), and to modify existing item (when previous data for given key exists).

#### Storing string value

```jsx
const storeData = async (value) => {
  try {
    await ExpoFsStorage.setItem('my-key', value);
  } catch (e) {
    // saving error
  }
};
```

#### Storing object value

```jsx
const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await ExpoFsStorage.setItem('my-key', jsonValue);
  } catch (e) {
    // saving error
  }
};
```

### Reading data

`getItem` returns a promise that either resolves to stored value when data is
found for given key, or returns `null` otherwise.

#### Reading string value

```jsx
const getData = async () => {
  try {
    const value = await ExpoFsStorage.getItem('my-key');
    if (value !== null) {
      // value previously stored
    }
  } catch (e) {
    // error reading value
  }
};
```

#### Reading object value

```jsx
const getData = async () => {
  try {
    const jsonValue = await ExpoFsStorage.getItem('my-key');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};
```

### Remove data

Removes item for a `key`, invokes (optional) callback once completed.

```js
const removeData = async () => {
  try {
    await ExpoFsStorage.removeItem('my-key')
  } catch(e) {
    // remove error
  }

  console.log('Done.')
}
```
