    const STORAGE_PRODUCTS = "qb_products_v1";
    const STORAGE_CART = "qb_cart_v1";
    const STORAGE_WISHLIST = "qb_wishlist_v1";
    const STORAGE_ROLE = "qb_role_v1";
    const STORAGE_USER_DATA = "qb_user_data_v1";
    const STORAGE_ORDERS_DEMO = "qb_orders_demo_v1";

    async function loadInitialProducts() {
        const local = localStorage.getItem(STORAGE_PRODUCTS);
        if (local) return JSON.parse(local);
        try {
            const res = await fetch("../data/products.json");
            const data = await res.json();
            localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(data));
            return data;
        } catch (e) {
            console.error("Failed loading products", e);
            return [];
        }
    }

    function saveProducts(products) { localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products)); }
    function getCart() { return JSON.parse(localStorage.getItem(STORAGE_CART) || "[]"); }
    function saveCart(cart){ localStorage.setItem(STORAGE_CART, JSON.stringify(cart)); }
    function addToCart(prodId, qty=1) { const cart = getCart(); const item = cart.find(i=>i.id===prodId); if(item) item.qty += qty; else cart.push({id:prodId, qty}); saveCart(cart); alert("Added to cart"); }
    function getWishlist(){ return JSON.parse(localStorage.getItem(STORAGE_WISHLIST) || "[]"); }
    function saveWishlist(list){ localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(list)); }
    function toggleWishlist(prodId){ const list = getWishlist(); const idx = list.indexOf(prodId); if(idx>=0){ list.splice(idx,1); alert("Removed from wishlist"); } else { list.push(prodId); alert("Added to wishlist"); } saveWishlist(list); }
    function searchProducts(products, q){ q = (q||"").trim().toLowerCase(); if(!q) return products; return products.filter(p => p.title.toLowerCase().includes(q) || (p.tags||[]).join(" ").toLowerCase().includes(q)); }
    function setRole(role){ localStorage.setItem(STORAGE_ROLE, role); }
    function getRole(){ return localStorage.getItem(STORAGE_ROLE); }
    function logout(){ localStorage.removeItem(STORAGE_ROLE); localStorage.removeItem(STORAGE_CART); localStorage.removeItem(STORAGE_USER_DATA); window.location.href = "../client/login.html"; }
    function getCurrentUser() {
        const userData = localStorage.getItem(STORAGE_USER_DATA);
        return userData ? JSON.parse(userData) : null;
    }
    function loginUser(username, role) {
        const user = {
            username: username,
            email: username + '@qb.com',
            memberSince: new Date().toISOString().slice(0, 10),
            role: role
        };
        localStorage.setItem(STORAGE_USER_DATA, JSON.stringify(user));
        setRole(role);
    }

    function getOrders() {
        return JSON.parse(localStorage.getItem(STORAGE_ORDERS_DEMO) || '[]');
    }

    function saveOrder(order) {
        const existingOrders = getOrders();
        existingOrders.unshift(order);
        localStorage.setItem(STORAGE_ORDERS_DEMO, JSON.stringify(existingOrders));
    }

    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    async function placeOrder(shippingDetails) {
        const cart = getCart();
        const prods = await loadInitialProducts();

        const totalPrice = cart.reduce((sum, cartItem) => {
            const product = prods.find(p => p.id === cartItem.id);
            if (product && product.price) {
                return sum + (Number(product.price) * cartItem.qty);
            }
            return sum;
        }, 0);
        
        const newOrder = {
            id: 'O' + Date.now(),
            date: new Date().toLocaleDateString(),
            total: totalPrice,
            items: cart,
            shipping: shippingDetails
        };
        
        saveOrder(newOrder);
        saveCart([]);

        alert('Order placed successfully! Total: ₹' + newOrder.total);
        window.location.href = 'profile.html';
    }

    function productCardHtml(p){ return `<div class="card"><img src="${p.image}" class="product-img" alt="${p.title}"><div class="small">${p.category}</div><h4>${p.title}</h4><div class="flex"><div class="badge">₹ ${p.price}</div><div class="small" style="margin-left:auto">${p.stock} in stock</div></div><div class="flex" style="margin-top:auto"><button class="btn" onclick="addToCart('${p.id}',1)">Add to cart</button><button class="btn" style="background:#fff;color:var(--accent);border:1px solid #eee" onclick="toggleWishlist('${p.id}')">Wishlist</button></div></div>`; }
    window.addToCart = addToCart; window.toggleWishlist = toggleWishlist; window.searchProducts = searchProducts; window.setRole = setRole; window.getRole = getRole; window.logout = logout; window.loadInitialProducts = loadInitialProducts; window.saveProducts = saveProducts; window.productCardHtml = productCardHtml; window.getCurrentUser = getCurrentUser; window.loginUser = loginUser; window.placeOrder = placeOrder; window.getOrders = getOrders; window.convertFileToBase64 = convertFileToBase64;
    function productCardHtml(p){ 
        return `<a href="veiw.html?id=${p.id}" class="product-card-link">
                    <div class="card">
                        <img src="${p.image}" class="product-img" alt="${p.title}">
                        <div class="small">${p.category}</div>
                        <h4>${p.title}</h4>
                        <div class="flex">
                            <div class="badge">₹ ${p.price}</div>
                            <div class="small" style="margin-left:auto">${p.stock} in stock</div>
                        </div>
                        <div class="flex" style="margin-top:auto">
                            <button class="btn" onclick="event.stopPropagation(); event.preventDefault(); addToCart('${p.id}',1)">Add to cart</button>
                            <button class="btn" style="background:#fff;color:var(--accent);border:1px solid #eee" onclick="event.stopPropagation(); event.preventDefault(); toggleWishlist('${p.id}')">Wishlist</button>
                        </div>
                    </div>
                </a>`; 
    }
    // ... rest of app.js functions remain unchanged