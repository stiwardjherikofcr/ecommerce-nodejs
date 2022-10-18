const BASE_URL = `http://${window.location.hostname}:${window.location.port}`;
let cart = (existsCart()) ? JSON.parse(localStorage.getItem('cart')) : [];
let iva = 0;

/**
 * funcion para los options de fetch 
 * @returns 
 */
function options() {
  return option = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
}

/**
 * funcion asincrona para leer un json
 * @param {*} url 
 * @returns 
 */
async function leerJSON(url) {
  try {
    const response = await fetch(url, options());
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
}

function existsCart() {
  return !!localStorage.getItem('cart');
}

function addToCart(id) {
  const url = `${BASE_URL}/products/add_cart/${id}`;
  leerJSON(url).then(data => {
    addToLocalStorage(data);
  }).catch(error => {
    console.log(error);
  })
}

/**
 * 
 * @param {*} product 
 */
function addToLocalStorage(product) {
  let productExists = false;
  cart.forEach(item => {
    if (item.id === product.id) {
      productExists = true;
      item.quantity += 1;
      item.subtotal = item.quantity * item.price;
      item.iva = item.subtotal * (iva / 100);
      item.total = item.subtotal + item.iva;
    }
  });
  if (!productExists) {
    cart.push(product);
  }
  getSizeCart();
  localStorage.setItem('cart', JSON.stringify(cart));
}

function getCart() {
  getSizeCart();
  totalPrice();
  let table = "";
  if (cart.length > 0) {
    cart.forEach(item => {
      table += /*html*/ `
        <tr>
          <td>
            <img src="data:image/jpeg;base64,${item.image}" alt="..." class="img-thumbnail"
              style="width: 100px; height: 100px;">
          </td>
          <td>
            <span>${item.name}</span>
          </td>
          <td>
            <div class="input-group" style="max-width: 120px;">
                <div class="input-group-prepend">
                    <button class="btn btn-outline-secondary" type="button" onclick="setQuantity(${item.id}, ${item.quantity - 1}, ${item.stock})">-</button>
                </div>
                <input type="text" class="form-control text-center" value="${item.quantity}" placeholder=""
                  aria-label="quantity" aria-describedby="button-addon1" disabled>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" onclick="setQuantity(${item.id}, ${item.quantity + 1}, ${item.stock})">+</button>
                </div>
            </div>
          </td>
          <td>${item.price}</td>
          <td>${item.quantity * item.price}</td>
          <td>
            <button type="button" class="btn btn-danger" onclick="removeFromCart(${item.id})">X</button>
          </td>
        </tr>
      `;
      document.getElementById("products").innerHTML = table;
    });
  } else {
    table += /*html*/ `
      <div class="row my-5">
        <div class="col-md-12 text-center">
          <span style="color:#000; font-size: 50px;">
            <i class="fa-solid fa-cart-shopping"></i>
          </span>
          <h2>Tu carrito está vacío</h2>
          <button type="button" class="btn btn-lg mt-2" style="color: #fff; background-color:#042577;" onclick="location.href='/products/products_list'">Sigue comprando</button>
        </div>
      </div>
    `;
    document.getElementById('cart').innerHTML = table;
  }
}

function setQuantity(id, quantity, stock) {
  cart.forEach(item => {
    if (item.id === id) {
      if (quantity > 0 && quantity <= stock) {
        item.quantity = quantity;
        item.subtotal = item.quantity * item.price;
        item.iva = item.subtotal * (iva / 100);
        item.total = item.subtotal + item.iva;
      }
    }
  });
  addCartToLocalStorage();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  getSizeCart();
  addCartToLocalStorage();
}

function totalPrice() {
  const total = cart.reduce((acc, curr) => {
    return acc + curr.subtotal;
  }, 0);
  document.getElementById('subtotal').innerHTML = `$ ${integerToFloatWithComma(total)}`;
  document.getElementById('iva').innerHTML = `$ ${integerToFloatWithComma(total * (iva / 100))}`;
  document.getElementById('total_price').innerHTML = `$ ${integerToFloatWithComma(total + (total * (iva / 100)))}`;
}

function addCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
  getCart();
}

function getSizeCart() {
  document.getElementById('size_cart').innerHTML = cart.length;
}

function integerToFloatWithComma(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function checkout() {
  const url = `${BASE_URL}/orders/new/`;
  const data = {
    products: cart,
    subtotal: Number(document.getElementById('subtotal').innerHTML.replace(/[^0-9\.]+/g, "")),
    iva: iva,
    total: Number(document.getElementById('total_price').innerHTML.replace(/[^0-9\.]+/g, ""))
  };
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    if (response.status === 200) {
      alert('Su pedido se ha enviado correctamente');
      localStorage.removeItem('cart');
      cart = [];
      getCart();
    } else {
      alert('Error al enviar el pedido');
    }
  }).catch(error => {
    console.log(error);
  });
}

function getIva() {
  const url = `${BASE_URL}/iva/`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      iva = data;
      document.getElementById('tax').innerText = `IVA(${data}%):`;
    })
    .catch(err => console.error(err));
}

getIva();