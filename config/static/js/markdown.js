const textarea = document.getElementById('history-character');
const preview = document.getElementById('preview-markdown');
const empty = document.getElementById('empty');

function verifyPreviewContent(valueInput) {
    if (valueInput.trim() != '') {
        empty.style.display = 'none'
    } else {
        empty.style.display = 'flex'
    }
}

textarea.addEventListener('input', () => {
    const markdown = textarea.value
    preview.innerHTML = marked.parse(markdown)
    verifyPreviewContent(markdown)
})