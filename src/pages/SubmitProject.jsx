import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';

const SubmitProject = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert("Project payload transmitted!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl glass-effect p-8 rounded-2xl border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">SUBMIT <span className="text-stellar-cyan">MISSION</span></h2>
        <p className="text-gray-400 text-center mb-8">Register your open source project for the event.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-400 mb-2 block uppercase">Project Name</label>
              <input 
                {...register("name", { required: true })} 
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-stellar-cyan outline-none transition-all" 
                placeholder="Project Alpha" 
              />
              {errors.name && <span className="text-red-400 text-xs">Required</span>}
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 mb-2 block uppercase">Repository URL</label>
              <input 
                {...register("repoUrl", { required: true })} 
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-stellar-cyan outline-none transition-all" 
                placeholder="https://github.com/..." 
              />
              {errors.repoUrl && <span className="text-red-400 text-xs">Required</span>}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 mb-2 block uppercase">Description</label>
            <textarea 
              {...register("desc", { required: true })} 
              rows="4" 
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-stellar-cyan outline-none transition-all" 
              placeholder="Brief mission overview..." 
            />
            {errors.desc && <span className="text-red-400 text-xs">Required</span>}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-400 mb-2 block uppercase">Track</label>
              <select {...register("track")} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-stellar-cyan outline-none appearance-none cursor-pointer">
                <option value="Web">Web Development</option>
                <option value="App">App Development</option>
                <option value="AI">AI / ML</option>
                <option value="Cloud">Cloud / DevOps</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 mb-2 block uppercase">Difficulty</label>
              <select {...register("difficulty")} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-stellar-cyan outline-none appearance-none cursor-pointer">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 border border-stellar-cyan text-stellar-cyan hover:bg-stellar-cyan hover:text-black font-bold py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_15px_rgba(76,201,240,0.1)] hover:shadow-[0_0_25px_rgba(76,201,240,0.3)]">
            <Send className="w-4 h-4" /> TRANSMIT DATA
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitProject;