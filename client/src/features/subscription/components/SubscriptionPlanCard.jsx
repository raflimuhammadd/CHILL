import { Icon } from "../../../components/ui";
import { useNavigate } from "react-router-dom";

function SubscriptionPlanCard({ plan, onSelect, isSelected }) {
  const navigate = useNavigate();

  return (
    <article
        className={`rounded-[20px] md:rounded-3xl bg-linear-to-b from-[#5370D4] to-[#192DB7] 
            p-6 md:p-8 min-h-86.5 md:min-h-100 flex flex-col 
            transition-all duration-300 hover:shadow-xl
            ${isSelected ? 'ring-4 ring-white/80' : ''}`}
    >
      {/* Plan Name Badge */}
      <div className="mb-4">
        {plan?.name && (
          <span className="inline-block rounded-full 
                bg-[#3D4142] px-5 py-3 text-sm md:text-base font-bold text-white">
              {plan.name}
          </span>
        )}
      </div>

      {/* Pricing & Users */}
      <div className="mb-6 md:mb-7 space-y-1">
        <div className="text-sm md:text-base text-blue-200">Mulai dari {plan.price}{plan.period}</div>
        <div className="text-sm md:text-base text-blue-200">{plan.users}</div>
      </div>

      {/* Features List */}
    <ul className="space-y-3 md:space-y-4 mb-6">
        {plan.features.map((feature) => (
            <li key={feature.text} className="flex items-center gap-3">
            <Icon name="check" className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-white" />
            <span className="text-sm md:text-base text-white">{feature.text}</span>
            </li>
        ))}
    </ul>

      {/* Button & Terms */}
    <div className="mt-auto border-t border-white/20 pt-6 md:pt-8">
        <button
            onClick={() => {
              onSelect(plan.id);
              navigate('/payment', {state: {planId: plan.id}});
            }}
            className="w-full rounded-full bg-white py-3 md:py-4 text-sm 
            md:text-base font-bold text-[#0F1E93] transition-all duration-300 
            hover:bg-[#7EC036] active:bg-[#60A125] hover:text-white cursor-pointer"
        >
            Langganan
        </button>
        <p className="text-center text-xs md:text-sm text-white/50 mt-3">
            Syarat dan Ketentuan Berlaku
        </p>
    </div>

    </article>
  );
}

export default SubscriptionPlanCard