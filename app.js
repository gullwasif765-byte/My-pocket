// app.js - PocketBase & Chat App Logic

document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const fileInput = document.getElementById('file-input');
    const filePreview = document.getElementById('file-preview');
    const fileNameSpan = document.getElementById('file-name');
    const clearFileBtn = document.getElementById('clear-file');
    const messagesList = document.getElementById('messages-list');
    const pbUrlInput = document.getElementById('pb-url-input');
    const saveUrlBtn = document.getElementById('save-url-btn');
    const statusDiv = document.getElementById('status');

    // Load saved server URL into UI
    if (typeof pb !== 'undefined' && pb.baseUrl) {
        pbUrlInput.value = pb.baseUrl;
        statusDiv.innerText = "PocketBase Ready";
        statusDiv.classList.replace('text-slate-300', 'text-emerald-400');
    }

    // Save custom PocketBase URL
    saveUrlBtn.addEventListener('click', () => {
        const url = pbUrlInput.value.trim();
        if (url) {
            localStorage.setItem('pb_server_url', url);
            alert('PocketBase URL محفوظ ہو گئی ہے! صفحہ ریفریش ہو رہا ہے...');
            location.reload();
        }
    });

    // File selection preview
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileNameSpan.innerText = `فائل چنی گئی: ${e.target.files[0].name}`;
            filePreview.classList.remove('hidden');
        }
    });

    clearFileBtn.addEventListener('click', () => {
        fileInput.value = '';
        filePreview.classList.add('hidden');
    });

    // Form Submit (Sending Messages / Files to PocketBase)
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();
        const selectedFile = fileInput.files[0];

        if (!text && !selectedFile) return;

        // UI Optimistic append
        appendMessageUI(text, selectedFile ? selectedFile.name : null, true);

        try {
            // FormData construct for PocketBase Collection ('messages')
            const formData = new FormData();
            formData.append('text', text);
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            // Uncomment when PocketBase backend is live:
            // await pb.collection('messages').create(formData);

            console.log('Sending payload:', { text, selectedFile });
            
            // Reset input fields
            messageInput.value = '';
            fileInput.value = '';
            filePreview.classList.add('hidden');

        } catch (error) {
            console.error('PocketBase Upload Error:', error);
            alert('پیغام بھیجنے میں مسئلہ آیا: ' + error.message);
        }
    });

    function appendMessageUI(text, fileName, isMe = true) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `max-w-[80%] rounded-lg p-3 text-sm ${
            isMe ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 self-start' : 'bg-slate-700 text-slate-100 self-end'
        }`;
        
        let html = '';
        if (text) html += `<p>${text}</p>`;
        if (fileName) {
            html += `<div class="mt-2 text-xs bg-slate-900/60 p-2 rounded flex items-center gap-2">
                📁 <span>${fileName}</span>
            </div>`;
        }
        
        msgDiv.innerHTML = html;
        messagesList.appendChild(msgDiv);
        messagesList.scrollTop = messagesList.scrollHeight;
    }
});
