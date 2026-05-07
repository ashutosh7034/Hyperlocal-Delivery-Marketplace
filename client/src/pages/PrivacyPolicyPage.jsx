import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Server, Users, Lock, ShieldCheck } from 'lucide-react';
import { Card } from '../components/BaseComponents';

const PrivacyPolicyPage = () => {
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
      <section className="relative w-full bg-slate-900 dark:bg-black overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-primary/10 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/20"
          >
            <ShieldCheck className="text-white" size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6"
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto"
          >
            We care about your privacy. Learn how we collect, use, and protect your data. Last updated: October 2023
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative -mt-10 lg:-mt-16 z-10 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer} initial="hidden" animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemFade}>
              <Card className="p-8 md:p-10 border-t-4 border-t-primary">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Eye className="text-primary" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Information We Collect</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      We collect information you provide directly to us when you create an account, place an order, or communicate with us. This includes:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 ml-2">
                      <li>Name, email address, and phone number</li>
                      <li>Delivery addresses and saved locations</li>
                      <li>Payment details (processed securely via third-party providers)</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemFade}>
              <Card className="p-8 md:p-10 border-t-4 border-t-emerald-500">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                    <Server className="text-emerald-500" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. How We Use Your Information</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      We use the information we collect to process your orders, provide customer support, and improve our platform. Your location data is used strictly to match you with nearby vendors and to ensure accurate, timely deliveries by our riders. We may also use your email to send important account updates or promotional offers (which you can opt out of at any time).
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemFade}>
              <Card className="p-8 md:p-10 border-t-4 border-t-blue-500">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-1">
                    <Users className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Data Sharing</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      We share your necessary information (like address and phone number) with vendors and delivery riders solely to fulfill your orders. We do not sell your personal data to third parties. We may also share data with service providers who perform services on our behalf, under strict confidentiality agreements.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemFade}>
              <Card className="p-8 md:p-10 border-t-4 border-t-amber-500">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-1">
                    <Lock className="text-amber-500" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Security</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. While we employ industry-standard security protocols, no method of transmission over the internet or electronic storage is 100% secure.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
