'use strict'

class FormComponent extends HTMLElement {

    game;
    submitButtonDOM;

    appendToDOM(game = null) {
        this.game = game;
        this.innerHTML = `
        <form data-game-form class="container form-add-game pt-3 text-center position-sticky top-0">
            <h4 id="form-title" class="text-center pt-5 mb-4">${this.game ? 'Update Game' : 'Add New Game'}</h4>
            <input id="title" value="${this.game ? this.game.title : ''}" class="input-group mb-3" type="text" name="" placeholder="Title">
            <input id="release-date" value="${this.game ? new Date(this.game.releaseDate * 1000).toISOString().split('T')[0] : ''}" class="input-group mb-3" type="date" name="" placeholder="Release Date">
            <input id="genre" value="${this.game ? this.game.genre : ''}"class="input-group mb-3" type="text" name="" placeholder="Genre">
            <input id="publisher" value="${this.game ? this.game.publisher : ''}" class="input-group mb-3" type="text" name="" placeholder="Publisher">
            <input id="image-url" value="${this.game ? this.game.imageUrl : ''}" class="input-group mb-3" type="text" name="" placeholder="Image URL">
            <textarea name="" id="description" class="input-group mb-3" placeholder="Description" rows="7">${this.game ? this.game.description : ''}</textarea>
            <input id="submit-button" class="bg-success border-0 shadow-sm px-3 py-1 rounded" type="button" value="Submit">
        </form>
        `;

        this.submitButtonDOM = this.querySelector('#submit-button');
        this.submitButtonDOM.onclick = this.save.bind(this);
    }

    save() {
        const titleDOM = this.querySelector('#title');
        const releaseDateDOM = this.querySelector('#release-date');
        const genreDOM = this.querySelector('#genre');
        const publisherDOM = this.querySelector('#publisher');
        const imageUrlDOM = this.querySelector('#image-url');
        const descriptionDOM = this.querySelector('#description');

        const gameToSave = {
            title: titleDOM.value,
            releaseDate: Date.parse(releaseDateDOM.value) / 1000,
            genre: genreDOM.value,
            publisher: publisherDOM.value,
            imageUrl: imageUrlDOM.value,
            description: descriptionDOM.value,
        }

        document.dispatchEvent(new CustomEvent('saveButtonClicked',
            {
                detail: {
                    game: gameToSave,
                    id: this.game ? this.game._id : null
                }
            }
        ));
    }
}

customElements.define('form-component', FormComponent);