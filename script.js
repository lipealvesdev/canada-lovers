const navToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.desktop-nav');

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('open', !isOpen);
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

// Scroll-aware glass dock: the active pill follows the section in view.
const dockLinks = [...document.querySelectorAll('.dock-item')];
const observedSections = dockLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const sectionObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  dockLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
}, { rootMargin: '-28% 0px -52% 0px', threshold: [0, .15, .4] });
observedSections.forEach(section => sectionObserver.observe(section));

// Reveal content as it enters the viewport; reduced-motion users see everything immediately.
const revealTargets = document.querySelectorAll('.intro, .editorial-note, .section-head, .destination-card, .pathways-head, .path-item, .community-content');
revealTargets.forEach(element => element.classList.add('reveal'));
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }
}), { threshold: .12 });
revealTargets.forEach(element => revealObserver.observe(element));

// Tiny, restrained magnetic response for touch-like, tactile controls on pointer devices.
document.querySelectorAll('.magnetic').forEach(button => {
  button.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = button.getBoundingClientRect();
    const x = (event.clientX - box.left - box.width / 2) * .08;
    const y = (event.clientY - box.top - box.height / 2) * .08;
    button.style.translate = `${x}px ${y}px`;
  });
  button.addEventListener('pointerleave', () => { button.style.translate = ''; });
});

const cityStories = {
  toronto: {name:'Toronto',province:'ONTÁRIO',coordinates:'43°39′N · 79°23′W',fact:'Toronto tem uma vasta rede de ravinas e parques naturais — por isso, seu apelido oficial é “City within a Park”.',image:'photo-1517090504586-fde19ea6066f',alt:'Horizonte urbano de Toronto',url:'https://www.destinationtoronto.com/'},
  vancouver: {name:'Vancouver',province:'COLÚMBIA BRITÂNICA',coordinates:'49°16′N · 123°07′W',fact:'Em Vancouver, dá para sair do centro e chegar à floresta, ao oceano ou às montanhas em poucos minutos.',image:'photo-1559511260-66a654ae982a',alt:'Paisagem urbana de Vancouver entre montanhas e mar',url:'https://www.destinationvancouver.com/'},
  calgary: {name:'Calgary',province:'ALBERTA',coordinates:'51°03′N · 114°04′W',fact:'As Montanhas Rochosas ficam pertinho: Calgary é uma das portas de entrada para parques como Banff e Kananaskis.',image:'https://upload.wikimedia.org/wikipedia/commons/5/57/Calgary_banner_Panorama.jpg',alt:'Panorama do horizonte de Calgary',url:'https://www.visitcalgary.com/'},
  winnipeg: {name:'Winnipeg',province:'MANITOBA',coordinates:'49°53′N · 97°08′W',fact:'Conhecida como “The Peg”, a cidade fica na confluência dos rios Red e Assiniboine — um encontro que moldou sua história.',image:'photo-1500530855697-b586d89ba3ee',alt:'Paisagem ampla das pradarias canadenses',url:'https://www.travelmanitoba.com/'},
  montreal: {name:'Montréal',province:'QUÉBEC',coordinates:'45°30′N · 73°34′W',fact:'O nome da cidade vem do Mont-Royal, a colina que se ergue no coração de Montréal e inspirou seu nome.',image:'photo-1519178614-68673b201f36',alt:'Arquitetura e ruas de Montréal',url:'https://www.mtl.org/en'},
  quebec: {name:'Québec',province:'QUÉBEC',coordinates:'46°49′N · 71°12′W',fact:'O Vieux-Québec é a única cidade fortificada ao norte do México e faz parte do Patrimônio Mundial da UNESCO.',image:'photo-1548574505-5e239809ee19',alt:'Ruas históricas da cidade de Québec',url:'https://www.quebec-cite.com/en'},
  halifax: {name:'Halifax',province:'NOVA ESCÓCIA',coordinates:'44°39′N · 63°34′W',fact:'A cidade vive de frente para o Atlântico: seu waterfront histórico é um dos grandes pontos de encontro de Halifax.',image:'photo-1500375592092-40eb2168fd21',alt:'Costa atlântica da Nova Escócia',url:'https://discoverhalifaxns.com/'},
  whitehorse: {name:'Whitehorse',province:'YUKON',coordinates:'60°43′N · 135°03′W',fact:'Whitehorse é a capital do Yukon e um ótimo lugar para observar a aurora boreal nas noites escuras de inverno.',image:'photo-1470770841072-f978cf4d019e',alt:'Paisagem montanhosa no norte do Canadá',url:'https://www.travelyukon.com/en'}
};

const mapPins = document.querySelectorAll('.map-pin');
const cityImage = document.querySelector('#city-image');
const cityCard = document.querySelector('.city-card');
mapPins.forEach(pin => pin.addEventListener('click', () => {
  const city = cityStories[pin.dataset.city];
  if (!city) return;
  mapPins.forEach(item => item.classList.toggle('selected', item === pin));
  cityCard.classList.add('changing');
  window.setTimeout(() => {
    document.querySelector('#city-province').textContent = city.province;
    document.querySelector('#city-coordinates').textContent = city.coordinates;
    document.querySelector('#city-name').textContent = city.name;
    document.querySelector('#city-fact').textContent = city.fact;
    document.querySelector('#city-link').href = city.url;
    const imageUrl = city.image.startsWith('http') ? city.image : `https://images.unsplash.com/${city.image}?auto=format&fit=crop&w=1100&q=85`;
    cityImage.style.backgroundImage = `url("${imageUrl}")`;
    cityImage.setAttribute('aria-label', city.alt);
    cityCard.classList.remove('changing');
  }, 160);
}));


const filmStories = {
  atanarjuat: {index:'SELEÇÃO 01 / 06',origin:'NUNAVUT · INUKTITUT',title:'Atanarjuat: The Fast Runner',credit:'Zacharias Kunuk · 2001',description:'Uma antiga lenda inuit ganha vida em Inuktitut. Dirigido por cineastas inuit, o filme se passa em Igloolik, Nunavut.',image:'https://images.bauerhosting.com/legacy/empire-tmdb/films/13245/images/lTHYrXktQ03L9vkHmr4bM2P9ENk.jpg?ar=16%3A9&auto=format&crop=top&fit=crop&q=80&w=1440',alt:'Cena de Atanarjuat: The Fast Runner na paisagem ártica',url:'https://www.nfb.ca/film/atanarjuat_the_fast_runner_en/'},
  'turning-red': {index:'SELEÇÃO 02 / 06',origin:'TORONTO · PIXAR',title:'Turning Red',credit:'Domee Shi · 2022',description:'Mei Lee vive as mudanças da adolescência em Toronto — e vira um panda-vermelho gigante quando fica muito animada.',image:'https://lumiere-a.akamaihd.net/v1/images/d0fe8c094accb5f217ce0135538c0aba_4096x2209_bff68f8f.jpeg?region=84%2C0%2C3928%2C2209',alt:'Cena de Turning Red, animação da Disney e Pixar ambientada em Toronto',url:'https://www.pixar.com/turning-red'},
  pixels: {index:'SELEÇÃO 03 / 06',origin:'TORONTO · ONTÁRIO',title:'Pixels',credit:'Chris Columbus · 2015',description:'Cenas de ação foram filmadas nas ruas de Toronto, que viraram Nova York para o filme. Yonge-Dundas Square também aparece na produção.',url:'https://www.sonypictures.com/movies/pixels'},
  incendies: {index:'SELEÇÃO 04 / 06',origin:'QUÉBEC · FRANCÊS / ÁRABE',title:'Incendies',credit:'Denis Villeneuve · 2010',description:'Após a morte da mãe, dois irmãos recebem uma missão que os leva a descobrir os segredos da própria família.',image:'https://fr.web.img3.acsta.net/medias/nmedia/18/77/19/59/19590233.jpg',alt:'Cena de Incendies com a atriz Mélissa Désormeaux-Poulin',url:'https://cfe.tiff.net/canadianfilmencyclopedia/content/films/incendies'},
  mommy: {index:'SELEÇÃO 05 / 06',origin:'QUÉBEC · FRANCÊS',title:'Mommy',credit:'Xavier Dolan · 2014',description:'Um retrato intenso da relação entre uma mãe viúva, seu filho adolescente e a vizinha que cruza o caminho dos dois.',image:'https://conteudo.imguol.com.br/c/entretenimento/2014/12/09/cena-de-mommy-1418148959205_1600x1095.jpg',alt:'Cena do filme Mommy com Antoine-Olivier Pilon',url:'https://www.canfilmday.ca/film/mommy/'},
  'scott-pilgrim': {index:'SELEÇÃO 06 / 06',origin:'TORONTO · ONTÁRIO',title:'Scott Pilgrim vs. the World',credit:'Edgar Wright · 2010',description:'Scott, baixista de uma banda de Toronto, enfrenta os sete ex-namorados de Ramona em uma aventura que mistura romance, comédia e videogame.',url:'https://www.icff.ca/title-item/scott-pilgrim-vs-the-world/'}
};
const filmCard = document.querySelector('.film-card');
document.querySelectorAll('.film-choice').forEach(button => button.addEventListener('click', () => {
  const film = filmStories[button.dataset.film];
  if (!film) return;
  document.querySelectorAll('.film-choice').forEach(choice => {
    const isActive = choice === button;
    choice.classList.toggle('active', isActive);
    choice.setAttribute('aria-pressed', String(isActive));
  });
  filmCard.classList.add('changing');
  window.setTimeout(() => {
    document.querySelector('#film-index').textContent = film.index;
    document.querySelector('#film-origin').textContent = film.origin;
    const filmTitle = document.querySelector('#film-title');
    filmTitle.textContent = film.title;
    filmTitle.href = film.url;
    document.querySelector('#film-credit').textContent = film.credit;
    document.querySelector('#film-description').textContent = film.description;
    filmCard.classList.remove('changing');
  }, 140);
}));
