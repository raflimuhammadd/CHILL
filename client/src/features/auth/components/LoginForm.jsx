import { useState } from "react";
import {useNavigate, Link} from 'react-router-dom';
import FormField from "../../../components/shared/FormField";
import { EyeIcon, Input, Button } from "../../../components/ui";
import useAuthStore from "../store/authStore";

const isValidUsername = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);

const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.username.trim()) errors.username = 'Username diperlukan';
    else if (formData.username.length < 3) errors.username = 'Username minimal 3 karakter';
    else if (!isValidUsername(formData.username)) errors.username = 'Username hanya boleh huruf, angka, dan underscore';
    
    if (!formData.password) errors.password = 'Kata sandi diperlukan';
    else if (formData.password.length < 6) errors.password = 'Kata sandi minimal 6 karakter';

    return errors;
};

function LoginForm() {
    const [formData, setFormData] = useState({username: '', password: ''});
    const [errors, setErrors] = useState ({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const {login, isLoading, error} = useAuthStore();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
        if (errors[name]) setErrors((prev) => ({...prev, [name]: ''}));
    };

    const handleSubmit = async (e) => {
       e.preventDefault();
       const formErrors = validateForm(formData);
       if (Object.keys(formErrors).length > 0) return setErrors(formErrors);
       
       const success = await login(formData);
       if (success) {
        setTimeout(() => navigate('/home'), 100);
       }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Username" htmlFor="login-username" error={errors.username}>
                <Input 
                    id="login-username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Masukkan username"
                    error={errors.username}
                    className="login-form-input login-form-input--username"
                />
            </FormField>

            <FormField label="Kata Sandi" htmlFor="login-password" error={errors.password}>
                <Input 
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan kata sandi"
                    error={errors.password}
                    className="login-form-input login-form-input--password"
                    icon={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                        >
                            <EyeIcon isOpen={showPassword}/>
                        </button>
                    }
                />
            </FormField>

            <div className="login-form-options flex justify-between items-center text-sm">
                <Link to="/register" className="text-white/80">
                    Belum punya akun? <span className="text-blue-300 hover:text-blue-700">Daftar</span>
                </Link>
                <a href="#" className="text-white/60 hover:text-white">Lupa kata sandi</a>
            </div>

            <div className="space-y-3">
                    {error && (
                        <div className="bg-red-500/20 border-red-500 text-red-500 px-4 py-3 
                                        rounded-lg text-center text-sm">
                            {error}
                        </div>
                    )}
                    <Button type="submit" variant="auth" className="w-full"
                                    disabled={isLoading}>
                        {isLoading ? 'Memproses...' : 'Masuk'}
                    </Button>
                    <p className="login-form-register-text text-center text-white/60">Atau</p>
                    <Button type="button" variant="secondary" className="w-full">
                        <img src="/assets/images/google-icon.png" alt="Google" className="h-5 w-5" />
                        Masuk dengan Google
                    </Button>
            </div>
        </form>
    )
}

export default LoginForm;