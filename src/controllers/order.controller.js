const pool = require('../database/db');
const orderController = {};

orderController.getOrders = async (req, res) => {
    const id_customer = req.user.id_customer;
    await pool.query('SELECT * FROM `order` WHERE id_customer = ?', [id_customer], (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            orders = rows.map(order => {
                return {
                    id: order.id_order,
                    id_status: order.id_status,
                    status: (order.id_status == 1) ? 'Pending' : (order.id_status == 2) ? 'Approved' : 'Rejected',
                    date: order.date.toLocaleDateString(),
                    time: order.date,
                    subtotal: order.subtotal,
                    iva: order.iva,
                    total: order.total,
                }
            })
            res.render('orders/orders', { data: orders })
        }
    })
}

orderController.getOrder = async (req, res) => {
    const id_order = req.params.id;
    await pool.query('SELECT * FROM `order_producto` WHERE id_order = ?', [id_order], (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            orders = rows.map(order => {
                return {
                    id: order.id_order_product,
                    id_product: order.id_product,
                    name: '',
                    image: '',
                    quantity: order.quantity,
                    price: order.price,
                    subtotal: order.subtotal,
                    iva: order.iva,
                    total: order.total,
                }
            })
            orders.forEach(order => {
                pool.query('SELECT * FROM `producto` WHERE id_product = ?', [order.id_product], (err, rows) => {
                    if (err) {
                        res.json(err);
                    } else {
                        order.name = rows[0].name;
                        order.image = Buffer.from(rows[0].image).toString('base64');
                    }
                })
            })
            res.render('orders/details', { data: orders })
        }
    })
}


orderController.createOrder = async (req, res) => {
    const id_customer = req.user.id_customer;
    const date = new Date();
    const subtotal = req.body.subtotal;
    const iva = req.body.iva;
    const total = req.body.total;
    const order = {
        id_customer,
        id_status: 1,
        date,
        subtotal,
        iva,
        total,
    }
    await pool.query('INSERT INTO `order` SET ?', [order], (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            id_order = rows.insertId;
            orderController.createOrderProducts(req, res, id_order, req.body.products);
            res.redirect('/orders');
        }
    })
}

orderController.createOrderProducts = async (req, res, id_order, products) => {
    products.forEach(product => {
        const order_product = {
            id_order,
            id_product: product.id,
            quantity: product.quantity,
            price: product.price,
            subtotal: product.subtotal,
            iva: product.iva,
            total: product.total,
        }
        pool.query('INSERT INTO `order_producto` SET ?', [order_product], (err, rows) => {
            if (err) {
                res.json(err);
            }
        })
    })
}

orderController.getOrdersAdmin = (req, res) => {
    console.log('getOrdersAdmin');
    /*await pool.query('SELECT * FROM `order`', (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            orders = rows.map(order => {
                return {
                    id: order.id_order,
                    date: order.date.toLocaleDateString(),
                    time: order.date,
                    subtotal: order.subtotal,
                    iva: order.iva,
                    total: order.total,
                }
            })
            res.render('orders/orders', { data: orders })
            console.log(rows);
            res.json(rows)
        }
    })*/
}


orderController.getOrderAdmin = async (req, res) => {
}


orderController.updateOrderAdmin = async (req, res) => {
}


orderController.deleteOrderAdmin = async (req, res) => {
}

module.exports = orderController;