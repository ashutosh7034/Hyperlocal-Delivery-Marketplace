import React from 'react';
import { Card } from '../components/BaseComponents';

const AboutPage = () => {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Card className="border border-slate-200/80 bg-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">About</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">Built for local commerce workflows</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          This platform is designed around the core hyperlocal flow: customers discover nearby sellers, vendors
          manage products and orders, and admins approve and oversee the marketplace.
        </p>
      </Card>
    </section>
  );
};

export default AboutPage;