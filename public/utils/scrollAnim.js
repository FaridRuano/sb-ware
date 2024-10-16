const titleObv = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add('show')
        }
    })
})

const skillObv = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add('open')
        }
    })
})

const titleElements = document.querySelectorAll('.title')

const skillsElements = document.querySelectorAll('.title-bg')

titleElements.forEach((el) => titleObv.observe(el))

skillsElements.forEach((el) => skillObv.observe(el))

/* ======NAVBAR===== */

let sections = document.querySelectorAll('section')
let navLinks = document.querySelectorAll('.nav-item')

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY
        let offset = sec.offsetTop
        let height = sec.offsetHeight
        let id = sec.getAttribute('id')

        if(top >= offset && top < offset + height){
            navLinks.forEach(link => {
                link.classList.remove('active')
                document.getElementById(id + 'nav').classList.add('active')
            })
        }
    })
}






