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

    // Cria um socket UDP
    const client = dgram.createSocket('udp4')

    // Amarra o socket a um endereço permitindo ele receber datagramas
    client.bind(() => {
        // Essencial para Wol
        client.setBroadcast(true)
        client.send(payload, 0, payload.length, 9, '255.255.255.255', (err) => {
            if(err) console.error('Erro:', err)
            else console.log(`Pacote mágico enviado para: ${macAddress}`)
            client.close()
        })
    })
}

// Obtém o endereço mac passado na linha de comando
const mac = process.argv[2]
if(!mac) {
    console.log('Uso: waker AA:BB:CC:DD:EE:FF')
    process.exit(1)
}

wake(mac)