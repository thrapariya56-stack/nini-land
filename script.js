let cart =
    JSON.parse(localStorage.getItem("niniCart")) || [];


/* تبدیل قیمت */

function formatPrice(price) {

    return price.toLocaleString("fa-IR") + " تومان";

}


/* ذخیره سبد خرید */

function saveCart() {

    localStorage.setItem(
        "niniCart",
        JSON.stringify(cart)
    );

}


/* اضافه کردن محصول */

function addToCart(name, price, image) {

    const existing =
        cart.find(item => item.name === name);


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            name: name,

            price: price,

            image: image,

            quantity: 1

        });

    }


    saveCart();

    updateCart();

    showToast();

}


/* نمایش سبد خرید */

function updateCart() {

    const count =
        cart.reduce(
            (sum, item) =>
            sum + item.quantity,
            0
        );


    document.getElementById("cartCount")
        .textContent = count;


    const container =
        document.getElementById("cartItems");


    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                سبد خرید شما خالی است 🛒
            </div>
        `;

    } else {

        container.innerHTML = cart.map(
            (item, index) => `

            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >


                <div class="cart-item-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <span>
                        ${formatPrice(item.price)}
                    </span>


                    <div class="quantity">

                        <button
                            onclick="changeQuantity(${index},1)">
                            +
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity(${index},-1)">
                            −
                        </button>

                    </div>

                </div>


                <button
                    class="remove"
                    onclick="removeItem(${index})">

                    🗑️

                </button>

            </div>

        `
        ).join("");

    }


    const total =
        cart.reduce(
            (sum, item) =>
            sum + item.price * item.quantity,
            0
        );


    document.getElementById("cartTotal")
        .textContent =
        formatPrice(total);

}


/* تغییر تعداد */

function changeQuantity(index, change) {

    cart[index].quantity += change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

    updateCart();

}


/* حذف محصول */

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    updateCart();

}


/* باز کردن سبد */

function openCart() {

    document
        .getElementById("cart")
        .classList.add("open");


    document
        .getElementById("overlay")
        .classList.add("show");

}


/* بستن سبد */

function closeCart() {

    document
        .getElementById("cart")
        .classList.remove("open");


    document
        .getElementById("overlay")
        .classList.remove("show");

}


/* رفتن به محصولات */

function goToProducts() {

    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* فیلتر محصولات */

function filterProducts(category, button) {

    document
        .querySelectorAll(".filter-btn")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    button.classList.add("active");


    document
        .querySelectorAll(".product")
        .forEach(product => {

            if (
                category === "all" ||
                product.dataset.category === category
            ) {

                product.style.display = "block";

            } else {

                product.style.display = "none";

            }

        });

}


/* جستجو */

document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const search =
            this.value.trim().toLowerCase();


        document
            .querySelectorAll(".product")
            .forEach(product => {

                const name =
                    product.dataset.name.toLowerCase();


                if (name.includes(search)) {

                    product.style.display = "block";

                } else {

                    product.style.display = "none";

                }

            });

    });


/* علاقه‌مندی */

function toggleHeart(button) {

    button.classList.toggle("liked");


    if (button.classList.contains("liked")) {

        button.innerHTML = "♥";

    } else {

        button.innerHTML = "♡";

    }

}


/* پیام اضافه شدن */

function showToast() {

    const toast =
        document.getElementById("toast");


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 1800);

}


/* ثبت سفارش واتساپ */

function checkout() {

    if (cart.length === 0) {

        alert(
            "سبد خرید شما خالی است."
        );

        return;

    }


    let message =
        "سلام، برای ثبت سفارش این محصولات را می‌خواهم:%0A%0A";


    cart.forEach(item => {

        message +=
            `🍼 ${item.name} × ${item.quantity}%0A`;

    });


    const total =
        cart.reduce(
            (sum, item) =>
            sum + item.price * item.quantity,
            0
        );


    message +=
        `%0A💰 مبلغ تقریبی: ${formatPrice(total)}`;


    /*
       این شماره را با شماره واتساپ خودت عوض کن.
       بدون + و بدون صفر اول.

       مثال:
       989121234567
    */

    const phone =
        "989121234567";


    window.open(
        `https://wa.me/${phone}?text=${message}`,
        "_blank"
    );

}


/* اجرای اولیه */

updateCart();