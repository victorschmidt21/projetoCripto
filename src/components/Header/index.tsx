import style from './style.module.css'
import { Link } from 'react-router-dom';
export function Header() {
  return (
    <header className={style.container}>
      <Link to="/" className={style.title}>CRIPTOAPP</Link>
    </header>
  );
}
