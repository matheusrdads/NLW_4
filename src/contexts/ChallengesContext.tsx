import { createContext, ReactNode, useEffect, useState } from 'react'
// import Cookies from 'js-cookie' //biblioteca para trabalhar com cookies
import Cookies from 'js-cookie'


import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModas';
interface Challenge{
  type: 'body' | 'eye'
  description: string
  amount: number
}

interface ChallengeContextData {
  level: number;
  currentExperience: number;
  experienceToNextLevel:number;
  challengesCompleted: number;
  activeChallenge:Challenge;
  levelUp: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
  closeLevelUpModal: () => void;
}

interface ChallengesProviderProps {
  children: ReactNode
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}



export const ChallengesContext = createContext({} as ChallengeContextData)

export function ChallengeProvider({ children, ...rest }: ChallengesProviderProps) {

  const [level, setLevel] = useState(rest.level ?? 1);// se rest.level não existir use 1
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0)
  const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0)

  const [activeChallenge, setActiveChallenge] = useState(null)
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

  useEffect(()=>{
    Notification.requestPermission() //pedindo par enviar notificações para a api do própio browser Notification.requestPermission()
  }, [])// array vazio no final, executa a primeira função apenas 'uma' vez quado o componente for exibido em tela

  useEffect(() => { //dispara um ou mais função assim que o parametro observado no array muda
    Cookies.set('level', String(level))
    Cookies.set('currentExperience', String(currentExperience))
    Cookies.set('challengesCompleted', String(challengesCompleted))

  }, [level, currentExperience, challengesCompleted])//parametros que estao sendo observados

  function levelUp() {
    setLevel(level + 1)
    setIsLevelUpModalOpen(true)
  }

  function closeLevelUpModal(){
    setIsLevelUpModalOpen(false)
  }
 
  function startNewChallenge() {
    const randomChallengesIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengesIndex]

    setActiveChallenge(challenge)

    new Audio('/Notification.mp3').play()

    if (Notification.permission === 'granted'){ // confirmando se o usuario deu permissão e executando uma menssagem
      new Notification('Novo desafio 🎉', {
        body:`Valendo ${challenge.amount}xp!` // passando no corpo o valor da xp desse desafio 
      }) 
    }else {
      console.log('semPermissao')
  }
  }

  function resetChallenge(){
    setActiveChallenge(null)
  }

  function completeChallenge(){
    if (!activeChallenge){
      return;
    }
    const { amount } = activeChallenge
    let finalExperience = currentExperience + amount

    if (finalExperience >= experienceToNextLevel){
      finalExperience = finalExperience - experienceToNextLevel
      levelUp()
    }
    setCurrentExperience(finalExperience)
    setActiveChallenge(null)
    setChallengesCompleted(challengesCompleted + 1)
  }

  return (
    <ChallengesContext.Provider
      value={{
        level,
        currentExperience,
        experienceToNextLevel,
        challengesCompleted,
        levelUp,
        startNewChallenge,
        activeChallenge,
        resetChallenge,
        completeChallenge,
        closeLevelUpModal,

      }}
    >
      {children}

      { isLevelUpModalOpen && <LevelUpModal/> } {/* se isLevelUpModalOpen mostre <LevelUpModal/> */}
    </ChallengesContext.Provider>

  )
}