const assignTypeAndId = type => x => Object.assign({ type, id: x.text }, x);

const comments = [
  { text: 'zeroth comment' },
  { text: 'first comment' },
  { text: 'second comment' },
  { text: 'third comment' },
  { text: 'fourth comment' },
  { text: 'fifth comment' },
  { text: 'sixth comment' },
  { text: 'seventh comment' },
  { text: 'eighth comment' },
  { text: 'ninth comment' },
  { text: 'tenth comment' },
  { text: 'eleventh comment' },
  { text: 'twelfth comment' },
  { text: 'thirteenth comment' },
  { text: 'fourteenth comment' },
  { text: 'fifteenth comment' },
  { text: 'sixteenth comment' },
  { text: 'seventeenth comment' },
  { text: 'eighteenth comment' },
  { text: 'nineteenth comment' },
].map(assignTypeAndId('Comment'));

module.exports = [
  {
    id: 'a',
    type: 'Person',
    firstName: 'Andy',
    lastName: 'Tryhard',
    intro: 'And harder',
    comments: comments.map(c => c.id),
  },
  {
    id: 'b',
    type: 'Skill',
    label: 'Math',
  },
  ...comments,
];
