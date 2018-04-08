var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos válidos
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de archivo no válido',
            errors: { message: 'Tipo de archivo no válido' }
        });
    }

    if (!req.files) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Error en subida de ficheros',
            errors: { message: 'Debe seleccionar una imagen' }
        });

    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1]

    // Extensiones válidas
    var extesionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extesionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'La extensión permitida debe ser alguna de estas:' + extesionesValidas.join(', ') }
        });
    }


    // Nombre del archivo personalizado
    // nro random-nro random.png
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el fichero',
                errors: err
            });

        }

        subirPorTipo(tipo, id, nombreArchivo, res);


        //res.status(200).json({
        //   ok: true,
        //   mensaje: 'Fichero movido correctamente',
        //   extensionArchivo: extensionArchivo
        //});

    })



});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (err || !usuario) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error obteniendo usuario',
                    errors: err
                });
            }

            var pathExistente = './uploads/usuarios/' + usuario.img;

            // Si ya existe la imagen se elimina
            if (fs.existsSync(pathExistente)) {
                fs.unlink(pathExistente);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error guardando usuario',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizado',
                    usuario: usuarioActualizado
                });

            })

        });

    }


    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (err || !medico) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error obteniendo medico',
                    errors: err
                });
            }

            var pathExistente = './uploads/medicos/' + medico.img;

            // Si ya existe la imagen se elimina
            if (fs.existsSync(pathExistente)) {
                fs.unlink(pathExistente);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error guardando medico',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizado',
                    medico: medicoActualizado
                });

            })

        });

    }


    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (err || !hospital) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error obteniendo hospital',
                    errors: err
                });
            }

            var pathExistente = './uploads/hospitales/' + hospital.img;

            // Si ya existe la imagen se elimina
            if (fs.existsSync(pathExistente)) {
                fs.unlink(pathExistente);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error guardando hospital',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizado',
                    hospital: hospitalActualizado
                });

            })

        });


    }

}

module.exports = app;