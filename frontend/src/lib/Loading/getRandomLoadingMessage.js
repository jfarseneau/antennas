export default function getRandomLoadingMessage() {
  const messages = [
    'Reticulating splines...',
    'Warming up hamsters...',
    'Counting backwards from infinity...',
    'Charging the flux capacitor...',
    'Rolling for initiative...',
    'Assembling the Avengers...',
    'Herding cats...',
    'Recalculating Pi...',
    'Beaming up Scotty...',
    'Procrastinating...',
    'Summoning Cthulhu...',
    'Just making some popcorn...',
    'Polishing the pixels...',
    'Shuffling the deck...',
    'Dropping the bass...',
    "Catching 'em all...",
    'Downloading more RAM...',
    'Applying sunscreen...',
    'Balancing the force...',
    'Finding the missing socks...',
    'Dividing by zero...',
    'Turning it off and on again...',
    'Stirring the pot...',
    'Checking for gremlins...',
    'Consulting the magic 8-ball...',
    'Channeling inner wisdom...',
    'Crossing fingers and toes...',
    'Waiting for the stars to align...',
    'Attempting to break the sound barrier...',
    'Revving up the engines...',
    'Spreading good vibes...',
    'Traveling to a galaxy far, far away...',
    'Going back to the future...',
    'Looking for Nemo...',
    'May the loading be with you...',
    'Escaping the Matrix...',
    'Feeling the need... the need for speed...',
    'Preparing to enter Jurassic Park...',
    'Unleashing the Fury...',
    'Finding a bigger boat...',
    'Releasing the Kraken...',
    'Assembling the Fellowship...',
    'Wax on, wax off...',
    'Getting to the choppa...',
    "I'm king of the loading!",
    'Hasta la vista, baby...',
    "Making an offer you can't refuse...",
    'Keep your friends close, but your loading closer...',
    'Waiting for Wilson...',
    'Feeling lucky, punk?',
    'I see loading people...',
    'Life is like a box of loading...',
    "Here's looking at you, loading...",
  ];

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}