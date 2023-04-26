const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const pool = require("../database/db");
const { promisify } = require("util");
const { ok } = require("assert");

//+++++++++++++++++++LOGIN++++++++++++++++++++++++
//procedimiento para registrar nuevos usuarios

exports.register = async (req, res) => {
  try {
    const user = req.body.usuario;
    const name = req.body.name;
    const pass = req.body.pass;
    let passHash = await bcryptjs.hash(pass, 4);

    const query = {
      text: "INSERT INTO usuarios (usuario, name, pass) VALUES ($1, $2, $3)",
      values: [user, name, passHash],
    };

    pool.query(query, (error, results) => {
      if (error) {
        console.log(error);
      }
      res.redirect("/login");
    });
  } catch (error) {
    console.log(error);
  }
};
// Login usuarios
exports.login = async (req, res) => {
  try {
    const user = req.body.usuario;
    const pass = req.body.pass;

    if (!user || !pass) {
     
      res.render("login", {
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese un usuario y contraseña",
        alertIcon: "info",
        showConfirmButton: true,
        timer: false,
        ruta: "login", // aquí hay que cambiar según la ruta que uno quiera
      });
    } else {
      pool.query(
        "SELECT * FROM usuarios WHERE usuario = $1",
        [user],
        async (error, results) => {
          if (error) throw error;

          if (
            results.rows.length == 0 ||
            !(await bcryptjs.compare(pass, results.rows[0].pass))
          ) {
            res.render("login", {
              alert: true,
              alertTitle: "Error",
              alertMessage: "Usuario y/o contraseña incorrectas",
              alertIcon: "error",
              showConfirmButton: true,
              timer: false,
              ruta: "login",
            });
          } else {
            // inicio de sesión OK
            const id = results.rows[0].id;

            const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
              expiresIn: process.env.JWT_TIEMPO_EXPIRA,
            });

            //muestra en consola el inicio de sesión satisfactorio
            console.log(`Token ${token} para el usuario ${user}`);

            // Define la duracion de las cookies antes de borrarlas y se guardan en.env
            const cookiesOptions = {
              expires: new Date(
                Date.now() +
                  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
            };
            res.cookie("jwt", token, cookiesOptions);
            res.render("login", {
              alert: true,
              alertTitle: "Conexión exitosa",
              alertMessage: "¡Registro exitoso BIENVENIDO A PANEL SONALERT!",
              alertIcon: "success",
              showConfirmButton: false,
              timer: 1500,
              ruta: "info", //en vacio redirige a la ruta ppal index.ejs
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

//proyecto original

// exports.login = async (req, res)=>{
  //     try {
    //         const user = req.body.usuario
    //         const pass = req.body.pass
    
//         if(!user || !pass ){
//             res.render('login',{
//                 //envia msj a traves de alert en login.ejs
//                 alert:true,
//                 alertTitle: "Advertencia",
//                 alertMessage: "Ingrese un usuario y password",
//                 alertIcon:'info',
//                 showConfirmButton: true,
//                 timer: false,
//                 ruta: 'login' //aca hay que cambiar segun la ruta que uno quiera
//             })
//         }else{
//             pool.query('SELECT * FROM usuarios WHERE usuario = $1', [user], async (error, results)=>{
//                 if( results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass)) ){
//                     res.render('login', {
//                         alert: true,
//                         alertTitle: "Error",
//                         alertMessage: "Usuario y/o Password incorrectas",
//                         alertIcon:'error',
//                         showConfirmButton: true,
//                         timer: false,
//                         ruta: 'login'
//                     })
//                 }else{
//                     //inicio de sesión OK
//                     const id = results[0].id
//                     const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
//                         expiresIn: process.env.JWT_TIEMPO_EXPIRA
//                     })
//                     //generamos el token SIN fecha de expiracion
//                    //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
//                    console.log("TOKEN: "+token+" para el USUARIO : "+user)

//                    const cookiesOptions = {
//                         expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
//                         httpOnly: true
//                    }
//                    res.cookie('jwt', token, cookiesOptions)
//                    res.render('login', {
//                         alert: true,
//                         alertTitle: "Conexión exitosa",
//                         alertMessage: "¡LOGIN CORRECTO!",
//                         alertIcon:'success',
//                         showConfirmButton: false,
//                         timer: 1000,
//                         ruta: ''
//                    })
//                 }
//             })
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }
//


// autenticacion 


exports.isAuthenticated = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRETO
      );
      pool.query(
        "SELECT * FROM usuarios WHERE id = $1",
        [decodificada.id],
        (error, results) => {
          if (!results) {
            return next();
          }
          req.user = results[0];// Permite pintar con ejs el usuario registrado en la ruta que uno desee
          return next();
        }
      );
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    //si no esta autenticado
    res.redirect("/login");
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  return res.redirect("/");
};
