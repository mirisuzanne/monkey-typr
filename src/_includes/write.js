const write = (doc) => {
  const editor = document.getElementById('typr');
  const favicon = document.querySelector("link[rel~='icon']");
  const good_favicon_href = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Ctext%20y%3D%22.9em%22%20font-size%3D%2290%22%3E%F0%9F%90%B5%3C%2Ftext%3E%3C%2Fsvg%3E";
  const bad_favicon_href = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Ctext%20y%3D%22.9em%22%20font-size%3D%2290%22%3E%F0%9F%99%88%3C%2Ftext%3E%3C%2Fsvg%3E";
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
      favicon.href = good_favicon_href;
      stats.hint = '';
    } else {
      fails += 1;
      favicon.href = bad_favicon_href;
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
