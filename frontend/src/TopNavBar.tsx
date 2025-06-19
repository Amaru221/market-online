import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./TopNavBar.module.css";
import { Menu, Search, User } from "lucide-react";

type Props = {
  onLogout: () => void;
};

const TopNavBar: React.FC<Props> = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (menuOpen && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 150 + window.scrollX,
      });
    }
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuOpen &&
        !iconRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.leftSection}>
          <button className={styles.iconButton}>
            <Menu size={24} />
          </button>
          <h1 className={styles.logo}>MyApp</h1>
        </div>

        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.rightSection}>
          <button
            ref={iconRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className={styles.iconButton}
          >
            <User size={24} />
          </button>
        </div>
      </header>

      {menuOpen &&
        ReactDOM.createPortal(
          <div
            className={styles.dropdownPortal}
            ref={dropdownRef}
            style={{ top: position.top, left: position.left }}
          >
            <button className={styles.normalButton} >
              Mis pedidos
            </button>
            <button className={styles.logoutButton} onClick={onLogout}>
              Cerrar sesión
            </button>
          </div>,
          document.getElementById("dropdown-root")!
        )}
    </>
  );
};

export default TopNavBar;
