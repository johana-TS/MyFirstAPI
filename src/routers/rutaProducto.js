const express=require('express');
const {  existeP, pushProducto, buscarProductoXNombre, buscarProductoXID, middleExisteArray, verProductos, validateCamposProductos, validateCamposModificacion, arrayProducto } = require('../datos/producto');
const {  authenticationAdmin, authenticationEsCliente, } = require('../datos/usuario');

const router = express.Router();


function getRoutersProductos(){
    const router = express.Router();
    router.get('/mostrar',authenticationEsCliente, middleExisteArray,verProductos);
    router.post('/alta',validateCamposProductos,authenticationAdmin,existeP, altaDeProductos);
    router.put('/modificar_nombre',authenticationAdmin,modificarProducto);
    router.put('/modificar',authenticationAdmin,validateCamposModificacion, modificarProductoAll);
    router.delete('/baja',authenticationAdmin, deletProducto);

    return router;
}

function altaDeProductos(req,res){
    const {name,description,stock,precio}= req.body;  
    const resultado= pushProducto(name,description,stock,precio);  
    if(resultado===false){
        res.status(406).send('no se pudo ingresar el producto');
    }     
    res.status(200).send('el producto ha sigo agregado a la lista exitosamente');
}

function modificarProducto(req,res){ //por nombre//somo modifica el campo "name"
    if (req.body.name!== "" ||req.body.name!== null && req.body.newName!== "" ||req.body.newName!== ""){
        const dato= req.body.name;        
        const producto= buscarProductoXNombre(dato);
        console.log(producto);
        if (producto===false){
            res.status(404).json("no se pudo realizar el cambio, el nombre ingresado no existe en la bd");
        }else {
            producto.name= req.body.newName;
            console.log(producto);
            res.status(200).json('cambio exitoso');
        }
    } else {
        res.status(406).json("no se completaron los campos: name y/o newName");
    }
        
}
function modificarProductoAll(req,res){ //cambia cualquier campo del producto
   console.log('entro');
    const {name, newName, description, stock, precio}= req.body;
    let msj="";
    const producto= buscarProductoXNombre(name);
    console.log(producto);

    if (producto=== undefined || producto===null){        
        res.status(404).json("no se pudo realizar el cambio, el nombre ingresado no existe en la bd");
    }
    else {            
        
        if (producto.name !== name){
            producto.name=newName;
            msj+="se modifico en nombre el producto "+newName;
        }
        if(producto.description!==description){
            producto.description=description;
            msj+="se modifico la descripcion ";
        }
        if(producto.stock!==stock){
            producto.stock=stock;
            msj+="se modifico el stock del producto ";
        }
        if(producto.precio!== precio){
            producto.precio=precio;
            msj+="se modifico el precio unitario del producto ";
        }
        console.log(producto);
        res.status(200).json(`${msj} exitosamente` + producto);
    } 
}
function deletProducto(req,res){
    const id=req.body.id;     
    if (buscarProductoXID(id)){
        console.log(arrayProducto);
        res.status(200).json(`se ha eliminado el producto de la lista `+ arrayProducto);
    }else {
        res.status(404).send('no se ha encontrado el producto ingresado');
    }
}



module.exports ={
   
    altaDeProductos,
    modificarProducto,
    modificarProductoAll,
    deletProducto,
    getRoutersProductos
}