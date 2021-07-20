const { arrayUsuario, Usuario } = require("./usuario");


class Pedido {
    constructor(detalle, persona) {
            this.id = "", 
            this.pedidoFecha=new Date();             //id del pedido
            this.detalle = detalle,   //array con los productos y sus precios unitario
            this.total = '',                      //generar el total de la suma de productos
            this.estado = "",      //estado del pedido
            this.pago = "",            //ingresado por el user y debo comparar conel array de pagos
            this.idUser = persona.id,           //id del usuario
            this.nameU = persona.name,              //nombre del usuario
            this.lastName = persona.lastName, 
            this.direcc="",               //direcc ingresado por el usuario
            this.cel = persona.cel  ,
            this.confirm=false;             //telefono del usuario
    }

}

Pedido.prototype.generarId = function generarId() { //se asigna id y estado de inicio del pedido "nuevo"
    this.id = new Date().getTime();
    this.estado = "nuevo";
}

const arrayPago = ["efectivo", "tarjeta", "QR"]; // debo convirtiendolo en objs PENDIENTE
const arrayEstado = ["nuevo", "confirmado", "preparando", "enviado", "cancelado", "entregado","cerrado"];

const arrayPedido = []; 


function crearPedido(detalle,usuarioObj) {
 
    const newPedido = new Pedido(detalle, usuarioObj);
    newPedido.generarId();   
    arrayPedido.push(newPedido);
    if (newPedido!== null || newPedido!== undefined || newPedido!==""){
        return true;
    }else {
        return false 
    }
}

function modificarCantidadEnPEdido(pedidoId,productoName,stock){

    for (const p of arrayPedido) {
        if (pedidoId=== p.id){
            const producto=p.detalle;
            for (const elemento of producto) {
                if (elemento.name===productoName){
                   elemento.cantidad+=stock;
                   return true;
                }
            }
        }
    }
    return false;
}


function validarPago(pagoUSer) {  
    for (let i = 0; i < pago.length; i++) {
        const p = arrayPago[i];
        if (p === pagoUSer) {
            
            return true
        }
    }
    return false
}

function medioDePago(idPedido, pagoUSer) {
    let msj = "";
    for (const pedido of arrayPedido) {
        if (idPedido === pedido.id) {
            const seleccionado = pedido;
            if (validarPago(pagoUSer)) {
                seleccionado.pago = pagoUSer;
            }return true            
        } else {           
            return false
        }
    }
    

}

function existPedido(req,res,next) {
    const idPedido= Number(req.body.pedidoId);
    
    for (const pedido of arrayPedido) {
        if (pedido.id===idPedido) {
            return next();
        }
    }
    next(new Error("no existe el pedido ingresado"));

}
function obtenerPedido(id){ //id del pedido
    
    for (const p of arrayPedido) {
        if (p.id===id){
            return p
        }
    }return false
}
function statusCerrado(req,res,next){
    for (const p of arrayPedido) {
        if (p.id===req.body.pedidoId && p.id==="cerrado"){
            return next(new Error("el pedido se encuentra cerrado, no se puede modificar"));
        }
    }return next(); 
}

function obtenerDetalle(id){
    const existe= obtenerPedido(id);
    if (existe=== false){
        return false
    }else {
        const detalle= existe.detalle;
        return detalle;
    }
}

function existeProductoEnPedido(req,res,next){
    const id= Number( req.body.pedidoId);
    const nameArt= req.body.name;
    
    for (const p of arrayPedido) {    
        if (p.id ===id){
            const detalle= p.detalle;
            for (const articulo of detalle) {                    
                if ( articulo.name===nameArt ){
                    console.log("entro al midle de existe produ en el pedido"+articulo.name + nameArt);
                    return  next();
                }
            }
            return next(new Error("no existe el producto en el pedido"));
        }
    } return next(new Error("no existe el pedido ingresado"));
    
    
}

function historial(idU){
    const historialCliente=[];
    for (const pedido of arrayPedido) {
        if (idU===pedido.idUser){
            historialCliente.push(pedido);
        }        
    }
    if (historialCliente=== null || historialCliente=== undefined || historialCliente=== []|| historialCliente=== ""){
        return false
    } else {
        return historialCliente;
    }
}
function historialFull(){
    let mostrar=[];
    for (const user of arrayUsuario) {
        const pedido=historial(user.id);
        mostrar+=pedido;
    }
    if (mostrar ===null || mostrar === undefined || mostrar===[] || mostrar===""){
        return false
    } else {
        return mostrar;
    }
}
function borrarMP(medioSeleccionado){

    for (const medio of arrayPago) {
        if (medio=== medioSeleccionado){
            const position=arrayPago.indexOf(medio);
            arrayPago.splice(position, 1);
            
           return true
        }
    }return false
}

function updateMP(nuevoMedio){

    for (const medio of arrayPago) {
        if (medio=== nuevoMedio){
            return true;
        }
    }return false;
}
function borrarPedido(idpedido){
    const eliminar=obtenerPedido(idpedido);
    if (eliminar === false ){
        return false
    }else{
        const position=arrayPedido.indexOf(eliminar);
        arrayPedido.splice(position, 1);
        return true
    }
            
  
}


module.exports = {
    
    arrayPedido,
    arrayEstado,
    arrayPago,
    existPedido,
    medioDePago,
    crearPedido,
    modificarCantidadEnPEdido,
    obtenerDetalle,
    existeProductoEnPedido,
    historial,
    historialFull,
    obtenerPedido,
    statusCerrado,
    borrarMP,
    updateMP,
    borrarPedido
  
    
    
}


///-----------------prueba por consola----------------------///

const datos= [{
    
    "name":"milanga",
    "description":"cocion: frita con papas fritas",
    "precioU":"300",
    "cantidad":2,
    
    
},
{
    
    "name":"jfhg",
    "description":"cocion: frita con papas fritas",
    "precioU":"300",
    "cantidad":1,
    
    
},
{
    
    "name":"CANELONES DE POLLO ESTILO ROSSINI",
    "descripcion":"bla bla bla  ",
    "precio":300,
    "cantidad":4,
    
},
{
    "total":2100,
    "pago":"tarjeta",
    "direcc":"direccions ingresada por el user"
}];

const datos2=[{
    
    "name":"milanga",
    "descripcion":"bla bla bla  ",
    "precio":300,
    "cantidad":4,
    
},
{
    "total":2100,
    "pago":"tarjeta"
}];


const senior= { //token= 'bWFyY2Vsb1I6NDU2'
    "id" : '123',
    "user":'marceloR',
    "psw" :' 456',
    "psw2":' 456',
    "name":'Marc elo',
    "lastName":'Romero',
    "email":'email@email.com',
    "adress ": 'adress 1456 dto 4',
    "cel":'15487596',
    "admin":'false'
};


const b=crearPedido(datos, arrayUsuario[1]);
b.estado="cerrado";

const c= crearPedido(datos2,senior)
arrayPedido[1].estado="en proceso";
arrayPedido[1].id=789;

console.log(arrayPedido);
console.log(arrayPedido[1].detalle);


const m=modificarCantidadEnPEdido(789,"milanga",-1);
console.log(m );

//-------------------fin prueba por consola----------------------//
