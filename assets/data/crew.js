/* ==========================================================================
   THE CREW: everyone shown in the "The Team" section of the site.
   Edit this file to add, change or remove people, roles and teams.
   script.js turns it into the section; no other file needs touching.

   PEOPLE  Each person is listed once and referenced by their key, so someone
           with two roles (like Jakub) has one avatar and one Discord ID.
     name       Display name (required).
     tag        Optional small label after the name, e.g. "Lead Dev".
     handle     Optional Discord username, shown as @handle.
     discordId  Optional Discord user ID (a long number, as a string). When set,
                the person links to their Discord profile.
                Get it: Discord > User Settings > Advanced > turn on Developer
                Mode, then right-click the person > Copy User ID.
     avatar     Optional image. Best: save their avatar into assets/img/crew/
                (square, about 128x128, .webp/.png/.jpg) and put the path here,
                e.g. "assets/img/crew/csoka.webp". A Discord CDN link
                (https://cdn.discordapp.com/avatars/<id>/<hash>.png?size=128)
                also works, but breaks when they change their avatar.
                Left empty, or if the image fails to load, their initials show.

   TEAMS   Shown in this order. Each team has roles, each role lists people by key.
           To add a team, copy a whole { name: ..., roles: [...] } block.

   Keep the quotes and the commas between entries.
   ========================================================================== */

window.PLANEX_CREW = {
  people: {
    csoka: {
      name: 'CSOKA',
      tag: 'Lead Dev',
      handle: '',
      discordId: '',   // TODO: Discord user ID
      avatar: ''       // TODO: e.g. 'assets/img/crew/csoka.webp'
    },
    tierod: {
      name: '4Tierod',
      tag: 'Dev',
      handle: '',
      discordId: '',   // TODO
      avatar: ''       // TODO
    },
    jakub: {
      name: 'Jakub',
      tag: 'Lead Idiot',
      handle: '',
      discordId: '',   // TODO
      avatar: ''       // TODO
    },
    vuk: {
      name: 'Vuk',
      tag: '',
      handle: 'creepylilix',
      discordId: '',   // TODO
      avatar: ''       // TODO
    },
    epicjab: {
      name: 'EpicJab',
      tag: '',
      handle: 'Jab2Roblox',
      discordId: '',   // TODO
      avatar: ''       // TODO
    }
  },

  teams: [
    {
      name: 'Development Team',
      blurb: "The architects and engineers behind the game's mechanics, visuals, and audio.",
      roles: [
        {
          title: 'Lead Developer',
          blurb: 'The project lead responsible for the overall vision, core systems, and management of the development cycle.',
          members: ['csoka']
        },
        {
          title: 'Developer',
          blurb: 'Key contributors handling the coding, building, and technical implementation of game features.',
          members: ['tierod']
        },
        {
          title: 'Sound Designer',
          blurb: 'The creative mind behind the atmospheric audio, SFX, and music that defines the PLANEX experience.',
          members: ['jakub']
        },
        {
          title: 'Extra Helpers',
          blurb: 'Valued contributors who assist with specific assets, testing, or specialized technical tasks.',
          members: ['vuk', 'jakub', 'epicjab']
        }
      ]
    }
  ]
};
