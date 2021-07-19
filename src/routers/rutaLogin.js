const express = require('express');
const router = express.Router();
const { validarUsuario, obtenetPosicion, arrayUsuario, registrarUsuario, esAdmin, validateCamposRegistro, validateEmail, existUser, validarPsw } = require('../datos/usuario.js');


function getRouter() {
    const router = express.Router();
    router.post('/registro', validateCamposRegistro, validateEmail, existUser, validarPsw, registroUser);
    router.post('/login', (req, res) => {  // OK
        if (!req.headers.token) {
            res.status(401).json('No token info');
        }
        else {
            const info = Buffer.from(req.headers.token, 'base64');
            const [username, psw] = info.toString('utf8').split(':');
            if (validarUsuario(username, psw)) {
                res.json('bienvenido '+username);
            } else {
                res.status(404).json('el usuario no esta registrado');
            }
        }        
    });

    return router;
};

function registroUser(req, res) {
    const { username, psw, psw2, name, lastName, email, adress, cel } = req.body;
   const resultado= registrarUsuario(username, psw, psw2, name, lastName, email, adress, cel);
    if (resultado=== false) {
        res.send(new Error("no se pudo registrar el usuario"));
    } else {
        res.status(200).json(`exito `);
    }
}


module.exports = {
    getRouter,
    registroUser

};