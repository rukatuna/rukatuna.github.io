window.addEventListener("DOMContentLoaded", () => {

    const bubbles = document.querySelector(".bubbles");

    // 泡の生成（bubblesが存在するときだけ実行）
    if (bubbles) {
        for(let i = 0; i < 100; i++){
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

    const opening = document.querySelector(".opening");

    if (opening) {
        // 1. 通常のアニメーション終了処理
        opening.addEventListener("animationend", () => {
            endOpening();
        });

        // 2. スマホ用の安全装置（3秒後に強制終了）
        setTimeout(() => {
            endOpening();
        }, 3000);
    }

    // オープニングを終わらせる共通の関数
    function endOpening() {
        if (!document.body.classList.contains("loading")) return;
        opening.style.pointerEvents = "none";
        opening.style.display = "none";
        document.body.classList.remove("loading");
    }

    // トップボタンのエフェクト
    const topButton = document.querySelector(".top-button");

    if(topButton){
        topButton.addEventListener("click", () => {
            topButton.classList.add("tap-effect");

            setTimeout(() => {
                topButton.classList.remove("tap-effect");
            }, 1000);
        });
    }

    // スクロールヒント表示
    const sliders = document.querySelectorAll(".slider");

    const hintObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                const hint = entry.target.querySelector(".scroll-hint");

                if(hint && !hint.classList.contains("shown")){
                    hint.classList.add("show");
                    hint.classList.add("shown");

                    setTimeout(() => {
                        hint.classList.remove("show");
                    }, 4000);
                }
            }
        });
    }, {
        threshold: 0.5
    });

    sliders.forEach(slider => {
        hintObserver.observe(slider);
    });

    // スマホ ハンバーガーメニュー
    const menuButton = document.querySelector(".menu-button");
    const nav = document.querySelector("header nav");
    const overlay = document.querySelector(".menu-overlay");

    if(menuButton && nav && overlay){
        menuButton.addEventListener("click", () => {
            menuButton.classList.toggle("active");
            nav.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        overlay.addEventListener("click", () => {
            menuButton.classList.remove("active");
            nav.classList.remove("active");
            overlay.classList.remove("active");
        });
    }

    const menuLinks = document.querySelectorAll("header nav a");

    menuLinks.forEach(link => {
        link.addEventListener("click", function() {
            if(menuButton && nav && overlay) {
                // 1. メニューとオーバーレイを閉じる
                menuButton.classList.remove("active");
                nav.classList.remove("active");
                overlay.classList.remove("active");
            }

            // 2. 現在地の光るクラスを付け替える
            menuLinks.forEach(item => item.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // スクロール量に応じてトップボタンを表示・非表示
    window.addEventListener("scroll", () => {
        if (topButton) {
            if (window.scrollY > 300) {
                topButton.style.opacity = "1";
                topButton.style.visibility = "visible";
                topButton.style.transform = "translateY(0)";
            } else {
                topButton.style.opacity = "0";
                topButton.style.visibility = "hidden";
                topButton.style.transform = "translateY(20px)";
            }
        }
    });

});
