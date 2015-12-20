var AlexaSkill = require('./AlexaSkill')
 ,  pokedex = require('./pokedex')
 ,  APP_ID = "amzn1.echo-sdk-ams.app.ceeb6d36-8b1e-4123-8cfb-0dfb3e6b1309";

/*
 * pokemon.name
 * pokemon.id
 * pokemon.description
 * pokemon.image
 * pokemon.types
 * pokemon.superEffective
 * pokemon.ineffective
 * pokemon.weakness
 * pokemon.noEffect
 * pokemon.resistance
*/

var handleNameLookupRequest = function (intent, session, response) {
    var name = intent.slots.name.value;
    var text = "";
    var cardText = "";
    var heading = "";

    pokedex.getPokemonByName(name, function (pokemon) {
        text += pokemon.name + ". National Index Number " + pokemon.id + ". ";
        text += "Description: " + pokemon.description + ". ";
        text += "Types: " + pokemon.types.join(", ");

        cardText += "National Index Number: " + pokemon.id + "\n";
        cardText += "Description: " + pokemon.description + "\n";
        cardText += "Types: " + pokemon.types.join(", ") + "\n";
        cardText += "Super Effective: " + pokemon.superEffective.join(", ") + "\n";
        cardText += "Ineffective: " + pokemon.ineffective.join(", ") + "\n";
        cardText += "Weakness: " + pokemon.weakness.join(", ") + "\n";
        cardText += "No Effect: " + pokemon.noEffect.join(", ") + "\n";
        cardText += "Resistance: " + pokemon.resistance.join(", ") + "\n";

        heading += pokemon.name;

        response.tellWithCard(text, heading, cardText);
    });

}

var handleNumberLookupRequest = function (intent, session, response) {
    var id = intent.slots.number.value;
    var text = "";
    var cardText = "";
    var heading = "";

    pokedex.getPokemonById(id, function (pokemon) {
        text += pokemon.name + ". National Index Number " + pokemon.id + ". ";
        text += "Description: " + pokemon.description + ". ";
        text += "Types: " + pokemon.types.join(", ");

        cardText += "National Index Number: " + pokemon.id + "\n";
        cardText += "Description: " + pokemon.description + "\n";
        cardText += "Types: " + pokemon.types.join(", ") + "\n";
        cardText += "Super Effective: " + pokemon.superEffective.join(", ") + "\n";
        cardText += "Ineffective: " + pokemon.ineffective.join(", ") + "\n";
        cardText += "Weakness: " + pokemon.weakness.join(", ") + "\n";
        cardText += "No Effect: " + pokemon.noEffect.join(", ") + "\n";
        cardText += "Resistance: " + pokemon.resistance.join(", ") + "\n";

        heading += pokemon.name;

        response.tellWithCard(text, heading, cardText);
    });

}

var Pokedex = function() {
    AlexaSkill.call(this, APP_ID);
};

Pokedex.prototype = Object.create(AlexaSkill.prototype);
Pokedex.prototype.constructor = Pokedex;

Pokedex.prototype.eventHandlers.onLaunch = function (launchRequest, session, response){
  var output = '';
  output += 'Welcome to your Pokedex. You can look Pokemon up by their name or their number. ';
  output += 'Try saying, Alexa ask Pokedex about Charizard, or, Alexa ask Pokedex about pokemon number 6. ';
  output += 'What Pokemon would you like information about?';

  var reprompt = 'What Pokemon do you want to look up?';

  response.ask(output, reprompt);
};

Pokedex.prototype.intentHandlers = {
  NameLookup: function(intent, session, response){
    handleNameLookupRequest(intent, session, response);
  },
  NumberLookup: function(intent, session, response){
    handleNumberLookupRequest(intent, session, response);
  },
};

exports.handler = function (event, context) {
    var skill = new Pokedex();
    skill.execute(event, context); 
}

// handleNameLookupRequest({slots: {name: {value: "pikachu"}}});