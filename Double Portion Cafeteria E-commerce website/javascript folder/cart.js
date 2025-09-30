document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const clearCartBtn = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('checkout');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCart() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';

            cart.forEach((item, index) => {
                const div = document.createElement('div');
                div.classList.add('cart-item');
                div.innerHTML = `
                    <p>${item.name} - ₦${item.price}</p>
                    <button class="remove-item" data-index="${index}">Remove</button>
                `;
                cartItemsContainer.appendChild(div);
            });
        }

        cartCount.textContent = cart.length;

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });
    }

    clearCartBtn.addEventListener('click', () => {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        showMessage('Cart cleared!');
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showMessage("Your cart is already empty.");
            return;
        }

        showCheckoutForm();
    });

    function calculateTotal() {
        return cart.reduce((total, item) => total + Number(item.price), 0);
    }

function showCheckoutForm() {
    const total = calculateTotal();

    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <form id="user-info-form" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 25px 30px;
            border-radius: 12px;
            z-index: 1000;
            width: 90%;
            max-width: 420px;
            font-family: 'Segoe UI', sans-serif;
        ">
            <h3 style="margin-bottom: 20px; font-size: 20px; color: #333;">Enter your information</h3>

            <label style="display: block; margin-bottom: 12px;">
                <span style="display:block; margin-bottom: 4px;">Name:</span>
                <input type="text" name="name" required style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc;"/>
            </label>

            <label style="display: block; margin-bottom: 12px;">
                <span style="display:block; margin-bottom: 4px;">Address:</span>
                <input type="text" name="address" required style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc;"/>
            </label>

            <label style="display: block; margin-bottom: 12px;">
                <span style="display:block; margin-bottom: 4px;">Phone Number:</span>
                <input type="tel" name="phone" required style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc;"/>
            </label>

            <label style="display: block; margin-bottom: 12px;">
                <span style="display:block; margin-bottom: 4px;">State:</span>
                <input type="text" name="state" required style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc;"/>
            </label>

            <p style="font-weight: bold; margin-top: 15px;">Total: ₦${total}</p>

            <div style="margin: 15px 0;">
                <p style="margin-bottom: 8px;"><strong>Payment Option:</strong></p>
                <label style="margin-bottom: 8px; display: block;">
                    <input type="radio" name="payment" value="pay_on_delivery" checked>Pay on Delivery
                </label>
                <label style="display: block;">
                    <input type="radio" name="payment" value="pay_now">Pay Now
                </label>
                <p id="pay-now-warning" style="color: red; display: none; margin-top: 5px; font-size: 0.9em;">
                    *This option is currently not available
                </p>
            </div>

            <div style="display: flex; justify-content: space-between; gap: 10px; margin-top: 20px;">
                <button type="submit" id="place-order-btn" style="
                    flex: 1;
                    background-color: #8B5A2B;
                    color: white;
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    Place Order
                </button>
                <button type="button" id="cancel-checkout" style="
                    flex: 1;
                    background-color:rgb(0, 0, 0);
                    color: white;
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    Cancel
                </button>
            </div>
        </form>
    `;
    document.body.appendChild(formContainer);

    const form = formContainer.querySelector('#user-info-form');
    const paymentRadios = form.querySelectorAll('input[name="payment"]');
    const payNowWarning = form.querySelector('#pay-now-warning');
    const placeOrderBtn = form.querySelector('#place-order-btn');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === "pay_now" && radio.checked) {
                payNowWarning.style.display = 'block';
                placeOrderBtn.disabled = true;
                placeOrderBtn.style.cursor = 'not-allowed';
            } else {
                payNowWarning.style.display = 'none';
                placeOrderBtn.disabled = false;
                placeOrderBtn.style.cursor = 'pointer';
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const userInfo = Object.fromEntries(formData.entries());

        console.log("User Info:", userInfo);

        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        formContainer.remove();
        showMessage("Order placed successfully!");
    });

    form.querySelector('#cancel-checkout').addEventListener('click', () => {
        formContainer.remove();
    });
}


    function showMessage(message) {
        const msg = document.createElement('div');
        msg.textContent = message;
        msg.style.position = 'fixed';
        msg.style.top = '50%';
        msg.style.left = '50%';
        msg.style.transform = 'translate(-50%, -50%)';
        msg.style.backgroundColor = " #8B5A2B";
        msg.style.color = 'white';
        msg.style.padding = '15px 25px';
        msg.style.borderRadius = '8px';
        msg.style.zIndex = 1000;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
    }

    

    renderCart();
});
