"use client";

type SuccessModalProps = {
    mensagem: string;
    onClose: () => void;
}

export default function ModalSucesso({ mensagem, onClose }: SuccessModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                <h2 className="text-xl font-bold text-center mb-4">{mensagem}</h2>
                <button
                    className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition"
                    onClick={onClose}
                >
                    OK
                </button>
            </div>
        </div>
    );
}
