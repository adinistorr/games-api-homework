'use strict'

const url = 'https://games-app-siit.herokuapp.com/games'
const body = document.getElementsByTagName('body')[0];
const mainContentDOM = document.querySelector('.main-content');
const mainPageDOM = document.getElementById('main-page');
const gameDetailsDOM = document.getElementById('game-details');

class GameListView {
    gameModel = new GameModel();

    constructor() {
        const sidebarDOM = document.querySelector('.sidebar');
        const formComponent = document.createElement('form-component');
        formComponent.appendToDOM();
        sidebarDOM.append(formComponent);

        this.getGamesList();

        document.addEventListener('saveButtonClicked', event => {
            const id = event.detail.id;
            const game = event.detail.game;
            id ? this.updateGame(game, id) : this.addNewGame(game);
        })
    }

    getGamesList() {
        mainContentDOM.innerHTML = '';
        this.gameModel.getGameList()
        .then(data => {    
            this.drawGameList(data.reverse());
        });
    }

    drawGameList(games) {
        const fragment= document.createDocumentFragment();
        games.forEach(game => {
            fragment.append(this.drawGameListElement(game));
        });

        mainContentDOM.append(fragment);
    }

    drawGameListElement(game) {
        const container = document.createElement('div');
        const wrapper = document.createElement('div');
        const spanEvent = document.createElement('span');
        const img = document.createElement('img');
        const title = document.createElement('h4');
        const description = document.createElement('p');
        const wrapButton = document.createElement('div');
        const button = document.createElement('button');

        container.classList.add('mb-5');
        wrapper.classList.add('mt-3');
        spanEvent.classList.add('game-title');
        wrapButton.classList.add('text-right');

        Object.assign(title, { className: 'mt-3', innerText: game.title, onclick: this.getGameDetails.bind(this, game._id)})
        Object.assign(img, { className: 'ml-5 mr-3 rounded', src: game.imageUrl, height: 100, width:100, onclick: this.getGameDetails.bind(this, game._id) });
        Object.assign(description, { className: 'description mt-3 text-justify', innerText: game.description });
        Object.assign(button, { className: 'bg-transparent border-0 text-success shadow-sm', innerText: '>> Read more about this game', onclick: this.getGameDetails.bind(this, game._id) });

        spanEvent.append(img, title);
        wrapper.append(spanEvent);
        wrapButton.append(button);
        container.append(wrapper, description, wrapButton);

        return container;
    }

    getGameDetails(id) {
        this.gameModel.getGameDetails(id)
        .then(data => {
            console.log(data);
            this.drawGameDetails(data);
        });
    }

    drawGameDetails(game) {
        gameDetailsDOM.classList.replace('d-none', 'd-block');
        mainPageDOM.classList.replace('d-flex', 'd-none');

        const close = document.createElement('button');
        const container = document.createElement('div');
        const row = document.createElement('div');
        const img = document.createElement('img');
        const wrapText = document.createElement('div');
        const title = document.createElement('h3');
        const genre = document.createElement('h5');
        const publisher = document.createElement('p');
        const date = document.createElement('span');
        const description = document.createElement('p');
        const wrapButtons = document.createElement('div');
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');

        container.classList.add('container', 'game-details-content', 'border', 'border-secondary', 'rounded');
        row.classList.add('row', 'd-flex', 'justify-content-between');
        wrapText.classList.add('text-right');
        title.innerText = game.title;
        genre.innerText = game.genre;
        publisher.innerText = game.publisher;
        date.innerText = new Date(game.releaseDate * 1000).toDateString();
        description.innerText = game.description;
        wrapButtons.classList.add('text-right');

        Object.assign(close, { className: 'closebtn bg-transparent border-0', onclick: this.closeGameDetails, innerHTML: 'close &#x2613;' });
        Object.assign(img, { className: 'game-picture rounded-circle shadow mb-5 w-25', src: game.imageUrl });
        Object.assign(editBtn, { className: 'mr-3 bg-warning border-0 shadow-sm px-3 py-1 rounded', innerText: 'Edit', onclick: this.editGame.bind(this, game) })
        Object.assign(deleteBtn, { className: 'bg-danger border-0 shadow-sm px-3 py-1 rounded', innerText: 'Delete', onclick: this.deleteGame.bind(this, game._id) })

        wrapText.append(title, genre, publisher, date)
        row.append(img, wrapText);
        wrapButtons.append(editBtn, deleteBtn);
        container.append(close, row, description, wrapButtons);

        gameDetailsDOM.innerHTML = ''
        gameDetailsDOM.append(container);
    }

    addNewGame(game) {
        this.gameModel.addNewGame(game)
        .then(data => {
            mainContentDOM.prepend(this.drawGameListElement(data));
            document.querySelector('[data-game-form]').reset();
        });
    }

    editGame(game) {
        const goBackBtn = document.createElement('button');
        const formComponent = document.createElement('form-component');
        
        Object.assign(goBackBtn, { className: 'closebtn bg-transparent border-0', onclick: this.drawGameDetails.bind(this ,game), innerHTML: 'go back &#x21D0;' });
        formComponent.appendToDOM(game);
        gameDetailsDOM.innerHTML = '';
        gameDetailsDOM.append(goBackBtn, formComponent);
    }

    updateGame(game, id) {
        this.gameModel.updateGame(game, id)
        .then(() => {
            this.closeGameDetails();
            this.getGamesList();
        })
    }

    deleteGame(id) {
        this.gameModel.deleteGame(id)
        .then(() => {
            this.closeGameDetails();
            this.getGamesList();
        })
    }
    
    closeGameDetails() {
        gameDetailsDOM.classList.replace('d-block', 'd-none');
        mainPageDOM.classList.replace('d-none', 'd-flex');
    }
    
    reset = document.querySelector('#reset').addEventListener('click', this.resetGameList);
    resetGameList() {
        fetch('https://games-app-siit.herokuapp.com/regenerate-games')
        .then(() => {
            location.reload();
        });
    }
}

new GameListView();





