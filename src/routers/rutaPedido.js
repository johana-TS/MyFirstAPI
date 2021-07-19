const express=require('express');
const router= express.Router();
const { existPedido,  crearPedido, historial, existeProductoEnPedido, arrayPedido, historialFull, arrayEstado, obtenerPedido, statusCerrado, modificarCantidadEnPEdido, arrayPago, borrarMP, updateMP } = require('../datos/pedidos');
const { hayStock, cambiarStock } = require('../datos/producto');
const {  searchUser, datosUsuario, authenticationEsCliente, authenticationAdmin, arrayUsuario } = require('../datos/usuario');
const { loadSwaggerInfo } = require('../middlewares/documentacion');



function getRouterPedidos(){
    const router=express.Router();
    router.post('/crear', authenticationEsCliente, crearNuevoPedido);
    router.post('/historial',authenticationEsCliente, verHistorialDePedidos);
    //router.put('/modificarPedido', authenticationEsCliente,existPedido,agregarProducto);
    //router.delete('/borrarProductoEnPedido', authenticationEsCliente,existPedido,EliminarProducto);

    router.put('/Admin/cambioEstado',authenticationAdmin, cambioDeEstadoDePedido);
    router.put('/Admin/cambioStock',authenticationAdmin, existPedido, existeProductoEnPedido,statusCerrado, cambioDeCantidadDePedido );
    router.post('/Admin/historial', authenticationAdmin,historialAdmin);
    //router.put('/Admin/cambioPrecio', authenticationAdmin,existPedido,cambioDePrecioFinal);
    //router.delete('/Admin/bajaPedido', authenticationAdmin,existPedido,bajaPedido);
    router.delete('/Admin/MedioPago', authenticationAdmin,deleteMedioDePago);
    router.put('/Admin/MedioPago', authenticationAdmin,upDateMedioDePAgo);

    return router;
}


function crearNuevoPedido(req, res){
    const datos= req.body; //toma el array de productos del body

    const info= Buffer.from(req.headers.token,'base64'); // me devuelve una cadena en base64..q debo convertir luego
    const [username, psw] = info.toString('utf8').split(':');

    const personaId= searchUser(username,psw);
    const personaObj= datosUsuario(personaId); 
    
    //console.log('ingreso a crear pedido');
    const newPedido = crearPedido(datos, personaObj);
    //console.log(newPedido);

    //preguntar si el campo direcc es distitnto al guardado en el obj user entonces asignarlo al pedido
    //newPedido.direcc=datos.direpostcc;
    //newPedido.pago=datos.pago;
    if (newPedido=== true){         
        return res.status(200).send("se ha registrado exitosamente el pedido realizado" + newPedido);
    }else {
        return res.status(404).send("No se pudo generar el pedido solicitado");
    }

}


function cambioDeEstadoDePedido(req,res){  //                   cambia el estado del pedido 
    const pedido= Number(req.body.pedidoId);
    const cambio=req.body.estado;    
    const existe=  obtenerPedido(pedido);

  
    if (existe.estado !== "cerrado" ){
        for (let i = 1; i < arrayEstado.length; i++) {  //chekea en el array de estado que exista el dato ingrresado             
            if (arrayEstado[i]=== cambio){
                existe.estado=cambio;
                res.status(200).send("ok");
            }else {
                res.status(404).send("no se reconoce el status ingresado");
            }                
        }           
    } else{
        res.status(406).send("el pedido ingresado se encuentra cerrado");    
    }
}

function cambioDeCantidadDePedido(req,res){
    const pedido= Number(req.body.pedidoId);   
    const producto=req.body.name;
    const cantidad= Number(req.body.cantidad);    
    const ok= hayStock(producto,cantidad);
    
    if ( ok=== true){                 
        const resultadoCambio= cambiarStock(producto,cantidad); //actualizo la cantidad en el array de productos  
        const resultado= modificarCantidadEnPEdido(pedido,producto,cantidad); //cambio la cantidad en el array de pedido
               
        if (resultado===false || resultadoCambio=== false){
            res.status(404).send("no se pudo realizar el cambio");    
        }else{
            res.status(200).send("ok");
        }        
    }else {
        res.status(401).send("no hay stock del producto seleccionado");
    }

}
function verHistorialDePedidos(req,res){
    
    const info= Buffer.from(req.headers.token,'base64'); // me devuelve una cadena en base64.. debo convertir luego
    const [username, psw] = info.toString('utf8').split(':');

    const personaId= searchUser(username,psw);
    const historialPedidos= historial(personaId);
  //  console.log(historialPedidos);
    if (historialPedidos===false){
        res.status(404).send("no se pudo generar el historial, no se registran pedidos ");
    }else {
        res.status(200).json(historialPedidos);
    }
}

function historialAdmin(req,res){
   const mostrar= historialFull();
    if (mostrar=== false){
        res.status(404).send("Error, no se puedo generar la lista de pedidos solicitada");
    }else {
        res.status(200).json(mostrar);
    }
}
function deleteMedioDePago(req,res){
    const exito=borrarMP(req.body.medioPago);   
   
    if (exito===true){        
        res.status(200).send("se borro exitosamente");
    }else {
        res.status(406).send("el medio de pago que intenta borra no se encuentra registrado");
    }
}
function upDateMedioDePAgo(req,res){
    const exito=updateMP(req.body.medioPago);
  
    if (exito===true){
        res.status(406).send("el medio de pago que intenta ingresar ya se encuentra registrado");
    }else {
        arrayPago.push(req.body.medioPago);
        res.status(200).send("UPDate exitoso!");
    }
}




//--------------prueba por consola-----------------///
//console.log(hayStock("milanga",3546));   FUNCIONA!







module.exports ={
    cambioDeEstadoDePedido,
    cambioDeCantidadDePedido,
    crearNuevoPedido,
    verHistorialDePedidos,
    getRouterPedidos
}