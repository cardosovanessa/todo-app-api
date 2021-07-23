const User = require('../models/user-model');
const UserDao = require('../DAO/UserDao');

module.exports = (app, db) => {
  let userBanco = new UserDao(db)
  
  app.get('/users', (req, res) => {
    userBanco
    .getAllUsers()
    .then((rows) => {
      res.json({
        result: rows,
        count: rows.length,
    });
  })
    .catch((err) => {
      res.json({err});
    });
  });

  app.get('/users/:email', (req, res) => {
    let arrayResp = db.users.filter((element) => {
      return element.email === req.params.email;
    });
    res.json({
      result: arrayResp,
      count: arrayResp.length,
    });
  });

  app.post('/users', (req, res) => {
    const {
      nome,
      email,
      senha
    } = req.body;
    let newUser = new User(nome, email, senha);
    userBanco
      .insertUser(newUser)
      .then(() => {
        res.status(201).json({
          message: "Usuário inserido com sucesso",
          error: false,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Erro inserido com sucesso",
          error: true,
      });
    });
  });

    /*
    db.run(`INSERT INTO USUARIOS VALUES(?, ?, ?, ?)`, [null, newUser.nome, newUser.email, newUser.senha], err => {
      if(err){
        res.json({
          message: "Erro ao criar usuário.",
          error: true
        })
      }
      else{
        res.json({
          message: "Usuário criado com sucesso.",
          error: false
        })
      }
    })
  }); */

  app.delete('/users/:email', (req, res) => {
    let arrayCount = db.users.length;

    db.users = db.users.filter((element) => {
      return element.email !== req.params.email;
    });

    if (arrayCount === db.users.length) {
      res.json({
        message: `Não existe usuário com este e-mail: ${req.params.email}`,
        error: true,
      });
    } else {
      res.json({
        message: `Usuário com e-mail: ${req.params.email}, foi deletado com sucesso.`,
        error: false,
      });
    }
  });

  app.put('/users/:email', (req, res) => {
    const {
      nome,
      email,
      senha
    } = req.body;
    var varCount = 0;
    if (nome || email || senha) {
      db.users.forEach((element) => {
        if (element.email === req.params.email) {
          if (nome) {
            element["nome"] = nome;
          }
          if (email) {
            element["email"] = email;
          }
          if (senha) {
            element["senha"] = senha;
          }
          varCount++;
        }
      });
      if (!varCount) {
        res.json({
          message: `Não existe usuário com este e-mail: ${req.params.email}`,
          error: true,
        });
      } else {
        res.json({
          message: `Usuário com e-mail: ${req.params.email}, foi atualizado com sucesso.`,
          error: false,
          count: varCount,
        });
      }
    } else {
      res.json({
        message: "Não foi possível atualizar o usuário, verifique se o campo informado é valido.",
        error: true,
      });
    }
  });
};