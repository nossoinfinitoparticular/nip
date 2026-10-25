let startDate = new Date('2026-08-28T00:00:00');
let coupleNames = "Mauricio & Nataly";

let defaultMemories = [
    {
        id: 1,
        image: 'imagem1.jpeg',
        caption: 'O Nosso Primeiro Encontro de Casais',
        date: '2026-09-02',
        story: 'Ficamos conversando por horas no BK e nem vimos o tempo passar. Ali eu já sabia que era você.',
        rotation: '-rotate-2'
    },
    {
        id: 2,
        image: 'imagem2.jpeg',
        caption: 'Cheiro no Pescoço',
        date: '2026-09-01',
        story: 'O cheiro no pescoço e o carinho que so nós temos um pelo outro.',
        rotation: 'rotate-3'
    },
    {
        id: 3,
        image: 'imagem3.jpeg',
        caption: 'Combinandinhos',
        date: '2026-09-01',
        story: 'Nossa vontade de se vestir combinando as cores sempre vai ser incrvel.',
        rotation: '-rotate-3'
    },
    {
        id: 4,
        image: 'imagem4.jpeg',
        caption: 'Momentos Especiais ao seu lado',
        date: '2026-08-28',
        story: 'Mais uma página linda da nossa história juntos.',
        rotation: 'rotate-2'
    }
];

const letters = [
    {
        title: "Quando Tudo Começou",
        date: "28 de Agosto de 2026",
        content: "Querida Nataly,\n\nHoje olhando para trás, lembro do nervosismo do nosso primeiro Beijo. Quem diria que aquelas simples conversas se transformaria no melhor capítulo da minha vida?\n\nObrigado por transformar dias comuns em memórias extraordinárias. Você é o meu porto seguro."
    },
    {
        title: "O Seu Sorriso",
        date: "Especial para Hoje",
        content: "Se algum dia você esquecer o quanto é especial para mim, leia esta carta.\n\nO seu sorriso tem o poder mágico de iluminar o meu pior dia. A sua risada é a minha melodia favorita e estar ao seu lado é onde eu sempre quero estar."
    },
    {
        title: "Promessas para o Infinito",
        date: "Para Sempre",
        content: "Prometo estar ao seu lado nos dias de sol e nos dias de tempestade. Prometo rir das suas piadas sem graça e segurar a sua mão em cada novo passo.\n\nNossa história é o meu lugar favorito no mundo.\n\nCom todo meu amor,\nEu Te Amo."
    }
];

let postIts = [
    { text: "Lembrar de comprar aquele café na cantina comigo?", color: "bg-yellow-200", rot: "rotate-2" },
    { text: "Eu te amo mais do que você ama um café quentinho.", color: "bg-pink-200", rot: "-rotate-3" },
    { text: "Nossa música favorita: 'Deixa' - Lagum ♫", color: "bg-green-200", rot: "rotate-1" },
    { text: "Meta: Poder conhecer sua familia pessoalmente sem medo.", color: "bg-blue-200", rot: "-rotate-2" }
];

function loadSavedData() {
    const savedDate = localStorage.getItem('nip_start_date');
    if (savedDate) startDate = new Date(savedDate);

    const savedNames = localStorage.getItem('nip_couple_names');
    if (savedNames) {
        coupleNames = savedNames;
        document.getElementById('coupleNames').innerText = coupleNames;
    }

    const savedMemories = localStorage.getItem('nip_memories');
    if (savedMemories) {
        defaultMemories = JSON.parse(savedMemories);
    }

    const savedNotes = localStorage.getItem('nip_postits');
    if (savedNotes) {
        postIts = JSON.parse(savedNotes);
    }
}

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;

    if (diff < 0) return;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = Math.floor((days % 365) % 30);

    document.getElementById('years').innerText = years;
    document.getElementById('months').innerText = months;
    document.getElementById('days').innerText = remainingDays;
    document.getElementById('hours').innerText = hours % 24;
    document.getElementById('minutes').innerText = minutes % 60;

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('startDateDisplay').innerText = `Desde ${startDate.toLocaleDateString('pt-BR', options)}`;
}

function renderPolaroids() {
    const grid = document.getElementById('polaroidsGrid');
    grid.innerHTML = '';

    defaultMemories.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `polaroid ${item.rotation || 'rotate-1'} cursor-pointer group`;
        card.onclick = () => openPhotoDetail(index);

        const tapeClass = index % 3 === 0 ? 'tape-yellow' : (index % 3 === 1 ? 'tape-pink' : 'tape-green');

        card.innerHTML = `
      <div class="washi-tape ${tapeClass} -top-3 left-1/2 -translate-x-1/2"></div>
      <div class="overflow-hidden mb-3 bg-stone-100">
        <img src="${item.image}" alt="${item.caption}" class="w-full h-64 object-cover filter sepia-[0.15] group-hover:scale-105 transition duration-500">
      </div>
      <div class="text-center">
        <p class="font-handwriting text-2xl text-stone-800 leading-tight">${item.caption}</p>
        <span class="text-[11px] font-serif text-stone-500 uppercase tracking-widest mt-1 block">${formatDate(item.date)}</span>
      </div>
    `;
        grid.appendChild(card);
    });
}

function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

function renderPostIts() {
    const board = document.getElementById('notesBoard');
    board.innerHTML = '';

    postIts.forEach((item) => {
        const note = document.createElement('div');
        note.className = `post-it ${item.color} ${item.rot} rounded-sm font-handwriting text-2xl text-amber-950 min-h-[140px] flex items-center justify-center text-center p-4 border border-black/5`;
        note.innerHTML = `<p>"${item.text}"</p>`;
        board.appendChild(note);
    });
}

let audioCtx = null;
let timerId = null;
let isPlaying = false;

function playLoFiMelody() {
    const audio = document.getElementById('bgAudio');
    const statusEl = document.getElementById('songStatus');
    const playBtn = document.getElementById('playBtn');
    const vinyl = document.getElementById('vinylDisk');

    if (!audio) return;

    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        statusEl.innerText = "Pausado ♫";
        playBtn.innerHTML = '<i class="fa-solid fa-play text-sm ml-0.5"></i>';
        vinyl.classList.remove('animate-spin');
    } else {
        audio.play().then(() => {
            isPlaying = true;
            statusEl.innerText = "Tocando... ♫";
            playBtn.innerHTML = '<i class="fa-solid fa-pause text-sm"></i>';
            vinyl.classList.add('animate-spin');
        }).catch(error => {
            console.log("Erro ao reproduzir áudio:", error);
            alert("Certifique-se de que o ficheiro de áudio está na pasta correta e com o nome certo!");
        });
    }
}

function initPetals() {
    const canvas = document.getElementById('petalsCanvas');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const petals = Array.from({ length: 25 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 1 + 0.5,
        speedX: Math.random() * 0.6 - 0.3,
        angle: Math.random() * 360,
        spin: Math.random() * 2 - 1
    }));

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        petals.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.angle += p.spin;

            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.angle * Math.PI) / 180);
            ctx.fillStyle = 'rgba(225, 112, 85, 0.4)';
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

function openLetter(index) {
    const letter = letters[index];
    const container = document.getElementById('letterContent');
    container.innerHTML = `
    <div class="text-center border-b border-stone-300 pb-4 mb-4">
      <div class="text-xs font-serif uppercase tracking-widest text-stone-500">${letter.date}</div>
      <h3 class="text-2xl font-serif font-bold text-stone-900 mt-1">${letter.title}</h3>
    </div>
    <div class="whitespace-pre-line text-stone-700">${letter.content}</div>
  `;
    document.getElementById('letterModal').classList.remove('hidden');
}

function openPhotoDetail(index) {
    const item = defaultMemories[index];
    const container = document.getElementById('photoDetailContent');
    container.innerHTML = `
    <div class="polaroid inline-block mb-6 max-w-sm">
      <img src="${item.image}" class="w-full h-72 object-cover">
      <p class="font-handwriting text-3xl text-stone-800 mt-2">${item.caption}</p>
    </div>
    <div class="text-center max-w-md mx-auto">
      <span class="text-xs font-serif text-amber-900/60 uppercase tracking-widest block mb-2">${formatDate(item.date)}</span>
      <p class="font-serif text-stone-800 leading-relaxed italic">"${item.story || 'Um momento inesquecível guardado com todo o carinho.'}"</p>
    </div>
  `;
    document.getElementById('photoDetailModal').classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    updateCounter();
    setInterval(updateCounter, 1000);
    renderPolaroids();
    renderPostIts();
    initPetals();

    document.getElementById('musicPlayerContainer').addEventListener('click', playLoFiMelody);

    document.getElementById('openConfigBtn').addEventListener('click', () => {
        document.getElementById('inputNames').value = coupleNames;
        document.getElementById('inputDate').value = startDate.toISOString().slice(0, 16);
        document.getElementById('configModal').classList.remove('hidden');
    });

    document.getElementById('saveConfigBtn').addEventListener('click', () => {
        const namesVal = document.getElementById('inputNames').value;
        const dateVal = document.getElementById('inputDate').value;

        if (namesVal) {
            coupleNames = namesVal;
            localStorage.setItem('nip_couple_names', coupleNames);
            document.getElementById('coupleNames').innerText = coupleNames;
        }

        if (dateVal) {
            startDate = new Date(dateVal);
            localStorage.setItem('nip_start_date', startDate.toISOString());
            updateCounter();
        }

        closeModal('configModal');
    });

    document.getElementById('openAddPhotoBtn').addEventListener('click', () => {
        document.getElementById('addPhotoModal').classList.remove('hidden');
    });

    document.getElementById('addPhotoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const caption = document.getElementById('photoCaptionInput').value;
        const date = document.getElementById('photoDateInput').value;
        const story = document.getElementById('photoStoryInput').value;
        const urlInput = document.getElementById('photoUrlInput').value;
        const fileInput = document.getElementById('photoFileInput').files[0];

        const saveMemory = (imgUrl) => {
            const newMemory = {
                id: Date.now(),
                image: imgUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
                caption: caption,
                date: date,
                story: story,
                rotation: (Math.random() > 0.5 ? 'rotate-2' : '-rotate-2')
            };
            defaultMemories.unshift(newMemory);
            localStorage.setItem('nip_memories', JSON.stringify(defaultMemories));
            renderPolaroids();
            closeModal('addPhotoModal');
            document.getElementById('addPhotoForm').reset();
        };

        if (fileInput) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                saveMemory(evt.target.result);
            };
            reader.readAsDataURL(fileInput);
        } else {
            saveMemory(urlInput);
        }
    });

    document.getElementById('addNoteBtn').addEventListener('click', () => {
        const text = prompt("Escreva sua frase ou recadinho para o mural:");
        if (text) {
            const colors = ["bg-yellow-200", "bg-pink-200", "bg-green-200", "bg-blue-200"];
            const rots = ["rotate-1", "-rotate-2", "rotate-3", "-rotate-1"];
            const newNote = {
                text: text,
                color: colors[Math.floor(Math.random() * colors.length)],
                rot: rots[Math.floor(Math.random() * rots.length)]
            };
            postIts.push(newNote);
            localStorage.setItem('nip_postits', JSON.stringify(postIts));
            renderPostIts();
        }
    });
});
// Função para abrir o modal de nova memória
function openAddPhotoModal() {
    const modal = document.getElementById('addPhotoModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function addNewPostIt() {
    const text = prompt("Escreva sua frase ou recadinho para o mural:");
    if (text) {
        const colors = ["bg-yellow-200", "bg-pink-200", "bg-green-200", "bg-blue-200"];
        const rots = ["rotate-1", "-rotate-2", "rotate-3", "-rotate-1"];
        const newNote = {
            text: text,
            color: colors[Math.floor(Math.random() * colors.length)],
            rot: rots[Math.floor(Math.random() * rots.length)]
        };
        postIts.push(newNote);
        localStorage.setItem('nip_postits', JSON.stringify(postIts));
        renderPostIts();
    }
}