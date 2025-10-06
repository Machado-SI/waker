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
    // Transforma o endereço mac em um Buffer de 6 bytes brutos
    const hex = Buffer.from(mac, 'hex')

    // Cria 2 Buffer e junta eles, um desses buffer contém 6 bytes como assinatura
    // Depois vem o outro Buffer, que contém o endereço mac repetido 16 vezes
    // Esse é o protocolo certo a se seguir
    const payload = Buffer.concat([Buffer.alloc(6, 0xff), Buffer.alloc(96).fill(hex)])
}