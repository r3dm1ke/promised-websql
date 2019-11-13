import assert from 'assert';
import PromisedSQL from "../../lib";
import {DB_LIKE_OBJECT, FAILING_DB_LIKE_OBJECT} from "./const";

describe('#sql', () => {
  let db;

  const BAD_QUERY_MESSAGE = /Expected a valid SQL query/;
  const BAD_PARAMETER_MESSAGE = /Expected valid SQL parameters/;

  describe('Query', () => {
    beforeEach('Creates a PromisedSQL object from a db-like object', () => {
      db = PromisedSQL(DB_LIKE_OBJECT);
    });

    it('Should demand arguments', () => {
      assert.throws(db.sql, {message: BAD_QUERY_MESSAGE});
    });

    it('Should not accept a number', () => {
      assert.throws(() => db.sql(420), {message: BAD_QUERY_MESSAGE});
    });

    it('Should not accept an object', () => {
      assert.throws(() => db.sql({a: 'b'}, {message: BAD_QUERY_MESSAGE}));
    });

    it('Should not accept an array', () => {
      assert.throws(() => db.sql(['a']), {message: BAD_QUERY_MESSAGE});
    });

    it('Should not accept null', () => {
      assert.throws(() => db.sql(null), {message: BAD_QUERY_MESSAGE});
    });

    it('Should not accept a function', () => {
      assert.throws(() => db.sql(() => {}), {message: BAD_QUERY_MESSAGE});
    });

    it('Should accept a string', () => {
      assert.doesNotThrow(() => db.sql('a'));
    });
  });

  describe('Parameters', () => {
    beforeEach('Creates a PromisedSQL object from a db-like object', () => {
      db = PromisedSQL(DB_LIKE_OBJECT);
    });

    it('Should not demand parameters', () => {
      assert.doesNotThrow(() => db.sql('a', undefined));
    });

    it('Should not accept a string', () => {
      assert.throws(() => db.sql('a', 'b'), {message: BAD_PARAMETER_MESSAGE});
    });

    it('Should not accept an object', () => {
      assert.throws(() => db.sql('a', {a: 'b'}), {message: BAD_PARAMETER_MESSAGE});
    });

    it('Should not accept a function', () => {
      assert.throws(() => db.sql('a', () => {}), {message: BAD_PARAMETER_MESSAGE});
    });

    it('Should not accept an array with anything but strings', () => {
      assert.throws(() => db.sql('a', ['a', 'b', {}]), {message: BAD_PARAMETER_MESSAGE});
    });

    it('Should accept a list of strings', () => {
      assert.doesNotThrow(() => db.sql('a', ['a', 'b', 'c']));
    });

    it('Should accept an empty list', () => {
      assert.doesNotThrow(() => db.sql('a', []));
    });
  });

  describe('Returns', () => {
    beforeEach(() => {
      db = PromisedSQL(FAILING_DB_LIKE_OBJECT);
    });
    it('Should return a promise', () => {
      const res = db.sql('a');
      assert.equal(typeof res.then, 'function');
      res.catch(() => {});
    });
    it('Should reject the promise', () => {
      db.sql('a')
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  })
});
