/** @copyright 2025 Mujtaba
 * @license Apache-2.0
 */
'use strict';

// Product Database
const productsDatabase = {
    attire: { id: 'attire', title: 'Attire', price: 25.75, image: './assets/images/slide-1.jpg', description: 'Artisanal designs that make every day a feast' },
    jewellry: { id: 'jewellry', title: 'Jewellry', price: 25.75, image: './assets/images/slide-2.jpg', description: 'Casual but Sophisticated pieces for every room in the house' },
    lamp: { id: 'lamp', title: 'Lamp', price: 25.75, image: './assets/images/slide-3.jpg', description: 'Makes the inside of room aesthetic' },
    product1: { id: 'product1', title: 'Purse', price: 25.75, image: './assets/images/slide-4.jpg', description: 'Stylish and functional purse' }
};

// Utility Functions
const addEventOnElem = function(elements, eventType, callback) {
    for(let i = 0; i < elements.length; i++) {
        elements[i].addEventListener(eventType, callback);
    }
}

// State Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// DOM Elements
const $header = document.querySelector('[data-header]');
const $navbar = document.querySelector('[data-navbar]');
const $navToggler = document.querySelectorAll('[data-nav-toggler]');
const $overlay = document.querySelector('[data-overlay]');
const $dropdownToggler = document.querySelector('[data-dropdown-toggler]');
const $dropdown = document.querySelector('[data-dropdown]');
const $cartToggler = document.querySelector('[data-cart-toggler]');
const $cartModal = document.querySelector('[data-cart-modal]');

// Navigation Functions
const toggleNavbar = function() {
    $navbar.classList.toggle('active');
    $overlay.classList.toggle('active');
    document.body.classList.toggle('active');
}

const toggleElem = function(elem) {
    elem.classList.toggle('active');
}

// Event Listeners
addEventOnElem($navToggler, 'click', toggleNavbar);
$dropdownToggler.addEventListener('click', () => toggleElem($dropdown));
$cartToggler.addEventListener('click', () => toggleElem($cartModal));

// Header Scroll Effect
const activeHeader = function() {
    window.scrollY > 50 ? $header.classList.add('active') : $header.classList.remove('active');
}
window.addEventListener('scroll', activeHeader);

// Cart Functions
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    showNotification('Added to cart');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function renderCart() {
    if (!$cartModal) return;
    
    const cartList = $cartModal.querySelector('.cart-items-list');
    const cartFooter = $cartModal.querySelector('.cart-footer');
    if (!cartList) return;

    if (cart.length === 0) {
        cartList.innerHTML = `
            <li class="empty-cart-message">
                <span class="material-symbols-rounded text-6xl mb-2">shopping_cart_checkout</span>
                <p>Your cart is empty</p>
            </li>
        `;
        if (cartFooter) {
            const subtotalSpan = cartFooter.querySelector('[data-cart-subtotal]');
            if (subtotalSpan) subtotalSpan.textContent = '$0.00';
        }
        return;
    }

    let html = '';
    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        html += `
        <li>
            <figure class="cart-item-image">
                <img src="${item.image}" width="80" height="80" loading="lazy" alt="${item.title}" class="img-cover">
            </figure>
            <div class="cart-item-content">
                <span class="cart-item-title">${item.title}</span>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button onclick="updateCartQuantity('${item.id}', -1)" aria-label="decrease quantity">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity('${item.id}', 1)" aria-label="increase quantity">+</button>
                    </div>
                    <span class="cart-item-price">$${itemTotal}</span>
                </div>
            </div>
            <button class="cart-remove-btn" onclick="removeFromCart('${item.id}')" aria-label="remove product">
                <span class="material-symbols-rounded">close</span>
            </button>
        </li>
        `;
    });
    cartList.innerHTML = html;

    // Update cart footer
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartFooter) {
        const subtotalSpan = cartFooter.querySelector('[data-cart-subtotal]');
        if (subtotalSpan) subtotalSpan.textContent = `$${total.toFixed(2)}`;
    }
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function checkoutCart() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    showNotification('Proceeding to checkout...');
// Implement checkout logic here
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.querySelector('[data-cart-count]');
    if (counter) {
        counter.textContent = count;
        if (count > 0) {
            counter.classList.remove('hidden');
        } else {
            counter.classList.add('hidden');
        }
    }
}

// Wishlist Functions
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index === -1) {
        wishlist.push(productId);
        showNotification('Added to wishlist');
    } else {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI(productId);
}

function updateWishlistUI(productId) {
    const heartIcon = document.querySelector(`[data-wishlist="${productId}"]`);
    if (heartIcon) {
        heartIcon.name = wishlist.includes(productId) ? 'heart' : 'heart-outline';
    }
}

// Quick View Functions
function showQuickView(product) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg max-w-2xl w-full m-4">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold">${product.title}</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
                    <span class="material-symbols-rounded">close</span>
                </button>
            </div>
            <div class="flex flex-col md:flex-row gap-6">
                <div class="md:w-1/2">
                    <img src="${product.image}" alt="${product.title}" class="w-full h-auto rounded-lg">
                </div>
                <div class="md:w-1/2">
                    <p class="text-2xl font-bold mb-4">$${product.price.toFixed(2)}</p>
                    <p class="mb-4">${product.description}</p>
                    <button class="btn bg-butterscotch_light py-3 px-6 w-full" 
                            onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Notification Function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-butterscotch_light text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-y-0 opacity-100 transition-all duration-300';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-100%)';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Slider Functions
function initSlider() {
    const sliderContainers = document.querySelectorAll('[data-slider-container]');
    
    sliderContainers.forEach(container => {
        const slider = container.querySelector('[data-slider]');
        if (!slider) return;

        let autoSlideInterval;
        let isUserInteracting = false;
        const autoSlideDelay = 1500; // 1.5 seconds between slides

        // Add arrow buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'arrow-button';
        prevBtn.setAttribute('data-prev-btn', '');
        prevBtn.innerHTML = '<ion-icon name="chevron-back-outline"></ion-icon>';
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'arrow-button';
        nextBtn.setAttribute('data-next-btn', '');
        nextBtn.innerHTML = '<ion-icon name="chevron-forward-outline"></ion-icon>';
        
        container.appendChild(prevBtn);
        container.appendChild(nextBtn);
        
        const scrollAmount = 280; // Width of item (256px) + gap (24px)
        
        // Scroll handlers
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Update arrow visibility based on scroll position
        const updateArrows = () => {
            const { scrollLeft, scrollWidth, clientWidth } = slider;
            // Calculate if there's content to scroll
            const hasScrollContent = scrollWidth > clientWidth;
            
            if (!hasScrollContent) {
                // Hide both arrows if no scrolling is needed
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                return;
            }

            const atStart = scrollLeft <= 0;
            const atEnd = Math.round(scrollLeft + clientWidth) >= scrollWidth - 1;

            // Show/hide back arrow
            if (atStart) {
                prevBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'grid';
                prevBtn.style.opacity = '1';
            }

            // Show/hide forward arrow
            if (atEnd) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'grid';
                nextBtn.style.opacity = '1';
            }
        };

        // Call updateArrows on various events
        slider.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        slider.addEventListener('touchend', updateArrows);
        updateArrows(); // Initial state

        // Handle touch events for mobile
        let startX, startScrollLeft;
        
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - slider.offsetLeft;
            startScrollLeft = slider.scrollLeft;
        });
        
        slider.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = startScrollLeft - walk;
        });
        
        slider.addEventListener('touchend', () => {
            startX = null;
            // Resume auto-slide after touch interaction
            setTimeout(() => {
                isUserInteracting = false;
                startAutoSlide();
            }, 1000);
        });

        // Auto-slide functionality
        function startAutoSlide() {
            if (isUserInteracting) return;
            
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                const { scrollLeft, scrollWidth, clientWidth } = slider;
                
                if (Math.round(scrollLeft + clientWidth) >= scrollWidth) {
                    // At the end, scroll back to start smoothly
                    slider.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                } else {
                    // Scroll to next item
                    slider.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
                updateArrows();
            }, autoSlideDelay);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        // Pause auto-slide on user interaction
        slider.addEventListener('mouseenter', () => {
            isUserInteracting = true;
            stopAutoSlide();
        });

        slider.addEventListener('mouseleave', () => {
            isUserInteracting = false;
            startAutoSlide();
        });

        prevBtn.addEventListener('mouseenter', stopAutoSlide);
        nextBtn.addEventListener('mouseenter', stopAutoSlide);
        prevBtn.addEventListener('mouseleave', () => {
            if (!isUserInteracting) startAutoSlide();
        });
        nextBtn.addEventListener('mouseleave', () => {
            if (!isUserInteracting) startAutoSlide();
        });

        // Start auto-slide initially
        startAutoSlide();
    });
}

// Initialize Product Actions
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the slider first
    initSlider();
    
    // Initialize cart UI
    updateCart();

    // Set up product actions for slider items
    document.querySelectorAll('.slider-item').forEach(item => {
        const productId = item.dataset.productId;
        if (!productId || !productsDatabase[productId]) return;

        const productDetails = productsDatabase[productId];

        // Set up action buttons
        const actionButtons = item.querySelectorAll('[data-action]');
        actionButtons.forEach(button => {
            const action = button.dataset.action;
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                switch(action) {
                    case 'add-to-cart':
                        addToCart(productDetails);
                        break;
                    case 'toggle-wishlist':
                        toggleWishlist(productId);
                        break;
                    case 'quick-view':
                        showQuickView(productDetails);
                        break;
                }
            });
        });

        // Initialize wishlist state for this product
        if (wishlist.includes(productId)) {
            const heartIcon = item.querySelector('[data-action="toggle-wishlist"] ion-icon');
            if (heartIcon) {
                heartIcon.name = 'heart';
            }
        }
    });

    // Set up new arrival products (without slider)
    document.querySelectorAll('.grid-list .group').forEach(item => {
        const productTitle = item.querySelector('.text-lg.text-jet.font-bold')?.textContent || '';
        const priceText = item.querySelector('.bg-butterscotch')?.textContent || '$0';
        const price = parseFloat(priceText.replace('$', ''));
        const imageUrl = item.querySelector('.img-cover')?.src || '';

        const productDetails = {
            id: productTitle.toLowerCase().replace(/\s+/g, '-'),
            title: productTitle,
            price: price,
            image: imageUrl,
            description: productTitle + ' - Premium handcrafted item'
        };

        const actionButtons = item.querySelectorAll('[data-action="add-to-cart"], [data-action="toggle-wishlist"], [data-action="quick-view"]');

        if (actionButtons.length === 0) {
            // Fallback for products with regular links
            const links = item.querySelectorAll('a');
            if (links.length >= 3) {
                links[0].addEventListener('click', (e) => {
                    e.preventDefault();
                    addToCart(productDetails);
                });
                links[2].addEventListener('click', (e) => {
                    e.preventDefault();
                    showQuickView(productDetails);
                });
            }
        }
    });

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if ($cartModal && $cartModal.classList.contains('active')) {
            if (!e.target.closest('[data-cart-toggler]') && !e.target.closest('[data-cart-modal]')) {
                $cartModal.classList.remove('active');
            }
        }
    });

    // Close navbar when clicking outside
    document.addEventListener('click', (e) => {
        if ($navbar && $navbar.classList.contains('active')) {
            if (!e.target.closest('[data-navbar]') && !e.target.closest('[data-nav-toggler]')) {
                $navbar.classList.remove('active');
                $overlay.classList.remove('active');
                document.body.classList.remove('active');
            }
        }
    });
});







// document.addEventListener('DOMContentLoaded', () => {
//     // Get elements
//     const dropdownTogglers = document.querySelectorAll('[data-dropdown-toggler]');

//     // Add click handlers to dropdown togglers
//     dropdownTogglers.forEach(toggler => {
//         toggler.addEventListener('click', function() {
//             // Find the nearest dropdown
//             const dropdown = this.nextElementSibling;
//             if (!dropdown || !dropdown.classList.contains('dropdown')) return;
            
//             // Toggle active class
//             const opening = dropdown.classList.toggle('active');

//             // Toggle an `open` state on the toggler so CSS can respond
//             this.classList.toggle('open', opening);

//             // Get the icon element and toggle a rotation class instead of writing inline styles
//             const icon = this.querySelector('ion-icon');
//             if (icon) {
//                 // Prefer Tailwind classes for transition; add as fallback
//                 icon.classList.add('transition-transform', 'duration-200', 'ease-in-out');
//                 icon.classList.toggle('rotate-90', opening);
//             }
//         });
//     });
// });