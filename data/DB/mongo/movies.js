db.movies.insertMany([
  {
    title: 'Dredd',
    year: 2012,
    director: {
      name: 'Alex Garland',
      nationality: 'UK',
      birth: 1970
    },
    genre: {
      name: 'sci-fi',
      description: 'sci-fi: genre description'
    },
    featured: false
  },
  {
    title: 'Aliens',
    year: 1986,
    description: 'Aliens: movie description',
    director: {
      name: 'James Cameron',
      nationality: 'Canada',
      birth: 1954
    },
    genre: {
      name: 'sci-fi',
      description: 'sci-fi: genre description'
    },
    featured: true
  },
  {
    title: 'Natural Born Killers',
    director: {
      name: 'Oliver Stone',
      nationality: 'USA',
      birth: 1946
    },
    featured: false
  },
  {
    title: 'The Road',
    director: {
      name: 'John Hillcoat',
      birth: 1960
    },
    genre: {
      name: 'post-apocalyptic',
      description: 'post-apocalyptic: genre description'
    },
    featured: false
  },
  {
    title: 'Conan The Barbarian',
    year: 1982,
    director: {
      name: 'John Milius',
      nationality: 'USA',
      birth: 1944
    },
    genre: {
      name: 'fantasy',
      description: 'fantasy: genre description'
    },
    featured: true
  },
  {
    title: 'True Lies',
    year: 1994,
    director: {
      name: 'James Cameron',
      nationality: 'Canada',
      birth: 1954
    },
    genre: {
      name: 'action/comedy',
      description: 'action/comedy: genre description'
    },
    featured: true
  },
  {
    title: 'Full Metal Jacket',
    year: 1987,
    description: 'Show me your warface!',
    director: {
      name: 'Stanley Kubrick',
      nationality: 'USA',
      birth: 1928,
      death: 1999
    },
    genre: {
      name: 'war drama',
      description: 'war drama: genre description'
    },
    featured: true
  },
  {
    title: 'A Clockwork Orange',
    year: 1971,
    description: 'This must be a real horrorshow film if you\'re so keen on my viddying it.',
    director: {
      name: 'Stanley Kubrick',
      nationality: 'USA',
      birth: 1928,
      death: 1999
    },
    genre: {
      name: 'the old ultra-violence',
      description: 'the old ultra-violence: genre description'
    },
    featured: false
  },
  {
    title: 'Blade Runner',
    year: 1982,
    description: 'Do androids dream of electric sheep?',
    director: {
      name: 'Ridley Scott',
      nationality: 'United Kingdom',
      birth: 1937
    },
    genre: {
      name: 'sci-fi',
      description: 'sci-fi: genre description'
    },
    featured: true
  },
  {
    title: 'Terminator 2: Judgment Day',
    year: 1991,
    director: {
      name: 'James Cameron',
      nationality: 'Canada',
      birth: 1954
    },
    genre: {
      name: 'action',
      description: 'action: genre description'
    },
    featured: false
  },
  {
    title: 'Alien',
    year: 1979,
    description: 'In Space No One Can Hear You Scream ...',
    director: {
      name: 'Ridley Scott',
      nationality: 'United Kingdom',
      birth: 1937
    },
    genre: {
      name: 'sci-fi',
      description: 'sci-fi: genre description'
    },
    featured: true
  }
]);
