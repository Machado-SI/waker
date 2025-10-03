#!/usr/bin/env node

const dgram = require('dgram')

function wake(macAddress) {
    // Pega o endereço mac e tira todos os -
    const mac = macAddress.replace(/[:\-]/g, '')
    
    // Verefica se o endereço mac tem exatamente 12 caracteres
    if(!/^[0-9A-Fa-f]{12}$/.test(mac)) {
        console.error('Erro: Mac inválido. Use o formato: AA:BB:CC:DD:EE:FF')
        process.exit(1)
    }
}