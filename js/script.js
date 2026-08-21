// ⚡ スマホのタイミングバグを防ぐため、画面準備ができたら実行する
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

        // 2. 【超重要】スマホ用の安全装置（アニメーションが動かなくても3秒後に強制終了）
        setTimeout(() => {
            endOpening();
        }, 3000); // 3000ms = 3秒（オープニング演出の長さに合わせて調整してください）
    }

    // オープニングを終わらせる共通の関数
    function endOpening() {
        if (!document.body.classList.contains("loading")) return; // すでに終わってたら何もしない
        opening.style.pointerEvents = "none";
        opening.style.display = "none"; // 念のため画面から完全に消す
        document.body.classList.remove("loading");
    }


const topButton = document.querySelector(".top-button");

if(topButton){
    topButton.addEventListener("click", () => {
        topButton.classList.add("tap-effect");

        setTimeout(() => {
            topButton.classList.remove("tap-effect");
        }, 1000);
    });
}

const opening = document.querySelector(".opening");

opening.addEventListener("animationend",()=>{

    opening.style.pointerEvents = "none";

    document.body.classList.remove("loading");

});

// スクロールヒント表示

const sliders = document.querySelectorAll(".slider");


const hintObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            const hint = entry.target.querySelector(".scroll-hint");


            if(hint && !hint.classList.contains("shown")){


                hint.classList.add("show");

                hint.classList.add("shown");


                setTimeout(()=>{

                    hint.classList.remove("show");

                },4000);


            }

        }

    });


},{
    threshold:0.5
});


    sliders.forEach(slider=>{

        hintObserver.observe(slider);

    });


// スマホ ハンバーガーメニュー

const menuButton = document.querySelector(".menu-button");

const nav = document.querySelector("header nav");

const overlay = document.querySelector(".menu-overlay");


if(menuButton && nav && overlay){


    menuButton.addEventListener("click",()=>{


        menuButton.classList.toggle("active");

        nav.classList.toggle("active");

        overlay.classList.toggle("active");


    });



    overlay.addEventListener("click",()=>{


        menuButton.classList.remove("active");

        nav.classList.remove("active");

        overlay.classList.remove("active");


    });



    document.querySelectorAll("header nav a").forEach(link=>{


        link.addEventListener("click",()=>{


            menuButton.classList.remove("active");

            nav.classList.remove("active");

            overlay.classList.remove("active");


        });


    });


}

const menuLinks = document.querySelectorAll("header nav a");

menuLinks.forEach(link => {
    link.addEventListener("click", function() {
        // 1. メニューとオーバーレイを閉じる
        menuButton.classList.remove("active");
        nav.classList.remove("active");
        overlay.classList.remove("active");

        // 2. 現在地の光るクラスを付け替える
        menuLinks.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
    });
});



// スクロール量に応じてトップボタンを表示・非表示
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        topButton.style.opacity = "1";
        topButton.style.visibility = "visible";
        topButton.style.transform = "translateY(0)";
    } else {
        topButton.style.opacity = "0";
        topButton.style.visibility = "hidden";
        topButton.style.transform = "translateY(20px)"; // 少し下に下げて消すとお洒落です
    }
});
