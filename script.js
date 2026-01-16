// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXXX",
  appId: "XXXXX"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ===== Global =====
let cart = [];

// ===== Navbar Control =====
auth.onAuthStateChanged(user=>{
    if(user){
        document.getElementById("login-link")?.style.display="none";
        document.getElementById("logout-link")?.style.display="inline-block";
        document.getElementById("orders-link")?.style.display="inline-block";
        if(user.email==="admin@sayeedmart.com") document.getElementById("admin-link")?.style.display="inline-block";
        fetchProducts();
        fetchCart();
        fetchOrders();
    } else {
        document.getElementById("login-link")?.style.display="inline-block";
        document.getElementById("logout-link")?.style.display="none";
        document.getElementById("admin-link")?.style.display="none";
        document.getElementById("orders-link")?.style.display="none";
    }
});

// ===== Signup =====
function signupUser(){
    let uname=document.getElementById("signup-username").value;
    let pass=document.getElementById("signup-password").value;
    if(!uname || !pass){ alert("Fill username & password"); return; }
    auth.createUserWithEmailAndPassword(uname+"@sayeedmart.com", pass)
    .then(()=> alert("Signup successful! Login now."))
    .catch(err=>alert(err.message));
}

// ===== Login =====
function loginUser(){
    let uname=document.getElementById("login-username").value;
    let pass=document.getElementById("login-password").value;
    auth.signInWithEmailAndPassword(uname+"@sayeedmart.com", pass)
    .then(()=>{ alert("Login successful"); window.location.href="index.html"; })
    .catch(err=>alert(err.message));
}

// ===== Logout =====
function logout(){ auth.signOut(); alert("Logged out"); window.location.href="index.html"; }

// ===== Fetch Products =====
function fetchProducts(){
    let list=document.getElementById("product-list");
    if(!list) return;
    list.innerHTML="Loading...";
    db.collection("products").get().then(snapshot=>{
        list.innerHTML="";
        snapshot.forEach(doc=>{
            let p=doc.data(); let id=doc.id;
            list.innerHTML+=`
            <div class="product-card">
                <img src="${p.img}">
                <h3>${p.name}</h3>
                <p>$${p.price}</p>
                <button onclick="addToCartFirestore('${id}','${p.name}',${p.price})">Add to Cart</button>
                <div class="stars">
                    ${[1,2,3,4,5].map(s=>`<span onclick="rateProductFirestore('${id}',${s})">★</span>`).join("")}
                </div>
                <textarea id="comment-${id}" placeholder="Comment..."></textarea><br>
                <button onclick="addCommentFirestore('${id}')">Submit Comment</button>
                <div id="comments-${id}">${(p.comments||[]).map(c=>"<p>"+c+"</p>").join("")}</div>
            </div>`;
        });
    });
}

// ===== Cart =====
function addToCartFirestore(id,name,price){
    let user=auth.currentUser;
    if(!user){ alert("Login required"); return; }
    cart.push({id,name,price});
    localStorage.setItem("cart",JSON.stringify(cart));
    showCart();
    showToast();
}
function showToast(){ let t=document.getElementById("cart-toast"); t.classList.add("show"); setTimeout(()=>{t.classList.remove("show");},1500);}
function fetchCart(){ cart=JSON.parse(localStorage.getItem("cart"))||[]; showCart();}
function showCart(){ let ul=document.getElementById("cart-items"); if(!ul)return; ul.innerHTML=""; let total=0; cart.forEach(p=>{ul.innerHTML+=`<li>${p.name} - $${p.price}</li>`; total+=p.price;}); document.getElementById("total")?.innerText="Total: $"+total;}
function checkout(){ let user=auth.currentUser; if(!user){ alert("Login required"); return; } cart.forEach(item=>{ db.collection("orders").add({user:user.email,...item,date:new Date()});}); cart=[]; localStorage.setItem("cart",JSON.stringify(cart)); showCart(); alert("Payment demo successful!");}

// ===== Ratings =====
function rateProductFirestore(id,stars){ db.collection("products").doc(id).update({rating:stars}); fetchProducts(); }

// ===== Comments =====
function addCommentFirestore(id){ let user=auth.currentUser; if(!user){ alert("Login required"); return;} let text=document.getElementById("comment-"+id).value; if(!text) return; db.collection("products").doc(id).update({comments: firebase.firestore.FieldValue.arrayUnion(user.email.split("@")[0]+": "+text)}); fetchProducts();}

// ===== Admin =====
function addProduct(){
    let pname=document.getElementById("pname").value;
    let pprice=parseFloat(document.getElementById("pprice").value);
    let pimg=document.getElementById("pimg").value;
    if(!pname||!pprice||!pimg){ alert("Fill all fields"); return; }
    db.collection("products").add({name:pname,price:pprice,img:pimg,rating:0,comments:[]}).then(()=>alert("Product added!"));
}

// ===== Orders =====
function fetchOrders(){
    let table=document.getElementById("orders-table");
    if(!table) return;
    let user=auth.currentUser;
    if(!user) return;
    db.collection("orders").where("user","==",user.email).get().then(snapshot=>{
        snapshot.forEach(doc=>{
            let o=doc.data();
            table.innerHTML+=`<tr><td>${o.name}</td><td>$${o.price}</td><td>${new Date(o.date.seconds*1000).toLocaleString()}</td></tr>`;
        });
    });
}
