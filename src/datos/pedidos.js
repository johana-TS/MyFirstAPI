const { prototype } = require("events");
const { existeProducto, hayStock } = require("./producto");
const { arrayUsuario, searchUser, datosUsuario } = require("./usuario");

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
    const id = new Date().getTime();
    this.id = id;
    this.estado = "nuevo";
}

const arrayPago = ["efectivo", "tarjeta", "QR"]; // probar convirtiendolo en obj
const arrayEstado = ["nuevo", "confirmado", "preparando", "enviado", "cancelado", "entregado"];

const arrayPedido = []; 


function crearPedido(detalle,usuarioObj) {
 
    let newPedido = new Pedido(detalle, usuarioObj);
    newPedido.generarId();   
    arrayPedido.push(newPedido);

    return newPedido;
}

function modificarCantidadEnPEdido(pedidoId,productoName,stock){

    for (const p of arrayPedido) {
        if (pedidoId=== p.id){
            const producto=p.detalle;
            for (const elemento of producto) {
                if (elemento.name===productoName){
                    elemento.stock=stock;
                    return elemento
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
            }

        } else {
            msj += "no existe el pedido";
            return msj
        }
    }


}

function existPedido(id) {
    for (const pedido of arrayPedido) {
        if (pedido.id === id) {
            return pedido
        }
    }
    return false

}

module.exports = {
  
    arrayPedido,
    existPedido,
    medioDePago,
    crearPedido,
    modificarCantidadEnPEdido

}


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
    
    "name":"CANELONES DE POLLO ESTILO ROSSINI",
    "descripcion":"bla bla bla  ",
    "precio":300,
    "cantidad":4,
    
},
{
    "total":2100,
    "pago":"tarjeta"
}];

// arrayDetalle.push(datos2);
const senior= {
    "id" : ' id',
    "user":'user',
    "psw" :' psw',
    "psw2":' psw2',
    "name":'name',
    "lastName":'lastName',
    "email":'email',
    "adress ": 'adress',
    "cel":'cel',
    "admin":'false'
};


 const b=crearPedido(datos, senior);
 b.estado="cerrado";
 console.log(b);
 console.log(arrayPedido);


