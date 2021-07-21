const express=require('express');
const router= express.Router();
const { existPedido,  crearPedido, historial, existeProductoEnPedido, arrayPedido, historialFull, arrayEstado, obtenerPedido, statusCerrado, modificarCantidadEnPEdido, arrayPago, borrarMP, updateMP, borrarPedido, obtenerDetalle, pedidoconfirmado, validarPago, validarCamposAgregar } = require('../datos/pedidos');
const { hayStock, cambiarStock, existeP, validarProducto, buscarProductoXNombre } = require('../datos/producto');
const {  searchUser, datosUsuario, authenticationEsCliente, authenticationAdmin } = require('../datos/usuario');
const { loadSwaggerInfo } = require('../middlewares/documentacion');



function getRouterPedidos(){
    const router=express.Router();
    router.post('/crear', authenticationEsCliente, crearNuevoPedido);//no funicona
    router.post('/confirmar', authenticationEsCliente,existPedido, pedidoconfirmado, confirmarPedido);
    router.post('/historial',authenticationEsCliente, verHistorialDePedidos);
    router.put('/agregar', authenticationEsCliente,validarCamposAgregar, existPedido,pedidoconfirmado,validarProducto, agregarProducto);
    //router.put('/modificar', authenticationEsCliente,existPedido,pedidoconfirmado, );
    router.delete('/borrarProducto', authenticationEsCliente,existPedido,eliminarProductoEnP);

    router.put('/Admin/cambioEstado',authenticationAdmin, pedidoconfirmado, cambioDeEstadoDePedido);
    router.put('/Admin/cambioStock',authenticationAdmin, existPedido, existeProductoEnPedido,statusCerrado, cambioDeCantidadDePedido );
    router.post('/Admin/historial', authenticationAdmin,historialAdmin);
    //router.put('/Admin/descuento', authenticationAdmin,existPedido,cambioDePrecioFinal);//en caso de descuentos, PENDIENTE
    router.delete('/Admin/bajaPedido', authenticationAdmin,existPedido,bajaPedido);
    router.delete('/Admin/MedioPago', authenticationAdmin,deleteMedioDePago);
    router.put('/Admin/MedioPago', authenticationAdmin,upDateMedioDePAgo);
    router.get('/Admin/MedioPago', authenticationAdmin,verMP);

    return router;
}


function crearNuevoPedido(req, res){
    const datos= req.body; //toma el array de productos del body
    console.log(datos);
    const info= Buffer.from(req.headers.token,'base64'); // me devuelve una cadena en base64..q debo convertir luego
    const [username, psw] = info.toString('utf8').split(':');

    const personaId= searchUser(username,psw);
    const personaObj= datosUsuario(personaId);     
    
    const newPedido = crearPedido(datos, personaObj);
    //console.log(newPedido);
    if (newPedido=== true){         
        return res.status(200).send("se ha registrado exitosamente el pedido realizado" + newPedido);
    }else {
        return res.status(404).send("No se pudo generar el pedido solicitado");
    }

}
function confirmarPedido(req,res){
    const idPedido= req.body.pedidoId;
    const direc= req.body.direcc;
    const pago= req.body.modoPago;

    const pedido= obtenerPedido(idPedido);   
       
       if (validarPago(pago)){
           pedido.pago=pago;
           pedido.estado="cerrado";
           pedido.confirm=true;
           if (direc!==""){
               pedido.direcc= direc;               
           }
            console.log(pedido);
            res.status(200).send("Pedido CONFIRMADO exitosamente" + pedido);
           
        } else {
            res.status(404).send("el metodo de pago ingresado no es correcto");
        }
    

}

function agregarProducto(req,res){
     const pedidoId= req.body.pedidoId;
     const{name, cantidad}= req.body;
     const sumar= {name,cantidad}
     const detalle= obtenerDetalle(pedidoId);
     if (detalle===false){
       res.status(404).send("no se encontro el detalle del pedido");
     }else {
         const pprecio= buscarProductoXNombre(name);
         if (pprecio===undefined){
            res.status(404).json("no se encontro el producto ingresado");
         } else {
             sumar.description=pprecio.description;
             sumar.precio=pprecio.precio;
         }
         detalle.push(sumar);
         res.status(200).json(detalle);
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
                res.status(200).json("ok"+ pedido);
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
            res.status(200).json("ok"+ resultado);
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
        res.status(200).send("se borro exitosamente ");
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
function verMP(req,res){ // modificar para q cada method tengo un estado activo/inactivo
    const listado=[];
    for (const metodo of arrayPago) {
        listado.push(metodo);
    }
    if(listado!==""|| listado!==undefined|| listado!==null){
        res.status(200).json(listado);
    } else {
        res.status(404).json("no hay metodos de pago guardados en el listado");
    }
}
function bajaPedido(req,res){
    const resultado= borrarPedido(req.body.pedidoId);
    if (resultado!==false){
        res.status(200).json("se ha borrado exitosamente");
    }  
}
function eliminarProductoEnP(req,res){
    const pId= req.body.pedidoId;
    const productoName= req.body.productoName;
    const userDetalle =obtenerDetalle(pId);

    if (userDetalle === false){
        res.status(404).json("no se pudo realizar el cambio");
    }else {

        for (const elemento of userDetalle) {
            if (elemento.name===productoName){
                const position=userDetalle.indexOf(elemento);
                userDetalle.splice(position, 1);
                res.status(200).json("producto eliminado del pedido");
            }
        }
        res.status(404).json("no se encontro el producto");
    }

}










module.exports ={
    cambioDeEstadoDePedido,
    cambioDeCantidadDePedido,
    crearNuevoPedido,
    verHistorialDePedidos,
    getRouterPedidos
}