document.addEventListener('DOMContentLoaded', () => {
    
    // --- Page Initializers ---
    const initShopPage = () => {
        const products = window.shopProducts || [];
        const productGrid = document.getElementById('product-grid');
        const noProductsMessage = document.getElementById('no-products-message');
        const paginationContainer = document.getElementById('pagination-container');
        const searchInput = document.getElementById('search-input');
        const filtersSidebar = document.getElementById('filters-sidebar');

        if (!productGrid || !searchInput || !filtersSidebar) return;

        let searchQuery = '';
        const selectedFilters = { 'Categoría': [], 'Precio': [], 'Material': [] };
        const priceRanges = {
            'S/ 5k - S/ 10k': { min: 5000, max: 10000 },
            'S/ 10k - S/ 20k': { min: 10000, max: 20000 },
            'S/ 20k - S/ 30k': { min: 20000, max: 30000 },
            'S/ 30k+': { min: 30000, max: Infinity },
        };

        const renderProducts = (productsToRender) => {
            productGrid.innerHTML = '';
            if (productsToRender.length === 0) {
                productGrid.style.display = 'none';
                noProductsMessage.style.display = 'flex';
                paginationContainer.style.display = 'none';
            } else {
                productGrid.style.display = 'grid';
                noProductsMessage.style.display = 'none';
                paginationContainer.style.display = 'flex';
                productsToRender.forEach(product => {
                    const productLink = document.createElement('a');
                    productLink.href = `product.html?id=${product.id}`;
                    productLink.setAttribute('aria-label', `Ver detalles de ${product.name}`);
                    productLink.className = "group relative bg-black bg-opacity-20 border border-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:border-brand-gold/70 hover:shadow-2xl hover:shadow-brand-gold/10 transform hover:-translate-y-1 cursor-pointer";
                    
                    productLink.innerHTML = `
                        <div class="aspect-square overflow-hidden">
                            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110">
                        </div>
                        <div class="p-4 text-center bg-gradient-to-t from-black/50 to-transparent">
                            <h3 class="font-serif text-lg text-gray-200 group-hover:text-white transition-colors duration-300">${product.name}</h3>
                            <p class="text-brand-gold mt-1 font-semibold">${product.price}</p>
                        </div>
                    `;
                    productGrid.appendChild(productLink);
                });
            }
        };

        const applyFilters = () => {
            const filtered = products.filter(product => {
                const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
                const categoryMatch = selectedFilters['Categoría'].length === 0 || selectedFilters['Categoría'].includes(product.category);
                const materialMatch = selectedFilters['Material'].length === 0 || selectedFilters['Material'].includes(product.material);
                const priceMatch = selectedFilters['Precio'].length === 0 || selectedFilters['Precio'].some(rangeKey => {
                    const range = priceRanges[rangeKey];
                    return product.priceValue >= range.min && product.priceValue < range.max;
                });
                return searchMatch && categoryMatch && materialMatch && priceMatch;
            });
            renderProducts(filtered);
        };

        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            applyFilters();
        });

        filtersSidebar.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const category = e.target.dataset.category;
                const value = e.target.value;
                if (e.target.checked) {
                    selectedFilters[category].push(value);
                } else {
                    selectedFilters[category] = selectedFilters[category].filter(item => item !== value);
                }
                applyFilters();
            }
        });

        applyFilters(); // Initial render
    };

    const initProductDetailPage = () => {
        const container = document.getElementById('product-detail-container');
        if (!container) return;

        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'), 10);
        const product = window.shopProducts.find(p => p.id === productId);

        if (!product) {
            container.innerHTML = '<p class="text-center text-gray-400 text-lg">Producto no encontrado.</p>';
            return;
        }

        container.innerHTML = `
            <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div class="flex justify-center items-center bg-black bg-opacity-20 p-8 rounded-lg border border-gray-800">
                    <img src="${product.image}" alt="${product.name}" class="w-full max-w-md drop-shadow-2xl">
                </div>
                <div class="flex flex-col">
                    <span class="text-brand-gold tracking-widest uppercase text-sm mb-2">${product.category}</span>
                    <h1 class="font-serif text-4xl md:text-6xl font-bold text-gray-100 mb-4 leading-tight">${product.name}</h1>
                    <p class="text-gray-400 max-w-lg mb-6 text-base leading-relaxed">${product.description}</p>
                    <p class="font-serif text-4xl text-brand-gold mb-8">${product.price}</p>
                    <div class="flex items-center gap-4 mb-8">
                        <span class="font-semibold text-gray-300">Cantidad:</span>
                        <div class="flex items-center border border-gray-700 rounded-md">
                            <button id="decrement-btn" class="px-4 py-2 text-2xl text-gray-400 hover:bg-gray-800 transition-colors duration-200" aria-label="Disminuir cantidad">-</button>
                            <span id="quantity-span" class="px-6 py-2 text-lg font-semibold w-16 text-center">1</span>
                            <button id="increment-btn" class="px-4 py-2 text-2xl text-gray-400 hover:bg-gray-800 transition-colors duration-200" aria-label="Aumentar cantidad">+</button>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row items-center gap-4">
                        <button id="purchase-btn" class="bg-brand-gold text-zinc-900 px-8 py-3 font-semibold tracking-wider hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">REALIZAR COMPRA</button>
                        <a href="shop.html" class="text-gray-300 px-8 py-3 font-semibold tracking-wider border border-gray-700 hover:border-gray-500 transition-colors duration-300 w-full sm:w-auto text-center">VOLVER A LA TIENDA</a>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for quantity and purchase
        const decrementBtn = document.getElementById('decrement-btn');
        const incrementBtn = document.getElementById('increment-btn');
        const quantitySpan = document.getElementById('quantity-span');
        const purchaseBtn = document.getElementById('purchase-btn');
        let quantity = 1;

        decrementBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                quantitySpan.textContent = quantity;
            }
        });

        incrementBtn.addEventListener('click', () => {
            quantity++;
            quantitySpan.textContent = quantity;
        });

        purchaseBtn.addEventListener('click', () => {
            const total = product.priceValue * quantity;
            alert(`Compra realizada: ${quantity} x ${product.name}\nTotal: S/ ${total.toLocaleString('es-PE')}`);
            window.location.href = 'shop.html';
        });
    };

    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        const successMessage = document.getElementById('success-message');

        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            form.reset();
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 4000);
        });
    };

    // --- Simple Router ---
    if (document.getElementById('product-grid')) {
        initShopPage();
    } else if (document.getElementById('product-detail-container')) {
        initProductDetailPage();
    }

    if (document.getElementById('contact-form')) {
        initContactForm();
    }
});
