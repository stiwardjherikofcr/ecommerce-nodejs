const pool = require('../database/db');
const ivaController = {};

ivaController.getIva = async (req, res) => {
    await pool.query('SELECT * FROM `iva`', (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            iva = rows[0].value;
            res.json(iva);
        }
    });
}

ivaController.updateIva = async (req, res) => {
    const { value } = req.body;
    await pool.query('UPDATE `iva` SET `value` = ? WHERE `id` = 1', [value], (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });
}


module.exports = ivaController;