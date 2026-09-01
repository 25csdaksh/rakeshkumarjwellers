// Custom Premium Alert Modal Override
window.alert = function(message, callback) {
    const alertModal = document.createElement("div");
    alertModal.className = "custom-alert-modal";
    
    const modalWrapper = document.createElement("div");
    modalWrapper.className = "custom-alert-wrapper";
    
    const title = document.createElement("h3");
    title.innerText = "Rakeshkumar Jewellers";
    
    const content = document.createElement("p");
    content.innerText = message;
    
    const btn = document.createElement("button");
    btn.className = "btn gold custom-alert-btn";
    btn.innerText = "OK";
    
    modalWrapper.appendChild(title);
    modalWrapper.appendChild(content);
    modalWrapper.appendChild(btn);
    alertModal.appendChild(modalWrapper);
    document.body.appendChild(alertModal);
    
    const closeAlert = () => {
        alertModal.style.animation = "fadeOut 0.25s ease forwards";
        modalWrapper.style.animation = "zoomOut 0.25s ease forwards";
        setTimeout(() => {
            alertModal.remove();
            if (typeof callback === "function") {
                callback();
            }
        }, 250);
    };

    btn.onclick = closeAlert;
    
    const handleKeydown = function(e) {
        if (e.key === "Enter" || e.key === "Escape") {
            e.preventDefault();
            closeAlert();
            document.removeEventListener("keydown", handleKeydown);
        }
    };
    document.addEventListener("keydown", handleKeydown);
};

// Dummy Gold Rate (replace with real API later)
const setInitialGoldRate = () => {
    if (document.getElementById("gold24")) {
        document.getElementById("gold24").innerText = "₹6,800 / gram";
        document.getElementById("gold22").innerText = "₹6,250 / gram";
        document.getElementById("silver").innerText = "₹85 / gram";
    }
};

// WhatsApp Business Logic
function sendWhatsApp(event) {
    if (event) event.preventDefault();
    const name = document.getElementById("name").value;
    const mobile = document.getElementById("mobile").value;
    const date = document.getElementById("date") ? document.getElementById("date").value : "";
    const time = document.getElementById("time") ? document.getElementById("time").value : "";
    const purpose = document.getElementById("purpose").value;
    const message = document.getElementById("message") ? document.getElementById("message").value : "";

    const whatsappNumber = "8799288538";
    const text = `*New Appointment Request*%0A%0A` +
        `*Name:* ${name}%0A` +
        `*Mobile:* ${mobile}%0A` +
        `*Date:* ${date}%0A` +
        `*Time:* ${time}%0A` +
        `*Purpose:* ${purpose}%0A` +
        `*Message:* ${message}`;

    const url = `https://wa.me/91${whatsappNumber}?text=${text}`;
    window.open(url, "_blank");
}

// Live Gold Rate
async function fetchGoldRates() {
    if (!document.getElementById("gold24")) return; // Skip if elements don't exist
    try {
        const response = await fetch("https://data-asg.goldprice.org/dbXRates/INR");
        if (!response.ok) throw new Error("API Network Error");

        const data = await response.json();
        if (!data.items || data.items.length === 0) throw new Error("Invalid Data");

        const item = data.items[0];
        const goldPriceOz = item.xauPrice; // Price per Ounce
        const silverPriceOz = item.xagPrice; // Price per Ounce

        // Conversion: 1 Ounce = 31.1035 grams
        const gold24kPerGram = goldPriceOz / 31.1035;
        const gold22kPerGram = gold24kPerGram * 0.9166;
        const silverPerGram = silverPriceOz / 31.1035;

        document.getElementById("gold24").innerText = `₹${Math.floor(gold24kPerGram).toLocaleString()} / gram`;
        document.getElementById("gold22").innerText = `₹${Math.floor(gold22kPerGram).toLocaleString()} / gram`;
        document.getElementById("silver").innerText = `₹${Math.floor(silverPerGram).toLocaleString()} / gram`;

    } catch (err) {
        console.warn("Gold Rate API failed. Using estimated values.", err);
        // Fallback Mock Data (Estimated for 2026)
        if (document.getElementById("gold24")) {
            document.getElementById("gold24").innerText = "₹15,600 / gram";
            document.getElementById("gold22").innerText = "₹14,300 / gram";
            document.getElementById("silver").innerText = "₹335 / gram";
        }
    }
}

// Auth Guard Routing Configuration
const protectedPages = [
    "necklace.html",
    "mangalsutra.html",
    "bangles.html",
    "earrings.html",
    "rings.html",
    "1diamond-jewellery.html",
    "diamond-bracelets.html",
    "diamond-necklace.html",
    "payal.html",
    "pooja.html",
    "silver-bracelets.html",
    "silver-rings.html"
];

function checkAuth() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    if (protectedPages.includes(page)) {
        if (localStorage.getItem("isLoggedIn") !== "true") {
            localStorage.setItem("redirectAfterLogin", page);
            alert("Please Login or Sign Up to view the premium items in this collection!", () => {
                window.location.href = "login.html";
            });
        }
    }
}

// Check authorization immediately on load before rendering to prevent visual flash
checkAuth();

function updateAuthNav() {
    const authNav = document.querySelector(".auth-nav");
    if (!authNav) return;
    
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const themeBtnHtml = `<button class="theme-toggle" onclick="toggleTheme()" title="Toggle Dark/Light Theme">🌓</button>`;
    
    if (isLoggedIn) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        const name = currentUser.name ? currentUser.name.split(" ")[0] : "User";
        const cartKey = "cart_" + currentUser.email;
        const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
        const cartCount = cart.length;
        authNav.innerHTML = `
            <span class="user-welcome-text">Welcome, ${name}</span>
            <a href="profile.html" class="auth-btn-small">Cart (${cartCount})</a>
            <a href="#" onclick="logout(event)" class="auth-btn-small">Logout</a>
            ${themeBtnHtml}
        `;
    } else {
        authNav.innerHTML = `
            <a href="login.html" class="auth-btn-small">Login</a>
            <a href="signup.html" class="auth-btn-small">Sign up</a>
            ${themeBtnHtml}
        `;
    }
}

function logout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    alert("You have logged out successfully!", () => {
        window.location.href = "index.html";
    });
}

function addToCart(title, img, desc) {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        alert("Please Login to add items to your cart!", () => {
            window.location.href = "login.html";
        });
        return;
    }
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const cartKey = "cart_" + currentUser.email;
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    
    if (cart.some(item => item.title === title)) {
        alert(`${title} is already in your cart!`);
        return;
    }
    
    cart.push({ title, img, desc });
    localStorage.setItem(cartKey, JSON.stringify(cart));
    alert(`${title} has been successfully added to your cart!`);
    updateAuthNav();
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

let index = 0;
let slides = [];

const startSlideshow = () => {
    slides = document.querySelectorAll(".slide");
    if (slides.length === 0) return;

    setInterval(() => {
        slides[index].classList.remove("active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");
    }, 3000);
};

// Initialize all scripts when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setInitialGoldRate();
    fetchGoldRates();
    startSlideshow();
    updateAuthNav();

    // Check LocalStorage first, then System Preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    } else if (savedTheme === "light") {
        document.body.classList.remove("dark-mode");
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Fallback to system preference if no saved preference
        document.body.classList.add("dark-mode");
    }

    // Listen for system changes (only if no manual override)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.getItem("theme")) { // Only auto-switch if user hasn't manually set it
            if (event.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });

    // Product Detail Split-Modal Logic
    const modal = document.getElementById("imageModal");
    if (modal) {
        // Define global close helper
        window.closeModal = function() {
            modal.style.display = "none";
        };

        // Attach click event to all product card images
        const images = document.querySelectorAll(".card img");
        images.forEach(img => {
            img.style.cursor = "pointer"; // Indicate clickable
            img.addEventListener("click", function () {
                const card = this.closest(".card");
                if (!card) return;
                
                const titleElement = card.querySelector("h4");
                const descElement = card.querySelector(".product-desc");
                
                const title = titleElement ? titleElement.innerText : "Luxury Jewelry Piece";
                const desc = descElement ? descElement.innerText : "Exquisite handcrafted design using premium precious metals and stones.";
                const imgSrc = this.src;

                // Display modal as a flex container for centering
                modal.style.display = "flex";
                
                // Escape single quotes for safe event arguments
                const safeTitle = title.replace(/'/g, "\\'");
                const safeDesc = desc.replace(/'/g, "\\'");
                
                modal.innerHTML = `
                    <span class="close" onclick="closeModal()">&times;</span>
                    <div class="modal-wrapper">
                        <div class="modal-left">
                            <img src="${imgSrc}" class="modal-product-img" alt="${title}">
                        </div>
                        <div class="modal-right">
                            <h2 class="modal-product-title">${title}</h2>
                            <p class="modal-product-spec">Exclusive Collection</p>
                            <p class="modal-product-desc">${desc}</p>
                            
                            <div class="modal-spec-grid">
                                <div class="modal-spec-item">
                                    <span class="spec-label">Availability</span>
                                    <span class="spec-value">In Stock</span>
                                </div>
                                <div class="modal-spec-item">
                                    <span class="spec-label">Purity Guarantee</span>
                                    <span class="spec-value">BIS Hallmark Certified</span>
                                </div>
                                <div class="modal-spec-item">
                                    <span class="spec-label">Service</span>
                                    <span class="spec-value">Lifetime Exchange Guarantee</span>
                                </div>
                            </div>
                            
                            <button class="btn gold modal-cart-btn" onclick="addToCart('${safeTitle}', '${imgSrc}', '${safeDesc}')">Add to Cart</button>
                        </div>
                    </div>
                `;
            });
        });

        // Click outside to close
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }

    // ========================================================
    // STYLISH SCROLL ANIMATION & INTERACTIVITY SUITE
    // ========================================================
    
    // 0. Royal Grand Door Opening Entrance Animation
    const doorLoader = document.getElementById("royal-door-loader");
    if (doorLoader) {
        document.body.style.overflow = "hidden";
        setTimeout(() => {
            doorLoader.classList.add("opened");
            setTimeout(() => {
                doorLoader.classList.add("fade-out");
                document.body.style.overflow = "";
                setTimeout(() => {
                    doorLoader.style.display = "none";
                }, 600);
            }, 1600);
        }, 1200);
    }
    
    // 1. Inject Top Scroll Progress Bar if missing
    if (!document.getElementById("scroll-progress")) {
        const progressBar = document.createElement("div");
        progressBar.id = "scroll-progress";
        document.body.prepend(progressBar);
    }

    // 2. Inject Back-To-Top Button if missing
    if (!document.getElementById("backToTop")) {
        const bttBtn = document.createElement("div");
        bttBtn.id = "backToTop";
        bttBtn.setAttribute("title", "Scroll to Top");
        bttBtn.innerHTML = `
            <svg class="progress-ring" width="50" height="50">
                <circle cx="25" cy="25" r="23"/>
            </svg>
            <span class="top-arrow-icon">↑</span>
        `;
        document.body.appendChild(bttBtn);

        bttBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    const scrollProgressEl = document.getElementById("scroll-progress");
    const backToTopBtn = document.getElementById("backToTop");
    const circle = backToTopBtn ? backToTopBtn.querySelector("circle") : null;
    const header = document.querySelector(".header");

    const updateScrollState = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        // Update Top Progress Bar
        if (scrollProgressEl) {
            scrollProgressEl.style.width = `${scrollPercent}%`;
        }

        // Update Back to Top Button visibility & SVG ring
        if (backToTopBtn) {
            if (scrollTop > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }

            if (circle) {
                const circumference = 2 * Math.PI * 23; // r = 23 -> 144.5
                const offset = circumference - (scrollPercent / 100) * circumference;
                circle.style.strokeDasharray = `${circumference}`;
                circle.style.strokeDashoffset = `${offset}`;
            }
        }

        // Sticky Navbar Toggle
        if (header) {
            if (scrollTop > 80) {
                header.classList.add("sticky-nav");
            } else {
                header.classList.remove("sticky-nav");
            }
        }
    };

    window.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();

    // 3. Intersection Observer for Scroll Reveals
    const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    // Optionally unobserve if we only want animate once
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 4. Animated Number Counters on Scroll
    const statNumbers = document.querySelectorAll(".stat-number");
    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetVal = parseInt(el.getAttribute("data-target"), 10);
                    const suffix = el.getAttribute("data-suffix") || "";
                    if (!isNaN(targetVal) && !el.classList.contains("counted")) {
                        el.classList.add("counted");
                        let current = 0;
                        const duration = 2000;
                        const stepTime = 20;
                        const increment = Math.max(1, Math.ceil(targetVal / (duration / stepTime)));
                        
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= targetVal) {
                                current = targetVal;
                                clearInterval(timer);
                            }
                            el.innerText = `${current.toLocaleString()}${suffix}`;
                        }, stepTime);
                    }
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => counterObserver.observe(stat));
    }
});

// Wishlist Heart Toggle Helper
function toggleWishlist(btn) {
    if (!btn) return;
    btn.classList.toggle("active");
    if (btn.classList.contains("active")) {
        btn.innerText = "❤️";
        btn.style.color = "#E63946";
    } else {
        btn.innerText = "🤍";
        btn.style.color = "#888888";
    }
}

