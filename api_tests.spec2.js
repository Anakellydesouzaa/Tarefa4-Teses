describe('API Testing', () => {
  const baseUrl = 'http://localhost:3000/api';

  context('Cadastro', () => {
    it('Cadastro com Dados Válidos', () => {
      cy.request('POST', `${baseUrl}/register`, {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq('Cadastro concluído com sucesso');
      });
    });

    it('Cadastro com E-mail Inválido', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/register`,
        failOnStatusCode: false,
        body: {
          name: 'John Doe',
          email: 'john.doe',
          password: 'password123'
        }
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('E-mail inválido');
      });
    });

    it('Cadastro com Senha Curta', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/register`,
        failOnStatusCode: false,
        body: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'pass'
        }
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('A senha deve ter no mínimo 6 caracteres');
      });
    });

    it('Cadastro com Campos Vazios', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/register`,
        failOnStatusCode: false,
        body: {
          name: '',
          email: '',
          password: ''
        }
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Todos os campos são obrigatórios');
      });
    });

    it('Cadastro com E-mail Já Cadastrado', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/register`,
        failOnStatusCode: false,
        body: {
          name: 'Jane Doe',
          email: 'john.doe@example.com',
          password: 'password123'
        }
      }).then((response) => {
        expect(response.status).to.eq(409); // Conflito
        expect(response.body.message).to.eq('E-mail já cadastrado');
      });
    });
  });

  context('Recomendações', () => {
    it('Recomendação com Base em Preferências', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/recommendations`,
        qs: {
          preferences: 'action,comedy'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.recommendations).to.be.an('array');
        expect(response.body.recommendations.length).to.be.above(0);
      });
    });

    it('Recomendação Sem Preferências', () => {
      cy.request('GET', `${baseUrl}/recommendations`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.recommendations).to.be.an('array');
        expect(response.body.recommendations.length).to.be.above(0);
      });
    });

    it('Recomendação para Usuário Inexistente', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/recommendations`,
        qs: {
          userId: 'nonexistent'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body.message).to.eq('Usuário não encontrado');
      });
    });

    it('Recomendação com Preferências Inválidas', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/recommendations`,
        qs: {
          preferences: 'invalid'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Preferências inválidas');
      });
    });
  });
});
