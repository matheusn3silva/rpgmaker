const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // ── 3 Arquétipos ─────────────────────────────────────
  const ashen = await prisma.rPGClass.upsert({
    where: { archetype: 'ASHEN' },
    update: {},
    create: {
      name: 'Ashen',
      archetype: 'ASHEN',
      sparkFormula: 'FOR+POD/2',
      description: 'Em um mundo em queda e terror, estes são os que buscaram força onde os outros mais temiam.',
    },
  })

  const shard = await prisma.rPGClass.upsert({
    where: { archetype: 'SHARD' },
    update: {},
    create: {
      name: 'Shard',
      archetype: 'SHARD',
      sparkFormula: 'DES+POD/2',
      description: 'Ficar parado quando tudo desaba não era algo sensato. Estes escolheram agir precisamente em prol do que desejam.',
    },
  })

  const lumen = await prisma.rPGClass.upsert({
    where: { archetype: 'LUMEN' },
    update: {},
    create: {
      name: 'Lumen',
      archetype: 'LUMEN',
      sparkFormula: 'INT+POD/2',
      description: 'A queda do mundo não os abalou, apenas consolidou mais ainda sua ânsia por conhecimentos sobrenaturais.',
    },
  })

  // ── Habilidades fixas do Ashen ────────────────────────
  await prisma.skill.upsert({
    where: { classId_name: { classId: ashen.id, name: 'Têmpera' } },
    update: {},
    create: {
      classId: ashen.id,
      name: 'Têmpera',
      type: 'PASSIVA',
      description: 'Absorve parte do impacto dos golpes recebidos. Reduz todo dano físico recebido em 2.',
      sparkCost: 0,
      emberCost: 0,
      upgradeDescription: 'Esta habilidade não pode ser aprimorada.'
    },
  })

  await prisma.skill.upsert({
    where: { classId_name: { classId: ashen.id, name: 'Instinto de Ferro' } },
    update: {},
    create: {
      classId: ashen.id,
      name: 'Instinto de Ferro',
      type: 'ATIVA_REACAO',
      description: 'O usuário fortalece o corpo para reduzir o dano do golpe em sua direção. Reduz o dano sofrido em 3.',
      sparkCost: 0,
      emberCost: 0,
      upgradeDescription: 'Reduz o dano sofrido em 5. Realiza um ataque padrão de resposta.'
    },
  })

  // ── Habilidades fixas do Shard ────────────────────────
  await prisma.skill.upsert({
    where: { classId_name: { classId: shard.id, name: 'Passo Ágil' } },
    update: {},
    create: {
      classId: shard.id,
      name: 'Passo Ágil',
      type: 'PASSIVA',
      description: 'O corpo do usuário é naturalmente mais veloz. Move-se 2 metros a mais que o normal por turno.',
      sparkCost: 0,
      emberCost: 0,
      upgradeDescription: 'Esta habilidade não pode ser aprimorada.'
    },
  })

  await prisma.skill.upsert({
    where: { classId_name: { classId: shard.id, name: 'Reflexo das Sombras' } },
    update: {},
    create: {
      classId: shard.id,
      name: 'Reflexo das Sombras',
      type: 'ATIVA_REACAO',
      description: 'O usuário envolve seu corpo com sombras para reagir aos golpes em sua direção. Reduz o dano sofrido em 2. Move-se 2 metros de distância.',
      sparkCost: 0,
      emberCost: 0,
      upgradeDescription: 'Reduz o dano sofrido em 3. Move-se 3 metros de distância.'
    },
  })

  // ── Habilidades fixas do Lumen ────────────────────────
  await prisma.skill.upsert({
    where: { classId_name: { classId: lumen.id, name: 'Chama Interior' } },
    update: {},
    create: {
      classId: lumen.id,
      name: 'Chama Interior',
      type: 'PASSIVA',
      description: 'O usuário tem uma compreensão básica da Brasa que pulsa em si. Ataques básicos podem ser imbuídos de Brasa causando +2 de dano adicional. Cria um golpe básico focado em um elemento natural sem custo (Fogo, água, ar e terra). Dano 1d8. Recebe 2 de Centelha a mais na recuperação.',
      sparkCost: 0,
      emberCost: 0,
      upgradeDescription: 'Esta habilidade não pode ser aprimorada.'
    },
  })

  await prisma.skill.upsert({
    where: { classId_name: { classId: lumen.id, name: 'Expulsão' } },
    update: {},
    create: {
      classId: lumen.id,
      name: 'Expulsão',
      type: 'ATIVA_REACAO',
      description: 'O usuário libera uma forte onda de energia que limita o ataque em sua direção. Reduz o dano sofrido em 2.',
      sparkCost: 2,
      emberCost: 0,
      upgradeDescription: 'Reduz o dano em 3. Com a energia o usuário também cria um escudo em seu corpo que reduz o dano em 2 no próximo turno.',
    },
  })

  // ── 31 Proficiências ──────────────────────────────────
  const proficiencies = [
    { name: 'Lutar (Briga)',          category: 'COMBATE' },
    { name: 'Técnicas de Combate',    category: 'COMBATE' },
    { name: 'Armas de Fogo',          category: 'COMBATE' },
    { name: 'Arremessar',             category: 'COMBATE' },
    { name: 'Acrobacia',              category: 'COMBATE' },
    { name: 'Esquivar',               category: 'COMBATE' },
    { name: 'Furtividade',            category: 'COMBATE' },
    { name: 'Arcanismo',              category: 'SOBRENATURAL' },
    { name: 'Ocultismo',              category: 'SOBRENATURAL' },
    { name: 'Investigação',           category: 'INVESTIGACAO' },
    { name: 'Percepção (Visual)',      category: 'INVESTIGACAO' },
    { name: 'Escutar',                category: 'INVESTIGACAO' },
    { name: 'Intuição',               category: 'INVESTIGACAO' },
    { name: 'Usar Bibliotecas',       category: 'INVESTIGACAO' },
    { name: 'Charme',                 category: 'SOCIAL' },
    { name: 'Intimidação',            category: 'SOCIAL' },
    { name: 'Lábia/Persuasão',        category: 'SOCIAL' },
    { name: 'Psicologia',             category: 'SOCIAL' },
    { name: 'Conhecimento',           category: 'PRATICA' },
    { name: 'História',               category: 'PRATICA' },
    { name: 'Atualidades',            category: 'PRATICA' },
    { name: 'Atletismo',              category: 'PRATICA' },
    { name: 'Fortitude',              category: 'PRATICA' },
    { name: 'Sobrevivência',          category: 'PRATICA' },
    { name: 'Medicina',               category: 'PRATICA' },
    { name: 'Primeiros Socorros',     category: 'PRATICA' },
    { name: 'Herbalismo',             category: 'PRATICA' },
    { name: 'Dirigir / Cavalgar',     category: 'PRATICA' },
    { name: 'Prestidigitação',        category: 'PRATICA' },
    { name: 'Vínculo Animal/Astral',  category: 'ESPECIAL' },
    { name: 'Lidar com Animais',      category: 'ESPECIAL' },
  ]

  for (const p of proficiencies) {
    await prisma.proficiency.upsert({
      where: { name: p.name },
      update: { category: p.category },
      create: p,
    })
  }

  console.log('✅ Seed concluído: 3 arquétipos, 6 habilidades fixas, 31 proficiências')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())