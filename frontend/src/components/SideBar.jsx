import { useState, useEffect } from "react";
import React from "react";
import {
    Coins,
    LogOut,
    MessageSquare,
    PanelLeftIcon,
    PanelRight,
    PenBoxIcon,
    PenSquare,
    Plus,
    User,
} from "lucide-react";
import { getConversations } from "../features/getConversations";
import { useDispatch, useSelector } from "react-redux";
import {
    setConversations,
    setSelectedConversation,
    addConversation,
} from "../redux/conversationSlice";
import { createConversation } from "../features/createConversation";
import logOut from "../features/logout.js";
import { setUserData } from "../redux/userSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase.js";

function SideBar() {
    const [collapse, setCollapse] = useState(false);
    const dispatch = useDispatch();
    const [imageError, setImageError] = useState(false);

    const { conversation, selectedConversation } = useSelector(
        (state) => state.conversation,
    );
    const { userData } = useSelector((state) => state.user);

    const { conversations } = useSelector((state) => state.conversation);
    useEffect(() => {
        const getConver = async () => {
            const data = await getConversations();
            dispatch(setConversations(data));
        };
        getConver();
    }, [userData?._id]);

    const handleCreateConversation = async () => {
        const data = await createConversation();
        dispatch(addConversation(data));
    };

    const handleLogout = async () => {
        try {
            await logOut();
            await signOut(auth);
            dispatch(setUserData(null));

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (collapse) {
        return (
            <div className=" hidden lg:flex flex-col items-center w-[56px] h-screen bg-[#212a3f] border-r border-white/6 py-4 gap-1 shrink-0">
                <button className="flex items-center justify-center w-7 h-7 rounded-lg hover:text-slate-200 hover:bg-purple/5 
            transition-colors duration-150 text-slate-500 bg-transparent border-none cursor-pointer mb-1" onClick={() =>
                        setCollapse(false)
                    }>
                    <PanelRight />
                </button>
                <button className="flex items-center justify-center w-7 h-7 rounded-lg hover:text-slate-200 hover:bg-purple/5 
            transition-colors duration-150 text-slate-500 bg-transparent border-none cursor-pointer">
                    <Plus size={18} />
                </button>

                <div className="flex-1 overflow-y-auto px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-18">
                    {conversations.map((conver, i) => {
                        const isActiveConver = selectedConversation?._id == conver?._id;
                        return (
                            <div
                                key={conver._id}
                                onClick={() => dispatch(setSelectedConversation(conver))}
                                className={`flex items-center gap-2 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150
                                    ${isActiveConver ? "bg-indigo-500/10 border-indigo-500/18" : "bg-transparent border-transparent"}`}
                            >
                                <div
                                    className={`flex item-center justify-center shrink-0 w-5 h-5 rounded-lg transition-colors duration-150
                                    ${isActiveConver ? "bg-indigo-400/10 text-indigo-400" : "bg-transparent text-slate-500"}
                                    `}
                                >
                                    <MessageSquare size={15} />
                                </div>

                            </div>
                        );
                    })}
                </div>
                <div className="relative shrink-0">
                    {userData?.avatar && !imageError ? (
                        <img
                            className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
                            src={userData?.avatar}
                            alt={"image"}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className=" w-9 h-9 rounded-[10px] bg-white/6 flex items-center justify-center">
                            <User size={15} className="text-slate-400" />
                        </div>
                    )}
                </div>



            </div>
        )
    }

    return (
        <div className="fixed lg:static inset-y-0 left-0 z-45 w-62.5 h-screen shrink-0 bg-[#42426096] border-r border-white/6">
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/5">
                    <div
                        className=" hidden lg:flex justify-center w-7 h-7 rounded-lg items-center  hover:text-slate-200 hover:bg-purple/5 
            transition-colors duration-150 text-slate-500 bg-transparent border-none cursor-pointer"
                        onClick={() => setCollapse(true)}
                    >
                        <PanelLeftIcon />
                    </div>
                    <span className="tet-[15px] font-semibold text-slate-100 tracking-tight flex-1">
                        MultiplexAI
                    </span>
                    <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/15 border border-indigo-500/20 px-0.5 py-0.5 rounded-full tracking-wide">
                        free tier
                    </span>
                    <button
                        className=" flex items-center justify-center w-7 h-7 rounded-lg hover:text-slate-200 hover:bg-purple/5 
            transition-colors duration-150 text-slate-500 bg-transparent border-none cursor-pointer"
                        onClick={handleCreateConversation}
                    >
                        <PenSquare size={14} />
                    </button>
                </div>
                <div className="flex flex-col flex-1 min-h-0">
                    <div className="px-4 pt-4 pb-1">
                        <button
                            className="w-full flex items-center justify-center gap-2 text-sm font-medium test-white bg-linear-to-br
                   from-indigo-400 to-violet-600 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-80 transition-opacity
                    duration-150 "
                            onClick={handleCreateConversation}
                        >
                            <Plus size={15} />
                            New chat
                        </button>

                        {conversations.length == 0 ? (
                            <div className="px-4 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-400">
                                No chats
                            </div>
                        ) : (
                            <div className="px-4 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-400">
                                Recents chats
                            </div>
                        )}
                        <div className="flex-1 overflow-y-auto px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {conversations.map((conver, i) => {
                                const isActiveConver = selectedConversation?._id == conver?._id;
                                return (
                                    <div
                                        key={conver._id}
                                        onClick={() => dispatch(setSelectedConversation(conver))}
                                        className={`flex items-center gap-2 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150
                                    ${isActiveConver ? "bg-indigo-500/10 border-indigo-500/18" : "bg-transparent border-transparent"}`}
                                    >
                                        <div
                                            className={`flex item-center justify-center shrink-0 w-[18px] rounded-lg transition-colors duration-150
                                    ${isActiveConver ? "bg-indigo-400/10 text-indigo-400" : "bg-transparent text-slate-500"}
                                    `}
                                        >
                                            <MessageSquare size={15} />
                                        </div>
                                        <span
                                            className={`text-[13px] font-medium truncate ${isActiveConver ? "text-slate-100" : "text-slate-300"}`}
                                        >
                                            {conver?.title || "New Chat"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-white/60 mx-2.5" />
                <div className="">
                    {userData ? (
                        <div
                            className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 
          hover:bg-white/5 transition-colors duration-150 "
                        >
                            <div className="relative shrink-0">
                                {userData?.avatar && !imageError ? (
                                    <img
                                        className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
                                        src={userData?.avatar}
                                        alt={"image"}
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div className=" w-9 h-9 rounded-[10px] bg-white/6 flex items-center justify-center">
                                        <User size={15} className="text-slate-400" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-semibold text-slate-200 truncate"> {userData?.name || "user"}</p>
                                <p className="text-[11px] text-slate-500 mt-px">{"plan"}</p>
                            </div>
                            <div className="flex gap-1">
                                <button className=" flex items-center justify-center w-7 h-7 rounded-[7px] hover:text-slate-400 hover:bg-white/8 
            transition-all duration-150 bg-transparent border-none text-yellow-500 cursor-pointer">

                                    <Coins size={17} />
                                </button>
                                <button className=" flex items-center justify-center w-7 h-7 rounded-[7px] hover:text-slate-400 hover:bg-white/8 
            transition-all duration-150 bg-transparent border-none text-yellow-500 cursor-pointer"
                                    onClick={handleLogout}>
                                    <LogOut size={17} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button className="w-full flex items-center justify-center w-7 h-7 rounded-[7px] hover:text-slate-400 hover:bg-white/8 
            transition-all duration-150 bg-transparent border-none text-yellow-500 cursor-pointer"
                        >login</button>
                    )}
                </div>
            </div>
        </div>
    );

}

export default SideBar;
