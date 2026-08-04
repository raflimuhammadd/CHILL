import chillLogo from '/assets/images/logo-chill.png';

function AuthLayout({title, subtitle, bgImage, children}) {
    return (
    <div className="auth-layout min-h-screen relative overflow-hidden">
      <div
        className="auth-layout-background absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* overlay */}
      <div className="auth-layout-overlay absolute inset-0 bg-black/50" />

      <div className="auth-layout-content relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="auth-layout-card w-full max-w-md bg-[rgba(24,26,28,0.84)]/84 rounded-xl p-6">
          <img src={chillLogo} alt="CHILL" className="auth-layout-logo h-16 mx-auto mb-6" />

          <div className="auth-layout-header text-center mb-6">
            <h1 className="auth-layout-title text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="auth-layout-subtitle text-gray-300">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;