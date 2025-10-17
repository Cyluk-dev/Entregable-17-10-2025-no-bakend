document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.endsWith('shop.html') || path.endsWith('/shop')) {
        if(document.getElementById('product-grid')) {
            initShopPage(window.shopProducts);
        }
    }

    if (path.endsWith('contact.html') || path.endsWith('/contact')) {
        initContactPage();
    }
});

function initContactPage() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    if (!form || !successMessage) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        successMessage.style.display = 'block';
        form.reset();
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 4000);
    });
}

function initShopPage(products) {
    if (!products) {
        console.error("Product data not found. Make sure data.js is loaded correctly.");
        return;
    }

    const productGrid = document.getElementById('product-grid');
    const searchInput = document.getElementById('search-input');
    const filtersSidebar = document.getElementById('filters-sidebar');
    const noProductsMessage = document.getElementById('no-products-message');
    const paginationContainer = document.getElementById('pagination-container');

    if (!productGrid || !searchInput || !filtersSidebar || !noProductsMessage || !paginationContainer) return;

    const priceRanges = {
      'S/ 5k - S/ 10k': { min: 5000, max: 10000 },
      'S/ 10k - S/ 20k': { min: 10000, max: 20000 },
      'S/ 20k - S/ 30k': { min: 20000, max: 30000 },
      'S/ 30k+': { min: 30000, max: Infinity },
    };

    let searchQuery = '';
    let selectedFilters = {
        'Categoría': [],
        'Precio': [],
        'Material': [],
    };

    const renderProducts = (productsToRender) => {
        productGrid.innerHTML = '';
        if (productsToRender.length === 0) {
            noProductsMessage.style.display = 'flex';
            paginationContainer.style.display = 'none';
        } else {
            noProductsMessage.style.display = 'none';
            paginationContainer.style.display = 'flex';
            productsToRender.forEach(product => {
                const productCard = `
                    <div class="group relative bg-black bg-opacity-20 border border-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:border-brand-gold/70 hover:shadow-2xl hover:shadow-brand-gold/10 transform hover:-translate-y-1 cursor-pointer">
                      <div class="aspect-square overflow-hidden">
                        <img 
                          src="${product.image}"
                          alt="${product.name}"
                          class="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                      </div>
                      <div class="p-4 text-center bg-gradient-to-t from-black/50 to-transparent">
                        <h3 class="font-serif text-lg text-gray-200 group-hover:text-white transition-colors duration-300">${product.name}</h3>
                        <p class="text-brand-gold mt-1 font-semibold">${product.price}</p>
                      </div>
                    </div>
                `;
                productGrid.innerHTML += productCard;
            });
        }
    };
    
    const applyFiltersAndSearch = () => {
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
        applyFiltersAndSearch();
    });

    filtersSidebar.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const category = e.target.dataset.category;
            const value = e.target.value;
            
            const currentCategoryFilters = selectedFilters[category];
            if (e.target.checked) {
                if (!currentCategoryFilters.includes(value)) {
                    currentCategoryFilters.push(value);
                }
            } else {
                selectedFilters[category] = currentCategoryFilters.filter(item => item !== value);
            }
            applyFiltersAndSearch();
        }
    });

    // Initial render
    applyFiltersAndSearch();
}