const pool = require('../database/db');
const statusController = {};

statusController.getStatus = async (req, res) => {
    await pool.query('SELECT * FROM `status`', (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    })
}


statusController.getStatusById = async (req, res) => {
    const id_status = req.params.id;
    await pool.query('SELECT * FROM `status` WHERE id_status = ?', [id_status], (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    })
}

module.exports = statusController;