//variables

const shoppingCartBtn = document.querySelector('.shopping-cart');
const displayShoppingCart = document.querySelector('.shopping-cart-display');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

const filterBtns = document.querySelectorAll('.filter-btn');

//cart
let cart = [];
//buttons
let buttonsDOM = [];

// getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch('./products/products.json');
      let data = await result.json();

      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        const category = item.category;

        return { title, price, id, image, category };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

//display products
class UI {
  displayProducts(products) {
    let result = '';
    products.forEach((product) => {
      result += `
      <article class="product">
            <div class="img-container">
              <img
                src=${product.image}
                alt="product"
                class="product-img"
              />
              <button class="bag-btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart"></i>add to cart
              </button>
            </div>
            <h3>${product.title}</h3>
            <h4>$${product.price}</h4>
          </article>
      `;
    });

    productsDOM.innerHTML = result;
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll('.bag-btn')];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innetText = 'In Cart';
        button.disabled = true;
      }
      button.addEventListener('click', (event) => {
        event.target.innerText = 'In Cart';
        event.target.disabled = true;
        //get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        //add product to the cart
        cart = [...cart, cartItem];
        //save cart in local storage
        Storage.saveCart(cart);
        //set cart values
        this.setCartValues(cart);
        //display cart item
        this.addCartItem(cartItem);
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
              <div class="cart-product-container">
              <img
                src=${item.image}
                alt="body-lotion"
              />
              
                <div class="cart-product-details">
                <h4>${item.title}</h4>
                <p>$${item.price}</p>
                <button class="cart-remove-btn" data-id=${item.id}>remove</button>
                </div>
              </div>
              <div class="cart-counter">
                <i class="fa-solid fa-angle-up" data-id=${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fa-solid fa-angle-down" data-id=${item.id}></i>
              </div>`;
    cartContent.appendChild(div);
  }
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  cartLogic() {
    //clear cart button
    clearCartBtn.addEventListener('click', () => {
      this.clearCart();
    });
    //cart functionality -- remove single item from cart
    cartContent.addEventListener('click', (event) => {
      if (event.target.classList.contains('cart-remove-btn')) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(
          removeItem.parentElement.parentElement.parentElement
        );
        this.removeItem(id);
      } else if (event.target.classList.contains('fa-angle-up')) {
        let maxAmount = 25;
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        if (tempItem.amount > maxAmount) {
          tempItem.amount = maxAmount;
          alert(
            'You can order maximum amount of 25 items per product.If you would like to order more, please contact us directly.'
          );
        }
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains('fa-angle-down')) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
  }
  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
  }
  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}

//local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();
  //setup app
  ui.setupAPP();
  //get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});

//shopping cart visibility
shoppingCartBtn.addEventListener('click', () => {
  displayShoppingCart.classList.toggle('active-cart');
});
