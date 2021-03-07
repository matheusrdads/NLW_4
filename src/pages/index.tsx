import Head from 'next/head'

import { GetServerSideProps } from 'next';
import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from '../components/Profile';
import { ChallengeBox } from "../components/ChallengeBox";

import styles from '../styles/pages/Home.module.css'
import { CountdownProvider } from '../contexts/CountdowmContext';
import { ChallengeProvider } from '../contexts/ChallengesContext';

interface HomeProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export default function Home(props: HomeProps) {
  console.log(props)
  return (
    <ChallengeProvider 
    level={props.level} 
    currentExperience={props.currentExperience}
    challengesCompleted={props.challengesCompleted}
    >
    <div className={styles.container}>

      <Head>
        <title>Início | move.it</title>
      </Head>

      <ExperienceBar />

      <CountdownProvider>
        <section>
          <div>
            <Profile />
            <CompletedChallenges />
            <Countdown />
          </div>
          <div>
            <ChallengeBox />
          </div>
        </section>
      </CountdownProvider>
    </div>
    </ChallengeProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => { 
  // 'ctx' acessando os dados dos cookies no back end
  // 'getServerSideProps': GetServerSideProps <- (informando o tipo 'GetServerSideProps')  consegue manipular quais dados podem ser passados da camada do servidor next será passada para o cliente "react"
  //permite fazer chamadas a api entregando para o componente o dado pronto para que os buscadores possam indxar tambem esses dados
  const { level, currentExperience, challengesCompleted} = ctx.req.cookies //capiturando dados armazenados nos cookies
  


  // Chamando a api

  return {
    props: {
      level: Number(level), //convertendo para numero +level tbm converte mais nom contexto apenas do js
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted)
    }
  }
}