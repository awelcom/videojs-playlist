
/**
 * Validates a number of seconds to use as the auto-advance delay.
 *
 * @private
 * @param   {number} s
 *          The number to check
 *
 * @return  {boolean}
 *          Whether this is a valid second or not
 */
const validSeconds = s =>
  typeof s === 'number' && !isNaN(s) && s >= 0 && s < Infinity;

/**
 * Resets the auto-advance behavior of a player.
 *
 * @param {Player} player
 *        The player to reset the behavior on
 */
let reset = (player) => {
  const aa = player.playlist.autoadvance_;

  if (aa.timeout) {
    player.clearTimeout(aa.timeout);
  }

  if (aa.trigger) {
    player.off('ended', aa.trigger);
  }

  aa.timeout = null;
  aa.trigger = null;
};

/**
 * Sets up auto-advance behavior on a player.
 *
 * @param  {Player} player
 *         the current player
 *
 * @param  {number} delay
 *         The number of seconds to wait before each auto-advance.
 *
 * @return {undefined}
 *         Used to short circuit function logic
 */
const setup = (player, delay) => {
  reset(player);

  // Before queuing up new auto-advance behavior, check if `seconds` was
  // called with a valid value.
  if (!validSeconds(delay)) {
    player.playlist.autoadvance_.delay = null;
    return;
  }

  player.playlist.autoadvance_.delay = delay;

  player.playlist.autoadvance_.trigger = function() {
    player.playlist.autoadvance_.timeout = player.setTimeout(() => {
      reset(player);
      player.playlist.next();
    }, delay * 1000);
  };

  player.one('ended', player.playlist.autoadvance_.trigger);
};

/**
 * Used to change the reset function in this module at runtime
 * This should only be used in tests.
 *
 * @param {Function} fn
 *        The function to se the reset to
 */
const setReset_ = (fn) => {
  reset = fn;
};

export {
  setReset_,
  reset,
  setup
};
