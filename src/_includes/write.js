const write = (doc) => {
  const editor = document.getElementById('typr');
  let current = '';

  // the stats
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

  const target = getStat('target');
  let fails = 0;

  const stats = {
    target,
    correct: 0,
    wasted: 0,
    remaining: target,
    previous: '…',
    hint: '',
  };

  const pushStats = (stats) => {
    Object.keys(stats).forEach((name) => { setStat(name, stats[name]) });
  }

  // the writing
  const getCurrent = () => {
    current = doc.startsWith(editor.value) ? editor.value : current;
  }

  const tried = (char, good) => {
    stats.previous = char;
    stats.correct = editor.value.length;
    stats.remaining = target - stats.correct;

    if (good) {
      fails = 0;
      stats.hint = '';
    } else {
      fails += 1;
      stats.wasted += 1;

      if (fails > 10) {
        const nextChar = doc.charAt(stats.correct);
        stats.hint = `Have you tried "${nextChar}"?`;
      } else {
        stats.hint = '';
      }
    }

    pushStats(stats);
  }

  const easyMode = (event) => {
    const value = editor.value;
    const nextChar = doc.charAt(value.length);

    // update keystroke
    setStat('previous', stats.previous);

    // insert characters
    const autoType = (event, nextChar) => {
      editor.value += nextChar;
      event.preventDefault();
      tried(event.key, true);
    }

    // easy mode helpers
    if (event.key === nextChar) {
      return;
    } else if (event.key.toLowerCase() === nextChar.toLowerCase()) {
      autoType(event, nextChar);
    } else if ((event.key === ' ') && (nextChar.search(/[^\w\d]/g) !== -1)) {
      autoType(event, nextChar);
    }
  }

  const checkInput = (event) => {
    if (!doc.startsWith(editor.value)) {
      editor.value = current;
      tried(event.data, false);
    } else {
      tried(event.data, true);
    }
  }

  if (editor && doc) {
    editor.addEventListener('beforeinput', getCurrent);
    editor.addEventListener('keydown', easyMode);
    editor.addEventListener('input', checkInput);
  }
}
