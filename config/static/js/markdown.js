const textarea = document.getElementById('history-character');
const preview = document.getElementById('preview-markdown');

textarea.addEventListener('input', () => {
    const markdown = textarea.value
    preview.innerHTML = marked.parse(markdown)
})