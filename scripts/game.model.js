'use strict'

class GameModel {
    apiUrl = 'https://games-app-siit.herokuapp.com/games';

    getGameList() {
        return this.getApiData();
    }
    
    getGameDetails(id) {
        return this.getApiData(id)
    }
    
    addNewGame(game) {
        return this.getApiData(null, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(game)
        // }).then(data => {
        //     mainContentDOM.innerHTML = drawGameListElement(data) + mainContentDOM.innerHTML;
        })
    }
    
    updateGame(game, id) {
        return this.getApiData(id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(game)
        })
    }
    
    deleteGame(id) {        
        return fetch(`${this.apiUrl}/${id}`, {
            method: 'DELETE'
        })
    }

    getApiData(id, options) {
        return fetch(this.apiUrl + (id ? `/${id}` : ''), options).then(res => res.json());
    }

}

