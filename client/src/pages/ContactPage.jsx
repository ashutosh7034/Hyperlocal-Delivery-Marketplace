import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../components/BaseComponents';

const ContactPage = () => {
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemFade = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative bg-slate-900 dark:bg-black py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4"
          >
            Let's build together
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto"
          >
            Whether you're a local vendor looking to join the platform, or a customer with questions, our team is here to help you get started.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative -mt-12 lg:-mt-16 z-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row">
            
            {/* Contact Info (Left) */}
            <div className="lg:w-2/5 bg-slate-50 dark:bg-slate-800/50 p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Get in touch</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-10">
                Fill out the form and our onboarding team will get back to you within 24 hours.
              </p>

              <motion.div 
                variants={staggerContainer} initial="hidden" animate="visible"
                className="space-y-8"
              >
                <motion.div variants={itemFade} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Email Support</h3>
                    <p className="text-slate-600 dark:text-slate-400">support@hyperlocalindia.example</p>
                  </div>
                </motion.div>

                <motion.div variants={itemFade} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                    <Phone className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Phone</h3>
                    <p className="text-slate-600 dark:text-slate-400">+91 22 4000 9000</p>
                  </div>
                </motion.div>

                <motion.div variants={itemFade} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Office</h3>
                    <p className="text-slate-600 dark:text-slate-400">123 Marine Drive, Churchgate<br/>Mumbai, Maharashtra 400020</p>
                  </div>
                </motion.div>

                <motion.div variants={itemFade} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                    <Clock className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Business Hours</h3>
                    <p className="text-slate-600 dark:text-slate-400">Mon-Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Contact Form (Right) */}
            <div className="lg:w-3/5 p-10 lg:p-14">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white" placeholder="John" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white" placeholder="you@example.com" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">How can we help?</label>
                  <textarea rows="5" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none dark:text-white" placeholder="Tell us a little about your inquiry..."></textarea>
                </div>

                <Button type="button" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
                  Send Message <ArrowRight size={18} />
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;
