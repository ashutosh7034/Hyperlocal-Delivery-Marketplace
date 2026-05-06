import React from 'react';
import { Card, Button, Input } from '../components/BaseComponents';

const ContactPage = () => {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border border-slate-200/80 bg-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Contact</p>
          <h1 className="mt-4 text-3xl font-black text-slate-950">Talk to the team</h1>
          <p className="mt-4 text-slate-600">
            Use this page as the starting point for vendor onboarding, integration help, or platform questions.
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <p>Email: support@hyperlocalindia.example</p>
            <p>Phone: +91 90000 00000</p>
            <p>Hours: Mon-Fri, 9:00 AM to 6:00 PM</p>
          </div>
        </Card>

        <Card className="border border-slate-200/80 bg-white">
          <form className="space-y-4">
            <Input label="Name" placeholder="Your name" />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input label="Message" placeholder="What do you need help with?" />
            <Button type="button">Send message</Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default ContactPage;