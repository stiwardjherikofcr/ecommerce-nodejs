const pool = require('../database/db');
const productController = {};

productController.listProducts = async (req, res) => {
    const categoryId = req.query.categoryId;
    const queries = [
        "SELECT * FROM producto",
        "SELECT * FROM producto WHERE id_category = ?",
    ];
    await pool.query(queries[categoryId ? 1 : 0], [categoryId], (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            products = rows.map(product => {
                return {
                    id: product.id_product,
                    name: product.name,
                    category: product.id_category,
                    price: product.price,
                    stock: product.stock,
                    image: Buffer.from(product.image).toString('base64')
                }
            })
            res.render('inventory/products', { data: products })
        }
    })
}


productController.addToCart = async (req, res) => {
    const { id } = req.params;
    await pool.query('SELECT * FROM producto WHERE id_product = ?', [id], (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            product = rows.map(product => {
                return {
                    id: product.id_product,
                    name: product.name,
                    stock: product.stock,
                    quantity: 1,
                    price: product.price,
                    subtotal: product.price,
                    iva: product.price * (19 / 100),
                    total: product.price * 1.19,
                    image: Buffer.from(product.image).toString('base64')
                }
            })
            res.json(product[0]);
        }
    })
}


productController.cart = (req, res) => {
    res.render('checkout/cart');
}

module.exports = productController;