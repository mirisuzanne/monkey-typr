const write = (doc) => {
  const editor = document.getElementById('typr');
  let current = '';

  const autoType = (event, nextChar) => {
    editor.value += nextChar;
    event.preventDefault();
  }

  const getCurrent = () => {
    current = doc.startsWith(editor.value) ? editor.value : current;
  }

  const easyMode = (event) => {
    const value = editor.value;
    const nextChar = doc.charAt(value.length);

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
    }
  }

  if (editor && doc) {
    editor.addEventListener('beforeinput', getCurrent);
    editor.addEventListener('keydown', easyMode);
    editor.addEventListener('input', checkInput);
  }
}
