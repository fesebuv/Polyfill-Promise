'use strict'
var events = require('events');
var eventEmitter = new events.EventEmitter();

function _Promise(executor) {
  this.value = null;
  this.error = null;
  this.status = 'pending';

  var p = this;

  var resolve = function (val) {
    p.value = val;
    p.status = 'fullfilled';
    eventEmitter.emit('fullfill');
  };

  var reject = function (err) {
    p.status = 'rejected';
    p.error = err;
    eventEmitter.emit('reject');
  }

  executor.call(this, resolve, reject);

}

_Promise.prototype.then = function(cb) {
  var that = this;
  eventEmitter.on('fullfill', function (evt) {
    that.value = cb.call(that, that.value);
  });

  eventEmitter.on('reject', function (err) {
    if(typeof rj === 'function') {
      rj.call(that, that.error);
    }
  });

  return this;
};

_Promise.prototype.catch = function (rj) {
  var that = this;
  eventEmitter.on('reject', function (err) {
    rj.call(that, that.error);
  });
}

var counter = 0;
var getDelay = function (count) {
  return count * 500;
};

var p = new _Promise(function (resolve, reject) {
  counter++;
  setTimeout(function () {
    resolve('Success!');
  }, getDelay(counter));
})
.then(function (successMessage) {
  return `Yay! ${successMessage}`;
})
.then(function (msg) {
  console.log(msg);
  return msg;
});


var p2 = new _Promise(function (resolve, reject) {
  counter++;
  setTimeout(function () {
    reject('there was an error!');
  }, getDelay(counter));
})
.catch(function (err) {
  console.log(err);
})

var p3 = new _Promise(function (resolve, reject) {
  counter++;
  setTimeout(function () {
    reject('there was an error!');
  }, getDelay(counter));
})
.then(function () {
  return 1;
}, function (err) {
  console.log(err);
})
