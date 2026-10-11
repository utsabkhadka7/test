class Slider {
    constructor(root, delay = 5000) {
        this.root = root;
        this.track = root.querySelector(".slider-track");
        this.dotsBox = root.querySelector(".slider-dots");
        this.prevBtn = root.querySelector(".prev");
        this.nextBtn = root.querySelector(".next");

        this.total = this.track.children.length;
        this.index = 1;
        this.isMoving = false;

        this.delay = delay;
        this.timer = null;
        this.setupClones();
        this.createDots();
        this.bindEvents();
        this.move(false);
        this.updateDots();
        this.startAutoPlay();
    }

    setupClones() {
        const first = this.track.firstElementChild.cloneNode(true);
        const last = this.track.lastElementChild.cloneNode(true);
        this.track.appendChild(first);
        this.track.insertBefore(last, this.track.firstElementChild);
    }

    createDots() {
        for (let i = 0; i < this.total; i++) {
            const dot = document.createElement("button");
            dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
            dot.addEventListener("click", () => {
                this.goTo(i + 1);
                this.startAutoPlay();         
            });
            this.dotsBox.appendChild(dot);
        }
        this.dots = [...this.dotsBox.children];
    }

    bindEvents() {
        this.nextBtn.addEventListener("click", () => {
            this.goTo(this.index + 1);
            this.startAutoPlay();
        });
        this.prevBtn.addEventListener("click", () => {
            this.goTo(this.index - 1);
            this.startAutoPlay();
        });

        this.root.addEventListener("mouseenter", () => this.stopAutoPlay());
        this.root.addEventListener("mouseleave", () => this.startAutoPlay());

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) this.stopAutoPlay();
            else this.startAutoPlay();
        });

        this.track.addEventListener("transitionend", (e) => {
            if (e.target !== this.track) return;

            if (this.index === this.total + 1) this.index = 1;
            if (this.index === 0) this.index = this.total;

            this.move(false);
            this.isMoving = false;
        });
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.timer = setInterval(() => this.goTo(this.index + 1), this.delay);
    }

    // cancel the timer
    stopAutoPlay() {
        clearInterval(this.timer);
        this.timer = null;
    }

    goTo(newIndex) {
        if (this.isMoving || newIndex === this.index) return;
        this.isMoving = true;
        this.index = newIndex;
        this.move(true);
        this.updateDots();
    }


    move(animate) {
        this.track.style.transition = animate ? "" : "none";
        this.track.style.transform = `translateX(-${this.index * 100}%)`;

        if (!animate) {
            this.track.offsetWidth;
            this.track.style.transition = "";
        }
    }

    updateDots() {
        let active = this.index - 1;
        if (this.index === 0) active = this.total - 1;
        if (this.index === this.total + 1) active = 0;

        this.dots.forEach((dot, i) => dot.classList.toggle("active", i === active));
    }
}

// Create a slider for every .slider on the page
document.querySelectorAll(".slider").forEach((el) => new Slider(el, 5000));