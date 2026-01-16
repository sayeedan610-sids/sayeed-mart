/* ===== USERS ===== */
let users = JSON.parse(localStorage.getItem("users")) || [{username:"admin", password:"123", role:"admin"}];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [
    {name:"Watch", price:25, img:"images/watch.jpg", rating:0, comments:[]},
    {name:"Headphones", price:18, img:"images/headphones.jpg", rating:0, comments:[]}
];

/* ===== NAVBAR CONTROL ===== */
window.onload = function () {
    if(currentUser){
        document.getElementById("login-link").style.display="none";
        document.getElementById("logout-link").style.display="inline-block";
        if(currentUser.role==="admin") document.getElementById("admin-link").style.display="inline-block";
    }
    displayProducts();
    showCart();
};

/* ===== SIGNUP ===== */
function signupUser(){
    let uname = document.getElementById("signup-username").value;
    let pass = document.getElementById("signup-password").value;
    if(!uname || !pass){ alert("Enter username & password"); return; }
    if(users.find(u=>u.username===uname)){ alert("Username exists"); return; }

    users.push({username:uname,password:pass,role:"user",orders:[]});
    localStorage.setItem("users",JSON.stringify(users));
    alert("Signup success! You can login now");
}

/* ===== LOGIN ===== */
function loginUser(){
    let uname = document.getElementById("login-username").value;
    let pass = document.getElementById("login-password").value;
    let user = users.find(u=>u.username===uname && u.password===pass);
    if(!user){ alert("Wrong credentials"); return; }

    localStorage.setItem("currentUser", JSON.stringify(user));
    currentUser=user;
    alert("Login successful");
    window.location.href="index.html";
}

/* ===== LOGOUT ===== */
function logout(){
    localStorage.removeItem("currentUser");
    currentUser=null;
    alert("Logged out");
    window.location.href="index.html";
}

/* ===== PRODUCTS DISPLAY ===== */
function displayProducts(){
    let list=document.getElementById("product-list");
    if(!list) return;
    list.innerHTML="";
    products.forEach((p,i)=>{
        list.innerHTML+=`
        <div class="product-card">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p>$${p.price}</p>
            <button onclick="addToCart(${i})">Add to Cart</button>
            <div class="stars">
                <span onclick="rateProduct(${i},1)">★</span>
                <span onclick="rateProduct(${i},2)">★</span>
                <span onclick="rateProduct(${i},3)">★</span>
                <span onclick="rateProduct(${i},4)">★</span>
                <span onclick="rateProduct(${i},5)">★</span>
            </div>
            <textarea id="comment-${i}" placeholder="Comment..."></textarea><br>
            <button onclick="addComment(${i})">Submit Comment</button>
            <div id="comments-${i}">${p.comments.map(c=>"<p>"+c+"</p>").join("")}</div>
        </div>`;
    });
}

/* ===== CART ===== */
function addToCart(i){
    if(!currentUser){ alert("Login required to buy"); window.location.href="login.html"; return; }
    cart.push(products[i]);
    localStorage.setItem("cart",JSON.stringify(cart));
    alert("Added to cart");
    showCart();
}
function showCart(){
    let ul=document.getElementById("cart-items");
    if(!ul) return;
    let total=0;
    ul.innerHTML="";
    cart.forEach(p=>{ ul.innerHTML+=`<li>${p.name} - $${p.price}</li>`; total+=p.price; });
    document.getElementById("total").innerText="Total: $"+total;
}
function checkout(){
    if(!currentUser){ alert("Login required"); return; }
    alert("Payment demo successful!");
    if(currentUser.role==="user"){
        let idx=users.findIndex(u=>u.username===currentUser.username);
        users[idx].orders = users[idx].orders.concat(cart);
        localStorage.setItem("users",JSON.stringify(users));
    }
    cart=[]; localStorage.setItem("cart",JSON.stringify(cart));
    showCart();
}

/* ===== RATINGS + COMMENTS ===== */
function rateProduct(idx,stars){
    products[idx].rating=stars;
    localStorage.setItem("products",JSON.stringify(products));
    alert("You rated "+stars+" stars");
}
function addComment(idx){
    if(!currentUser){ alert("Login required"); return; }
    let text=document.getElementById("comment-"+idx).value;
    if(!text) return;
    products[idx].comments.push(currentUser.username+": "+text);
    localStorage.setItem("products",JSON.stringify(products));
    displayProducts();
}
