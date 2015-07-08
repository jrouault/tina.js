var Tweener = require('./Tweener');

/**
 *
 * @classdesc
 * Tweener that manages the update of time independantly of the actual passing of time.
 * Every update, the time interval is equal to the given tupt (time units per tick).
 *
 */
function Ticker(tupt) {
	Tweener.call(this);

	// Time units per tick (tupt)
	// Every second, 'tupt' time units elapse
	this._tupt = tupt || 1;

	this._nbTicks = 0;
}
Ticker.prototype = Object.create(Tweener.prototype);
Ticker.prototype.constructor = Ticker;
module.exports = Ticker;

Object.defineProperty(Ticker.prototype, 'tupt', {
	get: function () { return this._tupt; },
	set: function (tupt) {
		if (tupt < 0) {
			this._warn('[Timer.tupt] tupt cannot be negative, stop messing with time.');
			tupt = 0;
		}

		var dt = this._nbTicks;
		if (tupt === 0) {
			// Setting start as if new tupt was 1
			this._nbTicks = this._time - dt * this._tupt;
		} else {
			if (this._tupt === 0) {
				// If current tupt is 0,
				// it corresponds to a virtual tupt of 1
				// when it comes to determing how many ticks have passed
				this._nbTicks = this._time - dt / tupt;
			} else {
				this._nbTicks = this._time - dt * this._tupt / tupt;
			}
		}

		this._tupt = tupt;
	}
});

Ticker.prototype._getElapsedTime = function () {
	return this._tupt * (this._nbTicks++);
};

Ticker.prototype._getSingleStepDuration = function () {
	return this._tupt;
};

Ticker.prototype.convertToTicks = function(timeUnits) {
	return timeUnits / this._tupt;
};

Ticker.prototype.convertToTimeUnits = function(nbTicks) {
	return nbTicks * this._tupt;
};