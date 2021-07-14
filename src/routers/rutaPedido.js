const express=require('express');

const { existPedido, cambiarEstadoPedido, crearPedido } = require('../datos/pedidos');
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


function cambioDeEstadoDePedido(req,res){  //                  el cliente cambia el stock del pedido 
    const pedido= req.body.pedido;
    const cambio=req.body.cambio;    

    if (existPedido(pedido)){
        //if el estado no es CERRADO crear mid
        cambiarEstadoPedido(pedido,cambio);
        res.status(200).send("ok");
    }else {
        res.status(401).send("no se encuentra autorizado para realizar el cambio");
    }

}
function cambioDeCantidadDePedido(req,res){
    const usuario= req.header.usuario;
    const pedido= req.body.pedido;
    const producto=req.body.producto;
    const stock=req.body.stock;    

    if (existPedido(pedido)){
        if (hayStock(producto)){
            cambiarCantidad(producto,stock); //cambio la cantidad ne el array de productos si es admin
            modificarCantidadEnPEdido(producto,stock); //cambio la cantidad en el arra de pedido
            res.status(200).send("ok");
        }else {
            res.status(404).send("no hay stock del producto");
        }
    }else {
        res.status(401).send("no se encuentra autorizado para realizar el cambio");
    }

}














module.exports ={
    cambioDeEstadoDePedido,
    cambioDeCantidadDePedido,
    crearNuevoPedido
}