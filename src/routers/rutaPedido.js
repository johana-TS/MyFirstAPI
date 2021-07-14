const express=require('express');

const { existPedido,  crearPedido } = require('../datos/pedidos');
const { hayStock, cambiarStock } = require('../datos/producto');
const { esAdmin, searchUser, datosUsuario } = require('../datos/usuario');






function crearNuevoPedido(req, res){
    console.log('inicio');
    const datos= req.body; //toma el array de productos del body
    const info= Buffer.from(req.headers.token,'base64'); // me devuelve una cadena en base64.. debo convertir luego
    const [username, psw] = info.toString('utf8').split(':');

    const personaId= searchUser(username,psw);
    const personaObj= datosUsuario(personaId); 
    console.log('ingreso a crear pedido');
    const newPedido = crearPedido(datos, personaObj);
    console.log(newPedido);

    //preguntar si el campo direcc es distitnto al guardado en el obj user entonces asignarlo al pedido
    //newPedido.direcc=datos.direcc;
    //newPedido.pago=datos.pago;
    if (newPedido!== null || newPedido!==undefined || newPedido!== ""){ // preguntar si lo q devuelve es un obj o un msj string
        
        return res.status(200).send("se ha registrado exitosamente el pedido realizado" + dato);
    }else {
        return res.status(404).send("No se pudo generar el pedido solicitado");
    }

}


function cambioDeEstadoDePedido(req,res){  //                  el cliente cambia el estado del pedido 
    const pedido= req.body.pedidoId;
    const cambio=req.body.estado;    
    const existe=  existPedido(pedido);
    if ( existe !== false){                   //if el estado no es CERRADO 
       if (existe.estado !== "cerrado"){
           existe.estado=cambio;
           res.status(200).send("ok");
           
       } else{
        res.status(406).send("el pedido ingresado se encuentra cerrado");    
       }
    }else {
        res.status(404).send("no se encuentra el pedido ingresado");
    }

}
function cambioDeCantidadDePedido(req,res){
    const pedido= req.body.pedidoId;    // id del pedido
    const producto=req.body.name;
    const cantidad=req.body.cantidad;    

    const existe=existPedido(pedido);
    if (existe!== false){
        if (hayStock(producto,cantidad)){
            cambiarStock(producto,stock); //actualizo la cantidad ne el array de productos si es admin
            modificarCantidadEnPEdido(pedido,producto,stock); //cambio la cantidad en el arra de pedido
            res.status(200).send("ok");
        }else {
            res.status(404).send("no hay stock del producto");
        }
    }else {
        res.status(401).send("no existe el pedido ingresado");
    }

}














module.exports ={
    cambioDeEstadoDePedido,
    cambioDeCantidadDePedido,
    crearNuevoPedido
}