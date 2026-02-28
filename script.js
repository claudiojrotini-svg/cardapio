// --- BANCO DE DADOS LOCAL DOS PRODUTOS ---
const menuData = {
    'burger': {
        name: "Double Cheddar <br><span>Bacon Smash</span>",
        desc: "Dois suculentos hambúrgueres de costela 150g, duplo queijo cheddar derretido, fatias crocantes de bacon artesanal e maionese defumada no pão brioche tostado na manteiga.",
        price: 42.90,
        modelSrc: "burger.glb",
        tags: '<span class="tag tag-hot">Mais Pedido</span><span class="tag tag-new">Lançamento</span>',
        cameraOrbit: "0deg 75deg 110%" // Câmera ajustada para produto largo
    },
    'fries': {
        name: "Batata Frita <br><span>Crocante Real</span>",
        desc: "Porção generosa das nossas batatas fritas exclusivas, crocantes por fora e macias por dentro. Acompanha nosso molho secreto da casa.",
        price: 24.90,
        modelSrc: "lifelike_3d_model_of_crispy_french_fries.glb",
        tags: '<span class="tag tag-hot">Para Dividir</span>',
        cameraOrbit: "45deg 60deg 130%" // Afasta um pouco para ver a porção toda
    },
    'coke': {
        name: "Coca-Cola <br><span>Garrafa Retrô</span>",
        desc: "A clássica e inconfundível Coca-Cola trincando de gelada, servida na icônica garrafa de vidro para manter o máximo do sabor e gás.",
        price: 9.90,
        modelSrc: "coca_cola_bottle.glb",
        tags: '<span class="tag tag-new">Geladíssima</span>',
        cameraOrbit: "0deg 85deg 160%" // Afasta mais porque a garrafa é alta
    },
    'icecream': {
        name: "Sorvete <br><span>Artesanal</span>",
        desc: "Sobremesa refrescante com textura cremosa inigualável. Feito com ingredientes selecionados para fechar sua refeição com chave de ouro.",
        price: 18.50,
        modelSrc: "icecream.glb",
        tags: '<span class="tag tag-hot">Sobremesa</span>',
        cameraOrbit: "0deg 75deg 120%"
    }
};

// Variáveis Globais do Carrinho
let cartTotal = 0;
let cartItemsCount = 0;
let currentItemPrice = menuData['burger'].price; // Inicia com o preço do hambúrguer

// --- LÓGICA DE TROCA DE PRODUTOS ---
const catButtons = document.querySelectorAll('.cat-btn');
const modelViewer = document.getElementById('food-model');
const productName = document.getElementById('product-name');
const productDesc = document.getElementById('product-desc');
const productPrice = document.getElementById('product-price');
const productTags = document.getElementById('product-tags');

catButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // 1. Muda o visual do botão ativo
        catButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // 2. Descobre qual produto foi clicado pegando o data-id
        const productId = e.currentTarget.getAttribute('data-id');
        const data = menuData[productId];

        // 3. Atualiza a tela com os dados novos
        modelViewer.src = data.modelSrc;
        modelViewer.cameraOrbit = data.cameraOrbit;
        productName.innerHTML = data.name;
        productDesc.innerHTML = data.desc;
        productTags.innerHTML = data.tags;
        
        // Atualiza o preço atual em memória e na tela (formatado com 2 casas decimais)
        currentItemPrice = data.price;
        productPrice.innerText = currentItemPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2});
        
        // Efeito rápido de piscar para mostrar que o conteúdo mudou
        document.querySelector('.product-details').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.product-details').style.opacity = '1';
            document.querySelector('.product-details').style.transition = 'opacity 0.3s ease';
        }, 50);
    });
});

// --- LÓGICA DO CARRINHO ---
function addToCart() {
    // Soma o preço do item que está na tela no momento
    cartItemsCount++;
    cartTotal += currentItemPrice;

    // Atualiza a UI
    document.getElementById('cart-count').innerText = cartItemsCount;
    document.querySelector('.cart-total').innerText = cartTotal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    // Feedback visual do botão
    const btn = document.querySelector('.btn-add-cart');
    const originalHTML = btn.innerHTML;
    
    btn.innerHTML = 'Adicionado! ✓';
    btn.style.backgroundColor = '#27ae60';
    btn.style.boxShadow = '0 10px 20px rgba(39, 174, 96, 0.3)';

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.backgroundColor = 'var(--primary)';
        btn.style.boxShadow = '0 10px 20px rgba(255, 94, 0, 0.3)';
    }, 1500);
}