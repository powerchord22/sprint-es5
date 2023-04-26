const { validationResult } = require('express-validator');
const db = require('../database/db');

//++++++++++++++++++++ maneja el guardado y actualizacion del datatable ++++++++++++++++++++++++++++++++++++++++++++++++++++

exports.save = async (req, res) => {
  // Validar los datos recibidos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nombre, rut, direccion, asesoria, fecha } = req.body;
    const query = 'INSERT INTO pacientes (nombre, rut, direccion, asesoria, fecha) VALUES ($1, $2, $3, $4, $5)';
      await db.query(query, [nombre, rut, direccion, asesoria, fecha]);
      req.flash('success', 'Paciente Agregado Correctamente');
      res.redirect('/info');
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};
//++++++++++++++++++++ maneja actualizacion en datatable ++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.update = async (req, res) => {
  // Validar los datos recibidos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id, nombre, rut, direccion, asesoria, fecha} = req.body;
    const query = 'UPDATE pacientes SET nombre=$1, rut=$2, direccion=$3, asesoria=$4 ,fecha=$5 WHERE id=$6';
    await db.query(query, [nombre, rut, direccion, asesoria, fecha, id]);
    req.flash('success', 'Paciente Editado Correctamente');
    res.redirect('/info');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

