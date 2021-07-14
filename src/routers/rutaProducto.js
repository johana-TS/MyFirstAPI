const express=require('express');
const {  existeP, pushProducto, buscarProductoXNombre, buscarProductoXID, middleExisteArray, verProductos, validateCamposProductos } = require('../datos/producto');
const {  existUser, authenticationAdmin } = require('../datos/usuario');

const router = express.Router();


function getRoutersProductos(){
    const router = express.Router();
    router.get('/mostrar',middleExisteArray,verProductos);
    router.post('/alta',validateCamposProductos,authenticationAdmin,existeP, altaDeProductos);
    router.put('/modificar/nombre',authenticationAdmin,modificarProducto);
    router.put('/modificar',authenticationAdmin,modificarProductoAll);
    router.delete('/baja',authenticationAdmin, deletProducto);

    return router;
}

function altaDeProductos(req,res){
    const {name,description,stock,precio}= req.body;  
    pushProducto(name,description,stock,precio);  
    if(!pushProducto(name,description,stock,precio)){
        res.status(406).send('no se pudo ingresar el producto');
    }     
    res.status(200).send('el producto ha sigo agregado a la lista exitosamente');
}

function modificarProducto(req,res){
   const dato= req.body.name;
   //const reemplazo= req.body.newName;
   const producto= buscarProductoXNombre(dato);
   if (producto===undefined){
       res.status(404).send("no se pudo realizar el cambio, el nombre ingresado no existe en la bd");
    }else {
       producto.name= req.body.newName;
       console.log(producto);
       res.status(200).send('cambio exitoso');
   }

}
function modificarProductoAll(req,res){
    const {name, newName, description, precio, stock}= req.body;
    let msj="";
    const producto= buscarProductoXNombre(name);
    console.log(producto);
    if (producto!== undefined){        
         if(newName!==producto.name){
            producto.name=newName;
            msj+="se ha modificado el nombre del producto, ";
         };
        if (producto.description!== description){
            producto.description=description;
            msj+="se ha modificado la descripcion del producto, ";
         };
         if (producto.precio!== precio){
            producto.precio=precio;
            msj+="se ha modificado el precio del producto, ";
         };
         if(producto.stock!== precio){
            producto.stock=stock;
            msj+="se ha modificado el stock del producto, ";
        };
        console.log(producto);
        res.status(200).send(msj+' exitosamente! ');
        }
    else {            
        res.status(404).send("no se pudo realizar el cambio, el nombre ingresado no existe en la bd");
    } 
}
function deletProducto(req,res){
    const id=req.body.id;    
    if (buscarProductoXID(id)){
        res.status(200).send('se ha eliminado el producto de la lista');
    }else {
        res.status(404).send('no se ha encontrado el producto ingresado');
    }
}



module.exports ={
   // visualizarProductos,
    altaDeProductos,
    modificarProducto,
    modificarProductoAll,
    deletProducto,
    getRoutersProductos
}