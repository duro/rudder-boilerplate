import Lab from "lab";
import Code from 'code';
import AppConfig from '../../server/config';
import jwt from 'jsonwebtoken';
import composeServerAndDB from '../_helpers/composeServerAndDB';

const expect = Code.expect;
const lab = exports.lab = Lab.script();

const user = {
  firstName: 'Tester',
  lastName: 'McGee',
  email: 'testy@mcgee.com',
  password: 'ilovetotestthings'
}

lab.experiment("Auth", () => {

  let server;

  lab.before(done => {
    // Compose and sync DB
    composeServerAndDB()
      .then(composedServer => {
        server = composedServer;
        return server;
      })
      .asCallback(done);
  });

  lab.test('should be able to create a authenticatable user', done => {
    const request = {
      method: "POST",
      url: "/user",
      payload: user
    }

    server.inject(request, response => {
      const payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(200);
      expect(payload.password).to.not.exist();
      expect(payload.firstName).to.exist();
      expect(payload.lastName).to.exist();
      expect(payload.email).to.exist();

      done();
    })
  });

  lab.test('should be able to login as that user', done => {
    const request = {
      method: "POST",
      url: "/auth",
      payload: {
        email: user.email,
        password: user.password
      }
    }

    server.inject(request, response => {
      const payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(200);
      expect(payload.id).to.exist();
      expect(payload.password).to.not.exist();
      expect(payload.firstName).to.exist();
      expect(payload.lastName).to.exist();
      expect(payload.email).to.exist();
      expect(payload.token).to.exist();

      const decodedToken = jwt.verify(payload.token, AppConfig.get('/security/jwtSecret'));

      expect(decodedToken.id).to.equal(payload.id);

      done();
    })
  });

  lab.test('should fail if no user can be found', done => {
    const request = {
      method: "POST",
      url: "/auth",
      payload: {
        email: "nonexistant@user.com",
        password: "doesntmatter"
      }
    }

    server.inject(request, response => {
      const payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(401);
      expect(payload.message).to.equal('invalid login credentials');

      done();
    })
  });

  lab.test('should fail if wrong password used', done => {
    const request = {
      method: "POST",
      url: "/auth",
      payload: {
        email: user.email,
        password: "doesntmatter"
      }
    }

    server.inject(request, response => {
      const payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(401);
      expect(payload.message).to.equal('invalid login credentials');

      done();
    })
  });

});
