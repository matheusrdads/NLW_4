import { createContext, ReactNode, useState } from 'react'

export const ChallengesContext = createContext({})

interface ChallengesProviderProps {
  children: ReactNode
}

export function ChallengeProvider({ children }: ChallengesProviderProps) {

  const [level, setLevel] = useState(1);
  const [currentExperience, serCurrentExperience] = useState(0)
  const [challengesCompleted, setChallengesCompleted] = useState(0)

  function levelUp() {
    setLevel(level + 1)
  }

  function startNewChallenge() {
    console.log('New Challenge')
  }

  return (
    <ChallengesContext.Provider
      value={{
        level,
        currentExperience,
        challengesCompleted,
        levelUp,
        startNewChallenge
      }}
    >
      {children}
    </ChallengesContext.Provider>

  )
}