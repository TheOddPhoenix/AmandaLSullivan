module.exports = {
  content: ['./index.html', './*/index.html', './*/index.htm', './assets/js/*.js'],
  theme: { extend: {
    colors: {
      deepEvergreen: '#202420', charcoal: '#1C1C1C', forestGreen: '#2F4732',
      antiqueGold: '#B68A3B', lightGold: '#C6A76D', warmIvory: '#EDE9E3',
      mutedIvory: 'rgba(237, 233, 227, 0.70)'
    },
    fontFamily: { serif: ['Libre Baskerville', 'serif'], sans: ['Montserrat', 'sans-serif'] }
  } }
};
