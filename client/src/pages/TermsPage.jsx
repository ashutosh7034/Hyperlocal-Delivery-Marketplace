import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card } from '../components/BaseComponents';

const TermsPage = () => {
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-primary/10 opacity-60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/20"
          >
            <FileText className="text-white" size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6"
          >
            Terms of Service
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto"
          >
            Please read these terms carefully before using our platform. Last updated: October 2023
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
                    <CheckCircle2 className="text-primary" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      By accessing and using HyperLocal, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemFade}>
              <Card className="p-8 md:p-10 border-t-4 border-t-blue-500">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-1">
                    <Shield className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. User Accounts</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      To use certain features of the service, you must register for an account. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account.
                    </p>
                    <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 ml-2">
                      <li>You must provide accurate, current, and complete information.</li>
                      <li>You must notify us immediately of any unauthorized use.</li>
                      <li>You may not use anyone else's account without permission.</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemFade}>
              <Card className="p-8 md:p-10 border-t-4 border-t-emerald-500">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                    <FileText className="text-emerald-500" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Vendor Obligations</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Vendors on our platform must ensure that all product descriptions, pricing, and availability are accurate. HyperLocal provides the technology to connect customers with vendors but is not responsible for fulfilling vendor orders directly, managing inventory, or resolving product quality disputes. Vendors must comply with all local laws and health regulations regarding the sale of goods.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemFade}>
              <Card className="p-8 md:p-10 border-t-4 border-t-rose-500">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-1">
                    <AlertTriangle className="text-rose-500" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Limitations of Liability</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      HyperLocal shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content.
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

export default TermsPage;
