import Image from "next/image"
import { Oval } from "react-loader-spinner"

export const Loading = () => {
    return (
        <div className="w-screen h-screen flex justify-center items-center relative bg-[#272731]">
            <Oval
                visible={true}
                height="130"
                width="130"
                ariaLabel="vortex-loading"
                wrapperStyle={{}}
                wrapperClass="vortex-wrapper"
                color="#63E300"
            />

            <div className="absolute w-28 h-28 flex justify-center items-center">
                <Image
                    src="/logo-fabr-color.png"
                    alt="Custom Image"
                    width={112}
                    height={112}
                    quality={100}
                    className="object-contain"
                />
            </div>
        </div>
    )
}
