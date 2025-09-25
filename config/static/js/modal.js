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


/* DELETE CHARACTER MODAL */
const deleteBtnCharacter = document.querySelectorAll('.delete')

const modalDelete = document.querySelector('.modal-delete')
const confirmBtn = document.getElementById('confirm-delete')
const cancelBtn = document.getElementById('cancel-delete')

const idCharacterDelete = null

deleteBtnCharacter.forEach(button => {
    button.addEventListener('click', () => {
        
    })
})

