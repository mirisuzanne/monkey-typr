const toggle = (toggleBtn) => {
  const name = toggleBtn.getAttribute("data-toggle");
  const targetName = `data-${name}`;
  const targetAttr = `[${targetName}]`;
  const target = document.querySelector(targetAttr);
  const defaultStates = ['off', 'on'];
  const btnStates = toggleBtn
    .getAttribute("data-states")
    .split(' ')
    .map((state) => state.trim());
  const states = btnStates.length > 1 ? btnStates : defaultStates;

  const toggleIt = () => {
    const current = target.getAttribute(targetName);
    const setTo = states[((states.indexOf(current) + 1) % states.length)];
    target.setAttribute(targetName, setTo);
    toggleBtn.setAttribute('data-state', setTo);
    toggleBtn.setAttribute('aria-pressed', !['auto', 'off'].includes(setTo));
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      toggleIt();
    });
  }
}

document.querySelectorAll(`[data-toggle]`).forEach((btn) => {
  toggle(btn);
});
