class MemoryPlay {

    constructor() {

        this.canPlay = false;

        this.card1 = null;
        this.card2 = null;

        // Arreglo para establecer las imagenes de las cartas que se vana a utilizar

        this.availableImages = [1, 2, 3, 4, 5, 6, 7];
        this.orderForThisRound = [];
        this.cards = Array.from( document.querySelectorAll(".board-game figure") );

        this.maxPairNumber = this.availableImages.length;

        this.startGame();

    }

    startGame() {

        this.foundPairs = 0;
        this.setNewOrder();
        this.setImagesInCards();
        this.openCards();

    }

    setNewOrder() {

        this.orderForThisRound = this.availableImages.concat(this.availableImages);
        this.orderForThisRound.sort( () => Math.random() - 0.5 );

    }

    setImagesInCards() {

        for (const key in this.cards) {
            
            const card = this.cards[key];
            const image = this.orderForThisRound[key];
            const imgLabel = card.children[1].children[0];

            card.dataset.image = image;
            imgLabel.src = `./images/cards/${image}.png`;

        }

    }

// Codigo que da apertura a las  cartas y da tiempo para memorizarlas
    
    openCards() {

        this.cards.forEach(card => card.classList.add("opened"));

        setTimeout(() => {
            this.closeCards();
        }, 4000);

    }

    closeCards() {

        this.cards.forEach(card => card.classList.remove("opened"));
        this.addClickEvents();
        this.canPlay = true;

    }

    addClickEvents() {

        this.cards.forEach(_this => _this.addEventListener("click", this.flipCard.bind(this)));

    }

    removeClickEvents() {

        this.cards.forEach(_this => _this.removeEventListener("click", this.flipCard));

    }

    flipCard(e) {

        const clickedCard = e.target;

        if (this.canPlay && !clickedCard.classList.contains("opened")) {
            
            clickedCard.classList.add("opened");
            this.checkPair( clickedCard.dataset.image );

        }

    }

    checkPair(image) {

        if (!this.card1) this.card1 = image;
        else this.card2 = image;

        if (this.card1 && this.card2) {
            
            if (this.card1 == this.card2) {

                this.canPlay = false;

                //Reproducir sonido de la nota musical
                //Sonidos tomados de: http://diariopositivo2015.blogspot.com/2016/11/todas-las-notas-de-piano-en-mp3.html
                var audio = new Audio(`./sounds/cards/${this.card2}.mp3`);
                audio.play();

                setTimeout(this.checkIfWon.bind(this), 300)

            }
            else {

                this.canPlay = false;

                //Reproducir sonido de error
                //Sonido tomados de: https://orangefreesounds.com/wrong-answer-sound-effect/
                //Licence: The sound effect is permitted for commercial use under license Creative Commons Attribution 4.0 International License”
                var audio = new Audio(`./sounds/Wrong-answer-sound-effect.mp3`);
                audio.play();

                setTimeout(this.resetOpenedCards.bind(this), 800)

            }

        }

    }

    resetOpenedCards() {
        
        const firstOpened = document.querySelector(`.board-game figure.opened[data-image='${this.card1}']`);
        const secondOpened = document.querySelector(`.board-game figure.opened[data-image='${this.card2}']`);

        firstOpened.classList.remove("opened");
        secondOpened.classList.remove("opened");

        this.card1 = null;
        this.card2 = null;

        this.canPlay = true;

    }

    checkIfWon() {

        this.foundPairs++;

        this.card1 = null;
        this.card2 = null;
        this.canPlay = true;

        if (this.maxPairNumber == this.foundPairs) {

            //Reproducir sonido de victoria
            //Sonido tomados de: https://orangefreesounds.com/piano-glissando-sound-effect/
            //Licence: The sound is permitted for non-commercial use under license “Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
            var audio = new Audio(`./sounds/Piano-glissando-sound-effect.mp3`);
            audio.play();

            // Codigo del mensaje de alerta al lograr hacer match de todas las tarjetas
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Felicitaciones! Lo lograste.',
                showConfirmButton: true,
                confirmButtonText: 'Continuar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.setNewGame();
                }
            });

        }

    }

    setNewGame() {

        this.removeClickEvents();
        this.cards.forEach(card => card.classList.remove("opened"));

        setTimeout(this.startGame.bind(this), 1000);

    }

}

document.addEventListener("DOMContentLoaded", () => {

    new MemoryPlay();

});