db.users.insertMany([
  {
    name: 'Ellen Ripley',
    password: 'Nostromo123',
    email: 'ellen.ripley@weyland-yutani.corp',
    birthday: new Date('1970-01-01'),
    favoriteMovies: [
      ObjectId("636ff6437475cbe95c6989ca"),
      ObjectId("636ff6437475cbe95c6989d3")
    ]
  },
  {
    name: 'Corporal Dwayne Hicks',
    password: 'nukeItFromTheOrbit',
    email: 'dwayne.hicks@uscm.us',
    birthday: new Date('1970-01-01'),
    favoriteMovies: [
      ObjectId("636ff6437475cbe95c6989ca")
    ]
  },
  {
    name: 'Rick Deckard',
    password: 'electronicsheep',
    email: 'rick.deckard@sfpd.gov',
    birthday: new Date('1970-01-01'),
    favoriteMovies: [
      ObjectId("636ff6437475cbe95c6989d1")
    ]
  },
  {
    name: 'Conan',
    password: 'riddleOfSteel',
    birthday: new Date('1970-01-01'),
    favoriteMovies: [
      ObjectId("636ff6437475cbe95c6989cd")
    ]
  },
  {
    name: 'Judge Dredd',
    password: 'iamthelaw',
    email: 'judge.dredd@megacity1.justice',
    birthday: new Date('1970-01-01'),
    favoriteMovies: [
      ObjectId("636ff6437475cbe95c6989c9")
    ]
  }
]);
