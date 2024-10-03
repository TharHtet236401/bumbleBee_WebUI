const expandCollapseBtn = document.getElementById('expand_collapse_btn')
const sideBarEl = document.getElementById('sidebar')
const sideBarOptionEls = document.querySelectorAll('.side_bar__option')
const expandCollapseBtnIcon = document.querySelector('.expand-collapse-btn svg')

const mediaQuery = window.matchMedia('(max-width: 900px)')

expandCollapseBtn.addEventListener('click', () => {
    sideBarEl.classList.toggle('side_bar_collapse_animation')
    sideBarOptionEls[0].classList.toggle('display_none')
    sideBarOptionEls[1].classList.toggle('display_none')
    expandCollapseBtnIcon.classList.toggle('rotate_collapse_btn')
})

function handleSidebarLayoutChange(e) {
    console.log('123')
    if (e.matches) {
        sideBarEl.classList.add('side_bar_collapse_animation')
        sideBarOptionEls[0].classList.add('display_none')
        sideBarOptionEls[1].classList.add('display_none')
        expandCollapseBtnIcon.classList.add('rotate_collapse_btn')
    } else {
        sideBarEl.classList.remove('side_bar_collapse_animation')
        sideBarOptionEls[0].classList.remove('display_none')
        sideBarOptionEls[1].classList.remove('display_none')
        expandCollapseBtnIcon.classList.remove('rotate_collapse_btn')
    }
}

// Register event listener
mediaQuery.addEventListener('change',handleSidebarLayoutChange)

// Initial check
handleSidebarLayoutChange(mediaQuery)