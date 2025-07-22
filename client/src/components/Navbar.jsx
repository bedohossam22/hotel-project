import React, { useEffect, useState } from 'react';
import { Link, useLocation} from 'react-router-dom';    
import { assets } from '../assets/assets';
import { useClerk , UserButton } from '@clerk/clerk-react';
import { useAppContext } from '../conext/AppContext';

const BookIcon = ()=>(
  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="10" width="18" height="7" rx="2" stroke="currentColor" />
    <path d="M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" stroke="currentColor" />
    <circle cx="7.5" cy="15.5" r="1" fill="currentColor" />
    <circle cx="16.5" cy="15.5" r="1" fill="currentColor" />
  </svg>
)


const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/' },
        { name: 'About', path: '/' },
    ];


    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {openSignIn} = useClerk();
    
    const location = useLocation();

    const {user , navigate , isOwner , setShowHotelReg } = useAppContext()


useEffect(() => {
    if (location.pathname !== "/") {
        setIsScrolled(true);
        return; // Don't attach scroll handler
    } else {
        setIsScrolled(false)
    }
        setIsScrolled(prev => location.pathname !== '/' ? true : prev)

    // Home page: set based on scroll
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    // Set initial state for home page
    setIsScrolled(window.scrollY > 10);

    return () => window.removeEventListener("scroll", handleScroll);
}, [location.pathname]);

    return (
      
        
            <nav className={`fixed top-0 left-0  w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`} >

                {/* Logo */}
                <Link to='/'>
                    <img src={assets.logo} alt="logo" className={`h-9 ${isScrolled && "invert opacity-80"}`} />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4 lg:gap-8">
                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}>
                            {link.name}
                            <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                        </a>
                    ))}
                    { user && (
                    <button className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`}  onClick={() =>isOwner ? navigate('/owner'): setShowHotelReg(true)}>
                       {isOwner ? 'Dashboard' : 'List Your Hotel'}
                    </button>
                    )
                        }
                </div>

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-4">
                   <img src={assets.searchIcon} alt='search' className={`${isScrolled && "invert"}  h-7 transition-all duration-500`} />
                    {user ? (<UserButton>
                        <UserButton.MenuItems> 
                            <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => navigate('/my-bookings')} /> 

                        </UserButton.MenuItems>
                        </UserButton>) 
                    : 
                    (  <button className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500 cursor-pointer" onClick={openSignIn}>
                        Login
                    </button>)
                    }
                 
                  
                </div>

                {/* Mobile Menu Button */}
              
                <div className="flex items-center gap-3 md:hidden">
                      {user && <UserButton>
                        <UserButton.MenuItems> 
                            <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => navigate('/my-bookings')} /> 
                        </UserButton.MenuItems>
                        </UserButton>}
                    <img src={assets.menuIcon} alt='menu' className={`${isScrolled && "invert"} h-4`}  onClick={() => setIsMenuOpen(!isMenuOpen)}/>
                </div>

                {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <img src={assets.closeIcon} alt='close-menu' className='h-6.5' />
                    </button>

                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </a>
                    ))}

                 {user &&  <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all" onClick={() => isOwner ? navigate('/owner') : setShowHotelReg(true)}>
                        {isOwner ? 'Dashboard' : 'List Your Hotel'}
               
                    </button>}

                  {!user &&  <button className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer" onClick={openSignIn}>
                        Login
                    </button>}
                </div>
            </nav>
     
    );
}

export default Navbar;