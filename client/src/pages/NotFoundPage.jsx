import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Not found</p>
      <h1 className="mt-4 text-4xl font-black text-slate-950">That page does not exist</h1>
      <p className="mt-4 text-slate-600">Use the navigation to go back to the main experience.</p>
      <Link to="/" className="mt-8 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-orange-600">
        Return home
      </Link>
    </div>
  );
};

export default NotFoundPage;