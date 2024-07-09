describe('Testes de Cadastro e Recomendações', () => {
  const baseUrl = 'http://localhost:3000/api';

  context('Cadastro', () => {
    it('Deve cadastrar um novo usuário com dados válidos', () => {
      cy.request('POST', `${baseUrl}/register`, {
        nome: 'João Silva',
        email: 'joao.silva@example.com',
        senha: 'senha123'
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq('Usuário cadastrado com sucesso');
      });
    });

    it('Deve falhar no cadastro com e-mail inválido', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/register`,
        failOnStatusCode: false,
        body: {
          nome: 'João Silva',
          email: 'joao.silva',
          senha: 'senha123'
        }
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('E-mail inválido');
      });
    });

    it('Deve falhar no cadastro com senha curta', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/register`,
        failOnStatusCode: false,
        body: {
          nome: 'João Silva',
          email: 'joao.silva@example.com',
          senha: '123'
        }
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('A senha deve ter no mínimo 6 caracteres');
      });
    });

    it('Deve falhar no cadastro com campos vazios', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/register`,
        failOnStatusCode: false,
        body: {
          nome: '',
          email: '',
          senha: ''
        }
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Todos os campos são obrigatórios');
      });
    });

    it('Deve falhar no cadastro com e-mail já cadastrado', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/register`,
        failOnStatusCode: false,
        body: {
          nome: 'Maria Silva',
          email: 'joao.silva@example.com',
          senha: 'senha123'
        }
      }).then((response) => {
        expect(response.status).to.eq(409); // Conflito
        expect(response.body.message).to.eq('E-mail já cadastrado');
      });
    });
  });

  context('Recomendações', () => {
    it('Deve retornar recomendações com base em preferências válidas', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/recommendations`,
        qs: {
          preferencias: 'ação,comédia'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.recommendations).to.be.an('array');
        expect(response.body.recommendations.length).to.be.above(0);
      });
    });

    it('Deve retornar recomendações sem preferências', () => {
      cy.request('GET', `${baseUrl}/recommendations`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.recommendations).to.be.an('array');
        expect(response.body.recommendations.length).to.be.above(0);
      });
    });

    it('Deve falhar ao retornar recomendações para usuário inexistente', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/recommendations`,
        qs: {
          userId: 'inexistente'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body.message).to.eq('Usuário não encontrado');
      });
    });

    it('Deve falhar ao retornar recomendações com preferências inválidas', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/recommendations`,
        qs: {
          preferencias: 'inválido'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Preferências inválidas');
      });
    });
  });
});
