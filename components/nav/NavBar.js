import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import { magicClient } from '../../lib/magic-client';
import styles from './NavBar.module.css';

function NavBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function getMagicMetadata() {
      try {
        const { email } = await magicClient.user.getMetadata();
        if (email) {
          setUsername(email);
        }
      } catch (error) {
        console.error('Error retrieving user email', error);
      }
    }
    getMagicMetadata();
  }, []);

  function onClickHomeHandler(event) {
    event.preventDefault();
    router.push('/');
  };

  function onClickMyListHandler(event) {
    event.preventDefault();
    router.push('/browse/my-list');
  };

  function showDropdownHandler(event) {
    event.preventDefault();
    setShowDropdown(!showDropdown);
  }

  async function signOutHandler(event) {
    event.preventDefault();

    try {
      await magicClient.user.logout();

      if (await magicClient.user.isLoggedIn()) { // => `false`
        console.error('Logging out failed!');
        throw new Error('For some reasons logging out was not successful');
      }
      
      router.push('/login');
    } catch (error) {
      console.error('Error logging out the user', error);
      router.push('/login');
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link className={styles.logoLink} href="/" >
          <div className={styles.logoWrapper}>
            <Image
              src="/icons/netflix.svg"
              alt="Netfilmix logo"
              width={128}
              height={34}
            />
          </div>
        </Link>

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={onClickHomeHandler}>
            Home
          </li>
          <li className={styles.navItem2} onClick={onClickMyListHandler}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={showDropdownHandler}>
              <p className={styles.username}>{username}</p>
              {/** Expand more icon */}
              <Image
                src={"/icons/expand-more.svg"}
                alt="Expand dropdown"
                width={24}
                height={24}
              />        
            </button>

            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <a className={styles.linkName} onClick={signOutHandler}>
                    Sign out
                  </a>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default NavBar;
