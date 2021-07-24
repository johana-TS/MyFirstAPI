const { Router } = require('express');
const express= require('express');
const { loadSwaggerInfo } = require('./middlewares/documentacion');
const {  getRouter } = require('./routers/rutaLogin');
const {  getRouterPedidos } = require('./routers/rutaPedido');
const {  getRoutersProductos } = require('./routers/rutaProducto');


const server=express();
server.use(express.json());//para capturar los datos desde el postman 
loadSwaggerInfo(server);

//-----------------usuario---------------
userRouters=getRouter();
server.use('/api/v1/usuario/',userRouters);

//----------------pedidos---------------
server.use('/api/v1/Pedido', getRouterPedidos());

//-------------- productos--------------

server.use('/api/v1/Productos',getRoutersProductos());

//------manejador de errores--------
function errorHandler(err,req,res,next){
    if (err !== undefined){
        if(err.message=== 'los password ingresados no son correctos' ){
            res.status(406).send("las password ingresados no son correctos");
        } else if (err.message==='ya existe  usuario registrado con ese email' ){
            res.status(406).send('ya existe  usuario registrado con ese email y/ nombre de usuario');
        } else if(err.message==='el correo no es correcto, no puede continuar'){
            res.status(406).send('el correo no es correcto, no puede continuar');
        } else if (err.message=== "no se pudo registrar el usuario"){
            res.status(406).send("no se pudo registrar el usuario");
        } else if (err.message=== 'no ha completado el campo "username"'){
            res.status(406).send('no ha completado el campo "username"');
        }  else if (err.message=== "no ha completado el campo 'psw'"){
            res.status(406).send("no ha completado el campo 'psw'");
        }  else if (err.message=== 'no ha completado el campo "psw2"'){
            res.status(406).send('no ha completado el campo "psw2"');
        }  else if (err.message=== 'no ha completado el campo "name"'){
            res.status(406).send('no ha completado el campo "name"');
        }  else if (err.message=== 'no ha completado el campo "lastName"'){
            res.status(406).send('no ha completado el campo "lastName"');
        }  else if (err.message=== 'no ha completado el campo "email"'){
            res.status(406).send('no ha completado el campo "email"');
        }  else if (err.message=== 'no ha completado el campo "adress"'){
            res.status(406).send('no ha completado el campo "adress"');
        }  else if (err.message=== 'no ha completado el campo "cel"'){
            res.status(406).send('no ha completado el campo "cel"');
        }  else if (err.message=== 'No token info'){
            res.status(404).send('No token info');
        }  else if (err.message=== 'el usuario no esta autorizado para realizar la operacion'){
            res.status(401).send('el usuario no esta autorizado para realizar la operacion');
        }
        //----productos----
        if (err.message==='no hay productos ingresados en la bd'){
            res.status(406).send('no hay productos ingresados en la bd');
        } else if(err.message==='ya existe el producto que intenta ingresar'){
            res.status(406).send('ya existe el producto que intenta ingresar');
        }  else if (err.message==='no ha completado el campo "name"'){
            res.status(404).send('no ha completado el campo "name"');
        }  else if (err.message==='no ha completado el campo "newName"'){
            res.status(404).send('no ha completado el campo "newName"');
        }  else if (err.message==='no ha completado el campo "description"'){
            res.status(404).send('no ha completado el campo "description"');
        }  else if (err.message==='no ha completado el campo "stock"'){
            res.status(404).send('no ha completado el campo "stock"');
        }  else if (err.message=== 'no ha completado el campo "precio"'){
            res.status(404).send('no ha completado el campo "precio"');
        }  else if (err.message==="Error, no hay listado disponible"){
            res.status(404).json("Error, no hay listado disponible");
        }  else if(err.message==='no existe el producto que intenta ingresar'){
            res.status(404).send('no existe el producto que intenta ingresar');
        }


        //---------pedidos--------
        if(err.message==="No se pudo generar el pedido solicitado"){
            res.status(404).send("No se pudo generar el pedido solicitado");
         } else if(err.message==="el pedido ingresado se encuentra cerrado"){
            res.status(406).send("el pedido ingresado se encuentra cerrado")
         } else if (err.message==="no se encuentra el pedido ingresado"){
             res.status(404).send("no se encuentra el pedido ingresado");
         } else if (err.message==="no existe el pedido ingresado"){
            res.status(404).send("no existe el pedido ingresado");
         } else if(err.message==="no hay stock para realizar el cambio"){
            res.status(404).send("no hay stock para realizar el cambio");
         } else if (err.message==="no existe el producto en el pedido"){
             res.status(404).json("no existe el producto en el pedido");
         } else if (err.message==="no se pudo realizar el cambio"){
            res.status(404).send("no se pudo realizar el cambio");
         } else if (err.message==="no hay stock del producto seleccionado"){
            res.status(404).send("no hay stock del producto seleccionado");
         } else if (err.message==="no existe el pedido NO NO ingresado"){
             res.status(404).send("no existe el pedido NO NO ingresado");
         } else if (err.message==="el pedido se encuentra cerrado, no se puede modificar"){
             res.status(406).send("el pedido se encuentra cerrado, no se puede modificar");
         } else if (err.message==='no existe el producto ingresado'){
             res.status(404).send('no existe el producto ingresado');
         } else if (err.message==="no existe pedido a su nombre, con ese identificados ingresado") {
            res.status(404).send("no existe pedido a su nombre, con ese identificados ingresado");
         }
    } 
}


server.use(errorHandler);
server.listen('9080',()=> {
     console.log('hola mundo, servior disponible!!!!!!!')
})