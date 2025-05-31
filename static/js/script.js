let web3;
let userAccount;

document.getElementById('connectWallet').addEventListener('click', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            document.getElementById('walletStatus').innerText = `Connected: ${userAccount}`;
            document.getElementById('connectWallet').style.display = 'none';
            fetchMessages();
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            document.getElementById('walletStatus').innerText = 'Failed to connect wallet.';
        }
    } else {
        alert('MetaMask not detected. Please install MetaMask to use this app.');
    }
});

document.getElementById('sendButton').addEventListener('click', async () => {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    if (message && userAccount) {
        const response = await fetch('/send_message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, sender: userAccount })
        });
        const result = await response.json();
        if (result.status === 'success') {
            messageInput.value = '';
            fetchMessages();
        }
    }
});

async function fetchMessages() {
    const response = await fetch('/get_messages');
    const messages = await response.json();
    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = '';
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `<span class="sender">${msg.sender.slice(0, 6)}...</span> ${msg.message}`;
        chatArea.appendChild(messageDiv);
    });
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Poll for new messages every 5 seconds
setInterval(fetchMessages, 5000);
