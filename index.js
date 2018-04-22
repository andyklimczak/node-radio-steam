var lame = require('lame');
var Speaker = require('speaker');
var request = require('request');
var Volume = require('pcm-volume');

//var url = 'http://ice1.somafm.com/dronezone-256-mp3';
var url = 'http://radio.plaza.one/mp3';

audioOptions = {
  channels: 2,
  bitDepth: 16,
  sampleRate: 44100,
  mode: lame.STEREO
}

var speaker = new Speaker(audioOptions);
var decoder = new lame.Decoder();
var volume = new Volume();

setTimeout(function() {
  console.log('volume set');
  volume.setVolume(0.1);
}, 5000);

volume.pipe(speaker);

request.get(url).on('response', function(res) {
  console.log(res);
  res.pipe(decoder).once('format', function() {
    decoder.pipe(volume);
  });
});
