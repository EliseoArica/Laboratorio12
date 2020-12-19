let db = require('../models/dbconnection');
const fs = require('fs-extra');

let productos = {
    listar( req, res ){
        let sql = "SELECT * FROM productos";
        db.query(sql,function(err, result){
        if( err ){
            console.log(err);
            res.sendStatus(500);
        }else{
            res.json(result);
        }
        });
    },
    store( req, res ){
        val_descripcion = req.body.descripcion;
        val_precio = req.body.precio;
        val_imagen = req.file.path;
        val_imagen_id = req.file.filename;
        let sql = "INSERT INTO productos(descripcion,precio,imagen,imagen_id) VALUES(?,?,?,?)";
        db.query(sql,[val_descripcion,val_precio,val_imagen,val_imagen_id],function(err, newData){
        if(err){
            console.log(err);
            res.sendStatus(500);
        }else{
            console.log(req.file);
            res.json("OK");
        }
        });
    },
    show( req, res ){
        val_id = req.params.id;
        let sql = "SELECT * FROM productos WHERE id=?";
        
        db.query(sql,[val_id],function(err, rowData){
            if(err){
            console.log(err);
            res.sendStatus(500);
            }else{
            res.json(rowData[0]);
            }
        });
    },
    edit( req, res ){
        // Recibimos los datos del body, también la imagen btw
        val_id = req.body.id;
        val_descripcion = req.body.descripcion;
        val_precio = req.body.precio;

        // Hay una imagen en el form?
        if (req.file) {
            val_imagen = req.file.path;
            val_imagen_id = req.file.filename;
            // Guardar el path de la imagen del producto antes de actualizarlo
            db.query("SELECT * FROM productos WHERE id = ?", [val_id], function(err, result) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    const imgBeforeUpdt = result[0].imagen;
                    let sql = "UPDATE productos SET descripcion = ?, precio = ?, imagen = ?, imagen_id = ? WHERE id = ?";
                    // Actualizamos el producto
                    db.query(sql, [val_descripcion, val_precio, val_imagen, val_imagen_id, val_id], async function(err, results) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        await fs.unlink(imgBeforeUpdt); // Eliminar la antigua imagen
                        res.json("OK");
                    }
                    });
                }
            });

            
        } else { 
            // No hay imagen en el form. Guardamos solo campos de texto
            let sql = "UPDATE productos SET descripcion = ?, precio = ? WHERE id = ?";
            db.query(sql, [val_descripcion, val_precio, val_id], function(err, results) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.json("OK");
                }
            });
        }
    },
    delete( req, res ){
        val_id = req.params.id;
        db.query("SELECT * FROM productos WHERE id = ?", [val_id], function(err, results) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                const rowFound = results[0];
                let sql = "DELETE FROM productos WHERE id = ?";
                db.query(sql, [val_id], async function(err, response) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        // Imagen eliminada de la BD
                        await fs.unlink(rowFound.imagen); // Eliminar del servidor
                        res.json("OK");
                    }
                });
            }
        });
    }
}

module.exports = productos;
