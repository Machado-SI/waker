# Waker (WOL)

Uma simples e leve interface de linha de comando (CLI) em Node.js para enviar o "Pacote Mágico" de **Wake-on-LAN**, permitindo ligar computadores remotamente através de rede local.

## Instalação e Uso
Este projeto é um script executável que deve ser rodado em Node.js.

### Pré-requisitos

Você precisa ter o **Node.js** instalado em seu sistema e rodar o `waker`.

### 1. Clonar o Repositório
```bash
git clone https://github.com/Machado-SI/waker
```

### 2. Entrar no Diretório
```bash
cd waker
```

### 3. Instalar globalmente
```bash
npm install -g
```

## Executar

### Endereço MAC
Caso não saiba seu endereço mac execute no terminal 
```bash
ipconfig /all
```

### Comando
Depois de verificar tudo execute o comando abaixo preenchendo com seu endereço MAC de forma correta

```bash
waker AA:BB:CC:DD:EE:FF
```
ou
```bash
waker AA-BB-CC-DD-EE-FF
```