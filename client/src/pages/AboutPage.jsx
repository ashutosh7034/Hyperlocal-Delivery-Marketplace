import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Rocket, HeartHandshake } from 'lucide-react';

const AboutPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative w-full bg-slate-900 dark:bg-black overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-60"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.p 
            initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}
            className="text-sm font-bold uppercase tracking-[0.25em] text-primary mb-4"
          >
            Our Mission
          </motion.p>
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6"
          >
            Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Local Commerce</span>
          </motion.h1>
          <motion.p 
            initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xl leading-relaxed text-slate-300 max-w-3xl mx-auto"
          >
            We are building the infrastructure that connects neighborhoods, empowering local vendors to thrive in the digital economy and giving customers instant access to what they need.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn} transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Built for hyperlocal workflows</h2>
                <p className="text-lg leading-8 text-slate-600 dark:text-slate-400">
                  This platform is designed entirely around the core hyperlocal flow. We believe that distance shouldn't dictate convenience, and local businesses shouldn't be left behind by massive e-commerce giants.
                </p>
                <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
                  Customers seamlessly discover nearby sellers, vendors efficiently manage products and orders, and admins oversee a thriving, self-sustaining marketplace ecosystem.
                </p>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                    <Rocket className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Lightning Fast</h3>
                    <p className="text-slate-600 dark:text-slate-400">Optimized routing and local matching ensures deliveries happen in minutes, not days.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <HeartHandshake className="text-emerald-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Community First</h3>
                    <p className="text-slate-600 dark:text-slate-400">Supporting local economy by keeping the commerce strictly within the neighborhood.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Secure & Reliable</h3>
                    <p className="text-slate-600 dark:text-slate-400">Enterprise-grade security ensuring every transaction and delivery is safe.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-orange-400 rounded-3xl blur-2xl opacity-20 dark:opacity-40"></div>
              <img 
                src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1000" 
                alt="Local Commerce" 
                className="relative rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 object-cover aspect-square md:aspect-[4/3] lg:aspect-[3/4]"
              />
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;