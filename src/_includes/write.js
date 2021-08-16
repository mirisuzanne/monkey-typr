const write = (doc) => {
  const editor = document.getElementById('typr');
  const favicon = document.querySelector("link[rel~='icon']");
  const good_favicon_href = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Ctext%20y%3D%22.9em%22%20font-size%3D%2290%22%3E%F0%9F%90%B5%3C%2Ftext%3E%3C%2Fsvg%3E";
  const bad_favicon_href = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Ctext%20y%3D%22.9em%22%20font-size%3D%2290%22%3E%F0%9F%99%88%3C%2Ftext%3E%3C%2Fsvg%3E";

  // setting the mode
  const cheatControls = {
    off: document.querySelector('[data-cheat="off"]'),
    normal: document.querySelector('[data-cheat="normal"]'),
    all: document.querySelector('[data-cheat="all"]'),
  };

  const setCheat = (scheme) => {
    if (scheme === 'normal') {
      localStorage.removeItem('cheat');
    } else {
      localStorage.setItem('cheat', scheme);
    }
  };

  const getCheat = () => {
    const cheat = localStorage.getItem('cheat');
    return cheat && ['off', 'normal', 'all'].includes(cheat)
      ? cheat
      : 'normal';
  };

  const updateControls = () => {
    const cheat = getCheat();
    Object.keys(cheatControls).forEach((opt) => {
      cheatControls[opt].checked = (opt === cheat);
    });
  }

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

  const isValid = () => doc.startsWith(editor.value);

  const setState = () => {
    state.value = isValid() ? editor.value : state.value;
    state.count = state.value.length;
    state.need = doc.charAt(state.count);
  }

  // recording the details
  const recordResult = (good) => {
    if (good) {
      fails = 0;
      favicon.href = good_favicon_href;
      stats.hint = '';
    } else {
      fails += 1;
      favicon.href = bad_favicon_href;
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

  // cheating
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
    stats.previous = event.data;

    if (stats.previous == state.need) {
      recordResult(true);
    } else if (stats.previous) {
      // reset
      event.preventDefault();
      editor.value = state.value;

      // try some cheats
      let result = false;
      let cheat = getCheat();

      if (cheat === 'normal') {
        result = normalCheat();
      } else if (cheat === 'all') {
        result = autoType();
      }

      // record the result
      recordResult(result);
    } else if (!isValid()) {
      editor.value = state.value;
      recordResult(false);
    }
  }

  // init onload
  if (editor && doc) {
    setState();
    updateControls();
    editor.addEventListener('input', handleInput);
    cheatControls.off.addEventListener("change", () => setCheat("off"));
    cheatControls.normal.addEventListener("change", () => setCheat("normal"));
    cheatControls.all.addEventListener("change", () => setCheat("all"));
  }
}
