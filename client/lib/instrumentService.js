const instruments = [
  {
    key: 'unassigned',
    name: 'Unassigned',
    color: 'red',
    hex: '#FF0000',
  },
  {
    key: 'twirler',
    name: 'Twirlers',
    color: 'lightblue',
    hex: '#ADD8E6',
  },
  {
    key: 'flag',
    name: 'Flags',
    color: 'orchid',
    hex: '#DA70D6',
  },
  {
    key: 'flute',
    name: 'Flutes',
    color: 'pink',
    hex: '#FFC0CB',
  },
  {
    key: 'clarinet',
    name: 'Clarinets',
    color: 'gainsboro',
    hex: '#DCDCDC',
  },
  {
    key: 'lowreed',
    name: 'Low Reeds',
    color: 'indigo',
    hex: '#4B0082',
  },
  {
    key: 'saxophone',
    name: 'Saxophones',
    color: 'lightgreen',
    hex: '#90EE90',
  },
  {
    key: 'trumpet',
    name: 'Trumpets',
    color: 'blue',
    hex: '#0000FF',
  },
  {
    key: 'horn',
    name: 'Horns',
    color: 'gold',
    hex: '#0000FF',
  },
  {
    key: 'trombone',
    name: 'Trombones',
    color: 'darkred',
    hex: '#8B0000',
  },
  {
    key: 'baritone',
    name: 'Baritones',
    color: 'purple',
    hex: '#8B0000',
  },
  {
    key: 'tuba',
    name: 'Tubas',
    color: 'orange',
    hex: '#FFA500',
  },
  {
    key: 'percussion',
    name: 'Percussion',
    color: 'gray',
    hex: '#808080',
  },
];

class instrumentService {
  constructor() {
    this.nameMap = instruments.reduce((map, inst) => {
      map[inst.name] = inst;
      return map;
    }, {});
    this.keyMap = instruments.reduce((map, inst) => {
      map[inst.key] = inst;
      return map;
    }, {});
  }

  getInstruments() {
    return instruments.slice();
  }

  getInstrumentColor(instrumentName) {
    // try to find by name, but fall back to key to support older naming style
    const instrument =
      this.nameMap[instrumentName] || this.keyMap[instrumentName];
    if (!instrument || !instrument.color) {
      return 'red';
    }
    return instrument.color;
  }
}

angular
  .module('drillApp')
  .service('instrumentService', ['appStateService', instrumentService]);
