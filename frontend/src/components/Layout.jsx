import React, { useContext } from "react";
import { AuthContext } from "../shared/context/auth-context"; // Importa il contesto di autenticazione
import logo from "../images/LogoFitDia.png";
import styles from "./Layout.module.css";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Icona per il profilo

const Layout = ({ children }) => {
  const { isLoggedIn, role } = useContext(AuthContext); // Ottieni lo stato di login e ruolo dall'AuthContext

  const renderProfileLink = () => {
    if (!isLoggedIn) {
      return null; // Non mostrare l'icona se non è loggato
    }

    // In base al ruolo, cambia il link del profilo
    if (role === "utente") {
      return (
        <div className={styles.profileLink}>
          <Link to="/profilo" title="Profilo Utente">
            <FaUserCircle size={32} className={styles.icon} />
          </Link>
        </div>
      );
    }

    if (role === "esperto") {
      return (
        <div className={styles.profileLink}>
          <Link to="/profilo-esperto" title="Profilo Esperto">
            <FaUserCircle size={32} className={styles.icon} />
          </Link>
        </div>
      );
    }

    if (role === "direttore") {
      return (
        <div className={styles.profileLink}>
          <Link to="/profilo-direttore" title="Profilo Direttore">
            <FaUserCircle size={32} className={styles.icon} />
          </Link>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <img src={logo} alt="FitDia Logo" className={styles.logo} />
        {renderProfileLink()} {/* Mostra il link del profilo solo se loggato */}
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;
