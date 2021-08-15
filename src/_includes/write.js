const write = (doc) => {
  const editor = document.getElementById('typr');
  const mode = 'normal';

  // the reported stats
  const statsOut = {};

  [
    'target',
    'remaining',
    'correct',
    'wasted',
    'previous',
    'hint',
  ].forEach((name) => {
    statsOut[name] = document.querySelector(`[data-${name}]`);
  });

  const getStat = (name) => {
    return Number(statsOut[name].getAttribute(`data-${name}`));
  }

  const setStat = (name, value) => {
    statsOut[name].setAttribute(`data-${name}`, value);
    statsOut[name].innerHTML = value;
  }

  let target = getStat('target');
  let fails = 0;

  const stats = {
    target: target,
    correct: 0,
    wasted: 0,
    remaining: target,
    previous: '…',
    hint: '',
  };

  const pushStats = (stats) => {
    Object.keys(stats).forEach((name) => { setStat(name, stats[name]) });
  }

  // the current state
  const state = {
    value: '',
    count: 0,
    need: '',
  };

  const setState = () => {
    state.value = doc.startsWith(editor.value) ? editor.value : state.value;
    state.count = state.value.length;
    state.need = doc.charAt(state.count);
  }

  // recording the details
  const recordEvent = (event) => {
    stats.previous = event.data;
    setState();
  }

  const recordResult = (good) => {
    if (good) {
      fails = 0;
      stats.hint = '';
    } else {
      fails += 1;
      stats.wasted += 1;

      if (fails > 10) {
        stats.hint = `⚠️ Have you tried "${state.need}"?`;
      } else {
        stats.hint = '';
      }
    }

    setState();
    stats.correct = state.count;
    stats.remaining = stats.target - stats.correct;
    pushStats(stats);
  }

  // cheat code!
  const isSpecial = (value) => {
    return (value.search(/[^\w\d]/g) !== -1);
  }

  const autoType = () => {
    editor.value += state.need;
    return true;
  }

  // cheat modes
  const normalCheat = () => {
    if (stats.previous.toLowerCase() === state.need.toLowerCase()) {
      return autoType();
    } else if ((stats.previous === ' ') && isSpecial(state.need)) {
      return autoType();
    } else {
      return false;
    }
  }

  // actual input handling
  const handleInput = (event) => {
    recordEvent(event);

    if (stats.previous === state.need) {
      recordResult(true);
    } else if (stats.previous) {
      // reset
      event.preventDefault();
      editor.value = state.value;

      // try some cheats
      let result = false;

      if (mode === 'normal') {
        result = normalCheat();
      }

      // record the result
      recordResult(result);
    }
  }

  // init onload
  const init = () => {
    setState();
    editor.addEventListener('input', handleInput);
  }

  if (editor && doc) {
    document.onload = init();
  }
}
