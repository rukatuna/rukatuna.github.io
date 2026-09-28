// ========================================
// 1. 初期設定 & 訪問・リロード検知
// ========================================
const hasVisited = sessionStorage.getItem("oceanVisited");
const opening = document.querySelector(".opening");
const bubbles = document.querySelector(".bubbles");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("header nav");
const overlay = document.querySelector(".menu-overlay");
const topButton = document.querySelector(".top-button");

// 💡最新のスマホでも100%確実にリロード（更新）されたかを精密にキャッチします
let isMobileReload = false;
try {
    const navEntries = window.performance.getEntriesByType("navigation");
    if (navEntries && navEntries.length > 0) {
        const firstEntry = navEntries.at(0); 
        if (firstEntry && firstEntry.type === "reload") {
            isMobileReload = true;
        }
    }
} catch (e) {
    if (window.performance && window.performance.navigation && window.performance.navigation.type === 1) {
        isMobileReload = true;
    }
}

// ========================================
// 2. オープニング演出（実機リロード完全スキップ）
// ========================================
if (opening) {
    if (hasVisited || isMobileReload) {
        opening.style.display = "none";
        opening.style.opacity = "0";
        opening.style.visibility = "hidden";
        opening.style.pointerEvents = "none";
        opening.style.transition = "none";
        document.body.classList.remove("loading");
    } else {
        sessionStorage.setItem("oceanVisited", "true");
        opening.addEventListener("animationend", () => {
            opening.style.pointerEvents = "none";
            document.body.classList.remove("loading");
        });
    }
}

// ========================================
// 3. 泡をランダム生成
// ========================================
if (bubbles) {
    for (let i = 0; i < 100; i++) {
        const span = document.createElement("span");
        span.style.left = Math.random() * 100 + "%";
        const size = Math.random() * 35 + 10;
        span.style.width = size + "px";
        span.style.height = size + "px";
        span.style.animationDuration = (Math.random() * 3 + 3) + "s";
        span.style.animationDelay = (Math.random() * 2) + "s";
        bubbles.appendChild(span);
    }
}

// ========================================
// 4. TOPボタン
// ========================================
if (topButton) {
    topButton.addEventListener("click", () => {
        topButton.classList.add("tap-effect");
        setTimeout(() => {
            topButton.classList.remove("tap-effect");
        }, 1000);
    });
}




// ========================================
// 6. ハンバーガーメニュー
// ========================================
function closeMenu() {
    if (menuButton) menuButton.classList.remove("active");
    if (nav) nav.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
}

if (menuButton && nav && overlay) {
    menuButton.addEventListener("click", () => {
        const isOpen = nav.classList.contains("active");
        if (isOpen) {
            closeMenu();
        } else {
            menuButton.classList.add("active");
            nav.classList.add("active");
            overlay.classList.add("active");
            document.body.classList.add("menu-open");
        }
    });
    overlay.addEventListener("click", () => {
        closeMenu();
    });
}

const menuLinks = document.querySelectorAll("header nav a");
menuLinks.forEach(link => {
    link.addEventListener("click", function () {
        closeMenu();
        menuLinks.forEach(item => { item.classList.remove("active"); });
        this.classList.add("active");
    });
});

if ("scrollRestoration" in history) {
    history.scrollRestoration = "auto";
}

window.addEventListener("pageshow", () => {
    closeMenu();
});

window.addEventListener("scroll", () => {
    if (!topButton) return;
    if (window.scrollY > 300) {
        topButton.style.opacity = "1";
        topButton.style.visibility = "visible";
        topButton.style.transform = "translateY(0)";
    } else {
        topButton.style.opacity = "0";
        topButton.style.visibility = "hidden";
        topButton.style.transform = "translateY(20px)";
    }
});

// ========================================
// 7. スマホ：水中スクロールアニメーション
// ========================================
const mobileSections = document.querySelectorAll("main section");
if (mobileSections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("scroll-show");
            } else {
                entry.target.classList.remove("scroll-show");
            }
        });
    }, { threshold: 0.15 });

    mobileSections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// ============================================================
// 8. スマホ：生き物カードスライダー判定（ドット＆地名完全大復活）
// ============================================================
const animalSliderObj = document.querySelector(".animal-cards");
const animalCardsObj = document.querySelectorAll(".animal-card");
const animalPositionNameObj = document.querySelector(".animal-position-name");
const animalDotsObj = document.querySelectorAll(".animal-dots span");

if (animalSliderObj && animalCardsObj.length > 0) {
    // HTML内のカード（イルカ、ペンギン、クラゲ、ジンベエザメ、ウミガメ、カワウソ）のタイトルを抽出
    const animalNames = Array.from(animalCardsObj).map(card => {
        const title = card.querySelector("h3");
        return title ? title.textContent.trim() : "";
    });

    // 指でスワイプしたときに「画面の真ん中に一番近いカード」をリアルタイム計算する関数
    function updateAnimalPosition() {
        if (window.innerWidth > 768) return; // PC版の時は計算をフリーズして軽量化

        const sliderRect = animalSliderObj.getBoundingClientRect();
        const sliderCenter = sliderRect.left + sliderRect.width / 2;
        let closestCard = null;
        let closestDistance = Infinity;
        let closestIndex = 0;

        animalCardsObj.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(sliderCenter - cardCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestCard = card;
                closestIndex = index;
            }
        });

        // 中央のカードだけに立体感や明るさを与えるための中央クラス切り替え
        animalCardsObj.forEach(card => { card.classList.remove("is-center"); });
        if (closestCard) closestCard.classList.add("is-center");

        // テキストとネオンドットを連動して光らせる
        if (animalPositionNameObj && animalNames[closestIndex]) {
            animalPositionNameObj.textContent = "● " + animalNames[closestIndex];
        }
        if (animalDotsObj.length > 0) {
            animalDotsObj.forEach((dot, index) => {
                dot.classList.toggle("active", index === closestIndex);
            });
        }
    }

    // スクロール時のガタつきを防ぐためのタイマー制御（水中クッション補正）
    let animalScrollTimer;
    animalSliderObj.addEventListener("scroll", () => {
        updateAnimalPosition();
        clearTimeout(animalScrollTimer);
        animalScrollTimer = setTimeout(updateAnimalPosition, 80);
    }, { passive: true });

    // 画面を開いた瞬間に一度初期位置でドットを光らせる
    updateAnimalPosition();
}




// ========================================
// 9. スマホ：イベントカードスライダー判定
// ========================================
const eventSlider = document.querySelector(".event-cards");
const eventCards = document.querySelectorAll(".event-card");
const eventPositionName = document.querySelector(".event-position-name");
const eventDots = document.querySelectorAll(".event-dots span");

if (eventSlider && eventCards.length > 0) {
    const eventNames = Array.from(eventCards).map(card => {
        const title = card.querySelector("h3");
        return title ? title.textContent.trim() : "";
    });

    function updateEventPosition() {
        const sliderRect = eventSlider.getBoundingClientRect();
        const sliderCenter = sliderRect.left + sliderRect.width / 2;
        let closestCard = null;
        let closestDistance = Infinity;
        let closestIndex = 0;

        eventCards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(sliderCenter - cardCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestCard = card;
                closestIndex = index;
            }
        });

        eventCards.forEach(card => { card.classList.remove("is-center"); });
        if (closestCard) closestCard.classList.add("is-center");

        if (eventPositionName && eventNames[closestIndex]) {
            eventPositionName.textContent = "● " + eventNames[closestIndex];
        }
        eventDots.forEach((dot, index) => {
            dot.classList.toggle("active", index === closestIndex);
        });
    }

    let eventScrollTimer;
    eventSlider.addEventListener("scroll", () => {
        updateEventPosition();
        clearTimeout(eventScrollTimer);
        eventScrollTimer = setTimeout(updateEventPosition, 80);
    }, { passive: true });

    updateEventPosition();
}

// 💡 スクロール連動背景エフェクト（ここが綺麗に繋がりました）
let lastScrollY = window.scrollY;
let scrollSpeed = 0;
window.addEventListener("scroll", () => {
    const currentY = window.scrollY;
    scrollSpeed = Math.abs(currentY - lastScrollY);
    document.documentElement.style.setProperty("--scroll-speed", Math.min(scrollSpeed, 30));
    lastScrollY = currentY;
});

// ========================================
// 10. 入場料金：アニメーション＆タップ演出
// ========================================
const priceCards = document.querySelectorAll('.price-card');
if (priceCards.length > 0) {
    priceCards.forEach((card, index) => {
        const price = card.querySelector('p');
        if (!price) return;
        setTimeout(() => { price.classList.add('price-shine'); }, index * 500);
    });

    setTimeout(() => {
        priceCards.forEach(card => {
            const price = card.querySelector('p');
            if (!price) return;
            price.classList.remove('price-shine');
            price.classList.add('price-pulse');
        });
    }, 500 * (priceCards.length - 1) + 1000);
}

// ========================================
// 11. チケット予約システム（リアルタイム計算・開閉）
// ========================================
const triggerBtn = document.getElementById("trigger-booking-form");
const bookingContainer = document.getElementById("booking-form-container");
const bookingCloseBtn = document.getElementById("booking-form-close");

function closeBookingForm() {
    if (!bookingContainer || !triggerBtn) return;
    bookingContainer.classList.remove("open");
    const btnArrow = triggerBtn.querySelector(".btn-arrow");
    const btnText = triggerBtn.querySelector(".btn-text");
    if (btnArrow) btnArrow.textContent = "↓";
    if (btnText) btnText.textContent = "WEBチケットのオンライン予約はこちら";
}

if (triggerBtn && bookingContainer) {
    triggerBtn.addEventListener("click", () => {
        const isOpen = bookingContainer.classList.contains("open");
        if (isOpen) {
            closeBookingForm();
        } else {
            bookingContainer.classList.add("active-open");
            bookingContainer.classList.add("open");
            const btnArrow = triggerBtn.querySelector(".btn-arrow");
            const btnText = triggerBtn.querySelector(".btn-text");
            if (btnArrow) btnArrow.textContent = "↑";
            if (btnText) btnText.textContent = "入力フォームを閉じる";
            setTimeout(() => {
                bookingContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    });
}

if (bookingCloseBtn) {
    bookingCloseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeBookingForm();
    });
}

const inputAdult = document.getElementById("count-adult");
const inputTeen = document.getElementById("count-teen");
const inputChild = document.getElementById("count-child");
const inputInfant = document.getElementById("count-infant");
const previewUsers = document.getElementById("total-preview-users");
const previewPrice = document.getElementById("total-preview-price");

function calculateTotalBooking() {
    if (!inputAdult || !inputTeen || !inputChild || !inputInfant) return;
    const priceAdult = 1800;
    const priceTeen = 1200;
    const priceChild = 800;
    const qtyAdult = parseInt(inputAdult.value) || 0;
    const qtyTeen = parseInt(inputTeen.value) || 0;
    const qtyChild = parseInt(inputChild.value) || 0;
    const qtyInfant = parseInt(inputInfant.value) || 0;

    const totalUsers = qtyAdult + qtyTeen + qtyChild + qtyInfant;
    const totalPrice = (qtyAdult * priceAdult) + (qtyTeen * priceTeen) + (qtyChild * priceChild);

    if (previewUsers) previewUsers.textContent = totalUsers + " 名";
    if (previewPrice) previewPrice.textContent = totalPrice.toLocaleString() + " 円";
}

[inputAdult, inputTeen, inputChild, inputInfant].forEach(input => {
    if (input) {
        input.addEventListener("input", calculateTotalBooking);
        input.addEventListener("change", calculateTotalBooking);
    }
});

const bookingForm = document.getElementById("aquarium-booking-form");
const successModal = document.getElementById("success-modal");

if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const qtyAdult = parseInt(inputAdult.value) || 0;
        const qtyTeen = parseInt(inputTeen.value) || 0;
        const qtyChild = parseInt(inputChild.value) || 0;
        if (qtyAdult + qtyTeen + qtyChild === 0) {
            alert("ご来館人数を1名以上選択してください。");
            return;
        }
        if (successModal) {
            successModal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    });
}

if (successModal) {
    const successModalCloseBtn = successModal.querySelector(".event-modal-btn-close, .event-modal-close");
    if (successModalCloseBtn) {
        successModalCloseBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            successModal.classList.remove("active");
            document.body.style.overflow = "";
        });
    }
}

// ➖ ➕ ボタンのクリック連動
document.addEventListener("DOMContentLoaded", () => {
    const plusButtons = document.querySelectorAll(".btn-plus");
    const minusButtons = document.querySelectorAll(".btn-minus");

    function updateButtonStates(input) {
        if (!input) return;
        const targetId = input.id;
        const plusBtn = document.querySelector(`.btn-plus[data-target="${targetId}"]`);
        const minusBtn = document.querySelector(`.btn-minus[data-target="${targetId}"]`);
        const currentValue = parseInt(input.value) || 0;
        const max = parseInt(input.getAttribute("max")) || 10;
        const min = parseInt(input.getAttribute("min")) || 0;

        if (plusBtn) plusBtn.classList.toggle("is-disabled", currentValue >= max);
        if (minusBtn) minusBtn.classList.toggle("is-disabled", currentValue <= min);
    }

    plusButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");
            const input = document.getElementById(targetId);
            if (input) {
                let currentValue = parseInt(input.value) || 0;
                let max = parseInt(input.getAttribute("max")) || 10;
                if (currentValue < max) {
                    input.value = currentValue + 1;
                    calculateTotalBooking();
                    updateButtonStates(input);
                }
            }
        });
    });

    minusButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");
            const input = document.getElementById(targetId);
            if (input) {
                let currentValue = parseInt(input.value) || 0;
                let min = parseInt(input.getAttribute("min")) || 0;
                if (currentValue > min) {
                    input.value = currentValue - 1;
                    calculateTotalBooking();
                    updateButtonStates(input);
                }
            }
        });
    });

    document.querySelectorAll(".booking-form-inner input[type='number']").forEach(input => {
        updateButtonStates(input);
    });
});

// ============================================================
// 12. 📱 生き物図鑑システム（スクロールロック・ドレスアップ）
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    const animalCardsList = document.querySelectorAll(".animal-card");
    const animalModal = document.getElementById("animal-detail-modal");
    const closeAnimalModalElements = document.querySelectorAll(".animal-modal-close, .animal-modal-btn-close, .animal-modal-overlay");

    const modalImg = document.getElementById("modal-animal-img");
    const modalName = document.getElementById("modal-animal-name");
    const modalDesc = document.getElementById("modal-animal-desc");
    const modalZone = document.getElementById("modal-animal-zone");
    const modalRarity = document.getElementById("modal-animal-rarity");
    const modalHabitat = document.getElementById("modal-animal-habitat");
    const modalDiet = document.getElementById("modal-animal-diet");

    const animalDatabase = {
        "イルカ": {
            zone: "表層〜中層 (0m〜200m)", habitat: "世界中の温帯・熱帯の海", diet: "魚類・イカ・タコ", rarity: "★★★☆☆",
            desc: "高い知能と豊かな感情を持ち、ジャンプや多彩なパフォーマンスで水族館の主役として愛されるイルカ。エコーロケーション（超音波）を使って暗い水中でも物体の形や距離を正確に把握することができます。",
            trivia: "イルカは寝るとき、右脳と左脳を『半分ずつ』交互に眠らせています！半分眠りながらも、もう半分の脳で息をするために水面へ泳ぎ、敵が来ないか見張りを続けているんです。",
            position: "40% 20%"
        },
        "ペンギン": {
            zone: "陸上〜水深300m", habitat: "南半球の沿岸地域・南極", diet: "オキアミ・小魚・イカ", rarity: "★★★☆☆",
            desc: "陸上をヨチヨチと歩く姿がコミカルで愛らしいペンギンですが、水中に入るとまるで鳥が空を飛ぶかのように超高速で自由自在に泳ぎ回る『水中飛行の達人』です。",
            trivia: "ペンギンはあんなに激しく水中を泳ぎ回っても、実は『一滴も体が水で濡れません』！ウロコのように超密集した羽毛に自分の脂を塗りたくっているため、完全防水の宇宙服を着ているような状態です。",
            position: "center 30%"
        },
        "クラゲ": {
            zone: "表層〜深海層 (0m〜数千m)", habitat: "世界中のあらゆる海域", diet: "プランクトン・小型甲殻類", rarity: "★★★☆☆",
            desc: "淡い光を透き通る体に通し、ゆらゆらと海中を漂う神秘的なクラゲ. 脳や心臓を持たず、波の感覚と光の刺激だけで生きているミステリアスな生き物です。",
            trivia: "クラゲには脳も心臓も血管もありません！心臓の代わりに全身の細胞が同時にパタパタと拍動して水分を巡らせ、脳の代わりに張り逃らされた神経の網だけで全身をコントロールしています。",
            position: "center 50%"
        },
        "ジンベエザメ": {
            zone: "表層〜中深海層 (0m〜1000m)", habitat: "世界中の熱帯・温帯の開放海域", diet: "プランクトン・小魚の群れ", rarity: "★★★★★",
            desc: "魚類の中で世界最大サイズを誇る、海の王様。体長は10メートルを超えますが、性格は非常に穏やかで、大きな口を開けて海水を飲み込みながら小さなエサをこし取って食べます。",
            trivia: "ジンベエザメのチャームポイントである『白い水玉模様』は、人間でいう『指紋』と全く同じです！1匹ずつ模様の配列が完全に異なっており、AIの画像認識で個体を識別して調査されています。",
            position: "72% 15%"
        },
                "ウミガメ": {
            zone: "表層〜水深200m", habitat: "世界中の温暖な外洋・砂浜", diet: "クラゲ・海藻・甲殻類", rarity: "★★★★☆",
            desc: "数千キロもの距離を旅する、海の偉大な冒険家。優雅に水中を羽ばたくように泳ぐ姿は、古代から海の守り神として世界中で大切にされてきました。",
            trivia: "ウミガメが産卵のときに涙を流すのは、感動しているわけではありません！海水をたくさん飲み込むため、体内に溜まった余分な『塩分』を、目の横にある腺からネバネバした涙として一生懸命外に排出しているんです。",
            position: "65% 45%"
        },
        "カワウソ": {
            zone: "陸上〜淡水・沿岸水域", habitat: "アジアの河川・湿地帯・沿岸", diet: "魚類・カエル・甲殻類", rarity: "★★★★☆",
            desc: "非常に器用な手先と抜群 of 運動神経を持つ、水辺のやんちゃな人気者。仲間同士で鳴き声を掛け合い、滑り台のように滑って遊ぶなど非常に社会性が高い生態をしています。",
            trivia: "カワウソの毛密度は動物界でトップクラスに凄まじく、1平方センチメートルになんと『約5万本』も生えています！この超濃密な毛の間に空気の層を作ることで、冷たい水の中でも体温を1ミリも奪われません。",
            position: "30% 25%"
        }
    };

// 💡 修正ポイント：指でスワイプした際、スワイプマーク（.scroll-hint）だけは
//    JavaScriptのスクロール計算対象から「100%完全に除外」して、画面中央に静止させます。
function safeBlockScroll(e) {
    if (animalModal && animalModal.classList.contains("active")) {
        if (!e.target.closest(".animal-modal-content")) { 
            e.preventDefault(); 
        }
    }
    
    // 💡【追加：防衛ガード】スワイプマークに触れた、またはその上で指が動いた時は、
    //    カードの移動命令をマークに絶対に伝達させないように即座に遮断します。
    if (e.target.closest(".scroll-hint")) {
        e.stopPropagation();
    }
}


    if (animalCardsList.length > 0) {
        animalCardsList.forEach(card => {
            card.addEventListener("click", () => {
                const cardImg = card.querySelector("img");
                const cardImgSrc = cardImg ? cardImg.src : "";
                const cardNameText = card.querySelector("h3") ? card.querySelector("h3").textContent.trim() : "";
                const cardShortDesc = card.querySelector("p") ? card.querySelector("p").textContent.trim() : "";
                const detailData = animalDatabase[cardNameText];

                if (modalImg) { 
                    modalImg.src = cardImgSrc; 
                    modalImg.alt = cardNameText;
                    if (window.innerWidth >= 769 && detailData && detailData.position) {
                        modalImg.style.objectPosition = detailData.position;
                    } else {
                        modalImg.style.objectPosition = "center center";
                    }
                }
                
                if (modalName) modalName.textContent = cardNameText;
                if (modalDesc) modalDesc.textContent = detailData ? detailData.desc : cardShortDesc;

                const oldTrivia = document.querySelector(".animal-trivia-box");
                if (oldTrivia) oldTrivia.remove();

                if (detailData) {
                    if (modalZone) modalZone.textContent = detailData.zone;
                    if (modalHabitat) modalHabitat.textContent = detailData.habitat;
                    if (modalDiet) modalDiet.textContent = detailData.diet;
                    const resRarity = document.getElementById("animal-rarity") || modalRarity;
                    if (resRarity) resRarity.textContent = detailData.rarity;
                    
                    const triviaBox = document.createElement("div");
                    triviaBox.className = "animal-trivia-box";
                    triviaBox.innerHTML = `<span class="trivia-label">💡 豆知識</span><p id="modal-animal-trivia">${detailData.trivia}</p>`;
                    if (modalDesc && modalDesc.parentNode) {
                        modalDesc.parentNode.insertBefore(triviaBox, modalDesc.nextSibling);
                    }
                }

    if (animalModal) {

    /* 📱 スマホでは図鑑をbody直下へ移動
       → どの位置で開いてもスマホ画面中央を基準にする */
    if (window.innerWidth <= 768) {
        document.body.appendChild(animalModal);

        if (typeof closeMenu === "function") {
            closeMenu();
        }

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        window.addEventListener("wheel", safeBlockScroll, { passive: false });
        window.addEventListener("touchmove", safeBlockScroll, { passive: false });
    }

    setTimeout(() => {
        animalModal.classList.add("active");
    }, 10);
}
            });
        });
    }

    closeAnimalModalElements.forEach(element => {
        if (element) {
            element.addEventListener("click", (e) => {
                e.stopPropagation();
    if (animalModal) {
    animalModal.classList.remove("active");

    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    window.removeEventListener("wheel", safeBlockScroll, { passive: false });
    window.removeEventListener("touchmove", safeBlockScroll, { passive: false });
}
            });
        }
    });
});

// ============================================================
// 13. イベント詳細解説ポップアップシステム（フワッとアニメーション復活版）
// ============================================================
(function() {
    const eventCardsElements = document.querySelectorAll(".event-card");
    const eModal = document.getElementById("event-detail-modal");
    const closeElements = document.querySelectorAll(".event-modal-close, .event-modal-btn-close, .event-modal-overlay");

    const mIcon = document.getElementById("modal-event-icon");
    const mTitle = document.getElementById("modal-event-title");
    const mDesc = document.getElementById("modal-event-desc");
    const mTime = document.getElementById("modal-event-time");
    const mPlace = document.getElementById("modal-event-place");

    const eventDatabase = {
        "イルカショー": {
            place: "3F メインパフォーマンスプール",
            desc: "ダイナミックなハイジャンプや、トレーナーと息を合わせた華麗な水中ダンスなど、大迫力のパフォーマンスをお届けします。イルカたちの驚異的な身体能力と高い知能を間近で体感できる、当館一番人気のメインイベントです！",
            trivia: "濡れたい方は前列1〜3列目がおすすめ！ポンチョは必須ですがイルカたちの力強い水しぶきを正面から浴びられます。全体のフォーメーションを綺麗に撮影したい方は、5列目中央がベストポジションです。"
        },
        "ペンギンのお散歩": {
            place: "1F ペンギンコースト",
            desc: "ヨチヨチ歩きのペンギンたちが、あなたのすぐ目の前を行進する大人気イベント！一羽一羽の名前や歩き方のクセ、性格の違いなどを飼育員が楽しく生解説する、癒やし度満点の時間です。",
            trivia: "通路の最前列でしゃがんでカメラを構えていると、ペンギンがトコトコと目の前まで覗き込みに来てくれる高確率なチャンスがありますよ！"
        },
        "ナイトアクアリウム": {
            place: "館内全域（大水槽メイン）",
            desc: "<span class='event-limited-tag'>夏季限定：7月18日(土) 〜 8月31日(月)の土日祝</span><br><br>日が沈んだ夜だけの、幻想的にライトアップされた水族館を開放。青い月の光のような照明に照らされ、昼間とは全く異なる動きを見せる海の生き物たちの「夜の生態」をじっくり観察できる特別なひとときです。",
            trivia: "夜になると、昼間は岩陰でじっとしていたサメやエイなどの大型魚が活発に泳ぎ回り始めます。巨大大水槽の前は照明がオーロラのように揺らめき、最高の特等席になります。"
        },
        "クラゲ幻想展示": {
            place: "2F クラゲリウム",
            desc: "何千匹ものクラゲがLED照明によって色鮮やかに照らされ、鏡張りの空間で無限に広がるような幻想的な世界を体験できます。心落ち着くヒーリングミュージックとともに、究極の癒し空間をお楽しみください。",
            trivia: "展示室の中央にある円柱水槽は、光の色がゆっくりとグラデーション変化します。カメラの露出を少し暗めに設定して撮ると、クラゲの輪郭がネオンのようにクッキリと美しく写りますよ。"
        },
        "エサやり体験": {
            place: "館内各セクション（特設受付）",
            desc: "当日の先着順で、水族館の大人気アイドルたちに直接ごはんをあげることができる特別なふれあい体験イベントです！生き物たちの器用な手先や、エサを食べる迫力満点の瞬間を特等席で観察してみましょう。",
            trivia: "【🐬 本日のエサやり体験スケジュール】<br><br>• <span class='event-limited-tag'>イルカのエサやり</span><br> ⏰ 11:30 / 15:30（各回20名）<br> 📍 3F メインプール特設デッキ<br><br>• <span class='event-limited-tag'>カワウソのごはんタイム</span><br> ⏰ 12:00 / 16:00（各回15名）<br> 📍 1F カワウソの森・ふれあい広場<br><br>• <span class='event-limited-tag'>ウミガメのレタス給餌</span><br> ⏰ 14:00（各回10名）<br> 📍 2F ウミガメ回遊水槽プール<br><br>※エサやり体験は開始15分前より各現地の特設受付にて整理券を配布いたします。大変人気のためお早めにお集まりください！"
        },
        "海の生き物教室": {
            place: "1F レクチャールーム",
            desc: "飼育員が海の生き物たちの不思議な生態について、実際の標本や映像を使いながらクイズを交えて楽しく解説するアカデミックな教室です。お子様の自由研究や、大人の知的好奇心を刺激するプログラムが満載！",
            trivia: "質問コーナーでは、普段は聞けない水族館の裏側の裏話や、飼育員しか知らない生き物たちのウラ話を聞くことができます。積極的に手を挙げると、特製の水族館オリジナルステッカーがもらえるかも！？"
        }
    };

    if (eventCardsElements.length > 0 && eModal) {
        eventCardsElements.forEach(card => {
            card.style.cursor = "pointer";
            card.addEventListener("click", () => {
                const cIcon = card.querySelector(".event-icon") ? card.querySelector(".event-icon").textContent.trim() : "🐬";
                const cTitle = card.querySelector("h3") ? card.querySelector("h3").textContent.trim() : "";
                const cTime = card.querySelector(".time") ? card.querySelector(".time").textContent.trim() : "";
                const cShortDesc = card.querySelector("p") ? card.querySelector("p").textContent.trim() : "";
                const dData = eventDatabase[cTitle];

                if (mIcon) mIcon.innerHTML = cIcon;
                if (mTitle) mTitle.innerHTML = cTitle;
                if (mTime) mTime.innerHTML = cTime;

                const oldEventTrivia = document.querySelector(".event-trivia-box");
                if (oldEventTrivia) oldEventTrivia.remove();

                if (dData) {
                    if (mPlace) mPlace.innerHTML = dData.place;
                    if (mDesc) mDesc.innerHTML = dData.desc;
                    const triviaBox = document.createElement("div");
                    triviaBox.className = "event-trivia-box";
                    triviaBox.innerHTML = `<span class="event-trivia-label">💡 おすすめの特等席・注目ポイント</span><p id="modal-event-trivia">${dData.trivia}</p>`;
                    mDesc.parentNode.insertBefore(triviaBox, mDesc.nextSibling);
                } else {
                    if (mPlace) mPlace.innerHTML = "館内各セクション";
                    if (mDesc) mDesc.innerHTML = cShortDesc;
                    const triviaBox = document.createElement("div");
                    triviaBox.className = "event-trivia-box";
                    triviaBox.innerHTML = `<span class="event-trivia-label">💡 おすすめの特等席・注目ポイント</span><p id="modal-event-trivia">開始10分前には会場にお集まりいただくと、見やすい正面の席が確保しやすくおすすめです。</p>`;
                    mDesc.parentNode.insertBefore(triviaBox, mDesc.nextSibling);
                }

                // 💡 モーダルをbody直下へ移動
                document.body.appendChild(eModal);

                if (typeof closeMenu === "function") {
                    closeMenu();
                }

                // 💡【フワッと出す解決策】：
                // 移動完了をブラウザに認識させるため、ほんのわずか（10ミリ秒）遅らせてクラスを付与
                setTimeout(() => {
                    eModal.classList.add("active");
                }, 10);
            });
        });

        closeElements.forEach(el => {
            if (el) {
                el.addEventListener("click", (e) => {
                    e.stopPropagation();
                    eModal.classList.remove("active");
                    document.body.style.overflow = "";
                    document.documentElement.style.overflow = "";
                });
            }
        });
    }
})();



// ========================================
// 14. お知らせ詳細ポップアップシステム
// ========================================
(function() {
    const newsItems = document.querySelectorAll(".news-item");
    const nModal = document.getElementById("news-detail-modal");
    const closeElements = nModal ? nModal.querySelectorAll(".event-modal-close, .event-modal-btn-close, .event-modal-overlay") : [];

    const mDate = document.getElementById("modal-news-date");
    const mTitle = document.getElementById("modal-news-title");
    const mBody = document.getElementById("modal-news-body");

    const newsDatabase = {
        "夏限定イベント「ナイトアクアリウム」を開催します。": {
            body: "日が沈んだ夜だけの、幻想的にライトアップされた水族館を開放。青い月の光のような照明に照らされ、昼間とは全く異なる動きを見せる海の生き物たちの「夜の生態」をじっくり観察できる特別なひとときです。<br><br>夜になると、昼間は岩陰でじっとしていたサメやエイなどの大型魚が活発に泳ぎ回り始めます。巨大大水槽の前は照明がオーロラのように揺らめき、最高の特等席になります。特に<span class='news-neon-mint'>「クラゲリウム」</span>では、夜間限定のスペシャルライトアップにより、クラゲたちが夜空の星のように妖艶に輝く圧倒的な絶景空間をお楽しみいただけます。<br><br><span class='event-limited-tag'>【開催期間】2026年7月18日(土) 〜 8月31日(月)の土日祝</span>",
        },
        "新しい仲間「ジンベエザメ」が展示に加わりました。": {
            body: "Blue Ocean Aquariumに、当館初となる「ジンベエザメ」が新しく仲間に加わりました！<br>魚類最大級の圧倒的なスケールと、優雅に大水槽を回遊する姿は迫力満点です。<br><br>毎日決まった時間に開催される<span class='news-neon-mint'>「ジンベエザメの大迫力ごはんタイム」</span>では、大きな口を水面に向けて垂直に立ち上がり、何十リットルもの海水と一緒にエサを豪快に吸い込む、ここでしか見られない驚きの瞬間を間近でご覧いただけます。ぜひ新しいアイドルに会いに来てください！"
        },
        "営業時間変更のお知らせ。": {
            body: "いつもBlue Ocean Aquariumをご愛顧いただき、誠にありがとうございます。<br><br>当館では、夏のきらめく思い出をより長く館内で楽しんでいただけるよう、夏休みの期間限定で営業時間を1時間拡大する<span class='news-neon-mint'>「夏季特別夜間営業」</span>を実施いたします！<br>昼間の爽やかな雰囲気から、夕暮れ・夜にかけてドラマチックに表情を変える深海の世界を、いつもよりゆったりとお楽しみください。<br><br><span class='event-limited-tag'>【対象期間】2026年7月15日(水) 〜 8月31日(土)</span><br><br><div style='background: rgba(0, 15, 35, 0.4); border: 1px solid rgba(141, 232, 255, 0.2); border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;'><span style='font-size: 13px; color: rgba(141, 232, 255, 0.6); display: block; letter-spacing: 1px; margin-bottom: 5px;'>⏳ 変更後の営業時間</span><span class='news-neon-mint' style='font-size: 26px; display: block;'>9:00 〜 18:00</span><span style='font-size: 13px; color: #d9f7ff; display: block; margin-top: 5px;'>（※最終入館 17:30 / 通常は17:00まで）</span></div>ご家族やご友人の皆さまで、特別な夏のひとときを当館でお過ごしください。ご来館を心よりお待ちしております。"
        }
    };

    if (newsItems.length > 0 && nModal) {
        newsItems.forEach(item => {
            item.addEventListener("click", () => {
                const cDate = item.querySelector(".date") ? item.querySelector(".date").textContent.trim() : "2026.07.20";
                const cTitle = item.querySelector("p") ? item.querySelector("p").textContent.trim() : "";
                const dData = newsDatabase[cTitle];

                if (mDate) mDate.innerHTML = cDate;
                if (mTitle) mTitle.innerHTML = cTitle;
                if (mBody) mBody.innerHTML = dData ? dData.body : "誠に恐れ入りますが、該当するお知らせの詳細情報が見つかりませんでした。";

                nModal.classList.add("active");
                document.body.style.overflow = "hidden";
            });
        });

        closeElements.forEach(el => {
            el.addEventListener("click", (e) => {
                e.stopPropagation();
                nModal.classList.remove("active");
                document.body.style.overflow = "";
            });
        });
    }
})();

// ========================================
// 15. お問い合わせモーダル
// ========================================
const envWrapper = document.getElementById("envelope-wrapper");
const contactModal = document.getElementById("contact-form-modal");
const closeContactModalElements = document.querySelectorAll(".contact-modal-close-trigger");

if (envWrapper && contactModal) {

    envWrapper.addEventListener("click", () => {

        // ★ モーダルを封筒の中からbodyへ移動
        // これでスマホの封筒サイズに影響されなくなる
        document.body.appendChild(contactModal);

        // 封筒を開く
        envWrapper.classList.add("open");

        setTimeout(() => {

            // モーダル表示
            contactModal.classList.add("active");



        }, 300);
    });


    // 閉じるボタン・背景クリック
    closeContactModalElements.forEach(element => {

        element.addEventListener("click", (e) => {

            e.stopPropagation();

            // モーダルを閉じる
            contactModal.classList.remove("active");

            // スクロール解除
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";

            // 少し待って封筒を閉じる
            setTimeout(() => {
                envWrapper.classList.remove("open");
            }, 400);

        });

    });
}

// ============================================================
// 🌊 水中フェードイン・スクロール自動感知システム（追記版）
// ============================================================
// 💡 ユーザーが下にスクロールして、各セクション（sectionタグ）が画面の
//    下側に差し掛かった瞬間にそれを感知し、順番にフワッと浮かび上がらせます。

document.addEventListener("DOMContentLoaded", () => {
    // 1. 動きをつけたいすべてのセクション（mainの中の全section）をターゲットとして登録
    const sections = document.querySelectorAll("main section");

    // 2. 画面内に入ってきたかをチェックする「監視カメラ（Observer）」のルールを設定
    const observerOptions = {
        root: null,        /* 基準にするのはブラウザの画面全体 */
        rootMargin: "0px", /* 画面の枠ぴったりに設定 */
        threshold: 0.1     /* セクションの「10%」が画面にチラッと見えた瞬間に発動 */
    };

    // 3. 画面内に入ってきたときのおもてなし処理
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // 💡 セクションが画面内に10%以上入ってきた場合
            if (entry.isIntersecting) {
                // セクションの箱に「.scroll-show」クラスをガチッと付与
                entry.target.classList.add("scroll-show");
                
                // 一度フワッと出終わったら、無駄な処理を止めるためにこのセクションの監視を終了（軽量化）
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 4. すべてのセクションに対して、実際に監視カメラを起動
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});


// ============================================================
// 【共通】×ボタンのインタラクション（PC・スマホ挙動同期パッチ）
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    // サイト内のすべての閉じるボタンをターゲットとして登録
    const allCloseButtons = document.querySelectorAll(".animal-modal-close, .event-modal-close, #booking-form-close");

    allCloseButtons.forEach(button => {
        // スマホで指が触れた瞬間、またはマウスが押し込まれた瞬間にネオンを覚醒
        button.addEventListener("touchstart", function() {
            this.classList.add("is-spinning");
        }, { passive: true });

        button.addEventListener("mousedown", function() {
            this.classList.add("is-spinning");
        });

        // 指が離れた、またはクリックが終わった瞬間にクラスを解除
        const removeSpin = () => {
            setTimeout(() => {
                button.classList.remove("is-disabled", "is-spinning");
            }, 350); // アニメーションの余韻を感じさせた後にリセット
        };

        button.addEventListener("touchend", removeSpin, { passive: true });
        button.addEventListener("mouseup", removeSpin);
        button.addEventListener("mouseleave", removeSpin);
    });
});


// ============================================================
// 【アニメーション同期】お知らせ・イベント・お問い合わせ 閉じる処理パッチ
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. イベントモーダルの閉じるボタン同期 ---
    const eventModal = document.getElementById("event-detail-modal");
    const closeEventElements = document.querySelectorAll(".event-modal-close, .event-modal-btn-close, .event-modal-overlay");
    
    closeEventElements.forEach(el => {
        if (el) {
            el.addEventListener("click", (e) => {
                e.stopPropagation();
                // 💡 ほんの一瞬だけ待つことで、スマホのタップ回転（is-spinning）を画面に焼き付けてから閉じます
                setTimeout(() => {
                    if (eventModal) eventModal.classList.remove("active");
                    document.body.style.overflow = "";
                    document.documentElement.style.overflow = "";
                }, 10);
            });
        }
    });

    // --- 2. お知らせモーダルの閉じるボタン同期 ---
    const newsModal = document.getElementById("news-detail-modal");
    const closeNewsElements = newsModal ? newsModal.querySelectorAll(".event-modal-close, .event-modal-btn-close, .event-modal-overlay") : [];

    closeNewsElements.forEach(el => {
        el.addEventListener("click", (e) => {
            e.stopPropagation();
            setTimeout(() => {
                if (newsModal) newsModal.classList.remove("active");
                document.body.style.overflow = "";
            }, 10);
        });
    });

    // --- 3. お問い合わせモーダル（白封筒）の閉じるボタン同期 ---
    const contactModal = document.getElementById("contact-form-modal");
    const envWrapper = document.getElementById("envelope-wrapper");
    const closeContactElements = document.querySelectorAll(".contact-modal-close-trigger");

    closeContactElements.forEach(element => {
        element.addEventListener("click", (e) => {
            e.stopPropagation();
            
            setTimeout(() => {
                // モーダルを滑らかにフェードアウト
                if (contactModal) contactModal.classList.remove("active");
                document.body.style.overflow = "";
                document.documentElement.style.overflow = "";

                // ポップアップが消える余韻に合わせて、封筒のフタをパタッと優しく閉じ直す
                setTimeout(() => {
                    if (envWrapper) envWrapper.classList.remove("open");
                }, 200);
            }, 10);
        });
    });
});




