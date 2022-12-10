const tl = gsap.timeline({defaults: {duration: 0.75, ease: 'Power3.easeOut'},
});

//nav text
const logo = document.querySelector('.page-logo');

const letters = logo.textContent.split('');
logo.textContent = '';

letters.forEach(letter => {
 logo.innerHTML += '<span class="letter">' + letter + '</span>';
})

gsap.set('.letter', {display: 'inline-block'});
gsap.fromTo('.letter', {y:'100%'}, {y:0, delay: 1, stagger: 0.05, ease: 'back.out(3)'});

//cart

gsap.fromTo('.shopping-cart', {x:50, opacity:0}, {x:0, opacity:1})

// hero section title

tl.fromTo('#title1', {x:"100%", opacity:0,}, {x: 0, opacity:1,}, "<20%");
tl.fromTo('#title3', {x:"-100%", opacity:0}, {x: 0, opacity:1,}, "<20%");
tl.fromTo('#title2', {y:"100%", opacity:0}, {y: 0, opacity:1,}, "<20%");
tl.fromTo('.header-link', {y:"-100%", opacity:0}, {y: 0, opacity:1,});