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
  .then((statement, data) => {
    console.log('Table created!');
  })
  .catch((error) => {
    console.error(error);
  });

// With async/await
const with_async = async () => {
  try {
    const [statement, data] = await promised_db.sql(
      'INSERT INTO AWESOME_PACKAGES (NAME, URL) VALUES (?, ?)',
      ['react-native-sqlite-promised', 'https://some-url.com']
    );
    console.log(`Success! Rows affected: ${data.rowsAffected}`);
  } catch (error) {
    console.error(error);
  }
};

with_async().then(() => console.log('Async function returned'));

// Multiple statements in a transaction

promised_db.sqls([
  ['SELECT * FROM AWESOME_PACKAGES'],
  ['INSERT INTO AWESOME_PACKAGES (NAME, URL) VALUES (?, ?)', 'expo-sdk', 'https://expo.io']
])
  .then(([data1, data2]) => {
    console.log(`Rows returned from 1st statement: ${data1.rows.length}`);
    console.log(`Rows affected by the second statement: ${data2.rowsAffected}`)
  })
  .catch(([error1, error2]) => {
    if (error1) console.error(error1);
    if (error2) console.error(error2);
  });
