import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

const Header: React.FC = () => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean = pathname =>
    router.pathname === pathname

  const { data: session } = useSession()

  const [showHeader, setShowHeader] = useState(true)
  useScrollPosition(({ prevPos, currPos }) => {
    const visible = currPos.y > prevPos.y
    setShowHeader(visible)
  }, [])

  return (
    <header
      className={`fixed top-0 pr-[60px] lg:pr-0 w-full max-w-[780px] z-10 bg-gray-200/80 duration-300
        ${showHeader ? '' : 'translate-y-[-100%]'}`}
    >
      <Head>
        <title>Simple Post</title>
      </Head>
      <nav className='py-8 flex justify-between text-[20px]'>
        <div className='left flex gap-3'>
          <Link href='/'>
            <a className='font-bold fall-down' data-active={isActive('/')}>
              Feed
            </a>
          </Link>
          <Link href='/create'>
            <a
              className='font-bold fall-down'
              data-active={isActive('/create')}
            >
              Create
            </a>
          </Link>
          <Link href='/drafts'>
            <a
              className='font-bold fall-down'
              data-active={isActive('/drafts')}
            >
              Draft
            </a>
          </Link>
        </div>
        <div className='translate-y-[-5px] slide-left'>
          {session ? (
            <button className='danger-btn' onClick={() => signOut()}>
              LogOut
            </button>
          ) : (
            <button className='primary-btn' onClick={() => signIn()}>
              LogIn
            </button>
          )}
        </div>

        <style jsx>{`
          .left a[data-active='true'] {
            color: gray;
          }
        `}</style>
      </nav>
    </header>
  )
}

export default Header
