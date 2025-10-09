#!/usr/bin/env node

const dgram = require('dgram')
// Vamos usar esse módulo nativo do node para pegar endereço do broadcast
const os = require('os')

function getBroadcastAddress() {
    // A constante interfaces armazena um Objeto que mapeia os nomes de todas as suas conexões de rede ativas (como 'Wi-Fi', 'Ethernet', 'Loopback', etc.) para um Array que lista todos os endereços IP (IPv4, IPv6) e detalhes técnicos encontrados em cada uma dessas conexões. 

    // Procuramos 3 informações que conencidem com o que queremos:
    // 1. Que o endereço seja IPv4 (family: 'IPv4')
    // 2. Que o endereço não seja interno (internal: false)
    // 3. Que a máscara de sub-rede não seja um endereço de erro
    const interfaces = os.networkInterfaces()
    for(const name of Object.keys(interfaces)) {
        const net = interfaces[name]

        // Intera sobre cada enderço da conexão
        for(const iface of net) {
            // Pula endereços que não são IPv4
            if(iface.internal || iface.family !== 'IPv4') continue

            // Desestruturação de array para pegar o endereço IP e a máscara de sub-rede
            const [addr, mask] = [iface.address, iface.netmask]
            if(!addr || !mask) continue

            // Converte o IP e a máscara de sub-rede em strings usando a função nativa do js Number
            const ip = addr.split('.').map(Number)
            const subNet = mask.split('.').map(Number)
        }
    }
}

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