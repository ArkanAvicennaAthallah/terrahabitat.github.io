const PRODUCTS = [ {
    "id": 1, "name": "Terrarium Glass 45", "category": "Kandang", "price": 485000, "badge": "BEST SELLER", "desc": "Terrarium kaca untuk setup habitat berukuran ringkas.", "img": "images/terrarium-glass.jpeg"
}
, {
    "id": 2, "name": "UVB Habitat Lamp", "category": "Pencahayaan", "price": 289000, "badge": "PILIHAN KEEPER", "desc": "Lampu habitat. Pilih tingkat UVB sesuai spesies dan setup.", "img": "images/uvb-lamp.jpeg"
}
, {
    "id": 3, "name": "Digital Thermo-Hygro", "category": "Penghangat", "price": 125000, "badge": "ESSENTIAL", "desc": "Pantau suhu dan kelembapan habitat dengan mudah.", "img": "images/thermo-hygro.jpeg"
}
, {
    "id": 4, "name": "Coconut Husk Substrate", "category": "Dekorasi", "price": 65000, "badge": "NATURAL", "desc": "Substrat berbahan sabut kelapa untuk setup yang sesuai.", "img": "images/coconut-substrate.jpeg"
}
, {
    "id": 5, "name": "Ceramic Heat Emitter", "category": "Penghangat", "price": 179000, "badge": "HEAT CONTROL", "desc": "Sumber panas tanpa cahaya tampak; gunakan dengan kontrol suhu.", "img": "images/ceramic-heater.jpeg"
}
, {
    "id": 6, "name": "Feeding Bowl — Stone", "category": "Pakan", "price": 79000, "badge": "EASY CLEAN", "desc": "Wadah pakan dan air dengan tampilan natural.", "img": "images/feeding-bowl.jpeg"
}
, {
    "id": 7, "name": "Climbing Branch Set", "category": "Dekorasi", "price": 99000, "badge": "NATURAL LOOK", "desc": "Dekorasi panjat untuk memperkaya struktur habitat.", "img": "images/climbing-branch.jpeg"
}
, {
    "id": 8, "name": "Calcium Supplement", "category": "Pakan", "price": 55000, "badge": "DAILY CARE", "desc": "Suplemen untuk penggunaan sesuai panduan spesies.", "img": "images/calcium-supplement.jpeg"
}
, {
    "id": 9, "name": "Reptile Care Essentials", "category": "Perawatan", "price": 89000, "badge": "CARE ESSENTIAL", "desc": "Perlengkapan perawatan dasar. Produk kesehatan digunakan sesuai saran dokter hewan.", "img": "images/care-essentials.jpeg"
}
];
const money = n => new Intl.NumberFormat('id-ID', {
    style:'currency', currency:'IDR', maximumFractionDigits:0
}
).format(n);
const getCart=()=>JSON.parse(localStorage.getItem('terraCart')||'[]');
const setCart=c=> {
    localStorage.setItem('terraCart', JSON.stringify(c));
    updateCartCount()
}
;
function updateCartCount() {
    const el=document.getElementById('cartCount');
    if(el)el.textContent=getCart().reduce((n, x)=>n+x.qty, 0)
}
function toast(msg) {
    const el=document.getElementById('toast');
    if(!el)return;
    el.textContent=msg;
    el.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer=setTimeout(()=>el.classList.remove('show'), 2200)
}
function addToCart(id) {
    let cart=getCart(), line=cart.find(x=>x.id===id);
    if(line)line.qty++;
    else cart.push( {
        id, qty:1
    }
    );
    setCart(cart);
    toast('Produk ditambahkan ke keranjang');
    renderCartPage()
}
function productCard(p) {
    return `<article class="product-card"><div class="product-image"><a href="product.html?id=${p.id}" aria-label="Lihat detail ${p.name}"><img loading="lazy" src="${p.img}" alt="${p.name}"></a><span class="product-badge">${p.badge}</span><button class="quick-add" data-add="${p.id}">+ Tambahkan ke keranjang</button></div><div class="product-meta"><div class="product-category">${p.category}</div><div class="product-title-row"><h3 class="product-title"><a href="product.html?id=${p.id}">${p.name}</a></h3></div><p class="product-desc">${p.desc}</p><div class="price-row"><span>${money(p.price)}</span><button class="mini-add" data-add="${p.id}" aria-label="Tambah ${p.name}">+</button></div></div></article>`
}
function renderProducts() {
    const shop=document.getElementById('shopProducts'), home=document.getElementById('homeProducts');
    if(home)home.innerHTML=PRODUCTS.slice(0, 3).map(productCard).join('');
    if(!shop)return;
    const q=(document.getElementById('productSearch')?.value||'').toLowerCase(), cat=document.getElementById('categoryFilter')?.value||'Semua', sort=document.getElementById('sortProducts')?.value||'featured';
    let list=PRODUCTS.filter(p=>(cat==='Semua'||p.category===cat)&&(`${p.name} ${p.category} ${p.desc}`).toLowerCase().includes(q));
    if(sort==='low')list.sort((a, b)=>a.price-b.price);
    if(sort==='high')list.sort((a, b)=>b.price-a.price);
    if(sort==='name')list.sort((a, b)=>a.name.localeCompare(b.name));
    shop.innerHTML=list.map(productCard).join('');
    document.getElementById('productCount').textContent=`${list.length} produk ditemukan`;
    document.getElementById('noProducts').hidden=list.length>0
}
function renderProductDetail() {
    const host=document.getElementById('productDetail');
    if(!host)return;
    const id=Number(new URLSearchParams(location.search).get('id')), p=PRODUCTS.find(x=>x.id===id);
    if(!p) {
        host.innerHTML='<div><h1>Produk tidak ditemukan</h1><a href="shop.html">Kembali ke Shop</a></div>';
        return
    }
    document.title=`${p.name} | TerraHabitat`;
    host.innerHTML=`<a class="detail-image image-link" href="${p.img}" target="_blank" rel="noopener" aria-label="Buka gambar produk ukuran penuh"><img src="${p.img}" alt="${p.name}"></a><div class="detail-copy"><p class="eyebrow">${p.category.toUpperCase()} / PRODUCT DETAILS</p><h1>${p.name}</h1><p>${p.desc}</p><p>Periksa spesifikasi dan kecocokan produk dengan spesies serta setup habitat sebelum membeli.</p><div class="detail-price">${money(p.price)}</div><button class="button button-dark" data-add="${p.id}">Tambahkan ke keranjang ↗</button><p><a class="text-link dark-link" href="shop.html">← Kembali ke Shop</a></p></div>`
}
function renderCartPage() {
    const host=document.getElementById('cartPageItems');
    if(!host)return;
    const cart=getCart();
    if(!cart.length) {
        host.innerHTML='<div class="cart-empty"><h2>Keranjangmu masih kosong</h2><p>Temukan perlengkapan untuk habitat reptilmu.</p><a class="button button-dark" href="shop.html">Jelajahi produk</a></div>';
        document.getElementById('cartPageSubtotal').textContent=money(0);
        updateDeliveryTotal();
        return
    }
    host.innerHTML=cart.map(line=> {
        const p=PRODUCTS.find(x=>x.id===line.id);if(!p)return '';return `<div class="cart-line"><a href="product.html?id=${p.id}"><img src="${p.img}" alt="${p.name}"></a><div><h4><a href="product.html?id=${p.id}">${p.name}</a></h4><p>${money(p.price)}</p><div class="quantity-control"><button data-qty="${p.id}" data-delta="-1" aria-label="Kurangi jumlah">−</button><span>${line.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Tambah jumlah">+</button></div><button class="remove-item" data-remove="${p.id}">Hapus</button></div><strong>${money(p.price*line.qty)}</strong></div>`
    }
    ).join('');
    document.getElementById('cartPageSubtotal').textContent=money(cart.reduce((s, line)=>s+(PRODUCTS.find(p=>p.id===line.id)?.price||0)*line.qty, 0)); updateDeliveryTotal()
}
document.addEventListener('click', e=> {
    const add=e.target.closest('[data-add]');if(add) {
        addToCart(Number(add.dataset.add));return
    }
    const qty=e.target.closest('[data-qty]');if(qty) {
        let c=getCart(), line=c.find(x=>x.id===Number(qty.dataset.qty));if(line) {
            line.qty+=Number(qty.dataset.delta);if(line.qty<1)c=c.filter(x=>x.id!==line.id);setCart(c);renderCartPage()
        }
        return
    }
    const rem=e.target.closest('[data-remove]');if(rem) {
        setCart(getCart().filter(x=>x.id!==Number(rem.dataset.remove)));renderCartPage();toast('Produk dihapus dari keranjang')
    }
}
);
document.getElementById('menuToggle')?.addEventListener('click', ()=>document.getElementById('mainNav')?.classList.toggle('open'));
document.querySelectorAll('.main-nav a').forEach(a=> {
    if(a.dataset.page===location.pathname.split('/').pop())a.classList.add('active');a.addEventListener('click', ()=>document.getElementById('mainNav')?.classList.remove('open'))
}
);
['productSearch', 'categoryFilter', 'sortProducts'].forEach(id=>document.getElementById(id)?.addEventListener(id==='productSearch'?'input':'change', renderProducts));
const catParam=new URLSearchParams(location.search).get('category');
if(catParam&&document.getElementById('categoryFilter'))document.getElementById('categoryFilter').value=catParam;
const cf=document.getElementById('contactForm');
cf?.addEventListener('submit', e=> {
    e.preventDefault();document.getElementById('contactFeedback').textContent='Terima kasih! Form demo tervalidasi, tetapi pesan belum dikirim ke server.';cf.reset()
}
);
const deliveryForm = document.getElementById('deliveryForm');
const deliveryService = document.getElementById('deliveryService');
const deliveryFee = document.getElementById('deliveryFee');
const deliveryTotal = document.getElementById('deliveryTotal');

function updateDeliveryTotal() {
    if (!deliveryService || !deliveryFee || !deliveryTotal) return;
    const fee = Number(deliveryService.selectedOptions[0]?.dataset.fee || 15000);
    const subtotal = getCart().reduce((sum, line) => {
        const product = PRODUCTS.find(item => item.id === line.id);
        return sum + (product ? product.price * line.qty : 0);
    }, 0);
    deliveryFee.textContent = money(fee);
    deliveryTotal.textContent = money(subtotal + fee);
}

deliveryService?.addEventListener('change', updateDeliveryTotal);
deliveryForm?.addEventListener('submit', event => {
    event.preventDefault();
    const feedback = document.getElementById('deliveryFeedback');
    if (!getCart().length) {
        feedback.textContent = 'Keranjang masih kosong. Tambahkan produk terlebih dahulu.';
        return;
    }
    if (!deliveryForm.reportValidity()) return;

    const formData = new FormData(deliveryForm);
    const serviceLabel = deliveryService.selectedOptions[0].textContent;
    const orderNumber = 'TH-' + Date.now().toString().slice(-8);
    feedback.textContent = `Pesanan demo ${orderNumber} berhasil dibuat untuk ${formData.get('name')}. Tujuan: ${formData.get('address')}, ${formData.get('city')}, ${formData.get('province')} ${formData.get('postal')}. Layanan: ${serviceLabel}. Ini simulasi; pesanan belum dikirim ke server atau kurir.`;
    toast('Pesanan demo berhasil dibuat');
});
updateCartCount();
renderProducts();
renderProductDetail();
renderCartPage();
