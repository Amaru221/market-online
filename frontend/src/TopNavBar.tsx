import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./TopNavBar.module.css";
import { Menu, Search, User } from "lucide-react";

type Category = {
  id: number;
  name: string;
};

type Props = {
  token: string;
  onLogout: () => void;
};

const TopNavBar: React.FC<Props> = ({ token, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const iconRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Fetch categories from backend
  useEffect(() => {
    if (!token) return;

    fetch("https://localhost:8000/api/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
        //Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener categorías");
        return res.json();
      })
      .then((data) => {
        console.log("Respuesta de categorías:", data); // <- importante
        setCategories(data.member);

      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [token]);

  // Menu position logic
  useEffect(() => {
    if (menuOpen && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 150 + window.scrollX,
      });
    }
  }, [menuOpen]);

  // Close menu/sidebar on outside click
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
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(target) &&
        !(e.target as HTMLElement).closest(`.${styles.iconButton}`)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, sidebarOpen]);

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.leftSection}>
          <button
            className={styles.iconButton}
            onClick={() => setSidebarOpen(true)}
          >
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

      {/* Dropdown user menu */}
      {menuOpen &&
        ReactDOM.createPortal(
          <div
            className={styles.dropdownPortal}
            ref={dropdownRef}
            style={{ top: position.top, left: position.left }}
          >
            <button className={styles.normalButton}>Mis pedidos</button>
            <button className={styles.logoutButton} onClick={onLogout}>
              Cerrar sesión
            </button>
          </div>,
          document.getElementById("dropdown-root")!
        )}

      {/* Sidebar for categories */}
      {sidebarOpen &&
        ReactDOM.createPortal(
          <div className={styles.sidebarOverlay}>
            <div className={styles.sidebar} ref={sidebarRef}>
              <h2 className={styles.sidebarTitle}>Categorías</h2>
              <ul className={styles.categoryList}>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      className={styles.categoryButton}
                      onClick={() => {
                        console.log("Clic en categoría:", cat.name);
                        setSidebarOpen(false);
                      }}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default TopNavBar;
