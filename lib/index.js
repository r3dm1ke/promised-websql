export default function PromisedSQLite(db) {

  if (!is_valid_db(db)) {
    throw new Error('Expected a valid DB object. ');
  }

  return {
    _db: db,
    sql: do_sql,
    sqls: do_sqls,
  };
}

const do_sql = (sql_query, parameters) => {
  const db = this._db;
  if (!is_valid_sql_statement(sql_query)) {
    throw new Error('Expected a valid SQL query');
  }
  if (!are_valid_sql_parameters(parameters)) {
    throw new Error('Expected valid SQL parameters')
  }
  return new Promise((resolve, reject) =>
    db.transaction((tx) =>
      tx.executeSql(
        sql_query,
        parameters,
        (transaction, resultSet) => resolve([transaction, resultSet]),
        (transaction, error) => reject([transaction, error])
      ),
      (error) => reject([sql_query, error])
    )
  )
};

const do_sqls = (sql_queries) => {
  const db = this._db;
  if (!are_valid_sql_queries(sql_queries)) {
    throw new Error('Expected valid SQL queries');
  }
  return new Promise((resolve, reject) =>
    db.transaction((tx) =>
      Promise.all(sql_queries.map(([sql_query, ...parameters]) => {
        if (!is_valid_sql_statement(sql_query)) {
          reject([sql_query, 'Expected valid SQL query']);
        }
        if (!are_valid_sql_parameters(parameters)) {
          reject([sql_query, 'Expected valid parameters']);
        }
        return new Promise((inner_resolve, inner_reject) =>
          tx.executeSql(
            sql_query,
            parameters,
            (transaction, resultSet) => inner_resolve([transaction, resultSet]),
            (transaction, error) => inner_reject([transaction, error])
          )
        );
      })).then(resolve).catch(reject),
      (error) => ([sql_queries, error])
    )
  );
};

const is_valid_db = (db) =>
  db !== null &&
  typeof db === 'object' &&
  db.hasOwnProperty('transaction') &&
  typeof db.transaction === 'function';

const is_valid_sql_statement = (sql_statement) =>
  sql_statement !== null &&
  typeof sql_statement === 'string' &&
  sql_statement.length > 0;

const are_valid_sql_parameters = (parameters) =>
  parameters === null ||
  parameters.length;

const are_valid_sql_queries = (queries) =>
  queries.length &&
  queries.length > 0;
