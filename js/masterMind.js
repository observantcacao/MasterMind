// LP, 23.05.25, MasterMind

// class...
class MasterMind {
    // initialisation
    zoneJeu = document.getElementById("zonejeu");
    affichageFin = document.getElementById("messageConclusionPartie");
    couleurs = ["bleu", "gris", "vert", "rouge", "jaune", "cyan"]
    couleursMystere = [];
    essaie = 1;
    fini = false;
    gagner = false;
    bloquer = false;

    constructor() {
        this.restart();
    }

    restart() {
        // clear tout
        this.gagner = false;
        this.bloquer = false;
        this.fini = false;
        this.couleursMystere = [];
        this.zoneJeu.innerHTML = "";
        this.essaie = 1;
        this.affichageFin.innerText = "";

        // attribue les couleurs au 4 carré
        for (let index = 0; index < 4; index++) {
            this.couleursMystere.push(this.couleurs[Math.floor(Math.random() * 6)]);
        }
        console.log(this.couleursMystere);// uniquement pour test

        // affiches les zones avec lesquel les joueur pouront intéragir
        for (let index = 1; index <= 10; index++) {
            this.zoneJeu.innerHTML += `
            <div id="id${index}" class="d-flex gap-5">
                <div class="contentColor" class="d-flex align-items-center gap-1">
                    <div class="rounded-circle border d-inline-block" style="width: 50px; height: 50px;" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                    <div class="rounded-circle border d-inline-block" style="width: 50px; height: 50px;" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                    <div class="rounded-circle border d-inline-block" style="width: 50px; height: 50px;" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                    <div class="rounded-circle border d-inline-block" style="width: 50px; height: 50px;" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                </div>
                <div class="d-flex flex-column justify-content-evenly">
                    <p class="m-0">
                        <span class="nbSuccess">✔ :  0</span>
                    </p>
                    <p class="m-0">
                        <span class="nbMalPlace">🟠 : 0</span>
                    </p>
                </div>
            </div>`;
        }
        this.jouer();
    }

    jouer() {
        if (!this.bloquer) {
            
            // affiche la zone dans laquel le joueur doit jouer et la rend jouablet
            try {
                let zoneActuelle = document.getElementById(`id${this.essaie}`);
                zoneActuelle.classList.add("active");
            } catch (error) {
                this.fini = true;
            }
        }
    }

    test() {
        // initialisation...
        let zoneActuelle = document.getElementById(`id${this.essaie}`);
        let couleurEssaieTmp = zoneActuelle.getElementsByClassName("contentColor")[0].childNodes;
        let couleurEssaie = [];
        let bienPlace = zoneActuelle.getElementsByClassName("nbSuccess")[0]
        let malPlace = zoneActuelle.getElementsByClassName("nbMalPlace")[0];
        let nombreBienPlace = 0;
        let nombreMalPlace = 0;
        let tableauTmpTest = [];
        let tableauMalPlace = [];
        let tableauMystereRestant = [];
        let containerFULL = true;

        if (!this.bloquer) {

            // enlève tout les text dans couleur essaie
            couleurEssaieTmp.forEach((nodes, index) => {
                if (nodes.nodeType !== 3) {
                    couleurEssaie.push(couleurEssaieTmp[index]);
                }
            })

            // vérifie si toutes les zone d'essaie sont deja remplie
            couleurEssaie.forEach(couleur => {
                if (!couleur.hasChildNodes()) {
                    containerFULL = false;
                    console.log(couleur);
                }
                console.log(couleur);
            });

            if (containerFULL) {
                couleurEssaie.forEach(couleur => {
                    tableauTmpTest.push(couleur.firstChild.id);
                    console.log(couleur);
                });

                console.log(tableauTmpTest);
                // vérification biens placé
                tableauTmpTest.forEach((couleur, index) => {
                    if (tableauTmpTest[index] == this.couleursMystere[index]) {
                        nombreBienPlace = nombreBienPlace + 1;
                        tableauMalPlace.push(null);
                        tableauMystereRestant.push(null);
                    } else {
                        tableauMalPlace.push(couleur);
                        tableauMystereRestant.push(this.couleursMystere[index]);
                    }
                });

                // vérification mal placé
                tableauMalPlace.forEach((couleur, index) => {
                    if (couleur !== null) {
                        if (tableauMystereRestant.indexOf(couleur) !== -1) {
                            nombreMalPlace = nombreMalPlace + 1;
                            tableauMystereRestant[tableauMystereRestant.indexOf(couleur)] = null;
                        }
                    }
                });

                // affichage des test...
                malPlace.innerHTML = `🟠 : ${nombreMalPlace}`;
                bienPlace.innerHTML = `✔ :  ${nombreBienPlace}`;

                // rend les autres truc pas interactif
                zoneActuelle.classList.toggle("active");

                // augmente this.essaie de 1
                this.essaie++;

                if (nombreBienPlace == 4){
                    this.gagner = true;
                    this.fini = true;
                    this.bloquer = true;
                }
                // appelle jouer();
                this.testerWin();
                this.jouer();

            } else {
                alert("Veuillez remplir la ligne de couleurs.")
            }
        }
        if (this.fini) {
            this.testerWin();
        }
    }

    testerWin() {
        if (this.fini && this.gagner) {
            this.affichageFin.innerText = `Bravo tu as gagné, (${this.essaie - 1} essaie)`;
        } 
        if (this.fini && !this.gagner) {
            this.affichageFin.innerText = `mince tu as perdu, la solution était ${this.couleursMystere}`;
        }

    }
}

// fonction...
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var copieElement = document.getElementById(data).cloneNode();

    //console.log(copieElement);
    if (event.target.parentElement.parentElement.classList.contains("active") || event.target.parentElement.parentElement.parentElement.classList.contains("active")) {
        if (event.target.classList.contains("BLOCKCOLOR")) {
            let tmpContainer = event.target.parentElement;
            tmpContainer.innerHTML = "";
            tmpContainer.appendChild(copieElement);
        } else {
            if (event.target.hasChildNodes()) {
                event.target.innerHTML = "";
                event.target.appendChild(copieElement);
            } else {
                event.target.appendChild(copieElement);
            }
        }
    }
}

// code...
let game = new MasterMind();

document.getElementById("recommencer").addEventListener("click", (e) => {
    game.restart();
});

document.getElementById("verifier").addEventListener("click", (e) => {
    game.test();
});