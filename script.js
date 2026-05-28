document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. COMPONENTE INTERATIVO: ACORDEÃO (SEÇÕES EXPANSÍVEIS)
    // ==========================================================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Alterna o estado do item clicado
            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
                content.removeAttribute('hidden');
                item.classList.add('active');
            } else {
                header.setAttribute('aria-expanded', 'false');
                content.setAttribute('hidden', '');
                item.classList.remove('active');
            }
        });
    });


    // ==========================================================================
    // 2. ACESSIBILIDADE: CONTROLE DE TAMANHO DE FONTE
    // ==========================================================================
    let currentScale = 100;
    const btnIncreaseFont = document.getElementById('btn-increase-font');
    const btnDecreaseFont = document.getElementById('btn-decrease-font');

    btnIncreaseFont.addEventListener('click', () => {
        if (currentScale < 140) {
            currentScale += 10;
            document.documentElement.style.setProperty('--font-scale', `${currentScale}%`);
        }
    });

    btnDecreaseFont.addEventListener('click', () => {
        if (currentScale > 80) {
            currentScale -= 10;
            document.documentElement.style.setProperty('--font-scale', `${currentScale}%`);
        }
    });


    // ==========================================================================
    // 3. ACESSIBILIDADE: ALTERNAÇÃO DE TEMA (CLARO/ESCURO)
    // ==========================================================================
    const btnToggleTheme = document.getElementById('btn-toggle-theme');
    
    btnToggleTheme.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });


    // ==========================================================================
    // 4. ACESSIBILIDADE: LEITURA POR VOZ (SpeechSynthesis API)
    // ==========================================================================
    const btnStartVoice = document.getElementById('btn-start-voice');
    const btnStopVoice = document.getElementById('btn-stop-voice');
    const speechContentArea = document.getElementById('speech-content');
    
    let synth = window.speechSynthesis;
    let currentUtterance = null;

    btnStartVoice.addEventListener('click', () => {
        // Para qualquer leitura em andamento antes de reiniciar
        if (synth.speaking) {
            synth.cancel();
        }

        // Extrai o texto limpo apenas do conteúdo principal (ignora botões ocultos e tags)
        if (speechContentArea) {
            const textToRead = speechContentArea.innerText;
            currentUtterance = new SpeechSynthesisUtterance(textToRead);
            currentUtterance.lang = 'pt-BR';
            currentUtterance.rate = 1.1; // Velocidade ideal de leitura

            // Feedback visual nos botões
            btnStartVoice.style.background = '#198754';
            
            currentUtterance.onend = () => {
                btnStartVoice.style.background = 'transparent';
            };

            currentUtterance.onerror = () => {
                btnStartVoice.style.background = 'transparent';
            };

            synth.speak(currentUtterance);
        }
    });

    btnStopVoice.addEventListener('click', () => {
        if (synth.speaking) {
            synth.cancel();
            btnStartVoice.style.background = 'transparent';
        }
    });


    // ==========================================================================
    // 5. INTERAÇÃO: ENVIO DO FORMULÁRIO DE INSCRIÇÃO
    // ==========================================================================
    const registrationForm = document.getElementById('registration-form');
    const successMsg = document.getElementById('form-success-msg');

    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Coleta os dados para demonstração de sucesso
        const formData = {
            nome: document.getElementById('nome').value,
            idade: document.getElementById('idade').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            pais: document.getElementById('pais').value
        };

        console.log('Inscrição realizada com sucesso:', formData);

        // Limpa o formulário e apresenta mensagem com animação suave
        registrationForm.reset();
        registrationForm.style.display = 'none';
        successMsg.removeAttribute('hidden');
    });


    // ==========================================================================
    // 6. INTERAÇÃO: ÁREA DE COMENTÁRIOS DINÂMICOS
    // ==========================================================================
    const commentForm = document.getElementById('comment-form');
    const commentText = document.getElementById('comment-text');
    const commentsListContainer = document.getElementById('comments-list-container');

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const text = commentText.value.trim();
        if (text === '') return;

        // Cria a estrutura visual moderna do novo comentário
        const commentBox = document.createElement('div');
        commentBox.className = 'comment-item-box';
        commentBox.style.animation = 'fadeIn 0.5s ease forwards';

        commentBox.innerHTML = `
            <div class="comment-meta">
                <span class="comment-author">Leitor Conectado (Você)</span>
                <span class="comment-date">Agora mesmo</span>
            </div>
            <p class="comment-body">${escapeHTML(text)}</p>
        `;

        // Insere no topo da lista
        commentsListContainer.insertBefore(commentBox, commentsListContainer.firstChild);
        
        // Reseta o input de texto
        commentText.value = '';
    });

    // Função de segurança para mitigar XSS ao inserir dados dinâmicos do usuário
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});