import assert from 'assert';
import PromisedSQL from "../../lib";

describe('WebSQL implementation', () => {
  let db, pdb;

  beforeEach('Init the DB', () => {
    db = createDatabase('test');
    pdb = PromisedSQL(db);
  });

  it('Can create tables', async (done) => {
    try {
      const [statement, result] =
        await pdb.sql('CREATE TABLE IF NOT EXISTS TEST (ID INTEGER PRIMARY KEY NOT NULL, NAME TEXT NOT NULL)');
      console.log(result);
    } catch (error) {
      done(error);
    }


  })
});
