"use client";

type SuccessModalProps = {
    mensagem: string;
    onClose: () => void;
}

export default function ModalSucesso({ mensagem, onClose }: SuccessModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-[#272731] rounded-lg p-6 shadow-lg w-96">
                <h2 className="text-xl font-bold text-white text-center mb-4">{mensagem}</h2>
                <button
                    className="w-full px-4 py-2 bg-[#63E300] text-black rounded-lg hover:bg-[#50B800] transition-colors font-medium"
                    onClick={onClose}
                >
                    OK
                </button>
            </div>
        </div>
    );
}