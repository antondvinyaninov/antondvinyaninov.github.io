import React, { useState, useRef, useEffect } from 'react';

export default function AvatarDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Theme initialization
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []); // Run once on mount

    const toggleTheme = () => {
        setIsDark(prevIsDark => {
            const newIsDark = !prevIsDark;
            if (newIsDark) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
            return newIsDark;
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`relative isolate inline-flex shrink-0 items-center justify-center rounded-full border border-transparent font-medium size-10 text-sm focus:outline-none transition-colors 
        ${isOpen ? 'bg-neutral-950/5 dark:bg-white/10' : 'hover:bg-neutral-950/5 dark:hover:bg-white/10'}
        text-neutral-950 dark:text-white cursor-pointer`}
            >
                <span className="sr-only">Open user menu</span>
                <div className="size-8 rounded-full object-cover inline-grid shrink-0 bg-neutral-200 align-middle">
                    <img
                        alt="avatar"
                        src="/images/hero_pool.png"
                        className="aspect-square object-cover rounded-full w-full h-full"
                    />
                </div>
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 transform origin-top-right bg-white dark:bg-neutral-800 rounded-2xl shadow-xl ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden">

                    {/* User Info Header */}
                    <div className="relative flex flex-col gap-y-6 px-6 py-7">
                        <div className="relative flex items-center gap-x-3">
                            <div className="size-12 rounded-full object-cover inline-grid shrink-0 bg-neutral-200 align-middle">
                                <img alt="avatar" src="/images/hero_pool.png" className="aspect-square object-cover rounded-full w-full h-full" />
                            </div>
                            <div className="grow">
                                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">John Doe</h4>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Los Angeles, CA</p>
                            </div>
                        </div>

                        <hr className="w-full border-t border-neutral-200 dark:border-neutral-700" />

                        {/* Links */}
                        <div className="flex flex-col gap-1">
                            <a href="/author/john-doe" className="-mx-3 flex items-center gap-x-4 rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700">
                                <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                                    <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8.5C17 5.73858 14.7614 3.5 12 3.5C9.23858 3.5 7 5.73858 7 8.5C7 11.2614 9.23858 13.5 12 13.5C14.7614 13.5 17 11.2614 17 8.5Z" /><path d="M19 20.5C19 16.634 15.866 13.5 12 13.5C8.13401 13.5 5 16.634 5 20.5" /></svg>
                                </div>
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200">Мой профиль</p>
                            </a>

                            <a href="/dashboard/posts" className="-mx-3 flex items-center gap-x-4 rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700">
                                <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                                    <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.99805 16H11.998M7.99805 11H15.998" /><path d="M7.5 3.5C5.9442 3.54667 5.01661 3.71984 4.37477 4.36227C3.49609 5.24177 3.49609 6.6573 3.49609 9.48836L3.49609 15.9944C3.49609 18.8255 3.49609 20.241 4.37477 21.1205C5.25345 22 6.66767 22 9.49609 22L14.4961 22C17.3245 22 18.7387 22 19.6174 21.1205C20.4961 20.241 20.4961 18.8255 20.4961 15.9944V9.48836C20.4961 6.6573 20.4961 5.24177 19.6174 4.36228C18.9756 3.71984 18.048 3.54667 16.4922 3.5" /><path d="M7.49609 3.75C7.49609 2.7835 8.2796 2 9.24609 2H14.7461C15.7126 2 16.4961 2.7835 16.4961 3.75C16.4961 4.7165 15.7126 5.5 14.7461 5.5H9.24609C8.2796 5.5 7.49609 4.7165 7.49609 3.75Z" /></svg>
                                </div>
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200">Мои посты</p>
                            </a>

                            <a href="/author/john-doe?tab=favorites" className="-mx-3 flex items-center gap-x-4 rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700">
                                <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                                    <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z" /></svg>
                                </div>
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200">Избранное</p>
                            </a>

                            <a href="/submission" className="-mx-3 flex items-center gap-x-4 rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700">
                                <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                                    <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V16M16 12H8" /><circle cx="12" cy="12" r="10" /></svg>
                                </div>
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200">Предложить запись</p>
                            </a>
                        </div>

                        <hr className="w-full border-t border-neutral-200 dark:border-neutral-700" />

                        {/* Bottom Actions */}
                        <div className="flex flex-col gap-1">
                            {/* Dark Mode Toggle */}
                            <div className="-mx-3 flex items-center justify-between rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                                <div className="flex items-center">
                                    <div className="flex flex-shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                                        <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6.08938 14.9992C5.71097 14.1486 5.5 13.2023 5.5 12.2051C5.5 8.50154 8.41015 5.49921 12 5.49921C15.5899 5.49921 18.5 8.50154 18.5 12.2051C18.5 13.2023 18.289 14.1486 17.9106 14.9992" /><path d="M12 1.99921V2.99921" /><path d="M22 11.9992H21" /><path d="M3 11.9992H2" /><path d="M19.0704 4.92792L18.3633 5.63503" /><path d="M5.6368 5.636L4.92969 4.92889" /><path d="M14.517 19.3056C15.5274 18.9788 15.9326 18.054 16.0466 17.1238C16.0806 16.8459 15.852 16.6154 15.572 16.6154L8.47685 16.6156C8.18725 16.6156 7.95467 16.8614 7.98925 17.1489C8.1009 18.0773 8.3827 18.7555 9.45345 19.3056M14.517 19.3056C14.517 19.3056 9.62971 19.3056 9.45345 19.3056M14.517 19.3056C14.3955 21.2506 13.8338 22.0209 12.0068 21.9993C10.0526 22.0354 9.60303 21.0833 9.45345 19.3056" /></svg>
                                    </div>
                                    <p className="ms-4 text-sm font-medium text-neutral-900 dark:text-neutral-200">Темная тема</p>
                                </div>
                                {/* Toggle Switch */}
                                <button
                                    onClick={toggleTheme}
                                    className={`${isDark ? 'bg-teal-600' : 'bg-neutral-200'} relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer rounded-full border-4 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                                >
                                    <span className="sr-only">Enable dark mode</span>
                                    <span className={`${isDark ? 'translate-x-5' : 'translate-x-0'} inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`} />
                                </button>
                            </div>

                            <a href="#" className="-mx-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700">
                                <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                                    <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5.14286 14C4.41735 12.8082 4 11.4118 4 9.91886C4 5.54539 7.58172 2 12 2C16.4183 2 20 5.54539 20 9.91886C20 11.4118 19.5827 12.8082 18.8571 14" /><path d="M7.38287 17.0982C7.291 16.8216 7.24507 16.6833 7.25042 16.5713C7.26174 16.3343 7.41114 16.1262 7.63157 16.0405C7.73579 16 7.88105 16 8.17157 16H15.8284C16.119 16 16.2642 16 16.3684 16.0405C16.5889 16.1262 16.7383 16.3343 16.7496 16.5713C16.7549 16.6833 16.709 16.8216 16.6171 17.0982C16.4473 17.6094 16.3624 17.8651 16.2315 18.072C15.9572 18.5056 15.5272 18.8167 15.0306 18.9408C14.7935 19 14.525 19 13.9881 19H10.0119C9.47495 19 9.2065 19 8.96944 18.9408C8.47283 18.8167 8.04281 18.5056 7.7685 18.072C7.63755 17.8651 7.55266 17.6094 7.38287 17.0982Z" /><path d="M15 19L14.8707 19.6466C14.7293 20.3537 14.6586 20.7072 14.5001 20.9866C14.2552 21.4185 13.8582 21.7439 13.3866 21.8994C13.0816 22 12.7211 22 12 22C11.2789 22 10.9184 22 10.6134 21.8994C10.1418 21.7439 9.74484 21.4185 9.49987 20.9866C9.34144 20.7072 9.27073 20.3537 9.12932 19.6466L9 19" /><path d="M12.5521 6.5L11.0305 8.19458C10.8214 8.42743 10.9486 8.79939 11.2566 8.85537L12.7453 9.12605C13.0732 9.18567 13.1886 9.59658 12.9398 9.81826L11.0521 11.5" /></svg>
                                </div>
                                <p className="ms-4 text-sm font-medium text-neutral-900 dark:text-neutral-200">Помощь</p>
                            </a>

                            <a href="#" className="-mx-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700">
                                <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                                    <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3.09502C13.543 3.03241 13.0755 3 12.6 3C7.29807 3 3 7.02944 3 12C3 16.9706 7.29807 21 12.6 21C13.0755 21 13.543 20.9676 14 20.905" /><path d="M21 12L11 12M21 12C21 11.2998 19.0057 9.99153 18.5 9.5M21 12C21 12.7002 19.0057 14.0085 18.5 14.5" /></svg>
                                </div>
                                <p className="ms-4 text-sm font-medium text-neutral-900 dark:text-neutral-200">Выйти</p>
                            </a>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
