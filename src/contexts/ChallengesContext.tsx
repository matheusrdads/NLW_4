import { createContext, ReactNode, useEffect, useState } from 'react'
import challenges from '../../challenges.json'

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
}

interface ChallengesProviderProps {
  children: ReactNode
}

export const ChallengesContext = createContext({} as ChallengeContextData)

export function ChallengeProvider({ children }: ChallengesProviderProps) {

  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(0)
  const [challengesCompleted, setChallengesCompleted] = useState(0)

  const [activeChallenge, setActiveChallenge] = useState(null)

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

  useEffect(()=>{
    Notification.requestPermission() //pedindo par enviar notificações para a api do própio browser Notification.requestPermission()
  }, [])// array vazio no final, executa a primeira função apenas 'uma' vez quado o componente for exibido em tela

  function levelUp() {
    setLevel(level + 1)
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
        completeChallenge
      }}
    >
      {children}
    </ChallengesContext.Provider>

  )
}