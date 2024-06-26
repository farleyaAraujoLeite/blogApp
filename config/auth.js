//const passport = require("passport");
const localStrategy = require("passport-local");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Model de usuario
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");

module.exports = function(passport){

  passport.use(new localStrategy ({usernameField: "email", passwordField: "senha"},(email, senha, done) => {
    Usuario.findOne({email: email}).then((usuario) => {
      if(!usuario) {
        return done(null, false, {message: "Essa conta não existe"} )
      }

      bcrypt.compare(senha, usuario.senha, (erro, baten) => {
        
        if(baten){
          return done(null, usuario);
        }else{
          return done(null, false, {message: "senha incorreta"})
        }

      })

    })

  }))

  // Salvando dados do usuario em uma sesão 
  passport.serializeUser((usuario, done) => {
    return done(null, usuario.id);
  });
  
  passport.deserializeUser((id, done) => {
    Usuario.findById(id)
      .then(usuario => {
        done(null, usuario);
      })
      .catch(err => {
        done(err, null);
      });
  });  
}