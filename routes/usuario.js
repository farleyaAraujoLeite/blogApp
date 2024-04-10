const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");

router.get("/registro", (req, res) => {
  res.render("usuarios/registro")
})
// Validação de usuario
router.post("/registro", (req, res) => {
  var erros = [];

  if(!req.body.nome ||typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({Texto: "Nome inválido!"})
  }

  if(!req.body.email ||typeof req.body.email == undefined || req.body.email == null) {
    erros.push({Texto: "Email inválido!"})
  }

  if(!req.body.senha ||typeof req.body.senha == undefined || req.body.senha == null) {
    erros.push({Texto: "Sena inválida!"})
  }

  if(req.body.senha.length < 4) {
    erros.push({Texto: "Senha muito curta!"})
  }

  if(req.body.senha != req.body.senha2) {
    erros.push({Texto: "As senhas são diferentes, tente novamente!"})
  }

  if(erros.length > 0){
    res.render("usuarios/registro", {Erros: erros})
  }else{
    //próxima aula
  }
})


module.exports = router;