var request = require('request')
 ,  base = 'http://pokeapi.co';

// pokedex:
function getPokedex(callback) {
    request(base + '/api/v1/pokedex/1/', callback);
}

function getPokemonById(id, callback) {
    request(base + '/api/v1/pokemon/' + id, function (error, response, body) {
        buildPokemonNoImage(error, response, body, callback);
    });
}

function getPokemonByName(name, callback) {
    var options = {
        url: "https://phalt-pokeapi.p.mashape.com/pokemon/" + name + "/",
        headers: {
            "X-Mashape-Key": "aK3qEKBNfhmsh1b07zGTLs7sZEGXp1PM79VjsnF4Grud0RVyVX",
            "Accept": "application/json"
        }
    }
    request(options, function (error, response, body) {
        buildPokemonNoImage(error, response, body, callback);
    });
}

function getResource(resourceUri, callback) {
    request(base + resourceUri, callback);
}

function buildPokemon(error, response, body, callback) {
    if (error || response.statusCode !== 200) {
        return console.log(error || response.statusCode + ": " + response.statusMessage);
    }
    var data = JSON.parse(body);
    var desc = data.descriptions;
    desc.sort(function (a, b) {
        // decreasing, most recent on top
        return parseInt(b.resource_uri.slice(20)) - parseInt(a.resource_uri.slice(20));
    });
    var sprites = data.sprites;
    sprites.sort(function (a, b) {
        // decreasing, most recent on top
        return parseInt(b.resource_uri.slice(15)) - parseInt(a.resource_uri.slice(15));
    });

    getResource(desc[0].resource_uri, function (descErr, descResp, descBody) {
        if (descErr || descResp.statusCode !== 200) {
            return console.log(descErr || descResp.statusCode + ": " + descResp.statusMessage);
        }
        var descData = JSON.parse(descBody);
        getResource(sprites[0].resource_uri, function (spriteErr, spriteResp, spriteBody) {
            if (spriteErr || spriteResp.statusCode !== 200) {
                return console.log(spriteErr || spriteResp.statusCode + ": " + spriteResp.statusMessage);
            }
            var spriteData = JSON.parse(spriteBody);
            
            var superEffective = [],
                ineffective = [],
                weakness = [],
                noEffect = [],
                resistance = [],
                types = [],
                typesProcessed = 0;
            for (var i = 0; i < data.types.length; i++) {
                getResource(data.types[i].resource_uri, function (err, resp, bod) {
                    bod = JSON.parse(bod);
                    for (var j in bod.super_effective) {
                        if (superEffective.indexOf(bod.super_effective[j].name) == -1) {
                            superEffective.push(bod.super_effective[j].name);
                        }
                    }
                    for (var j in bod.ineffective) {
                        if (ineffective.indexOf(bod.ineffective[j].name) == -1) {
                            ineffective.push(bod.ineffective[j].name);
                        }
                    }
                    for (var j in bod.weakness) {
                        if (weakness.indexOf(bod.weakness[j].name) == -1) {
                            weakness.push(bod.weakness[j].name);
                        }
                    }
                    for (var j in bod.resistance) {
                        if (resistance.indexOf(bod.resistance[j].name) == -1) {
                            resistance.push(bod.resistance[j].name);
                        }
                    }
                    for (var j in bod.no_effect) {
                        if (noEffect.indexOf(bod.no_effect[j].name) == -1) {
                            noEffect.push(bod.no_effect[j].name);
                        }
                    }
                    types.push(bod.name);
                    typesProcessed++;

                    if (typesProcessed == data.types.length) {
                        
                        var pokemon = {};
                        pokemon.name = data.name;
                        pokemon.id = data.national_id
                        pokemon.description = descData.description;
                        pokemon.image = base + spriteData.image;
                        pokemon.types = types;
                        pokemon.superEffective = superEffective;
                        pokemon.ineffective = ineffective;
                        pokemon.weakness = weakness;
                        pokemon.noEffect = noEffect;
                        pokemon.resistance = resistance;
                        callback(pokemon);
                    }
                });
            }
        });
    });
}

function buildPokemonNoImage(error, response, body, callback) {
    if (error || response.statusCode !== 200) {
        return console.log(error || response.statusCode + ": " + response.statusMessage);
    }
    var data = JSON.parse(body);
    var desc = data.descriptions;
    desc.sort(function (a, b) {
        // decreasing, most recent on top
        return parseInt(b.resource_uri.slice(20)) - parseInt(a.resource_uri.slice(20));
    });

    getResource(desc[0].resource_uri, function (descErr, descResp, descBody) {
        if (descErr || descResp.statusCode !== 200) {
            return console.log(descErr || descResp.statusCode + ": " + descResp.statusMessage);
        }
        var descData = JSON.parse(descBody);
            
        var superEffective = [],
            ineffective = [],
            weakness = [],
            noEffect = [],
            resistance = [],
            types = [],
            typesProcessed = 0;
        for (var i = 0; i < data.types.length; i++) {
            getResource(data.types[i].resource_uri, function (err, resp, bod) {
                bod = JSON.parse(bod);
                for (var j in bod.super_effective) {
                    if (superEffective.indexOf(bod.super_effective[j].name) == -1) {
                        superEffective.push(bod.super_effective[j].name);
                    }
                }
                for (var j in bod.ineffective) {
                    if (ineffective.indexOf(bod.ineffective[j].name) == -1) {
                        ineffective.push(bod.ineffective[j].name);
                    }
                }
                for (var j in bod.weakness) {
                    if (weakness.indexOf(bod.weakness[j].name) == -1) {
                        weakness.push(bod.weakness[j].name);
                    }
                }
                for (var j in bod.resistance) {
                    if (resistance.indexOf(bod.resistance[j].name) == -1) {
                        resistance.push(bod.resistance[j].name);
                    }
                }
                for (var j in bod.no_effect) {
                    if (noEffect.indexOf(bod.no_effect[j].name) == -1) {
                        noEffect.push(bod.no_effect[j].name);
                    }
                }
                types.push(bod.name);
                typesProcessed++;

                if (typesProcessed == data.types.length) {
                    
                    var pokemon = {};
                    pokemon.name = data.name;
                    pokemon.id = data.national_id
                    pokemon.description = descData.description;
                    pokemon.types = types;
                    pokemon.superEffective = superEffective;
                    pokemon.ineffective = ineffective;
                    pokemon.weakness = weakness;
                    pokemon.noEffect = noEffect;
                    pokemon.resistance = resistance;
                    callback(pokemon);
                }
            });
        }
    });
}

module.exports = {
    getPokemonByName: getPokemonByName,
    getPokemonById: getPokemonById,
    getPokedex: getPokedex,
    getResource: getResource,
}

// getPokemonByName("charizard", 
// getPokemonById(25, 
//     function(pokemon) {
//         console.log(pokemon);
// });

// getPokedex(function(error, resposne, body) {
//     var fs = require('fs');
//     var data = JSON.parse(body);
//     var pokemon = data.pokemon;
//     pokemon.sort(function (a, b) {
//         return parseInt(a.resource_uri.slice(15)) - parseInt(b.resource_uri.slice(15));
//     });
//     for(var i = 0; i < pokemon.length; i++) {
//         fs.appendFileSync('pokemon.txt', pokemon[i].name + "\n");
//     }
//     console.log('bitches');
// });