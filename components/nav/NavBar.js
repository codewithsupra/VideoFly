import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import styles from './NavBar.module.css';

function NavBar(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const { username } = props;

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

  function signOutHandler() {}

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link className={styles.logoLink} href="/" >
          <div className={styles.logoWrapper}>
            <Image
              src="/icons/netflix.svg"
              alt="Netflix logo"
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
