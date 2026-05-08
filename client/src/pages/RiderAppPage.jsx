import React from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../components/BaseComponents';
import { Clock, DollarSign, ShieldCheck } from 'lucide-react';

const RiderAppPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40 bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-slate-900 mix-blend-overlay"></div>
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Deliver with <span className="text-primary">HyperLocal</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 max-w-md">
                Be your own boss. Enjoy flexible hours, competitive earnings, and the freedom to work when you want.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg">Apply to Ride</Button>
                <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:text-white">Download App</Button>
              </div>
            </motion.div>
            <div className="hidden lg:block relative h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
              <img src="https://cdn.dribbble.com/userupload/16677654/file/original-75cf3068bacc27ab2d2379726c643dd1.png" alt="Delivery Rider" className="w-full h-full object-cover rounded-[3rem] border-4 border-slate-800" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Why ride with us?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                <DollarSign size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Great Earnings</h3>
              <p className="text-slate-600 dark:text-slate-400">Competitive payouts per delivery plus tips and performance bonuses.</p>
            </Card>
            <Card className="p-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Flexible Hours</h3>
              <p className="text-slate-600 dark:text-slate-400">Work when you want, where you want. You are in control of your schedule.</p>
            </Card>
            <Card className="p-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Insurance Support</h3>
              <p className="text-slate-600 dark:text-slate-400">Stay protected with accidental insurance while you are actively delivering.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RiderAppPage;
