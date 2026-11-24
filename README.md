Integrante da equipe 10: Arthur B.Spada
RA: 1136264


## 1. Estrutura de Pastas

```text
├── index.html
├── README.md
└── src/
    └── World/
        ├── World.js                 # Gerenciador principal das cenas, luzes, modelos e câmera
        ├── assets/                  # Modelos 3D (.glb / .gltf)
        ├── components/
        │   ├── Bebedouros.js        # Geometria e texturas da Cena 2 (Bebedouros)
        │   ├── Camera.js            # Configuração da câmera
        │   ├── Cortina.js           # Malha e física Rapier da cortina (Cena 1)
        │   ├── Light.js             # Configuração de iluminação
        │   ├── Luminaria.js         # Luminária de teto (Cena 1)
        │   ├── Room.js              # Estrutura arquitetônica da sala (Cena 1)
        │   └── Scene.js             # Instância da cena
        └── systems/
            ├── GuiControls.js       # Interface dat.GUI para seleção de cena e ajustes
            ├── Renderer.js          # Renderizador WebGL com sombras
            └── Resizer.js           # Ajuste responsivo de tela
```

---

## 2. Como Abrir e Executar o Projeto

Por utilizar módulos ES (`import`) e carregamento de arquivos 3D externos (`.glb`/`.gltf`), o projeto deve ser aberto através de um **servidor local** (não abra o `index.html` diretamente com duplo clique).

### Opção A — Pelo VS Code (Live Server)
1. Abra a pasta do projeto
2. Instale a extensão **Live Server** (caso ainda não tenha).
3. Clique com o botão direito no arquivo **`index.html`** e selecione **Open with Live Server** (ou clique em **Go Live** na barra inferior direita).
4. O navegador abrirá automaticamente em `http://127.0.0.1:5500/` ou `http://127.0.0.1:8000/`.

### Opção B — Pelo Terminal (Python ou Node.js)
1. Abra o terminal na pasta raiz do projeto.
2. Execute um dos comandos abaixo:
   ```bash
   # Usando Python 3:
   python -m http.server 8000

   # Ou usando Node.js:
   npx serve -l 8000
   ```
3. Acesse **`http://127.0.0.1:8000/`** no navegador.

---

## 3. Como Alternar e Testar as Duas Cenas

A aplicação inicia automaticamente na **Cena 1 (Sala)**. Você pode alternar entre as cenas de duas formas:

### Pelo Teclado (Atalho Rápido)
* Pressione a tecla **`1`** para ativar a **Cena 1 — Sala (70%)** e centralizar a câmera automaticamente.
* Pressione a tecla **`2`** para ativar a **Cena 2 — Bebedouros (30%)** e posicionar a câmera em frente aos equipamentos.

### Pelo Menu Gráfico (`dat.GUI`)
1. No painel preto localizado no **canto superior direito** da tela, localize o seletor **`Cena Ativa`**.
2. Clique na caixa de seleção e escolha entre **`Cena 1 - Sala (70%)`** e **`Cena 2 - Bebedouros (30%)`**.

---

## 4. Controles de Navegação e Câmera (`OrbitControls`)

* **Girar a câmera:** segure o **botão esquerdo do mouse** e arraste.
* **Mover lateralmente (Pan):** segure o **botão direito do mouse** (ou `Shift + botão esquerdo`) e arraste.
* **Aproximar / Afastar (Zoom):** gire a **rodinha (scroll)** do mouse.
* **Mover pelo teclado:** utilize as **setas direcionais** (`↑`, `↓`, `←`, `→`).
* **Recentralizar a visão:** caso perca o enquadramento da câmera, pressione **`1`** ou **`2`** novamente para restaurar a posição padrão da cena atual.

---

## 5. Checklist de Validação das Cenas

* **Cena 1 (`1`):**
  * Verificar a estrutura da sala (paredes, piso, pilar escuro, janela e luminária).
  * Observar o movimento contínuo da cortina simulado com física **Rapier**.
  * Conferir o posicionamento e escala dos modelos importados: sofá, 4 almofadas coloridas, vaso de planta, poltrona e ar-condicionado.
* **Cena 2 (`2`):**
  * Verificar o piso cerâmico com faixa de piso tátil e o teto modular.
  * Conferir o fervedor inox sobre a prateleira com mãos-francesas (incluindo bandeja coletora, visor vermelho e LED).
  * Conferir o bebedouro inox de chão, reflexos metálicos e as 3 torneiras importadas posicionadas nos aparelhos.
* **Inspeção em Tempo Real:**
  * Caso queira inspecionar coordenadas, luzes ou câmera, abra as pastas individuais no menu lateral direito (`C1_...`, `C2_...`, `Camera`, `Light`).
  //projeto atualizado