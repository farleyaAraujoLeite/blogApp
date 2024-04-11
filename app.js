//carregando módulos
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("./models/Postagem");
const Postagem = mongoose.model("postagens");
require("./models/Categoria");
const Categoria = mongoose.model("categorias");
const passport = require("passport");
require("./config/auth")(passport)
//importando rotas
const admin = require("./routes/admin");
const usuarios = require("./routes/usuario");
//const mongoose = require("mongoose");
//Configurações
  //Sessão
    app.use(session({
      secret: "cursodenode",
      resave: true,
      saveUninitialized: true,
    }));
  //passport
    app.use(passport.initialize());
    app.use(passport.session());
  //flash
    app.use(flash());
  //middleware
    app.use((req, res, next) => {
      res.locals.success_msg = req.flash("success_msg");
      res.locals.error_msg = req.flash("error_msg");
      res.locals.error = req.flash("error");
      next();
    })
  //Body-parser
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  // Handlebars
  app.engine("handlebars", handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  }))
  app.set("view engine", "handlebars");
  // Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/blogapp").then(() => {
      console.log("Conectado ao mongo.");
    }).catch((err) => {
      console.log("Erro ao se conectar" + err);
    })
    // em breve
  //
  //public
    app.use(express.static(path.join(__dirname, "public")));
//Rotas
// Rota responsável por listar todas as postagens na página home
  app.get("/", (req, res) => {
    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) => {
      res.render("index", {postagens: postagens});
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro interno");
      res.redirect("/404");
    }) 
  });
// Rota responsável por listar as postagens 
  app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({slug: req.params.slug}).then((postagem) => {
      if(postagem){
        res.render("postagem/index", {postagem: postagem} )
      }else{
        req.flash("error_msg", "Postagem não existe!");
        res.redirect("/");
      }
    }).catch((err) => {
      req.flash("Error_msg", "Houve um erro interno!");
      res.redirect("/");
    })
  })
// Rota responsável por listar as categorias
  app.get("/categorias", (req, res) => {
    Categoria.find().then((categorias) => {
      res.render("categorias/index", {categorias: categorias});
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao postar as categorias!");
      res.render("/");
    })
  })
// Rota responsável por listar os posts 
  app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).then((categoria) => {
      if(categoria){
        Postagem.find({categoria: categoria._id}).then((postagens) => {
          res.render("categorias/postagens", {postagens: postagens, categoria: categoria});
        }).catch((err) => {
          req.flash("error_msg", "Houve um erro ao listar os posts!");
          res.redirect("/");
        })
      }else{
        req.flash("error_msg", "Essa categoria não existe!");
        res.redirect("/");
      }
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar a categoria!")
      res.redirect("/");
    })
  })

  app.get("/404", (req, res) => {
    res.send("Erro 404!");
  })

  app.get("/posts", (req, res) => {
    res.render("Rota de postagens");
  });
  app.use("/admin", admin);
  app.use("/usuarios", usuarios);


//Outros
const PORT = 8081;
app.listen(PORT, () => {
  console.log("servidor rodando.")
})