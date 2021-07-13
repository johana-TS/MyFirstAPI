const express = require('express');
const router = express.Router();
const { validarUsuario, obtenetPosicion, arrayUsuario, registrarUsuario, esAdmin, validateCamposRegistro, validateEmail, existUser, validarPsw } = require('../datos/usuario.js');


function getRouter() {
    const router = express.Router();
    router.post('/registro', validateCamposRegistro, validateEmail, existUser, validarPsw, registroUser);
    router.post('/login', (req, res) => {  // OK
        if (!req.headers.token) {
            res.status(401).send('No token info');
        }
        else {
            const info = Buffer.from(req.headers.token, 'base64');
            const [username, psw] = info.toString('utf8').split(':');
            if (validarUsuario(username, psw)) {
                res.send('bienvenido '+username);
            } else {
                res.status(404).send('el usuario no esta registrado');
            }
        }        
    });

    return router;
};

function registroUser(req, res) {
    const { username, psw, psw2, name, lastName, email, adress, cel } = req.body;
    registrarUsuario(username, psw, psw2, name, lastName, email, adress, cel);
    if (!registrarUsuario(username, psw, psw2, name, lastName, email, adress, cel)) {
        res.send(new Error("no se pudo registrar el usuario"));
    } else {
        res.status(200).send(`exito `);
    }
}


// function authentication(req,res){   // prueba get para path /auth se debe convertir en middleware >>>>>>>
//     if (!req.headers.token){
//         res.status(401).send('No token info');
//     }else  {
//         const info= Buffer.from(req.headers.token,'base64');
//         const [username, psw] = info.toString('utf8').split(':');
//         console.log(`info: ${info}  -- user: ${username}  --psw: ${psw}`);
//         if (validarUsuario(username,psw)){
//             res.send(`ok ${username} ${ psw}`);
//         }else {
//             res.status().send('el usuario no esta registrado');
//         }
//     }
// } >>>>>>>>



module.exports = {
    getRouter,
    registroUser

};