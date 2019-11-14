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

    it('Can execute multiple statements', async () => {
      const results = await pdb.sqls(
        [
          ['INSERT INTO TEST (NAME) VALUES (?);', 'test 1'], // 1
          ['SELECT * FROM TEST'], // 2
          ['INSERT INTO TEST (NAME) VALUES (?);', 'test 2'], // 3
          ['SELECT * FROM TEST WHERE ID = ?;', '5'], // 4
          ['SELECT * FROM TEST'], // 5
          ['INSERT INTO TEST (NAME) VALUES (?);', 'test 3'], // 6
          ['DELETE FROM TEST WHERE ID = ?;', '1'], // 7
          ['SELECT * FROM TEST'] // 8
        ]
      );
      // Results
      expect(results).to.have.length(8);
      // 1st query
      const [first_transaction, first_results] = results[0];
      expect(first_results.rowsAffected).to.be.equal(1);
      // 2nd query
      const [second_transaction, second_results] = results[1];
      expect(second_results.rows).to.have.length(4);
      expect(second_results.rows[3].ID).to.be.equal(4);
      expect(second_results.rows[3].NAME).to.be.equal('test 1');
      // 3rd query
      const [third_transaction, third_results] = results[2];
      expect(third_results.rowsAffected).to.be.equal(1);
      // 4th query
      const [forth_transaction, forth_results] = results[3];
      expect(forth_results.rows).to.have.length(1);
      expect(forth_results.rows[0].ID).to.be.equal(5);
      expect(forth_results.rows[0].NAME).to.be.equal('test 2');
      // 5th query
      const [fifth_transaction, fifth_results] = results[4];
      expect(fifth_results.rows).to.have.length(5);
      // 6th query
      const [sixth_transaction, sixth_results] = results[5];
      expect(sixth_results.rowsAffected).to.be.equal(1);
      // 7th query
      const [seventh_transaction, seventh_results] = results[6];
      expect(seventh_results.rowsAffected).to.be.equal(1);
      // 8th query
      const [eigth_transaction, eigth_results] = results[7];
      expect(eigth_results.rows).to.have.length(5);
      expect(eigth_results.rows[4].NAME).to.be.equal('test 3');
    });

    it('Can throw errors from multiple statements', async () => {
      try {
        await pdb.sqls([
          ['SELECT * FROM TEST;'],
          ['SELECT * FROM INVALID WHERE ID = ?;', '3'],
          ['SELECT * FROM BAD WHERE ID = ?;', '3']
        ]);
      } catch ([transaction, error]) {
        expect(error.message).to.match(/no such table: INVALID/);
      }
    });
  });
});
