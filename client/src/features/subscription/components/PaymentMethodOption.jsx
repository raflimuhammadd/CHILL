import { Icon } from "../../../components/ui";

function PaymentMethodOption({selected, onClick, children}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-16 w-full items-center gap-3 rounded-xl border px-4 text-left transition-all duration-300 ${
                selected 
                ? 'border-white/80 bg-[#2F3334]/50 shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
                : 'border-white/30 hover:border-white/50 hover:bg-[#2F3334]/30'
            }`}
            >
            <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                selected 
                    ? 'border-white bg-white shadow-[inset_0_0_0_4px_#0F0F0F]' 
                    : 'border-white/60'
                }`}
            />
            <div className="flex-1">{children}</div>
            {selected && <Icon name="check" className="h-5 w-5 text-white" />}
        </button>
    )
}

export default PaymentMethodOption