# Promised WebSQL

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
`npm install promised-websql --save` or `yarn add promised-websql`.

## Usage
```javascript
import * as SQLite from 'expo-sqlite';
import PromisedWebSQL from 'promised-websql';

// Setup
const db = SQLite.openDatabase('test.db');
const promised_db = PromisedWebSQL(db);

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
`PromisedWebSQL(db)`
- Arguments:
    - `db: object` - a DB-like object that conforms to the WebSQL specification,
    most notably, has a `#transaction` function.
- Returns:
    - `{sql: function, sqls: function}`
 
`PromisedWebSQL#sql(sql_query, paramerters)`
- Arguments:
    - `sql_query: string` - an SQL query to execute
    - `parameters?: Array<string>` - an optional array of parameters to
    interpolate `?` symbols in `sql_query`.
- Returns:
    - `Promise<[transaction: SQLTransaction, result: ResultSet]>` - 
    A promise which resolves when the transaction is executed. Resolves with an array,
    where the first element is the transaction itself and the second is the response from
    the database api. If rejected, rejects with an array where the first element is the 
    transaction itself, and the second is the error returned from the database api.
## Contributing
Any contributions are welcome. Feel free to open an issue if you find a bug or a pull request if you want to fix it.

