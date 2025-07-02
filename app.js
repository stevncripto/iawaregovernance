const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';

(async () => {
  const abi = await fetch('abi.json').then(res => res.json());

  if (!window.ethereum) {
    alert('Instala MetaMask para usar esta DApp');
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  async function loadProposals() {
    const count = await contract.proposalCount();
    const list = document.getElementById('proposalList');
    list.innerHTML = '';
    for (let i = 1; i <= count; i++) {
      const p = await contract.proposals(i);
      const li = document.createElement('li');
      li.textContent = `#${i}: ${p.description} — Votes: ${p.voteCount}`;
      list.appendChild(li);
    }
  }

  document.getElementById('newProposalBtn').onclick = async () => {
    const desc = prompt('Descripción de la propuesta:');
    if (!desc) return;
    await contract.createProposal(desc);
    await loadProposals();
  };

  await loadProposals();
})();