// Emotion configs
const emotionGroupsNames = [ 'Bem & Calmo', 'Bem & Energizado', 'Mal & Calmo', 'Mal & Energizado' ]
const goodEnergizedEmotions = ['Animação', 'Concentração', 'Desinibição', 'Motivação', 'Euforia']
const goodCalmEmotions = ['Alívio', 'Calma', 'Conforto', 'Despreocupação', 'Inspiração', 'Orgulho', 'Paz', 'Relaxamento', 'Satisfação', 'Segurança', 'Criatividade']
const badEnergizedEmotions = ['Inquietação', 'Ansiedade', 'Desespero', 'Frustração', 'Insatisfação', 'Irritação', 'Medo', 'Vergonha', 'Preocupação', 'Impaciência', 'Sobrecarregado(a)', 'Tensão']
const badCalmEmotions = ['Depressão', 'Timidez', 'Cansaço', 'Tristeza','Confusão', 'Desanimo', 'Insegurança', 'Solidão', 'Tédio']
// const badEnergizedEmotions = ['Agitação', 'Ansiedade', 'Tristeza', 'Decepção', 'Depressão', 'Desespero', 'Frustração', 'Insatisfação', 'Irritação', 'Medo', 'Paranoia', 'Preocupação', 'Impaciencia', 'Raiva', 'Revolta', 'Sobrecarregado(a)', 'Tensão', 'Nojo']

const emotionGroups = [ goodCalmEmotions.sort(), goodEnergizedEmotions.sort(), badCalmEmotions.sort(), badEnergizedEmotions.sort() ]
const basicEmotions = [ ...emotionGroups[0], ...emotionGroups[1], ...emotionGroups[2], ...emotionGroups[3] ]

const emotionTypes = ['Positiva', 'Negativa']
const emotionEnergy = ['Calmo(a)', 'Energizado(a)']

var defaultEmotions = []
var type, energy

for (let emotion of basicEmotions) {
    type = emotionGroups[0].includes(emotion) || emotionGroups[1].includes(emotion) ? emotionTypes[0] : emotionTypes[1]
    energy = emotionGroups[0].includes(emotion) || emotionGroups[2].includes(emotion) ? emotionEnergy[0] : emotionEnergy[1]
    defaultEmotions.push({name: emotion, type: type, energy: energy})
}

// console.log(defaultEmotions);

module.exports = defaultEmotions;