import PromisedSQL from "../../lib";
const expect = chai.expect;

describe('WebSQL implementation', () => {
  let db, pdb;

  beforeEach('Init the DB', (done) => {
    db = openDatabase('test', null, null, null);
    db.transaction(tx => {
      tx.executeSql('DROP TABLE IF EXISTS TEST;')
    }, () => {}, () => {
      pdb = PromisedSQL(db);
      done();
    });
  });

  describe('Table creation', () => {
    it('Can create tables', async () => {
      const result = await pdb.sql(
        'CREATE TABLE TEST (ID INTEGER PRIMARY KEY NOT NULL, NAME TEXT NOT NULL);'
      );
      expect(result).to.have.lengthOf(2);
    });
  });

  describe('Selection', () => {
    beforeEach('Populate the db', (done) => {
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE TEST (ID INTEGER PRIMARY KEY NOT NULL, NAME TEXT);')
        tx.executeSql('INSERT INTO TEST (NAME) VALUES (?);', ['ACME']);
        tx.executeSql('INSERT INTO TEST (NAME) VALUES (?);', ['APPL']);
        tx.executeSql('INSERT INTO TEST (NAME) VALUES (?);', ['Some name']);
      }, console.error, () => done());
    });

    it('Can select data', async () => {
      const [transaction, result] = await pdb.sql('SELECT * FROM TEST');
      expect(result).to.have.property('rows');
      expect(result.rows).to.have.length(3);
      expect(result.rows[0].ID).to.be.equal(1);
      expect(result.rows[0].NAME).to.be.equal('ACME');
      expect(result.rows[1].ID).to.be.equal(2);
      expect(result.rows[1].NAME).to.be.equal('APPL');
      expect(result.rows[2].ID).to.be.equal(3);
      expect(result.rows[2].NAME).to.be.equal('Some name');
    });

    it('Can select data with interpolation', async () => {
      const [transaction, result] = await pdb.sql(
        'SELECT * FROM TEST WHERE ID = ?;', ['2']
      );
      expect(result.rows).to.have.length(1);
      expect(result.rows[0].ID).to.be.equal(2);
      expect(result.rows[0].NAME).to.be.equal('APPL');
    });

    it('Can throw errors', async () => {
      try {
        await pdb.sql('SELECT * FROM NOT_EXISTS');
      } catch ([transaction, error]) {
        expect(error.message).to.match(/no such table: NOT_EXISTS/);
      }
    });

    it('Can insert data', async () => {
      const [transaction, result] = await pdb.sql(
        'INSERT INTO TEST (NAME) VALUES (?);',
        ['LOL']
      );
      expect(result.rowsAffected).to.be.equal(1);
    });

  });
});
