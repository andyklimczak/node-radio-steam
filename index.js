var lame = require('lame');
var Speaker = require('speaker');
var request = require('request');
var Volume = require('pcm-volume');

//var url = 'http://ice1.somafm.com/dronezone-256-mp3';
var url = 'http://radio.plaza.one/mp3';

function RadioStream() {
  this.playing = false;
  this.volume = 100;
  this.url = null;
  this.speaker = new Speaker(
    {
      channels: 2,
      bitDepth: 16,
      sampleRate: 44100,
      mode: lame.STEREO
  });
  this.decoder = new lame.Decoder();
  this.volume = new Volume();
  this.andy = 'andy';
};

RadioStream.prototype.play = function() {
  this.playing = true;
  var _this = this;
  request.get(_this.url).on('response', function(res) {
    res.pipe(_this.decoder).once('format', function() {
      _this.volume.pipe(_this.speaker);
      _this.decoder.pipe(_this.volume);
    });
  });
};

RadioStream.prototype.stop = function() {
  this.playing = false;
  this.speaker.end();
};

RadioStream.prototype.setStreamUrl = function(url) {
  this.url = url;
}

RadioStream.prototype.setVolume = function(volume) {
  this.volume = volume < 0 ?
    0 :
    volume > 100 ?
    100 :
    volume;
}

RadioStream.prototype.increaseVolume = function(volume) {
  this.setVolume(this.volume + volume);
}

RadioStream.prototype.decreaseVolume = function(volume) {
  this.setVolume(this.volume - volume);
}

// test
var radio = new RadioStream();
radio.setStreamUrl(url);
radio.play();
