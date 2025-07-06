const itemsClass = document.querySelectorAll('.item-class');
const modal = document.getElementById('modal');

itemsClass.forEach((item) => {
    item.addEventListener('click', () => {
        modal.style.display = 'flex'
    })
})

modal.addEventListener('click', () => {
    modal.style.display = 'none'

    return
})