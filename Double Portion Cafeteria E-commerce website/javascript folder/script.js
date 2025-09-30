document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const clearCartButton = document.getElementById("clear-cart");
    const emptyCartMessage = document.getElementById("empty-cart-message");
    const checkoutButton = document.getElementById("checkout");
    
    function updateCartDisplay() {
        if (cartContainer) {
            cartContainer.innerHTML = "";
            cart.forEach((item, index) => {
                let cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
                cartItem.innerHTML = `
                    <p>${item.name} - ₦${item.price}</p>
                    <button class="remove-item" data-index="${index}">Remove</button>
                `;
                cartContainer.appendChild(cartItem);
            });

            if (emptyCartMessage) {
                emptyCartMessage.style.display = cart.length === 0 ? 'block' : 'none';
            }

            if (cartContainer) {
                const totalPrice = cart.reduce((total, item) => total + parseFloat(item.price), 0);
                const totalElement = document.createElement("div");
                totalElement.classList.add("cart-total");
                totalElement.innerHTML = `<strong>Total: ₦${totalPrice.toFixed(2)}</strong>`;
                cartContainer.appendChild(totalElement);
            }
        }

        if (cartCount) {
            cartCount.textContent = cart.length;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function showNotification(message) {
        let notification = document.createElement("div");
        notification.textContent = message;
        notification.style.position = "fixed";
        notification.style.top = "20px";
        notification.style.left = "50%";
        notification.style.transform = "translateX(-50%)";
        notification.style.backgroundColor = "rgb(139, 90, 43)";
        notification.style.color = "#fff";
        notification.style.padding = "10px 20px";
        notification.style.borderRadius = "5px";
        notification.style.zIndex = "1000";
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    function addToCart(event) {
        const menuItem = event.target.closest(".menuitem");
        const name = menuItem.querySelector("h3").textContent;
        const price = event.target.getAttribute("data-price");
        
        cart.push({ name, price });
        updateCartDisplay();
        showNotification("Added to cart successfully");
    }

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", addToCart);
    });

    updateCartDisplay();
});
