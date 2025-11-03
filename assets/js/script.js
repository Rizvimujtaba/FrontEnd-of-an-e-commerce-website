/** @copyright 2025 Mujtaba
 * @license Apache-2.0
 */
'use strict';

const addEventOnElem =function(elements,eventType,callback) {
    for(let i = 0 ;i<elements.length;i++) {
        elements[i].addEventListener(eventType,callback);
    }
}
const $header = document.querySelector('[data-header]');
const $navbar = document.querySelector('[data-navbar]');
const $navToggler = document.querySelectorAll('[data-nav-toggler]');
const $overlay = document.querySelector('[data-overlay]');
const $dropdownToggler = document.querySelector('[data-dropdown-toggler]');
const $dropdown = document.querySelector('[data-dropdown]');
const $cartToggler = document.querySelector('[data-cart-toggler]');
const $cartModel = document.querySelector('[data-cart-modal]');

const toggleNavbar = function() {
       $navbar.classList.toggle('active');
       $overlay.classList.toggle('active');
       document.body.classList.toggle('active');
}

addEventOnElem($navToggler, 'click', toggleNavbar);


//element toggle function 
const toggleElem = function(elem) {
    elem.classList.toggle('active');
}

//toggle dropdown
$dropdownToggler.addEventListener('click', function() {
    toggleElem($dropdown);});

//toggle cart modal
$cartToggler.addEventListener('click', function() {
    toggleElem($cartModel);});

    // header active when window scroll y to 50 px
    const activeHeader = function() {
        window.scrollY > 50 ? $header.classList.add('active') : $header.classList.remove('active');
    }
    window.addEventListener('scroll', activeHeader);







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