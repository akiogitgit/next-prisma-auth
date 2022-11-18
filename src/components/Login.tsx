import { VFC, ReactNode } from 'react'
import { useSession, signIn } from 'next-auth/react'
import Local from '../lib/Local'

type Props = {
  children: ReactNode
}

const Login: VFC<Props> = ({ children }) => {
  const { data: session } = useSession()

  return (
    <main>
      {session || Local ? (
        children
      ) : (
        <div className='mt-10 text-center'>
          <p className='fadeIn-deley'>こちらからログインしてください</p>
          <button
            className='primary-btn mt-10 fadeIn-deley'
            onClick={() => signIn()}
          >
            Login
          </button>
        </div>
      )}
    </main>
  )
}

export default Login
