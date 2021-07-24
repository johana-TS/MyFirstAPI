#     -- API Resto Delilah --

Descripcion: API para gestionar todos los pedidos del
restaurante. Los consumidores de la API puedan realizar operaciones CRUD de las
siguientes entidades:
* Usuarios
* Productos
* Pedidos

Tecnologias implementadas:
* NodeJs
* Express
* Swagger 

Para iniciar el sistema  utilizar 
```bash
    npm run start
```

##  -- Instalacion --   

* Clonar repositorio de GitHub
* Instalar depencencias:

   * Express
    ```bsh
        npm i express
    ```
    * swagger-ui / swagger-doc
    ```bsh
        npm i swagger-ui-express    
    ```
    * js-yaml
    ```bsh
        npm i js-yaml    
    ```

## Detalle para realizar las pruebas: 
para realizar las pruebas de autenticacion se utilizo la funcion btoa() and atob() :

-token= 'bWFyaTozMjE=' del cliente/psw: mari:321 

-token= 'am9oYToxMjM=' del admin/psw: joha:123

-token: 'bWFyY2Vsb1I6NDU2' del cliente/psw marceloR:456, idPedido: 789
