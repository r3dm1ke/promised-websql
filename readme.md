# Promised SQL

A wrapper for WebSQL implementations to make them support promises.

Tested with:
- Chrome's WebSQL
- Expo SDK's `expo-sqlite`
- React Native's `react-native-sqlite-storage`

While not tested, it should work with Cordova's `cordova-sqlite-storage` and any WebSQL implementation 
in accordance with [this standard](https://www.w3.org/TR/webdatabase/).

## Why
I know WebSQL is deprecated and will not be developed, but it is still used widely and remains the only
SQL option on React Native/Cordova projects. I had to use SQL in one and wanted to write it with promises, 
that is why I created this package.
## Installation
`npm install promised-sql --save` or `yarn add promised-sql`.

## Usage
```javascript
import * as SQLite from 'expo-sqlite';
import PromisedSQLite from 'react-native-promised-sqlite';

// Setup
const db = SQLite.openDatabase('test.db');
const promised_db = PromisedSQLite(db);

// Usage
promised_db.sql(
  'CREATE TABLE AWESOME_PACKAGES(' +
  'ID INT PRIMARY KEY NOT NULL, ' +
  'NAME TEXT NOT NULL, ' +
  'URL TEXT NOT NULL);')
  .then(([transaction, result]) => {
    console.log('Table created!');
  })
  .catch((error) => {
    console.error(error);
  });
```

## API Reference
Coming soon
## Contributing
Any contributions are welcome. Feel free to open an issue if you find a bug or a pull request if you want to fix it.

