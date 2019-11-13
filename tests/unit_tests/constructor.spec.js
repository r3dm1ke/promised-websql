import assert from 'assert';
import PromisedSQL from "../../lib";
import {DB_LIKE_OBJECT} from "./const";

describe('Constructor errors', () => {
  const CONSTRUCTOR_ERROR_MESSAGE = /Expected a valid DB object/;

  it('Should throw error when called empty', () => {
    assert.throws(PromisedSQL, {message: CONSTRUCTOR_ERROR_MESSAGE});
  });
  it('Should throw error when called with a number', () => {
    assert.throws(() => PromisedSQL(420), {message: CONSTRUCTOR_ERROR_MESSAGE});
  });
  it('Should throw error when called with a string', () => {
    assert.throws(() => PromisedSQL('string'), {message: CONSTRUCTOR_ERROR_MESSAGE});
  });
  it('Should throw error when called with an arbitrary object', () => {
    assert.throws(() => PromisedSQL({a: 'b'}), {message: CONSTRUCTOR_ERROR_MESSAGE});
  });
  it('Should throw error when called with null', () => {
    assert.throws(() => PromisedSQL(null), {message: CONSTRUCTOR_ERROR_MESSAGE});
  });
  it('Should not throw error when called with a DB-like object', () => {
    assert.doesNotThrow(() => PromisedSQL(DB_LIKE_OBJECT));
  });
});

describe('Constructor return value', () => {
  const db = PromisedSQL(DB_LIKE_OBJECT);
  it('is an object', () => {
    assert.equal(typeof db, 'object');
  });
  it('has an sql function', () => {
    assert.equal(typeof db.sql, 'function');
  });
  it('has an sqls function', () => {
    assert.equal(typeof db.sqls, 'function');
  });
  it('has nothing else', () => {
    assert.equal(Object.keys(db).length, 2);
  });
});
