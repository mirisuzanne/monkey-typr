const write = (doc) => {
  const editor = document.getElementById('typr');
  // replace tabs and then trim
  const content = doc.replace('	', '    ').trim();
  let current = '';

  const autoType = (event, nextChar) => {
    editor.value += nextChar;
    event.preventDefault();
  }

  const getCurrent = () => {
    current = content.startsWith(editor.value) ? editor.value : current;
  }

  const handleSpecial = (event) => {
    const value = editor.value;
    const nextChar = content.charAt(value.length);

    if (event.key === nextChar) {
      return;
    } else if (event.key.toLowerCase() === nextChar.toLowerCase()) {
      autoType(event, nextChar);
    } else if ((event.key === ' ') && (nextChar.search(/[^\w\d]/g) !== -1)) {
      autoType(event, nextChar);
    }
  }

  const checkInput = (event) => {
    if (!content.startsWith(editor.value)) {
      editor.value = current;
    }
  }

  if (editor && content) {
    editor.addEventListener('beforeinput', getCurrent);
    editor.addEventListener('keydown', handleSpecial);
    editor.addEventListener('input', checkInput);
  } else {
    console.log('oops');
    console.log(`editor: ${!!editor}`);
    console.log(`doc: ${!!content}`);
  }
}
