


class Usuario {
   constructor(user, psw, psw2, name, lastName, email, adress, cel) {
      this.id = '',
         this.user = user,
         this.psw = psw,
         this.psw2 = psw2,
         this.name = name,
         this.lastName = lastName,
         this.email = email,
         this.adress = adress,
         this.cel = cel,
         this.admin = false
   }

}

Usuario.prototype.generarId = function generarId() {
   const id = new Date().getTime();
   this.id = id;
   //buscar funcion para generar id con el datatime
}

//---------------inicio de prueba------------------
const arrayUsuario = [];
let nuevo = new Usuario('joha', '123', '123', 'johana', 'torres', 'to@toto.com', 'olmo 1010', '239545865');
nuevo.generarId();
arrayUsuario.push(nuevo);
let c = new Usuario('mari', '321', '321', 'Maria ', 'Lopez', 'tomate@toto.com', 'malvinas arg. 4562', '2395488746');
c.generarId();
arrayUsuario.push(c);
//console.log(arrayUsuario);

//-------------fin de prueba------------------------
function searchUser(usuario, psw) {
   for (let user of arrayUsuario) {
      if (user.user === usuario && user.psw === psw) {
         return user.id
      }
   }
}

function existUser(req, res, next) {   //para realizar el registro se fija q el email no exista en la bd
   const email = req.body.email;

   for (const usuario of arrayUsuario) {
      if (usuario.email === email) {
         next(new Error('ya existe  usuario registrado con ese email'));
      }
   }
   next();
}
function validarPsw(req, res, next) {   // validacion para registro que las pass sean iguales
   const psw = req.body.psw;
   const psw2 = req.body.psw2;
   if (psw === psw2) {
      // res.status(200).send('ok las pass son correctas');
      next();
   } else {
      next(new Error('los password ingresados no son correctos'));
   }
}
function validateEmail(req, res, next) {               //valida que el campo ingresado sea un email
   const correo = req.body.email;
   const re = /\S+@\S+\.\S+/;   //patron basico no del todo correcto para comprobar q sea una direc de correo electronico

   if (re.test(correo)) {
      // res.status(200).send('ok el dato ingresado en una direccion de email correcta');
      next();
   } else {
      next(new Error('el correo no es correcto, no puede continuar'));
   };
}
function validarUsuario(usuario, psw) { //para el login chekear  que el user exista en el array

   for (let user of arrayUsuario) {
      if (user.user === usuario && user.psw === psw) {
         return true
      }
   }
   return false
}
function authenticationAdmin(req, res, next) {   //convercion a middleware para confirmar q el user sea admin y permitir CRUD
   if (!req.headers.token) {
      next(new Error('No token info'));
   } else {
      const info = Buffer.from(req.headers.token, 'base64');
      const [username, psw] = info.toString('utf8').split(':');

      if (validarUsuario(username, psw)) {
         if (esAdmin(username));
         next();
      } else {
         next(new Error('el usuario no esta autorizado para realizar la operacion'));
      }
   }
}
function authenticationEsCliente(req, res, next) {   //convercion a middleware para confirmar q el user sea admin y permitir CRUDme
   if (!req.headers.token) {
      next(new Error('No token info'));
   } else {
      const info = Buffer.from(req.headers.token, 'base64');
      const [username, psw] = info.toString('utf8').split(':');
      

      if (validarUsuario(username, psw)) {
        next();        
      } else {
         next(new Error('el usuario no esta autorizado para realizar la operacion, es admin'));
      }
   }

}
function obtenetPosicion(usuario) {   // funcion de prueba no sirve para ela
   for (let i in arrayUsuario) {
      let userr = arrayUsuario[i];
      if (userr.user === usuario) {
         return i
      }
   }
}

function validateCamposRegistro(req, res, next) {       // chekear que los campos de registro esten completos
   const { username, psw, psw2, name, lastName, email, adress, cel } = req.body;
   if (username === undefined || username === null) {
      next(new Error('no ha completado el campo "username"'))
   } else if (psw === undefined || psw === null) {
      next(new Error('no ha completado el campo "psw"'))
   } else if (psw2 === undefined || psw2 === null) {
      next(new Error('no ha completado el campo "psw2"'))
   } else if (name === undefined || name === null) {
      next(new Error('no ha completado el campo "name"'))
   } else if (lastName === undefined || lastName === null) {
      next(new Error('no ha completado el campo "lastName"'))
   } else if (email === undefined || email === null) {
      next(new Error('no ha completado el campo "email"'))
   } else if (adress === undefined || adress === null) {
      next(new Error('no ha completado el campo "adress"'))
   } else if (cel === undefined || cel === null) {
      next(new Error('no ha completado el campo "cel"'))
   } else {
      next();
   }
}
function registrarUsuario(username, psw, psw2, name, lastName, email, adress, cel) {

   let newUser = new Usuario(username, psw, psw2, name, lastName, email, adress, cel);
   newUser.generarId()
   arrayUsuario.push(newUser);
   console.log('entro al registroUsuario---creo el obj y lo agrego al array');
   console.log(newUser);
   return true
}
function esAdmin(username) {
   for (const user of arrayUsuario) {
      if (user.user === username) {
         if (user.admin === true) {
            return true
         }
      }
   }
   return false
}
function datosUsuario(id) {
   for (const user of arrayUsuario) {
      if (user === id) {
         persona = user;
         return persona
      }
   }
}
//--------------inicio de prueba----------------

let yo = arrayUsuario[0];
yo.admin = true;
arrayUsuario.push(yo);
//console.log(registroUser(yo));

console.log(arrayUsuario)
//----------------fin de prueba---------------------






module.exports = {
   Usuario,
   arrayUsuario,
   obtenetPosicion,
   validarUsuario,
   registrarUsuario,
   validarPsw,
   validateEmail,
   existUser,
   esAdmin,
   validateCamposRegistro,
   authenticationAdmin,
   authenticationEsCliente,
   searchUser,
   datosUsuario


}