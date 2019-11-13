import assert from 'assert';
import PromisedSQL from "../../lib";
import {DB_LIKE_OBJECT, FAILING_DB_LIKE_OBJECT} from "./const";

const BAD_SQL_QUERIES = /Expected valid SQL queries/;

describe('#sqls', () => {
  let db;

  describe('Query', () => {
    beforeEach(() => {
      db = PromisedSQL(DB_LIKE_OBJECT);
    });

    it('Should demand arguments', () => {
      assert.throws(db.sqls, {message: BAD_SQL_QUERIES});
    });

    it('Should not accept a string', () => {
      assert.throws(() => db.sqls('a'), {message: BAD_SQL_QUERIES});
    });

    it('Should not accept an object', () => {
      assert.throws(() => db.sqls({a: 'b'}), {message: BAD_SQL_QUERIES});
    });

    it('Should not accept a function', () => {
      assert.throws(() => db.sqls(() => {}), {message: BAD_SQL_QUERIES});
    });

    it('Should not accept a list with anything but lists', () => {
      assert.throws(() => db.sqls([[], {}]), {message: BAD_SQL_QUERIES});
    });

    it('Should not accept an empty list', () => {
      assert.throws(() => db.sqls([]), {message: BAD_SQL_QUERIES});
    });

    it('Should not accept a list of empty lists', () => {
      assert.throws(() => db.sqls([[], []]), {message: BAD_SQL_QUERIES});
    });

    it('Should accept a list of lists of strings', () => {
      assert.doesNotThrow(() => db.sqls([['a'], ['a', 'b', 'c']]));
    });
  });

  describe('Returns', () => {
    beforeEach(() => {
      db = PromisedSQL(FAILING_DB_LIKE_OBJECT);
    });
    it('Should return a promise', () => {
      const res = db.sqls([['a']]);
      assert.equal(typeof res.then, 'function');
      res.catch(() => {});
    });
    it('Should reject the promise', () => {
      db.sqls([['a']])
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });
});
