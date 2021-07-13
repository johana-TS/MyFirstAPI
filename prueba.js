const datos=require("./src/datos/datos.js");

function saludoUno(req,res){
    res.send("saludo Uno");
}

function saludoDos(req,res){
    let nombre= req.params.nombre; //lo toma de  la url
    console.log(req.body);
    res.send(`hola ${nombre}`);
}



function crearUsuario(req,res){
    const name= req.params.name;
    const apellido= req.params.lastName;
    const emal=req.params

}




module.exports={
    saludoUno,
    saludoDos,
    crearUsuario

}