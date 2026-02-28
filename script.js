// --- 1. BANCO DE DADOS DOS PRODUTOS ---
const menuData = {
    'burger': {
        id: 'burger',
        name: "Double Cheddar Smash",
        desc: "Dois blends de costela, muito cheddar e pão brioche artesanal.",
        basePrice: 42.90,
        modelSrc: "burger.glb",
        orbit: "0deg 75deg 110%",
        options: [
            { id: 'removals', type: 'checkbox', title: 'Deseja retirar algo?', items: [
                { id: 'no-onion', name: 'Sem Cebola', price: 0 },
                { id: 'no-pickles', name: 'Sem Picles', price: 0 }
            ]},
            { id: 'adds', type: 'checkbox', title: 'Turbine seu Burger', items: [
                { id: 'bacon', name: 'Bacon Extra', price: 4.50 },
                { id: 'meat', name: 'Hambúrguer Extra', price: 12.00 },
                { id: 'sauce', name: 'Molho da Casa', price: 3.00 }
            ]}
        ]
    },
    'fries': {
        id: 'fries',
        name: "Batata Frita Rústica",
        desc: "Batatas sequinhas e crocantes. Escolha o tamanho ideal para você.",
        basePrice: 15.00,
        modelSrc: "lifelike_3d_model_of_crispy_french_fries.glb",
        orbit: "45deg 60deg 130%",
        options: [
            { id: 'size', type: 'radio', title: 'Escolha o Tamanho', items: [
                { id: 'size-p', name: 'Pequena', price: 0, checked: true },
                { id: 'size-m', name: 'Média', price: 6.00 },
                { id: 'size-g', name: 'Grande (Família)', price: 12.00 }
            ]}
        ]
    },
    'coke': {
        id: 'coke',
        name: "Refrigerante",
        desc: "Garrafa de vidro extremamente gelada.",
        basePrice: 8.90,
        modelSrc: "coca_cola_bottle.glb",
        orbit: "0deg 85deg 160%",
        options: [
            { id: 'flavor', type: 'radio', title: 'Escolha a sua', items: [
                { id: 'coke-normal', name: 'Coca-Cola Original', price: 0, checked: true },
                { id: 'coke-zero', name: 'Coca-Cola Zero', price: 0 },
                { id: 'sprite', name: 'Sprite', price: 0 }
            ]}
        ]
    },
    'icecream': {
        id: 'icecream',
        name: "Sorvete Premium",
        desc: "Sorvete artesanal. Personalize com nossas coberturas exclusivas.",
        basePrice: 18.00,
        modelSrc: "icecream.glb",
        orbit: "0deg 75deg 120%",
        options: [
            { id: 'toppings', type: 'checkbox', title: 'Coberturas (R$ 3,00)', items: [
                { id: 'top-choc', name: 'Calda de Chocolate', price: 3.00 },
                { id: 'top-straw', name: 'Calda de Morango', price: 3.00 },
                { id: 'top-nut', name: 'Castanhas Trituradas', price: 3.00 }
            ]}
        ]
    }
};

// --- 2. VARIÁVEIS DE ESTADO ---
let currentProduct = menuData['burger'];
let currentQty = 1;
let currentOptionsTotal = 0;
let cart = [];

// Elementos do DOM
const optionsContainer = document.getElementById('options-container');
const btnPrice = document.getElementById('btn-price');

// --- 3. LÓGICA DE RENDERIZAÇÃO DA TELA ---
function renderProduct(productId) {
    currentProduct = menuData[productId];
    currentQty = 1;
    document.getElementById('item-qty').innerText = currentQty;
    
    // Atualiza Informações Básicas
    document.getElementById('food-model').src = currentProduct.modelSrc;
    document.getElementById('food-model').cameraOrbit = currentProduct.orbit;
    document.getElementById('product-name').innerHTML = currentProduct.name;
    document.getElementById('product-desc').innerHTML = currentProduct.desc;
    
    // Constrói as opções (Radio / Checkbox) dinamicamente
    optionsContainer.innerHTML = '';
    
    if(currentProduct.options) {
        currentProduct.options.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'option-group';
            
            const title = document.createElement('div');
            title.className = 'option-title';
            title.innerText = group.title;
            groupDiv.appendChild(title);

            group.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'option-item';
                
                const isChecked = item.checked ? 'checked' : '';
                const inputType = group.type; // 'radio' ou 'checkbox'
                
                // Se for radio, o "name" tem que ser o ID do grupo para eles funcionarem juntos
                const inputName = inputType === 'radio' ? group.id : item.id;
                
                itemDiv.innerHTML = `
                    <label>
                        <input type="${inputType}" name="${inputName}" data-price="${item.price}" data-name="${item.name}" value="${item.id}" ${isChecked} onchange="calculatePrice()">
                        ${item.name}
                    </label>
                    <div class="option-price">${item.price > 0 ? '+ R$ ' + item.price.toFixed(2).replace('.', ',') : ''}</div>
                `;
                groupDiv.appendChild(itemDiv);
            });
            optionsContainer.appendChild(groupDiv);
        });
    }
    
    calculatePrice(); // Calcula o preço inicial
}

// Navegação nas abas
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        renderProduct(e.currentTarget.getAttribute('data-id'));
    });
});

// --- 4. LÓGICA DE CÁLCULOS E BOTÕES ---
function changeQty(amount) {
    currentQty += amount;
    if(currentQty < 1) currentQty = 1;
    document.getElementById('item-qty').innerText = currentQty;
    calculatePrice();
}

function calculatePrice() {
    currentOptionsTotal = 0;
    
    // Lê todos os inputs que estão marcados
    const checkedInputs = optionsContainer.querySelectorAll('input:checked');
    checkedInputs.forEach(input => {
        currentOptionsTotal += parseFloat(input.getAttribute('data-price'));
    });
    
    const finalPrice = (currentProduct.basePrice + currentOptionsTotal) * currentQty;
    
    // Atualiza o botão
    btnPrice.innerText = finalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return finalPrice;
}

// --- 5. LÓGICA DO CARRINHO ---
function addToCart() {
    const finalPrice = calculatePrice();
    
    // Pega o nome das opções selecionadas para mostrar no carrinho
    let selectedOptionsText = [];
    const checkedInputs = optionsContainer.querySelectorAll('input:checked');
    checkedInputs.forEach(input => {
        selectedOptionsText.push(input.getAttribute('data-name'));
    });

    // Cria o objeto do item do carrinho
    const cartItem = {
        id: Date.now(), // ID único para remoção
        name: currentProduct.name,
        qty: currentQty,
        total: finalPrice,
        details: selectedOptionsText.join(', ')
    };

    cart.push(cartItem);
    updateCartUI();
    
    // Feedback visual
    const btnAdd = document.querySelector('.btn-add');
    const originalHTML = btnAdd.innerHTML;
    btnAdd.innerHTML = 'Adicionado! ✓';
    btnAdd.style.background = '#34c759';
    setTimeout(() => {
        btnAdd.innerHTML = originalHTML;
        btnAdd.style.background = 'var(--primary)';
    }, 1000);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
}

function updateCartUI() {
    // Atualiza Badge
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-badge').innerText = totalItems;
    
    // Atualiza Lista no Modal
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';
    let cartTotalValue = 0;

    if(cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align:center; color:gray; margin-top: 20px;">Seu carrinho está vazio.</p>';
    } else {
        cart.forEach(item => {
            cartTotalValue += item.total;
            const itemHTML = `
                <div class="cart-item">
                    <h3>${item.qty}x ${item.name}</h3>
                    ${item.details ? `<div class="cart-item-details">${item.details}</div>` : ''}
                    <div class="cart-item-bottom">
                        <span>${item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        <button class="btn-remove" onclick="removeFromCart(${item.id})">Remover</button>
                    </div>
                </div>
            `;
            cartItemsDiv.innerHTML += itemHTML;
        });
    }

    // Atualiza Total Final
    document.getElementById('cart-total-price').innerText = cartTotalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('active');
    document.getElementById('cart-overlay').classList.toggle('active');
}

// Inicia o app com o primeiro produto
renderProduct('burger');