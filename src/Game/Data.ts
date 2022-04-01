import { TowerType, Specials } from './Types';
// Message Data
interface Message {
  image: string;
  name: string;
  message: string;
}
export const Dialog: { [key: number]: Message[] } = {
  0: [
    {
      image: 'r-h.png',
      name: 'TheDrone7',
      message: 'Welcome to the replit team!',
    },
    {
      image: 'r-h.png',
      name: 'TheDrone7',
      message: 'For starters here, let\'s get you started on some basic moderation.',
    },
    {
      image: 'r-h.png',
      name: 'TheDrone7',
      message: 'Your job is to take out all the malicious repls that appear such as ToS-violating repls, malicious, attacks, etc.',
    },
    {
      image: 'r-lily.png',
      name: 'Lily',
      message: 'Good Luck!',
    },
  ],
  1: [
    {
      image: 'r-lena.png',
      name: 'Lena',
      message: 'Wow! You passed with flying colors!',
    },
    {
      image: 'r-h.png',
      name: 'TheDrone7',
      message: 'Sweet! here are some more on the way, slightly harder to deal with, but I\'m sure you\'ll be able to handle them.',
    },
  ],
  4: [
    {
      image: 'r-nathan.png', 
      name: 'Nathan', 
      message: 'We got some extremely malicious repls being created.'
    },
    {
      image: 'r-akac.png', 
      name: 'akac', 
      message: 'I\'ll keep a constant list of them coming.  Reporting them all to you.'
    },
    {
      image: 'r-piero.png', 
      name: 'Piero', 
      message: 'See how fast you can take them out.  If you do it fast enough, I\'ll give you the best piero pic.'
    }
  ],
  6: [
    {
      image: 'r-nathan.png', 
      name: 'Nathan', 
      message: 'I\'m seeing the end of this tunnel.  Let\'s get these reports down.'
    },
    {
      image: 'r-akac.png', 
      name: 'akac', 
      message: 'Wait, I\'m not done yet!'
    },
    {
      image: 'r-lily.png', 
      name: 'Lily', 
      message: 'akac, give \'em a break!'
    },
    {
      image: 'r-h.png', 
      name: 'TheDrone7', 
      message: 'They\'re here.  Let\'s go!'
    }
  ],
  8: [
    {
      image: 'r-piero.png', 
      name: 'Piero', 
      message: 'I\'m doing some blog maintenence at the moment.'
    },
    {
      image: 'r-bookie.png', 
      name: 'Bookie', 
      message: 'What in the world is this design, piero?  Liek come on man wtf, take a look at this abomidable layout and interface!'
    },
    {
      image:'r-bookie.png', 
      name: 'Bookie', 
      message: '[ten-minute-long design feedback]'
    },
    {
      image: 'r-piero.png', 
      name: 'Piero', 
      message: 'I need to use the bathroom.  Can you smash those bugs for me?'
    },
    {
      image: 'r-cnnd.png', 
      name: 'Cnnd', 
      message: 'https://fart.solutions is the solution to everything, even blog design.'
    },
    {
      image: 'r-soren.png', 
      name: 'Soren', 
      message: 'Alright, we\'re ready to go.'
    },
  ],
  9: [
    {
      image: 'r-bookie.png', 
      name: 'Bookie', 
      message: 'Okay, this blog design is a bit better.  There are still some issues, however.'
    },
    {
      image: 'r-bookie.png', 
      name: 'Bookie', 
      message: '[Design Feedback]'
    },
    {
      image: 'r-ironclad.png', 
      name: 'IroncladDev', 
      message: 'Can you multitask?  Some modding needs to be done as well.'
    },
    {
      image: 'r-ironclad.png', 
      name: 'IroncladDev', 
      message: 'All my fellow mods are out for today.  I don\'t think I can do all this on my own.'
    },
    {
      image: 'r-nathan.png', 
      name: 'Nathan', 
      message: 'I can\'t do modding since I\'m drowning in replit merch.'
    },
    {
      image: 'r-cc.png', 
      name: 'CodingCactus', 
      message: 'Let me help you, sweetie.'
    },
    {
      image: 'r-cc.png', 
      name: 'CodingCactus', 
      message: 'I was talking to Nathan.'
    },
    {
      image: 'r-nathan.png', 
      name: 'Nathan', 
      message: 'Ouch, spikey.'
    },
    {
      image: 'r-lena.png',
      name: 'Lena', 
      message: 'Aww, are you okay nathan?  Here let me give you a hand so cc doesn\'t have to.'
    },
    {
      image: 'r-lena.png', 
      name: 'Lena', 
      message: 'You got a lot of stuff to do, but I hope you can handle it :)'
    }
  ],
  10: [
    {
      image: 'r-bookie.png', 
      name: 'Bookie',
      message: 'Sweet, blog\'s awesome now.'
    },
    {
      image: 'r-piero.png', 
      name: 'Piero', 
      message: 'Nice, Maybe I should retire soon.'
    },
    {
      image: 'r-piero.png', 
      name: 'Piero', 
      message: 'At a second thought, maybe I\'ll stick around for some more cringe moments.'
    },
    {
      image: 'r-aa.png', 
      name: 'AllAwesome497', 
      message: 'I\'m seeing some activity outside of replit HQ.  Not sure exactly what it is.  By the way, replit editors are having a lot of bugs.  Could you fix that up for us?'
    },
  ],
  14: [
    {
      image: 'r-cnnd.png', 
      name: 'Cnnd', 
      message: 'Welcome to being a chat mod.'
    },
    {
      image: 'r-soren.png', 
      name: 'Soren', 
      message: 'Time to teach you how to seek pain.'
    },
    {
      image: 'r-soren.png', 
      name: 'Soren', 
      message: 'Any experience with search engine algorithms?  I need you to patch up some issues here.'
    },
    {
      image: 'r-spotandjake.png', 
      name: 'SpotAndJake', 
      message: 'This search engine is !%#&*^& %$!#'
    },
    {
      image: 'r-nathan.png', 
      name: 'Nathan', 
      message: 'Keep an eye out on discord modding as well as the stuff you need to do.'
    }
  ],
  16: [
    {
      image: 'r-dart.png', 
      name: 'Dart', 
      message: 'There have been an unnatural increase in nitro scammers.  Take a look out for those.'
    },
    {
      image: 'r-h.png', 
      name: 'TheDrone7', 
      message: 'Looks like some replit bot accounts are increasing and running for malicious purposes.  Be sure to take care of them.'
    },
    {
      image: 'r-jdog.png', 
      name: 'JDOG787', 
      message: 'I\'ve found a majority of bot accounts:...'
    },
    {
      image: 'r-devbird.png', 
      name: 'TheDevBird', 
      message: 'Remember, we seek pain when we can.  Assuming this isn\'t that much of a load, lemme give you another list of stuff to be fixed.'
    }
  ],
  17: [
    {
      image: 'r-piero.png', 
      name: 'Piero', 
      message: 'Dang, you\'re getting pretty good at multitasking.'
    },
    {
      image: 'r-aa.png', 
      name: 'AllAwesome497', 
      message: 'Even from a birds-eye view, I\'m not able to identify this large wave of activity moving towards the HQ.'
    },
    {
      image: 'r-devbird.png', 
      name: 'TheDevBird', 
      message: 'Let me take a look...'
    },
    {
      image: 'r-devbird.png', 
      name: 'TheDevBird', 
      message: 'Hmmm, looks like it\'s getting closer at a constant speed, possibly shielded from view with some special technology.'
    },
    {
      image: 'r-amasad.png', 
      name: 'Amjad', 
      message: 'I\'ll figure out a way to break the formation.  Keep the base safe for me.  I got some CEO stuff to do.'
    }
  ],
  19: [
    {
      image: 'r-amasad.png', 
      name: 'Amjad', 
      message: 'Almost there, looks like an invasion force with some heavy artillery approaching.'
    },
    {
      image: 'r-amasad.png', 
      name: 'Amjad', 
      message: 'Even with nix on our side, I\'m not fully able to reveal it and there also is a low chance of destroying it.'
    },
    {
      image: 'r-spotandjake.png',
      name: 'SpotAndJake', 
      message: 'The *dark cloud* is approaching'
    },
    {
      image: 'r-spotandjake.png', 
      name: 'SpotAndJake', 
      message: 'Nvm that was a terrible joke.'
    },
    {
      image: 'r-amasad.png', 
      name: 'Amjad', 
      message: 'I\'m going to keep trying to do this.  Keep all foreign entities outside the base.'
    },
  ],
  24: [
    {
      image: 'r-devbird.png', 
      name: 'TheDevBird', 
      message: 'Replit is having some downtime issues due to DDoS attacks.'
    },
    {
      image: 'r-nathan.png', 
      name: 'Nathan', 
      message: 'undefined'
    },
    {
      image: 'r-cc.png', 
      name: 'CodingCactus', 
      message: 'You okay there, zwack?  I hope my cactus spines didn\'t do too much harm.'
    },
    {
      image: 'r-nathan.png', 
      name: 'Nathan', 
      message: 'C▉m█nicat|ons Br34k▏1ng 0▂n my 3nd█'
    },
    {
      image: 'r-soren.png', 
      name: 'Soren', 
      message: 'Verified, we are undergoing an attack right now.  Keep the base safe at all costs, lots of things are gettins insecure.'
    },
    {
      image: 'r-aa.png', 
      name: 'AllAwesome497', 
      message: 'Invasion force is coming nearer and could be transmitting a wireless attack.  The force is going to arrive any moment now.'
    }
  ],
  26: [
    {
      image: 'r-cnnd.png', 
      name: 'Cnnd', 
      message: 'At least discord works.  Sheesh, there are a lot of people I\'m having to warn about pinging the team about downtime issues.'
    },
    {
      image: 'r-bookie.png', 
      name: 'Bookie', 
      message: 'Who designed replit\'s offline page?  It\'s in light mode.  Bruh.'
    },
    {
      image: 'r-lily.png', 
      name: 'Lily', 
      message: 'Everyone, we got some issues, please check out https://status.replit.com for more information.'
    },
    {
      image: 'r-aa.png', 
      name: 'AllAwesome497', 
      message: 'We\'re almost done fixing things from the ongoing attack.  Just keep us alive a little bit longer.'
    },
  ],
  28: [
    {
      image: 'r-aa.png', 
      name: 'AllAwesome497', 
      message: 'We\'ve just about finished taking care of those DDoS attacks.  Also, good news for pain seekers: the invasion force is here.'
    },
    {
      image: 'r-frissyn.png', 
      name: 'Frissyn', 
      message: 'I need my unpaid intern bot running.  Keep replit up for me!'
    },
    {
      image: 'r-amasad.png', 
      name: 'Amjad', 
      message: 'We\'re all in this together.  We\'ll survive this if we can put our full force together.'
    },
  ],
  29: [
    {
      image: 'r-nathan.png', 
      name: 'Nathan', 
      message: 'Yess!  We defeated the invasion force!'
    },
    {
      image: 'r-amasad.png', 
      name: 'Amjad', 
      message: 'Awesome!  You just saved replit!'
    },
    {
      image: 'r-spotandjake.png', 
      name: 'SpotAndJake', 
      message: 'Congratgulations, player!  I hope you liked our game!  Be sure to give us an upvote if you\'re liked it!'
    },
    {
      image: 'r-ironclad.png', 
      name: 'IroncladDev', 
      message: 'Asking for upvotes is against the rules on replit.  Cycle farming.'
    },
    {
      image: 'r-spotandjake.png', 
      name: 'SpotAndJake', 
      message: 'Did you just send me a moderator warning strike on my account?'
    },
    {
      image: 'r-ironclad.png', 
      name: 'IroncladDev', 
      message: '*shrug*'
    },
    {
      image: 'r-jdog.png', 
      name: 'JDOG787', 
      message: 'Stop abusing mod powers!!'
    },
    {
      image: 'r-frissyn.png', 
      name: 'Frissyn', 
      message: 'Kaboom'
    },
    {
      image: 'r-amasad.png', 
      name: 'Amjad', 
      message: 'That was an amazing first day of work at replit.  Ready to seek some more pain?'
    },
    {
      image: 'r-soren.png', 
      name: 'Soren', 
      message: 'Yup, this doesn\'t end here!'
    },
    {
      image: 'r-spotandjake.png', 
      name: 'SpotAndJake', 
      message: 'Keep playing and get to the highest wave possible to get on the leaderboard!!'
    }
  ],
  40: [
    {
      image: 'r-dart.png',
      name: 'Dart',
      message: 'Wow, wave 40!  Nice job.'
    },
  ],
  50: [
    {
      image: 'r-jdog.png',
      name: 'JDOG787',
      message: 'Whoah, you\'re on to breaking some records!!  Wave 50 wow.'
    },
  ],
  60: [
    {
      image: 'r-spotandjake.png',
      name: 'SpotAndJake',
      message: 'Wave 60.  Looks like you got some powerful defenses going on!!'
    },
  ],
  70: [
    {
      image: 'r-ironclad.png',
      name: 'IroncladDev',
      message: 'Unbelievable!  Wave 70. Please click next to prove you aren\'t a bot 😂'
    },
  ],
  80: [
    {
      image: 'r-cc.png',
      name: 'CodingCactus',
      message: 'Pog, you\'re doing good, but not as good as a cactus would.'
    },
  ],
  90: [
    {
      image: 'r-lena.png',
      name: 'Lena',
      message: 'Wave 90.  All I can say is, Awesome job.'
    },
  ],
  100: [
    {
      image: 'r-amasad.png',
      name: 'Amasad',
      message: 'Wave 100.  I\'m glad you\'re still defending us.  Time to make a tweet about our guardian ^_^'
    },
  ]
}
// Store Data
export interface StoreItem {
  name: string;
  image: string;
  cost: number;
  type?: TowerType | Specials;
  level?: number;
}
export const SpecialsShelf: Map<number, StoreItem> = new Map([
  [ 
    0, {
      name: 'Airstrike',
      image: 'replers/r-h.png',
      cost: 150
    } 
  ],
  [ 
    1, {
      name: 'Piero Bomb',
      image: 'replers/r-piero.png',
      cost: 250
    } 
  ],
  [
    2, {
      name: "Laser Rain",
      image: "replers/r-soren.png",
      cost: 250
    }
  ],
  [
    3, {
      name: "Nix Nuke",
      image: "replers/r-amasad.png",
      cost: 1000
    }
  ],
  [
    4, {
      name: "DartSpear",
      image: "replers/r-dart.png",
      cost: 250
    }
  ],
  [
    5, {
      name: "Freezer",
      image: "replers/r-snow.png",
      cost: 250
    }
  ],
  [
    6, {
      name: "Fart Solution",
      image: "replers/r-cnnd.png",
      cost: 250
    }
  ],
]);
export const TowersShelf: Map<number, StoreItem> = new Map([
  [ 
    0, {
      name: 'Basic - 0',
      image: 'towers/tower-base-0.png',
      cost: 75,
      type: TowerType.Basic,
      level: 0
    } 
  ],
  [ 
    1, {
      name: 'Machine - 0',
      image: 'towers/mgun-base-0.png',
      cost: 100,
      type: TowerType.Machine,
      level: 0
    } 
  ],
  [ 
    2, {
      name: 'Railgun - 0',
      image: 'towers/railgun-base-0.png',
      cost: 200,
      type: TowerType.RailGun,
      level: 0
    } 
  ],
  [ 
    3, {
      name: 'Basic - 1',
      image: 'towers/tower-base-1.png',
      cost: 250,
      type: TowerType.Basic,
      level: 1
    } 
  ],
  [ 
    4, {
      name: 'Machine - 1',
      image: 'towers/mgun-base-1.png',
      cost: 300,
      type: TowerType.Machine,
      level: 1
    } 
  ],
  [ 
    5, {
      name: 'Railgun - 1',
      image: 'towers/railgun-base-1.png',
      cost: 400,
      type: TowerType.RailGun,
      level: 1
    } 
  ],
  [ 
    6, {
      name: 'Basic - 2',
      image: 'towers/tower-base-2.png',
      cost: 450,
      type: TowerType.Basic,
      level: 2
    } 
  ],
  [ 
    7, {
      name: 'Machine - 2',
      image: 'towers/mgun-base-2.png',
      cost: 500,
      type: TowerType.Machine,
      level: 2
    } 
  ],
  [ 
    8, {
      name: 'Railgun - 2',
      image: 'towers/railgun-base-2.png',
      cost: 600,
      type: TowerType.RailGun,
      level: 2
    } 
  ],
  [ 
    9, {
      name: 'Basic - 3',
      image: 'towers/tower-base-3.png',
      cost: 650,
      type: TowerType.Basic,
      level: 3
    } 
  ],
  [ 
    10, {
      name: 'Machine - 3',
      image: 'towers/mgun-base-3.png',
      cost: 700,
      type: TowerType.Machine,
      level: 3
    } 
  ],
  [ 
    11, {
      name: 'Railgun - 3',
      image: 'towers/railgun-base-3.png',
      cost: 800,
      type: TowerType.RailGun,
      level: 3
    } 
  ]
]);