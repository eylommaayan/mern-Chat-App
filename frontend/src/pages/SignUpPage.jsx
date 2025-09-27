import { useState  } from 'react';
import { useAuthStore } from "../store/useAuthStore";

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fukllName: '',
    email:"",
    password: '',
  });

  const { signup, isSingingUp } = useAuthStore();

  const validateForm = () => {}
  const handleChange = (e) => {
    e.preventDefault();
  }
    

  return <div className="min-h-screen grid lg:grid-cols-2">
  {/*צד שמאל */}
    <div className="flex flex-col justify-center items-center p-6 sm:p-12">

      <div className="w-full max-w-md space-y-8">
        
      </div>
    </div>

  </div>

}

export default SignUpPage