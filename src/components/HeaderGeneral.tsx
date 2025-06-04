"use client"

import Image from "next/image"
import Link from "next/link"

interface Props {
    label: string
}

export const HeaderGeneral = ({ label }: Props) => {

    return (
        <header className="sticky top-0 z-10 bg-gradient-to-r from-[#191920] to-[#272731] shadow-xl mb-4">
            <div className="w-full px-2 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/" className="text-white font-bold text-xl flex items-center">
                        <Image
                            src="/logo-fabr-color.png"
                            alt="Logo"
                            width={200}
                            height={100}
                        />
                    </Link>
                    <h1 className="text-4xl text-[#63E300] font-extrabold italic leading-[55px] tracking-[-3px]">
                        {label}
                    </h1>
                </div>
                <div className="flex gap-4 mr-4">
                    <Link
                        href="/"
                        className="px-4 py-2 bg-[#63E300] text-black rounded-lg hover:bg-[#50B800] transition-colors flex items-center font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </Link>
                </div>
            </div>
        </header>
    )
}