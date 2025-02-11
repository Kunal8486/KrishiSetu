import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userMetadata, setUserMetadata] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Function to check authentication status from local storage
    const checkUser = () => {
        const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);

        if (loggedIn) {
            const metadata = JSON.parse(localStorage.getItem('userMetadata'));
            setUserMetadata(metadata);
        } else {
            setUserMetadata(null);
        }
    };

    useEffect(() => {
        checkUser();

        const handleStorageChange = (e) => {
            if (e.key === 'userLoggedIn' || e.key === 'userMetadata') {
                checkUser();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        checkUser();
    }, [location.pathname]);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    const closeDropdown = () => setIsDropdownOpen(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = () => {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userMetadata');
        setIsLoggedIn(false);
        setUserMetadata(null);
        closeDropdown();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home' },
        isLoggedIn && { path: '/dashboard', label: 'Dashboard' },
        { path: '/about', label: 'About' },
        { path: '/services', label: 'Services' },
        { path: '/contact', label: 'Contact' },
    ].filter(Boolean);

    return (
        <header className="navbar">
            <div className="navbar-container">
                <div className="logo">
                    <Link to="/">
                        <img src="/Logo/navlogo.png" alt="KrishiSetu Logo" />
                    </Link>
                </div>

                <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <ul>
                        {navLinks.map((link, index) => (
                            <li key={index} onClick={closeMenu} className={isActive(link.path) ? 'active' : ''}>
                                <Link to={link.path}>{link.label}</Link>
                            </li>
                        ))}
                        {isLoggedIn ? (
                            <li className="profile-dropdown" ref={dropdownRef}>
                                <button className="profile-button" onClick={toggleDropdown}>
                                    <img src={userMetadata?.picture || '/Logo/profile.png'} alt="Profile" className="profile-icon" />
                                </button>
                                {isDropdownOpen && (
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link to="/dashboard" onClick={closeDropdown}>
                                                <img src="/Logo/dashboard.png" alt="Dashboard Icon" /> Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/profile" onClick={closeDropdown}>
                                                <img src="/Logo/profile2.png" alt="Profile Icon" /> Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/settings" onClick={closeDropdown}>
                                                <img src="/Logo/settings.png" alt="Settings Icon" /> Settings
                                            </Link>
                                        </li>
                                        <li>
                                            <button onClick={handleLogout} className="logout-button">
                                                <img src="/Logo/logout.png" alt="Logout Icon" /> Logout
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        ) : (
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </nav>

                <button className="hamburger" aria-label="Toggle Menu" onClick={toggleMenu}>
                    <img src="/Logo/hamburger.svg" alt="Hamburger Menu" />
                </button>
            </div>

            <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
                <button className="close-menu" aria-label="Close Menu" onClick={closeMenu}>
                    ×
                </button>
                <ul>
                    {navLinks.map((link, index) => (
                        <li key={index} onClick={closeMenu} className={isActive(link.path) ? 'active' : ''}>
                            <Link to={link.path}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
};

export default Navbar;
