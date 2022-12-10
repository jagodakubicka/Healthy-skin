const tl = gsap.timeline({defaults: {duration: 0.75, ease: 'Power3.easeOut'},
});

const logo = document.querySelector('.page-logo');

const letters = logo.textContent.split('');
logo.textContent = '';

letters.forEach(letter => {
 logo.innerHTML += '<span class="letter">' + letter + '</span>';
})

gsap.set('.letter', {display: 'inline-block'});
gsap.fromTo('.letter', {y:'100%'}, {y:0, delay: 1, stagger: 0.05, ease: 'back.out(3)'});