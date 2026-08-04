import { AuthLayout, RegisterForm } from "../components";

function RegisterPage() {
  return (
    <AuthLayout
      title="Daftar"
      subtitle="Selamat Datang!"
      bgImage="/assets/images/theatre3.jpg"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default RegisterPage;