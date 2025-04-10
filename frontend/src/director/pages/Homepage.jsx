import { Link } from "react-router-dom";
import styles from "./HomePage.module.css"; // Importa il modulo CSS

const HomePage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Homepage Direttore</h1>
      <div className={styles.linksContainer}>
        <Link to="/lista-utenti" className={styles.link}>
          Lista utenti
        </Link>
        <Link to="/esperti-allenamento" className={styles.link}>
          Esperti allenamento
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
