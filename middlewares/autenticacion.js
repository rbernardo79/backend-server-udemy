var jwt = require('jsonwebtoken');

var SEED = require('../config/config.js').SEED;


// ====================================
// Verificar token
// ====================================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {


        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
        //res.status(200).json({
        //    ok: true,
        //    decoded:   decoded
        //});

    });
}


// ====================================
// Verificar ADMIN_ROLE
// ====================================

exports.verificaADMIN_ROLE = function(req, res, next) {


    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {

        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es Administrador',
            errors: { message: 'No es administrador, no está permitida la operación' }
        });

    }

}

// ====================================
// Verificar ADMIN_ROLE o Mismo usuario 
// ====================================

exports.verificaADMIN_ROLE_o_MismoUsuario = function(req, res, next) {


    var usuario = req.usuario;
    var id = req.params.id;


    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {

        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es Administrador ni es mismo usuario',
            errors: { message: 'No es administrador, no está permitida la operación' }
        });

    }

}