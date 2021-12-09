var Promise = PipefyApp.Promise;

var openModal = function (p) {
    p.modal({
        url: './modal.html', height: '70%', width: '70%',
    });

    p.closeDropdown();
};

var openSidebar = function (p) {
    p.sidebar({
        title: 'Sidebar with Flags', url: './sidebar.html',
    });


    p.closeDropdown();
};

var openEmojiDropdown = function (p) {
    p.dropdown({
        title: 'Select Card Emoji', url: './set-emoji.html', height: '500px',
    });
}

var openCardDropdown = function (p) {
    p.dropdown({
        title: 'Emoji app', items: [{
            title: '😈  Set Card Emoji', callback: openEmojiDropdown,
        }, {
            title: '😎  Open Modal', callback: openModal,
        }, {
            title: '👋  Close card', callback: function (p) {
                p.closeCard()
            },
        },]
    });
};

var transformToSearchItem = function (emoji) {
    var title = emoji.name + " " + emoji.emoji;
    return {
        title: title, callback: function (p) {
            p.attach({
                url: emoji.url, name: title,
            }).then(function () {
                p.closeDropdown();
            });
        }
    }
}

var attachRandomEmoji = function (p) {
    var emoji = window.emojis_urls[Math.floor(Math.random() * window.emojis_urls.length)];

    p.attach({
        url: emoji.url, name: emoji.name + " " + emoji.emoji,
    }).then(function () {
        p.closeDropdown();
    })
};

var searchEmoji = function (p) {
    p.search({
        title: 'Select Emoji',
        placeholder: 'Search Emoji',
        empty: 'No Emoji found',
        loading: 'Looking for Emoji...',
        items: function (p, query) {
            return new Promise(function (resolve) {
                if (query && query.length) {
                    var filteredEmojis = window.emojis_urls.filter(function (emoji) {
                        return emoji.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
                    });

                    resolve(filteredEmojis.map(transformToSearchItem));
                } else {
                    resolve(window.emojis_urls.map(transformToSearchItem));
                }
            });
        },
    });
};

PipefyApp.initCall({
    'card-tab': function (p, pipe) {
        return {
            icon: './images/icon-blue.svg', title: 'Gerar Contrato HE', buttons: [{
                text: 'Gerar', callback: function (p) {
                    p.card().then(function ({title}) {
                        // 'https://apitcdev.pontte.com.br/Pipefy/v1/generate/he/contract'
                        // https://apitcstaging.pontte.com.br/Pipefy/v1/generate/he/contract
                        fetch('https://apitc.pontte.com.br/Pipefy/v1/generate/he/contract', {
                            method: 'POST', headers: {
                                'Content-Type': 'application/json'
                            }, body: JSON.stringify({cardId: title})
                        })
                            .then(res => res.json())
                            .then(data => console.log(data))
                            .catch(err => console.log(err));
                    })
                }
            },]
        }
    }, 
    'pipe-view': function (p, pipe) {
        return ({
            icon: 'https://cdn.glitch.com/03813ab1-4482-45be-b7f7-74e8948d7ae7%2Ficon-white.svg?1505355257252',
            text: ' Help ',
            url: './pipe-view.html',
            hide_create_button: false,
        })
    }, 
});
