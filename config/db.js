if(process.env.NODE_ENV == "production"){
  module.exports = {mongoURI: "mongodb+srv://farley2181:<Fcf3866@>@cluster0.ovpslwl.mongodb.net/"};
}else{
  module.exports = {mongoURI: "mongodb://localhost/blogapp"};
}