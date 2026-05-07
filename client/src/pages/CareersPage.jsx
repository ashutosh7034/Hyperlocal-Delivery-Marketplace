import React from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../components/BaseComponents';
import { Briefcase, Heart, Zap, Globe } from 'lucide-react';

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg py-20">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-6">
            We're Hiring
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
            Build the future of local commerce
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Join our fast-growing team and help us connect millions of customers with their favorite local businesses.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Card className="p-8">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Work anywhere</h3>
            <p className="text-slate-600 dark:text-slate-400">
              We are a remote-first company with hubs in major cities. Choose where you do your best work.
            </p>
          </Card>
          <Card className="p-8">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
              <Heart size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Health & Wellness</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Comprehensive medical, dental, and vision coverage for you and your dependents.
            </p>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Open Positions</h2>
        <div className="space-y-4">
          {[
            { title: 'Senior Frontend Engineer', dept: 'Engineering', location: 'Remote / Bangalore' },
            { title: 'Product Manager', dept: 'Product', location: 'Mumbai' },
            { title: 'Operations Lead', dept: 'Operations', location: 'Delhi' },
            { title: 'UX Designer', dept: 'Design', location: 'Remote' }
          ].map((job, idx) => (
            <Card key={idx} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary transition-colors cursor-pointer">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{job.dept} • {job.location}</p>
              </div>
              <Button variant="outline" size="sm">Apply Now</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
