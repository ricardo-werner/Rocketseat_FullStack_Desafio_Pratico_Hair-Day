# 💈 Projeto Hair Day: Agendamento Acessível (A11Y)

![Status do Projeto](https://img.shields.io/badge/Status-Refatoração_A11Y_Concluída-brightgreen)
![Tecnologia](https://img.shields.io/badge/Tecnologia-JavaScript_(ES6+)-yellow)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)

Projeto de agendamento de horários focado na prática de JavaScript, refatorado com ênfase total em **Acessibilidade Web (A11Y)** para garantir uma experiência 100% funcional via teclado e leitor de tela.

---

## 🔗 Deploy

### 🚀 **Acesse a aplicação funcional aqui:** [https://rocketseat-full-stack...vercel.app/](https://rocketseat-full-stack-desafio-pratico-hair-day-m6c-quozl8wz0.vercel.app)

---

## 🎬 Demonstração (Recomendado)

Recomendo fortemente que você crie um **GIF curto** (usando um app como ScreenToGif) que mostre as 3 interações funcionando:
1.  **Mouse:** Clicando em um horário e agendando.
2.  **Teclado:** Usando `Tab` (para focar), `Setas` (para navegar) e `Espaço` (para selecionar), e depois `Enter` para cancelar.
3.  **Resultado:** Mostrando o item aparecer (UI Otimista) e ser deletado (UI Otimista).

<p align="center">
    <img width="600" src="./src/assets/to_readme/demo.gif" alt="Demonstração da aplicação usando mouse e teclado para agendar e cancelar" />
</p>

---

## 📚 Contexto do Projeto

Este projeto foi desenvolvido como desafio final do módulo de JavaScript da trilha **FullStack da Rocketseat**, sob instrução de **Rodrigo Gonçalves**. O escopo original era construir a lógica de agendamento e cancelamento em JavaScript (ES6+), consumindo uma API local (`json-server`) e usando Webpack para modularização.

Após concluir a funcionalidade base, iniciei o **desafio pessoal de refatorar 100% do projeto com foco em Acessibilidade (A11Y)**, aplicando os conceitos que tenho estudado.

---

## ♿ O Desafio da Acessibilidade: Minha Refatoração

O componente original não era acessível. Meu trabalho foi identificar e corrigir as falhas críticas de A11Y.

### 1. O Seletor de Horários Inacessível
* **Problema:** A lista de horários era feita com `<li>`, tornando-a completamente invisível para a navegação com `Tab`.
* **Solução:**
    * Refatoração completa do HTML e JS para usar um `radiogroup` semântico (`<fieldset>`, `<legend>`, `<input type="radio">`).
    * Gerenciamento de foco dinâmico com `tabindex="0"` no primeiro item disponível e `tabindex="-1"` nos demais, permitindo navegação nativa com as teclas de seta.
    * Implementação de uma técnica de CSS *overlay* (`opacity: 0` + `z-index`) para esconder o `input` sem quebrar o foco do teclado, corrigindo também o clique do mouse (`pointer-events: none;`).

### 2. Controles de Cancelamento Não-Funcionais
* **Problema:** O botão "cancelar" era uma `<img>`, inacessível por teclado e sem contexto para leitores de tela.
* **Solução:**
    * O JS foi alterado para criar um `<button>` semântico.
    * Adicionado um `aria-label` dinâmico (ex: "Cancelar agendamento de Ricardo às 21:00") para dar contexto claro ao leitor de tela.

### 3. Falhas na Submissão e "Bugs" do Ambiente
* **Problema:** A lógica de `submit` (UI Otimista) causava um bug de *listener* duplicado (o "alerta duplo") no ambiente de desenvolvimento (HMR do Webpack).
* **Solução:**
    * Refatorada a anexação do *event listener*, guardando a referência da função no objeto `window` para garantir que o *listener* antigo fosse removido antes de o HMR anexar o novo.
    * Corrigida a lógica de validação de horário (`hourNumber < 18`) e a limpeza do formulário (`selectedRadio.checked = false`).

---

## 🛠️ Tecnologias e Conceitos Aplicados

| Categoria | Tecnologias e Conceitos |
| :--- | :--- |
| **Fundação** | HTML5, CSS3 (Flexbox, Grid), JavaScript (ES6+), Webpack, JSON-Server |
| **Acessibilidade (A11Y)** | HTML Semântico (`fieldset`, `legend`), ARIA (`role`, `aria-label`), Gerenciamento de Foco (`tabindex`, `focus-visible`), Navegação por Teclado, Contraste. |
| **Boas Práticas JS** | Modularização (Import/Export), UI Otimista (`appendChild`), Manipulação de DOM, Event Listeners, Programação Assíncrona (`async/await`). |
| **Deploy** | Vercel (CI/CD), My JSON Server (API pública "read-only"). |

---

## 🧭 Rodando o Projeto Localmente

Este projeto usa Webpack e JSON-Server.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/ricardo-werner/Rocketseat_FullStack_Desafio_Pratico_Hair-Day.git](https://github.com/ricardo-werner/Rocketseat_FullStack_Desafio_Pratico_Hair-Day.git)
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie a API local (JSON-Server):**
    *(Em um terminal)*
    ```bash
    npm run server
    ```
    *Isso iniciará o `json-server` em `http://localhost:3333`*

4.  **Inicie o projeto (Webpack Dev Server):**
    *(Em um segundo terminal)*
    ```bash
    npm run dev
    ```
    *O projeto abrirá automaticamente em `http://localhost:3000`*

---

## 🙋‍♂️ Sobre o Autor

**Ricardo Werner**

Profissional com mais de 30 anos de experiência em gestão e liderança, atualmente em **transição de carreira para Desenvolvimento Front-End**.

Meu foco principal é o estudo e aplicação de **Acessibilidade Web (A11Y)**, com o objetivo de construir soluções digitais que sejam verdadeiramente inclusivas, acessíveis e que tenham um propósito real.

📫 **Conecte-se comigo:**
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ricardo-werner)
[![github](https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white)](https://www.github.com/ricardo-werner)