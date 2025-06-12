
// seleciona cada container de produto (caixa0)
document.querySelectorAll('.caixa0').forEach(produto => { //  executa na hora que abre a tela

  debugger;
  // produto representa cada caixa da tela
  const addButton = produto.querySelector('button'); // botão de cada um dos produtos

  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'button-wrapper';             
  addButton.parentElement.appendChild(buttonWrapper);
  buttonWrapper.appendChild(addButton); // cria a div(buttonwrapper) pra posicionar os botoes. Coloca a div no lugar do botao original e coloca add to cart dentro dessa div

  addButton.addEventListener('click', function () {  //  evento de clique
    if (produto.querySelector('.quantidade-controls')) return;  // evita duplicar

    addButton.style.display = 'none';   // esconde botao add cart

    const controls = document.createElement('div');
    controls.className = 'quantidade-controls';
    
    const minus = document.createElement('button');
    minus.textContent = '−';
    const quantity = document.createElement('span');
    quantity.textContent = '1';
    const plus = document.createElement('button');
    plus.textContent = '+';

    controls.appendChild(minus);    
    controls.appendChild(quantity);    // adiciona os botoes - # + na div controls
    controls.appendChild(plus);
    buttonWrapper.appendChild(controls);   // adiciona controls em buttonwrapper
    
    let count = 1;

    // coleta dados do produto
    const nome = produto.parentElement.querySelector('.nome').textContent;
    const precoStr = produto.parentElement.querySelector('.valor').textContent;
    const preco = parseFloat(precoStr.replace('$', ''));

    // adiciona ao carrinho
    carrinho[nome] = { qtd: count, preco };
    atualizarCarrinho();

    plus.addEventListener('click', () => {
      count++;
      quantity.textContent = count;
      carrinho[nome].qtd = count;
      atualizarCarrinho();
    });

    minus.addEventListener('click', () => {
      count--;
      if (count <= 0) {
        controls.remove();
        addButton.style.display = 'block';  // se a contagem chegar em 0 volta o botao Add cart
        delete carrinho[nome];  // remove carrinho
      } else {
        quantity.textContent = count;
        carrinho[nome].qtd = count;
      }
      atualizarCarrinho();
    });
  });
});

const carrinho = {};  // armazena os itens: { nome: { qtd, preco } }

function atualizarCarrinho() {
  const cartContent = document.getElementById('cart-content');
  cartContent.innerHTML = ''; // limpa tudo
  let totalItens = 0;

  for (const nome in carrinho) {
    const item = carrinho[nome];
    totalItens += item.qtd;

    // cria elementos para cada item no carrinho
    const div = document.createElement('div');
    div.classList.add('cart-item');
    const nomeEl = document.createElement('p');
    nomeEl.className = 'cart-item-nome';
    nomeEl.textContent = nome;
    const infoEl = document.createElement('div');
    infoEl.className = 'cart-item-info';
    const texto = document.createElement('span');
    texto.innerHTML = `<span class="cart-item-qtd">${item.qtd}x</span> — $${(item.qtd * item.preco).toFixed(2)}`;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.className = 'remove-btn';

    removeBtn.addEventListener('click', () => {
      delete carrinho[nome];

      // restaura botao do produto
      document.querySelectorAll('.caixa1').forEach(prod => {
        const nomeEl = prod.querySelector('.nome');
        if (nomeEl && nomeEl.textContent === nome) {
          const controls = prod.querySelector('.quantidade-controls');
          const addBtn = prod.querySelector('button');

          if (controls) controls.remove();
          if (addBtn) addBtn.style.display = 'block';
        }
      });

      atualizarCarrinho();
    });

    infoEl.appendChild(texto);
    infoEl.appendChild(removeBtn);

    div.appendChild(nomeEl);
    div.appendChild(infoEl);
    cartContent.appendChild(div);
  }

  if (totalItens > 0) {
    // converte a moeda e exibe botao de confirmar
    const formatador = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const valorTotal = Object.values(carrinho).reduce((soma, item) => {
      return soma + item.qtd * item.preco; }, 0);

    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total';
    totalDiv.innerHTML = `<strong>Total: ${formatador.format(valorTotal)}</strong>`;
    cartContent.appendChild(totalDiv);

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm Order';
    confirmButton.className = 'confirmar-btn';
    confirmButton.addEventListener('click', mostrarJanela);
    cartContent.appendChild(confirmButton);

  } else {
    // se o carrinho estiver vazio, mostra mensagem e imagem
    const img = document.createElement('img');
    img.src = '/assets/images/illustration-empty-cart.svg';
    img.alt = 'cart';
    img.className = 'img2';

    const p = document.createElement('p');
    p.textContent = 'Your added items will appear here';

    cartContent.appendChild(img);
    cartContent.appendChild(p);
  }

function mostrarJanela() {
  const janela = document.getElementById('order-janela');  // janela de confirmaçao escondida
  const detalhes = document.getElementById('order-details');  // onde vai inserir os itens
  detalhes.innerHTML = '';  // limpa antes de mostrar os novos

  let totalPedido = 0;  // acumula valores do preço total do pedido

  for (const nome in carrinho) {
    const item = carrinho[nome];

    const div = document.createElement('div');
    div.className = 'order-item';              // cria as imagens dos itens no carrinho
    const img = document.createElement('img');

    const produto = Array.from(document.querySelectorAll('.caixa1')).find(p => 
      p.querySelector('.nome')?.textContent === nome      //  procura produto com msm nome do item no carrinho
    ); 
    if (produto) {
      img.src = produto.querySelector('img').src;
    }

    const info = document.createElement('div');
    info.className = 'order-item-info';
    
    const quantidadeEl = document.createElement('span');
    quantidadeEl.className = 'order-item-qtd';       // mostra numero de unidades compradas
    quantidadeEl.textContent = `${item.qtd}x`;

    const nomeEl = document.createElement('span');
    nomeEl.className = 'order-item-nome';            // nome do item
    nomeEl.textContent = nome;

    const precoEl = document.createElement('span');
    precoEl.className = 'order-item-preco';          //  valor total
    precoEl.textContent = `$${(item.qtd * item.preco).toFixed(2)}`;

    //  coloca info e img do item da div do #order-details
    info.appendChild(quantidadeEl);
    info.appendChild(nomeEl);
    info.appendChild(precoEl);

    div.appendChild(img);
    div.appendChild(info);
    detalhes.appendChild(div);

    totalPedido += item.qtd * item.preco;
  }

  // total final
  const totalEl = document.createElement('div');  // div q vai mostrar total da compra
  totalEl.className = 'order-total';
  totalEl.innerHTML = `<strong>Total: $${totalPedido.toFixed(2)}</strong>`;  // tofixed2 para mostrar 2 casas decimais
  detalhes.appendChild(totalEl);

  janela.classList.remove('hidden');  // remmove o hidden para poder mostrar a janela de finalizaçao
}


// fecha janela extra ao clicar no X
document.querySelector('.close-janela').addEventListener('click', () => {
  document.getElementById('order-janela').classList.add('hidden');
})
};
