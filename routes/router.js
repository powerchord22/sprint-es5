
const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
// const { check, validationResult } = require('express-validator')
const conexion= require('../database/db');
const authController = require('../controllers/authController')
const crud= require('../controllers/crud');

//___________________________________LOGIN________________________________________________

//router para las vistas. aca se especifica donde se quiere poder tener acceso 
router.get('/', authController.isAuthenticated, (req, res)=>{ 
    //enviar a user    
    res.render('index', {usuario:req.user})
})
router.get('/login', (req, res)=>{
    res.render('login', {alert:false})
})
router.get('/register', (req, res)=>{
    res.render('register')
})

//router para los métodos del controller

//se importan desde archivo controllers (control + click para redirigir)
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

// module.exports = router

//__________________________________DATATABLE___________________________________________________________________


/**========================================================================
 **                            Ruta INDEX
 *========================================================================**/
router.get('/', async (req, res) => {
    try {
        const results = await conexion.query('SELECT * FROM pacientes GROUP BY nombre ORDER BY id ASC;');
        res.render('index', { results: results.rows});
    } catch (error) {
        throw error;
    }
});
/**========================================================================
 **                            Ruta INFO
 *========================================================================**/
router.get('/info', authController.isAuthenticated, async (req, res) => {
    try {
        const results = await conexion.query('SELECT * FROM pacientes ORDER BY id ASC');
        res.render('info', { results: results.rows});
    } catch (error) {
        throw error;
    }
});
/**========================================================================
 **                           Ruta REGISTROS
 *========================================================================**/

router.get('/create', (req, res)=> {
    res.render('create')
})
/**========================================================================
 **                      Desde la ruta export.save
 *========================================================================**/

router.post('/create',urlencodedParser, [],crud.save, (req, res)=> {{
        // return res.status(422).jsonp(errors.array())
        res.render('save', {alert})
    }
});


//ruta para editar los registros paciente
router.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const results = await conexion.query('SELECT * FROM pacientes WHERE id=$1 ', [id]);
        console.log(id);
        res.render('edit', { pac: results.rows });
    } catch (error) {
        throw error;
    }
});

//edicion registros especialista

router.get('/edit/:especialidad', async (req, res) => {
    const id = req.params.especialidad;
        try {
            const results = await conexion.query('SELECT * FROM profesional WHERE especialidad=$1', [especialidad]);
            console.log(id);
            console.log(results.rows)
            res.render('edit', { espec: results.rows });
        } catch (error) {
            throw error;
        }
});

// hace update en datatable
router.post('/update', crud.update);


// borra a traves del Id 
router.get('/delete/:id',async (req, res) => {
    const id = req.params.id;
    try {
        resultado = await conexion.query('DELETE FROM pacientes WHERE id = $1',[id]);
        if(resultado = true){
            req.flash('success', 'Paciente Eliminado Correctamente')
            res.redirect('/info');
        }
    }catch(error){
        throw error;
    }

});

//vamos a exportar el archivo router.js
module.exports = router
