import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/BaseComponents';

const stats = [
  { value: '2k+', label: 'local stores ready to list' },
  { value: '30 min', label: 'delivery promise for core zones' },
  { value: '3 roles', label: 'customer, vendor, admin' },
];

const features = [
  {
    title: 'Find nearby vendors',
    description: 'Surface shops by location, delivery radius, and product fit instead of showing a generic catalog.',
  },
  {
    title: 'Manage inventory',
    description: 'Vendors can create products, update stock, and track orders from one place.',
  },
  {
    title: 'Approve and govern',
    description: 'Admins can review vendors, monitor orders, and keep the marketplace healthy.',
  },
];

const HomePage = () => {
  return (
    <div className="surface-grid">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Hyperlocal commerce for India
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Deliver from the nearest store, not the largest catalog.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              HyperLocal India is the marketplace shell for discovering nearby vendors, placing fast local orders,
              and managing the full delivery lifecycle across customers, vendors, and admins.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/contact" className="rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/20 hover:bg-orange-600">
                Get started
              </Link>
              <Link to="/about" className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:border-primary hover:text-primary">
                Learn more
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <Card key={stat.label} className="border border-white/70 bg-white/85 backdrop-blur">
                  <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute right-8 top-0 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
            <Card className="relative overflow-hidden border border-white/80 bg-slate-950 p-0 text-white shadow-2xl">
              <div className="border-b border-white/10 px-6 py-5">
                <p className="text-sm font-medium text-slate-300">Live marketplace preview</p>
                <p className="mt-1 text-2xl font-bold">Nearby essentials</p>
              </div>
              <div className="space-y-4 px-6 py-6">
                {[
                  ['Fresh Mart', '1.2 km away', 'Groceries, dairy, and staples'],
                  ['Quick Pharmacy', '0.8 km away', 'Medicines and wellness essentials'],
                  ['Daily Bites', '2.4 km away', 'Meals, snacks, and beverages'],
                ].map(([name, distance, detail]) => (
                  <div key={name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{name}</p>
                        <p className="mt-1 text-sm text-slate-300">{detail}</p>
                      </div>
                      <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">{distance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border border-slate-200/80 bg-white/90">
              <p className="text-lg font-bold text-slate-950">{feature.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;