import { useForm } from 'react-hook-form';
import { Rocket } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert("Registration protocol initiated!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-effect p-8 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cosmic-purple to-nebula-blue"></div>
        
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Rocket className="w-8 h-8 text-cosmic-purple" />
            </div>
            <h2 className="text-2xl font-bold text-white">CADET REGISTRATION</h2>
            <p className="text-gray-400 text-sm">Join the fleet for Winter of Code</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Full Name</label>
            <input 
              {...register("fullName", { required: true })}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cosmic-purple outline-none transition-all"
              placeholder="Your Name Here"
            />
            {errors.fullName && <span className="text-red-400 text-xs">Required field</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">College / University</label>
            <input 
              {...register("college", { required: true })}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cosmic-purple outline-none transition-all"
              placeholder="VIT Bhopal University"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">GitHub Username</label>
            <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-500 text-sm">@</span>
                <input 
                {...register("github", { required: true })}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 pl-7 text-white focus:border-cosmic-purple outline-none transition-all"
                placeholder="username"
                />
            </div>
          </div>

          <button type="submit" className="w-full mt-4 bg-gradient-to-r from-cosmic-purple to-nebula-blue text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-cosmic-purple/25 transition-all transform hover:-translate-y-0.5">
            INITIATE LAUNCH
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;