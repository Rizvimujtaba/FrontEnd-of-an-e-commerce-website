document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const dropdownTogglers = document.querySelectorAll('[data-dropdown-toggler]');

    // Add click handlers to dropdown togglers
    dropdownTogglers.forEach(toggler => {
        toggler.addEventListener('click', function() {
            // Find the nearest dropdown
            const dropdown = this.nextElementSibling;
            if (!dropdown || !dropdown.classList.contains('dropdown')) return;
            
            // Toggle active class
            const opening = dropdown.classList.toggle('active');

            // Toggle an `open` state on the toggler so CSS can respond
            this.classList.toggle('open', opening);

            // Get the icon element and toggle a rotation class instead of writing inline styles
            const icon = this.querySelector('ion-icon');
            if (icon) {
                // Prefer Tailwind classes for transition; add as fallback
                icon.classList.add('transition-transform', 'duration-200', 'ease-in-out');
                icon.classList.toggle('rotate-90', opening);
            }
        });
    });
});