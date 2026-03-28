import React, { useEffect, useState } from 'react';
import { MessageCircle, Settings, User, Edit, Trash2, Building2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";

import { setSessions, removeSession } from '../../store/sessionSlice'; // Import the setSessions action

const SideBar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sessions = useSelector( ( state ) => state.sessions ); // Access sessions from Redux store





    const handleSessionClick = ( session ) => {
        navigate( `/chat/${session.id}`, {
            state: {
                sessionId: session.id,
                isNewSession: false
            }
        } );
    };


    useEffect( () => {
        const fetchSessions = async () => {
            const token = localStorage.getItem( 'token' );
            try {
                const response = await axios.get( 'http://localhost:8000/api/session/user-sessions', {
                    headers: { Authorization: `Bearer ${token}` }
                } );

                console.log( "Reponse coming", response )
                // Dispatch action to set sessions in Redux store
                dispatch( setSessions( response.data.data ) );
            } catch ( error ) {
                console.error( 'Error fetching sessions:', error );
            }
        };

        fetchSessions();
    }, [ dispatch ] );


   
    // Check if user is authenticated
    const token = localStorage.getItem( 'token' );
    const isAuthenticated = Boolean( token ); // Convert to boolean for clarity

  

    const settingsItems = [
        {
            icon: User,
            name: 'Profile',
            path: '/profile',
        },
        {
            icon: Settings,
            name: 'Settings',
            path: '/settings',
        }
    ];

    const NavItem = ( { icon: Icon, name, path } ) => {
        const isActive = location.pathname === path;
        return (
            <Link
                to={path}
                className={`flex items-center px-4 py-3 rounded-lg mb-1.5 transition-colors duration-200
                    ${isActive ? 'bg-[#A2AA7B] text-white' : 'text-[#5C6748] hover:bg-[#D7E0BD]/20'}`}
            >
                <Icon size={20} className="mr-2" />
                <span className="text-base font-medium">{name}</span>
            </Link>
        );
    };


    console.log( "new session", sessions )



    const handleDeleteSession = async ( sessionId ) => {
        const token = localStorage.getItem( 'token' );
        try {
            await axios.delete( `http://localhost:8000/api/session/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            } );
            // Dispatch action to remove session from Redux store
            dispatch( removeSession( sessionId ) );


            if ( sessions.length > 1 ) {
                // If there are more sessions, navigate to the most recent session or the last active session
                const mostRecentSession = sessions.filter( session => session.id !== sessionId ).reduce( ( latest, session ) => {
                    return new Date( session.createdAt ) > new Date( latest.createdAt ) ? session : latest;
                } );
                navigate( `/chat/${mostRecentSession.id}` );
            } else {
                // If no sessions left, navigate to /assessment page
                navigate( '/assessment' );
            }


            navigate( "/assessment" )
        } catch ( error ) {
            console.error( 'Error deleting session:', error );
        }
    };


    return (
        <aside className="relative flex flex-col h-screen w-[280px] bg-[#151515] border-r border-white/5 z-30 overflow-y-auto scrollbar-thin scrollbar-thumb-[#C5A059]/20 scrollbar-track-transparent">
            <div className="flex flex-col h-full p-6">
                {/* Logo Section */}
                <Link to="/home" className="flex items-center justify-center py-6 mb-4 border-b border-white/5">
                    <img
                        src="/src/assets/derma_glow_final.png"
                        alt="Derma Glow Logo"
                        className="h-12 object-contain"
                    />
                </Link>

                {/* Chat Section */}
                <div className="flex-grow pr-1">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#C5A059]">Active</span>
                            <h2 className="text-xs font-semibold tracking-widest text-[#F9F8F6]/80 uppercase">Sessions</h2>
                        </div>
                        <Link 
                            to="/assessment"
                            className="p-2.5 bg-white/5 hover:bg-[#C5A059] rounded-xl transition-all duration-300 group"
                        >
                            <Edit size={16} className="text-[#C5A059] group-hover:text-[#151515]" />
                        </Link>
                    </div>

                    {/* Sessions List */}
                    <div className="space-y-3 px-1">
                        {sessions.length > 0 ? (
                            sessions.map((session) => {
                                const isSessionActive = location.pathname === `/chat/${session.id}`;
                                const sessionName = `Session ${new Date(session.createdAt).toLocaleDateString()}`;

                                return (
                                    <div
                                        key={session.id}
                                        className="group relative flex items-center justify-between transition-all duration-300"
                                    >
                                        <div
                                            onClick={() => handleSessionClick(session)}
                                            className={`flex items-center flex-1 p-3.5 rounded-2xl transition-all duration-300 border
                                                  ${isSessionActive 
                                                    ? 'bg-[#C5A059] border-[#C5A059] text-[#151515] shadow-[0_10px_20px_rgba(197,160,89,0.2)]' 
                                                    : 'bg-transparent border-transparent text-[#F9F8F6]/40 hover:bg-white/5 hover:text-[#F9F8F6]'}`}
                                        >
                                            <MessageCircle 
                                                size={16} 
                                                className={`mr-3 ${isSessionActive ? 'text-[#151515]' : 'text-[#C5A059]/40 group-hover:text-[#C5A059]'}`} 
                                            />
                                            <span className="text-[11px] font-bold tracking-widest uppercase truncate">
                                                {sessionName}
                                            </span>
                                        </div>

                                        <button
                                            onClick={( e ) => {
                                                e.stopPropagation();
                                                handleDeleteSession( session.id );
                                            }}
                                            className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:text-red-500 rounded-lg bg-[#1a1a1a]/80"
                                            aria-label="Delete session"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-10 px-6 rounded-[24px] bg-white/5 border border-white/5">
                                <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase mb-4">
                                    No records found
                                </p>
                                <Link 
                                    to="/assessment"
                                    className="inline-flex items-center justify-center px-6 py-2.5 bg-[#C5A059] text-[#151515] rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#F9F8F6] transition-all duration-300"
                                >
                                    Begin Phase 01
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Explore Clinics Link */}
                <div className="mt-8 mb-4">
                    <Link
                        to="/explore-clinics"
                        className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-300 border
                            ${location.pathname === '/explore-clinics' 
                                ? 'bg-[#C5A059] border-[#C5A059] text-[#151515] shadow-lg' 
                                : 'text-[#F9F8F6]/40 border-transparent hover:bg-white/5 hover:text-[#F9F8F6]'}`}
                    >
                        <Building2 size={18} className="mr-3" />
                        <span className="text-[11px] font-bold tracking-widest uppercase">Explore Clinics</span>
                    </Link>
                </div>

                {/* Settings Section */}
                {isAuthenticated && (
                    <div className="mt-auto pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between mb-4 px-2">
                             <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/10 italic">Core Profile</span>
                        </div>
                        <div className="space-y-1">
                            {settingsItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        className={`flex items-center px-5 py-3.5 rounded-2xl mb-2 transition-all duration-300
                                            ${isActive 
                                                ? 'bg-white/10 text-[#C5A059] border border-[#C5A059]/20' 
                                                : 'text-[#F9F8F6]/30 hover:text-[#C5A059] hover:bg-white/5'}`}
                                    >
                                        <Icon size={18} className="mr-3" />
                                        <span className="text-[11px] font-bold tracking-widest uppercase">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </aside>

    );
};

export default SideBar;
