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

const content = {
    gu: {
        title: "વિશ્વાસ અને શુદ્ધતાનો વારસો",
        subtitle: "Rakeshkumar Jewellers, Patan"
    },
    en: {
        title: "A Legacy of Trust & Pure Gold Jewellery",
        subtitle: "Rakeshkumar Jewellers, Patan"
    }
};

function setLang(lang) {
    if (document.getElementById("title")) {
        document.getElementById("title").innerText = content[lang].title;
        document.getElementById("subtitle").innerText = content[lang].subtitle;
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    // Save to localStorage
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
    setLang("gu"); // default language
    startSlideshow();

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

    // Lightbox Logic
    const modal = document.getElementById("imageModal");
    if (modal) {
        const modalImg = document.getElementById("img01");
        const captionText = document.getElementById("caption");
        const closeBtn = document.getElementsByClassName("close")[0];

        // Attach click event to all card images
        const images = document.querySelectorAll(".card img");
        images.forEach(img => {
            img.style.cursor = "pointer"; // Indicate clickable
            img.addEventListener("click", function () {
                modal.style.display = "block";
                modalImg.src = this.src;
                // Try to find the caption text from the sibling container h4
                const container = this.nextElementSibling;
                let caption = "";
                if (container && container.querySelector("h4")) {
                    caption = container.querySelector("h4").innerText;
                }
                captionText.innerHTML = caption;
            });
        });

        // Close logic
        closeBtn.onclick = function () {
            modal.style.display = "none";
        }

        // Click outside to close
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
});
