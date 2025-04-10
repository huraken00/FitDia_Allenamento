import { Link } from "react-router-dom";
import styles from "./HomePage.module.css"; // Importa il modulo CSS

const HomePage = () => {
  return (
    <div className={styles.homePageContainer}>
      <h1 className={styles.homePageTitle}>Homepage Esperto di allenamento</h1>
      <Link to="/lista-varianti" className={styles.link}>
        Varianti generate
      </Link>
      <br />
      <Link to="/lista-esercizi" className={styles.link}>
        Esercizi
      </Link>
    </div>
  );
};

export default HomePage;
