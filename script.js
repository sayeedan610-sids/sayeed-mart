let products = JSON.parse(localStorage.getItem("products")) || [
    {name:"Watch", price:25, img:"images/watch.jpg"},
    {name:"Headphones", price:18, img:"images/headphones.jpg"}
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayProducts() {
    let list = document.getElementById("product-list");
    if (!list) return;

    list.innerHTML = "";
    products.forEach((p,i)=>{
        list.innerHTML += `
        <div class="product-card">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p>$${p.price}</p>
            <button onclick="addToCart(${i})">Add to Cart</button>
        </div>`;
    });
}

function addToCart(i) {
    cart.push(products[i]);
    localStorage.setItem("cart",JSON.stringify(cart));
    alert("Added to cart");
    showCart();
}

function showCart() {
    let ul = document.getElementById("cart-items");
    let total = 0;
    if (!ul) return;

    ul.innerHTML="";
    cart.forEach(p=>{
        ul.innerHTML += `<li>${p.name} - $${p.price}</li>`;
        total += p.price;
    });
    document.getElementById("total").innerText="Total: $"+total;
}

function checkout() {
    alert("Payment Successful (Demo)");
    cart=[];
    localStorage.removeItem("cart");
    showCart();
}

/* Admin */
function login() {
    if(username.value=="admin" && password.value=="123"){
        alert("Admin Login Success");
    } else {
        alert("Wrong Login");
    }
}

function addProduct() {
    products.push({
        name:pname.value,
        price:pprice.value,
        img:pimg.value
    });
    localStorage.setItem("products",JSON.stringify(products));
    alert("Product Added");
}

displayProducts();
showCart();
